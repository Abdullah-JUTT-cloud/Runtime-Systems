import type { SonarBrief } from "./types";

/**
 * Formats a brief as clean readable plain text for Copy / Email.
 * Never prints "undefined" or "null": missing fields are skipped entirely.
 * Pure function; unit-tested.
 */
export function formatBriefAsText(brief: SonarBrief): string {
  const lines: string[] = [];
  const bullet = (items: string[]): void => {
    for (const item of items) {
      const text = item?.trim();
      if (text) lines.push(`- ${text}`);
    }
  };

  const projectName = brief.project_name?.trim() || "Untitled project";
  lines.push(`Project brief: ${projectName}`);
  if (brief.summary?.trim()) {
    lines.push("", brief.summary.trim());
  }

  if (brief.project_type?.trim()) {
    lines.push("", `Type: ${brief.project_type.trim()}`);
  }

  const section = (title: string, body?: string): void => {
    const text = body?.trim();
    if (!text) return;
    lines.push("", `${title}:`, text);
  };
  const sectionList = (title: string, items?: string[]): void => {
    if (!items || items.length === 0) return;
    lines.push("", `${title}:`);
    bullet(items);
  };

  sectionList("Goals", brief.goals);
  sectionList("Target users", brief.target_users);
  sectionList("Must have", brief.must_have_features);
  sectionList("Should have", brief.should_have_features);
  sectionList("Later", brief.later_features);
  section("Recommended approach", brief.recommended_approach);

  if (brief.phases && brief.phases.length > 0) {
    lines.push("", "Phases:");
    for (const phase of brief.phases) {
      const name = phase?.name?.trim() || "Phase";
      const scope = phase?.scope?.trim();
      lines.push(scope ? `- ${name}: ${scope}` : `- ${name}`);
    }
  }

  sectionList("Integrations", brief.integrations);
  sectionList("Risks and notes", brief.risks_and_notes);
  section("Existing assets", brief.existing_assets);

  const constraints = brief.constraints;
  if (constraints && typeof constraints === "object") {
    const constraintLines: string[] = [];
    if (constraints.deadline_context?.trim()) {
      constraintLines.push(`- Deadline context: ${constraints.deadline_context.trim()}`);
    }
    if (constraints.budget_note?.trim()) {
      constraintLines.push(`- Budget note: ${constraints.budget_note.trim()}`);
    }
    if (constraints.compliance?.trim()) {
      constraintLines.push(`- Compliance: ${constraints.compliance.trim()}`);
    }
    if (constraintLines.length > 0) {
      lines.push("", "Constraints:", ...constraintLines);
    }
  }

  sectionList("Open questions for the team", brief.open_questions_for_team);

  const contact = brief.contact;
  if (contact && typeof contact === "object") {
    const contactLines: string[] = [];
    if (contact.name?.trim()) contactLines.push(`- Name: ${contact.name.trim()}`);
    if (contact.email?.trim()) contactLines.push(`- Email: ${contact.email.trim()}`);
    if (contact.preferred_channel?.trim()) {
      contactLines.push(`- Preferred channel: ${contact.preferred_channel.trim()}`);
    }
    if (contactLines.length > 0) {
      lines.push("", "Contact:", ...contactLines);
    }
  }

  lines.push("", "Prepared with SONAR, the AI project advisor at runtimesystems.tech");
  return lines.join("\n");
}

/** Builds a length-safe mailto: URL; returns null when it would be unusable. */
export function buildMailto(
  email: string,
  subject: string,
  body: string,
  maxUrlLength = 1800,
): string | null {
  if (!email || email.includes("FILL IN") || email.startsWith("[")) return null;
  const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return url.length <= maxUrlLength ? url : null;
}
