import {
  BRIEF_PROJECT_TYPES,
  MAX_ASSISTANT_CONTENT,
  MAX_USER_CONTENT,
  type SonarMessage,
  type SonarRole,
} from "./types";

export const MAX_MESSAGES_KEPT = 20;
export const MAX_MESSAGES_ACCEPTED = 30;
export const MAX_BODY_BYTES = 32 * 1024;

// Control characters except tab/newline/CR (those are handled by trimming).
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export interface ValidationResult {
  ok: boolean;
  /** Normalized conversation when ok; otherwise absent. */
  messages?: SonarMessage[];
  /** Short, generic error code — never echo raw input back. */
  code?: "invalid_body" | "invalid_messages" | "invalid_message";
}

function isRole(value: unknown): value is SonarRole {
  return value === "user" || value === "assistant";
}

function cleanContent(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const stripped = value.replace(CONTROL_CHARS, "").trim();
  if (stripped.length < 1 || stripped.length > max) return null;
  return stripped;
}

/**
 * Validates and normalizes a parsed request body into a clean conversation.
 * Pure function: unit-tested in tests/sonar-validate.test.mjs.
 */
export function validateConversation(input: unknown): ValidationResult {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, code: "invalid_body" };
  }
  const body = input as Record<string, unknown>;
  if (!("messages" in body)) return { ok: false, code: "invalid_body" };

  const raw = body.messages;
  if (!Array.isArray(raw) || raw.length < 1) {
    return { ok: false, code: "invalid_messages" };
  }
  if (raw.length > MAX_MESSAGES_ACCEPTED) {
    return { ok: false, code: "invalid_messages" };
  }

  const messages: SonarMessage[] = [];
  for (const item of raw) {
    if (item === null || typeof item !== "object" || Array.isArray(item)) {
      return { ok: false, code: "invalid_message" };
    }
    const { role, content } = item as Record<string, unknown>;
    if (!isRole(role)) return { ok: false, code: "invalid_message" };

    const limit = role === "user" ? MAX_USER_CONTENT : MAX_ASSISTANT_CONTENT;
    const cleaned = cleanContent(content, limit);
    if (cleaned === null) return { ok: false, code: "invalid_message" };
    messages.push({ role, content: cleaned });
  }

  const last = messages[messages.length - 1];
  if (!last || last.role !== "user") {
    return { ok: false, code: "invalid_messages" };
  }

  // Keep only the most recent 20 messages.
  return { ok: true, messages: messages.slice(-MAX_MESSAGES_KEPT) };
}
