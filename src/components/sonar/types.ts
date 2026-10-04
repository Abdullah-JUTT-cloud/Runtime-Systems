// Shared types for the SONAR advisor. Types only — no runtime imports — so this
// file is safe to reference from both src/ (browser bundle) and functions/ (server).

export type SonarRole = "user" | "assistant";

/** A single chat message as sent over the wire (no UI-only fields). */
export interface SonarMessage {
  role: SonarRole;
  content: string;
}

export type BriefProjectType =
  | "shopify"
  | "website"
  | "web_app"
  | "mobile_app"
  | "cloud_devops"
  | "ai_automation"
  | "data"
  | "integration"
  | "design"
  | "consulting"
  | "other";

export interface SonarBrief {
  project_name: string;
  summary: string;
  project_type: BriefProjectType;
  goals: string[];
  target_users: string[];
  must_have_features: string[];
  should_have_features: string[];
  later_features: string[];
  recommended_approach: string;
  phases: { name: string; scope: string }[];
  integrations: string[];
  risks_and_notes: string[];
  existing_assets: string;
  constraints: {
    deadline_context: string;
    budget_note: string;
    compliance: string;
  };
  open_questions_for_team: string[];
  contact: {
    name: string | null;
    email: string | null;
    preferred_channel: string | null;
  };
}

export interface SonarQuickReply {
  label: string;
  payload: string;
}

/** Body returned by POST /api/advise. */
export interface SonarAdviseResponse {
  mode: "reply" | "brief";
  message: string;
  quick_replies: string[];
  brief: SonarBrief | null;
}

export type SonarStatus = "idle" | "loading" | "error";

/** UI-only message shape kept in state (never sent to the API as-is). */
export interface SonarUiMessage extends SonarMessage {
  id: string;
  /** Error bubbles are UI-only: retryable, never persisted as real turns. */
  isError?: boolean;
}
