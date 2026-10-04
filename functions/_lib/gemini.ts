import type { SonarBrief } from "../../src/components/sonar/types";
import { BRIEF_PROJECT_TYPES } from "./types";

export const DEFAULT_MODEL = "gemini-flash-latest";
export const UPSTREAM_URL = "https://generativelanguage.googleapis.com/v1beta/models";
export const UPSTREAM_TIMEOUT_MS = 25_000;
export const TEMPERATURE = 0.5;
export const MAX_OUTPUT_TOKENS = 4096;

export const FALLBACK_REPLY: ParsedAdvice = {
  mode: "reply",
  message: "Sorry, I lost my train of thought. Could you rephrase that?",
  quick_replies: [],
  brief: null,
};

/**
 * Response schema in Gemini's OpenAPI-subset dialect (see ai.google.dev structured
 * output docs). Nullable strings use lowercase `type` arrays with `"null"` — the
 * documented way to express nullables. The model decides `mode`; everything else
 * is fixed by the contract.
 */
export const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    mode: { type: "STRING", enum: ["reply", "brief"] },
    message: { type: "STRING" },
    quick_replies: { type: "ARRAY", items: { type: "STRING" }, maxItems: 4 },
    brief: {
      type: "OBJECT",
      nullable: true,
      properties: {
        project_name: { type: "STRING" },
        summary: { type: "STRING" },
        project_type: {
          type: "STRING",
          enum: [
            "shopify",
            "website",
            "web_app",
            "mobile_app",
            "cloud_devops",
            "ai_automation",
            "data",
            "integration",
            "design",
            "consulting",
            "other",
          ],
        },
        goals: { type: "ARRAY", items: { type: "STRING" } },
        target_users: { type: "ARRAY", items: { type: "STRING" } },
        must_have_features: { type: "ARRAY", items: { type: "STRING" } },
        should_have_features: { type: "ARRAY", items: { type: "STRING" } },
        later_features: { type: "ARRAY", items: { type: "STRING" } },
        recommended_approach: { type: "STRING" },
        phases: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: { name: { type: "STRING" }, scope: { type: "STRING" } },
            required: ["name", "scope"],
          },
        },
        integrations: { type: "ARRAY", items: { type: "STRING" } },
        risks_and_notes: { type: "ARRAY", items: { type: "STRING" } },
        existing_assets: { type: "STRING" },
        constraints: {
          type: "OBJECT",
          properties: {
            deadline_context: { type: "STRING" },
            budget_note: { type: "STRING" },
            compliance: { type: "STRING" },
          },
          required: ["deadline_context", "budget_note", "compliance"],
        },
        open_questions_for_team: { type: "ARRAY", items: { type: "STRING" } },
        contact: {
          type: "OBJECT",
          nullable: true,
          properties: {
            name: { type: "STRING", nullable: true },
            email: { type: "STRING", nullable: true },
            preferred_channel: { type: "STRING", nullable: true },
          },
        },
      },
      required: [
        "project_name",
        "summary",
        "project_type",
        "goals",
        "target_users",
        "must_have_features",
        "should_have_features",
        "later_features",
        "recommended_approach",
        "phases",
        "integrations",
        "risks_and_notes",
        "existing_assets",
        "constraints",
        "open_questions_for_team",
        "contact",
      ],
    },
  },
  required: ["mode", "message", "quick_replies", "brief"],
} as const;

export interface GeminiTurn {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface GeminiChatResponse {
  candidates?: {
    content?: { parts?: { text?: string }[] };
    finishReason?: string;
  }[];
  promptFeedback?: { blockReason?: string };
}

export interface ParsedAdvice {
  mode: "reply" | "brief";
  message: string;
  quick_replies: string[];
  brief: SonarBrief | null;
}

/** Defensive result of validating an advise payload; ok=false → fallback reply. */
export type ParseAdviceResult =
  | { ok: true; value: ParsedAdvice }
  | { ok: false };

export function asStringList(value: unknown, max = 40): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && item.length <= 600)
    .slice(0, max);
}

/** Strip stray markdown code fences like ```json ... ``` if present. */
export function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  const fenced = /^```[a-zA-Z0-9_-]*\s*([\s\S]*?)\s*```$/.exec(trimmed);
  return (fenced ? fenced[1] : trimmed).trim();
}

function asNullableString(value: unknown): string | null {
  if (value === null) return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseBrief(value: unknown): SonarBrief | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "object" || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  const constraintsRaw =
    raw.constraints && typeof raw.constraints === "object" && !Array.isArray(raw.constraints)
      ? (raw.constraints as Record<string, unknown>)
      : {};
  const contactRaw =
    raw.contact && typeof raw.contact === "object" && !Array.isArray(raw.contact)
      ? (raw.contact as Record<string, unknown>)
      : {};
  const projectType =
    typeof raw.project_type === "string" && BRIEF_PROJECT_TYPES.includes(raw.project_type as never)
      ? (raw.project_type as SonarBrief["project_type"])
      : "other";

  return {
    project_name: asNullableString(raw.project_name) ?? "Untitled project",
    summary: asNullableString(raw.summary) ?? "",
    project_type: projectType,
    goals: asStringList(raw.goals),
    target_users: asStringList(raw.target_users),
    must_have_features: asStringList(raw.must_have_features),
    should_have_features: asStringList(raw.should_have_features),
    later_features: asStringList(raw.later_features),
    recommended_approach: asNullableString(raw.recommended_approach) ?? "",
    phases: Array.isArray(raw.phases)
      ? raw.phases
          .filter((phase): phase is Record<string, unknown> =>
            Boolean(phase) && typeof phase === "object" && !Array.isArray(phase),
          )
          .map((phase) => ({
            name: asNullableString(phase.name) ?? "",
            scope: asNullableString(phase.scope) ?? "",
          }))
          .filter((phase) => phase.name.length > 0 || phase.scope.length > 0)
          .slice(0, 12)
      : [],
    integrations: asStringList(raw.integrations),
    risks_and_notes: asStringList(raw.risks_and_notes),
    existing_assets: asNullableString(raw.existing_assets) ?? "",
    constraints: {
      deadline_context: asNullableString(constraintsRaw.deadline_context) ?? "",
      budget_note: asNullableString(constraintsRaw.budget_note) ?? "",
      compliance: asNullableString(constraintsRaw.compliance) ?? "",
    },
    open_questions_for_team: asStringList(raw.open_questions_for_team),
    contact: {
      name: asNullableString(contactRaw.name),
      email: asNullableString(contactRaw.email),
      preferred_channel: asNullableString(contactRaw.preferred_channel),
    },
  };
}

/**
 * Validates a parsed advise payload defensively. Enforces: mode is reply|brief;
 * message is a non-empty string (max 6000); quick_replies capped at 4 short
 * strings; brief is null unless mode is "brief". Pure function; unit-tested.
 */
export function parseAdvice(value: unknown): ParseAdviceResult {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false };
  }
  const raw = value as Record<string, unknown>;

  const mode = raw.mode === "brief" || raw.mode === "reply" ? raw.mode : null;
  if (!mode) return { ok: false };

  if (typeof raw.message !== "string") return { ok: false };
  const message = raw.message.trim();
  if (message.length < 1 || message.length > 6000) return { ok: false };

  const quickReplies = asStringList(raw.quick_replies, 4)
    .filter((item) => item.length <= 60)
    .slice(0, 4);

  const brief = mode === "brief" ? parseBrief(raw.brief) : null;
  if (mode === "brief" && !brief) return { ok: false };

  return { ok: true, value: { mode, message, quick_replies: quickReplies, brief } };
}

/**
 * Parses the raw model text (possibly fenced) into a validated advice payload.
 * Pure function; unit-tested.
 */
export function parseModelText(text: string): ParseAdviceResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripCodeFence(text));
  } catch {
    return { ok: false };
  }
  return parseAdvice(parsed);
}

/** Extracts the assistant's text part from a Gemini generateContent response. */
export function extractModelText(data: GeminiChatResponse): string | null {
  const candidate = data?.candidates?.[0];
  const parts = candidate?.content?.parts;
  if (!Array.isArray(parts)) return null;
  const text = parts
    .map((part) => (typeof part?.text === "string" ? part.text : ""))
    .join("")
    .trim();
  return text.length > 0 ? text : null;
}

export interface BuildGeminiRequestBodyArgs {
  systemInstruction: string;
  conversation: { role: "user" | "assistant"; content: string }[];
}

/**
 * Maps the conversation to Gemini contents (assistant → model, user → user) and
 * embeds the JSON response contract. The user text only ever appears in user
 * content — never concatenated into the system instruction.
 */
export function buildGeminiRequestBody({
  systemInstruction,
  conversation,
}: BuildGeminiRequestBodyArgs) {
  const contents: GeminiTurn[] = conversation.map((turn) => ({
    role: turn.role === "assistant" ? "model" : "user",
    parts: [{ text: turn.content }],
  }));

  return {
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents,
    generationConfig: {
      temperature: TEMPERATURE,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  };
}
