import {
  DEFAULT_MODEL,
  FALLBACK_REPLY,
  UPSTREAM_TIMEOUT_MS,
  UPSTREAM_URL,
  buildGeminiRequestBody,
  extractModelText,
  parseModelText,
  type GeminiChatResponse,
  type ParsedAdvice,
} from "../_lib/gemini";
import { clientIp, hitRateLimit } from "../_lib/rateLimit";
import {
  MAX_BODY_BYTES,
  validateConversation,
  type ValidationResult,
} from "../_lib/validate";
import { KNOWLEDGE } from "../_lib/knowledge";

export interface Env {
  GEMINI_API_KEY: string;
  GEMINI_MODEL?: string;
}

const SITE_URL = "https://runtimesystems.tech";

const json = (body: unknown, status = 200, extraHeaders: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });

// Built lazily inside handlers: workerd forbids constructing Response objects
// in global scope.
const methodNotAllowed = () => json({ error: "method_not_allowed" }, 405, { Allow: "POST" });

export const onRequestGet = () => methodNotAllowed();
export const onRequestHead = () => methodNotAllowed();
export const onRequestPut = () => methodNotAllowed();
export const onRequestPatch = () => methodNotAllowed();
export const onRequestDelete = () => methodNotAllowed();

export const onRequestOptions = () =>
  // Deliberately no CORS grants. Same-origin GET/HEAD fetches are simple
  // requests and never preflight; cross-site JavaScript gets no
  // Access-Control-Allow-Origin, so it cannot read responses.
  new Response(null, { status: 204, headers: { Allow: "POST" } });

/** Same-origin check: Origin, when present, must match our own origin or the site URL. */
export function originAllowed(request: Request): boolean {
  const origin = request.headers.get("Origin");
  if (!origin) return true; // Same-origin fetches may omit Origin (e.g. curl).
  const url = new URL(request.url);
  const allowed = new Set<string>([url.origin, SITE_URL]);
  const host = request.headers.get("Host");
  if (host) allowed.add(`${url.protocol}//${host}`);
  return allowed.has(origin);
}

/**
 * How the upstream Gemini call ended:
 * - "ok"             → advice parsed successfully
 * - "parse_fallback" → upstream answered 200 but the output never parsed
 *                      (retried once); respond 200 with FALLBACK_REPLY
 * - "busy"           → upstream throttled us (429); respond 429
 * - "upstream"       → other upstream HTTP errors, network failure or
 *                      timeout; respond 502 { error: "upstream" }
 */
type GeminiCallResult =
  | { kind: "ok"; advice: ParsedAdvice }
  | { kind: "parse_fallback"; advice: ParsedAdvice }
  | { kind: "busy" }
  | { kind: "upstream" };

/** Runs the Gemini call with an upstream timeout; classifies how it ended. */
async function callGemini(
  apiKey: string,
  model: string,
  messages: NonNullable<ValidationResult["messages"]>,
): Promise<GeminiCallResult> {
  const body = buildGeminiRequestBody({ systemInstruction: KNOWLEDGE, conversation: messages });

  // One extra attempt is made when the upstream is throttled or briefly
  // unavailable (429/5xx) — capacity blips are common on the free tier.
  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  const url = `${UPSTREAM_URL}/${encodeURIComponent(model)}:generateContent`;
  try {
    const callOnce = () =>
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Key goes in a header, never in the URL, and is never logged.
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

    const parseResponse = async (response: Response): Promise<GeminiCallResult | null> => {
      if (response.status === 429) {
        console.error("[sonar] upstream status 429");
        return { kind: "busy" };
      }
      if (!response.ok) {
        // Log only a short, non-sensitive status code. Never the body, prompts or key.
        console.error(`[sonar] upstream status ${response.status}`);
        return { kind: "upstream" };
      }

      const data = (await response.json()) as GeminiChatResponse;
      if (data.promptFeedback?.blockReason) {
        console.error("[sonar] upstream blocked prompt");
        return { kind: "parse_fallback", advice: { ...FALLBACK_REPLY } };
      }

      const text = extractModelText(data);
      if (!text) {
        console.error("[sonar] upstream returned no text");
        return { kind: "parse_fallback", advice: { ...FALLBACK_REPLY } };
      }

      const parsed = parseModelText(text);
      if (!parsed.ok) {
        console.error("[sonar] response parse failed");
        return { kind: "parse_fallback", advice: { ...FALLBACK_REPLY } };
      }
      return { kind: "ok", advice: parsed.value };
    };

    let response = await callOnce();
    let result = await parseResponse(response);

    // One extra attempt when the first try was throttled, briefly
    // unavailable, or produced unparseable output — budget permitting.
    if (
      result &&
      result.kind !== "ok" &&
      Date.now() - startedAt < UPSTREAM_TIMEOUT_MS - 1_500
    ) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      response = await callOnce();
      result = await parseResponse(response);
    }
    if (result) return result;
    return { kind: "upstream" };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    console.error(`[sonar] upstream ${aborted ? "timeout" : "network error"}`);
    return { kind: "upstream" };
  } finally {
    clearTimeout(timer);
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method !== "POST") return methodNotAllowed();
  if (!originAllowed(request)) return json({ error: "forbidden" }, 403);

  const contentType = request.headers.get("Content-Type") ?? "";
  if (!contentType.includes("application/json")) {
    return json({ error: "unsupported_media_type" }, 415);
  }

  const requestBody = await request.arrayBuffer();
  if (requestBody.byteLength > MAX_BODY_BYTES) {
    return json({ error: "payload_too_large" }, 413);
  }

  const ip = clientIp(request);
  const { result, retryAfter } = hitRateLimit(ip);
  if (result !== "allowed") {
    return json({ error: "busy" }, 429, { "Retry-After": String(Math.max(retryAfter, 1)) });
  }

  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    // Configuration problem on the deployment, not the visitor's fault.
    console.error("[sonar] GEMINI_API_KEY is not configured");
    return json({ error: "upstream" }, 502);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder().decode(requestBody));
  } catch {
    return json({ error: "invalid_body" }, 400);
  }

  const validation = validateConversation(parsed);
  if (!validation.ok || !validation.messages) {
    return json({ error: validation.code ?? "invalid_body" }, 400);
  }

  const model =
    env.GEMINI_MODEL && env.GEMINI_MODEL.trim().length > 0
      ? env.GEMINI_MODEL.trim()
      : DEFAULT_MODEL;

  const geminiResult = await callGemini(apiKey, model, validation.messages);
  if (geminiResult.kind === "busy") {
    // Distinguish provider throttling from other upstream failures.
    return json({ error: "busy" }, 429, { "Retry-After": "10" });
  }
  if (geminiResult.kind === "upstream") {
    // Upstream 4xx/5xx, network failure or timeout — never leak details.
    return json({ error: "upstream" }, 502);
  }
  return json(geminiResult.advice);
};
