export const BRIEF_PROJECT_TYPES = [
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
] as const;

export type SonarRole = "user" | "assistant";

/** A single chat message as sent over the wire (no UI-only fields). */
export interface SonarMessage {
  role: SonarRole;
  content: string;
}

/** Wire limits shared by the server validator and the client composer. */
export const MAX_USER_CONTENT = 1500;
export const MAX_ASSISTANT_CONTENT = 6000;
export const MAX_QUICK_REPLIES = 4;
export const MAX_STORED_MESSAGES = 30;
