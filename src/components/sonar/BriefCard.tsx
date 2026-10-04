import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import type { SonarBrief } from "./types";
import { buildMailto, formatBriefAsText } from "./formatBrief";

const SECTION_LABELS: { key: keyof SonarBrief; title: string }[] = [
  { key: "goals", title: "Goals" },
  { key: "target_users", title: "Target users" },
  { key: "must_have_features", title: "Must have" },
  { key: "should_have_features", title: "Should have" },
  { key: "later_features", title: "Later" },
  { key: "risks_and_notes", title: "Risks and notes" },
  { key: "open_questions_for_team", title: "Open questions for the team" },
];

function isNonEmptyList(value: unknown): value is string[] {
  return Array.isArray(value) && value.some((item) => typeof item === "string" && item.trim().length > 0);
}

function BriefList({ items }: { items: string[] }) {
  return (
    <ul className="sonar-brief__list">
      {items.filter((item) => item.trim()).map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export function BriefCard({ brief }: { brief: SonarBrief }) {
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
  }, []);

  const plainText = useMemo(() => formatBriefAsText(brief), [brief]);
  const mailto = useMemo(
    () => buildMailto("hello@runtimesystems.tech", `Project brief: ${brief.project_name || "Untitled project"}`, plainText),
    [brief.project_name, plainText],
  );

  const copyBrief = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(plainText);
      } else {
        // Fallback for the rare non-secure-context case.
        const area = document.createElement("textarea");
        area.value = plainText;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
      }
      setCopied(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API failed; the brief is still visible and selectable above.
    }
  };

  const listSections = SECTION_LABELS.filter(({ key }) => isNonEmptyList(brief[key]));
  const phases = (brief.phases ?? []).filter((phase) => phase?.name?.trim() || phase?.scope?.trim());

  return (
    <div className="sonar-brief" data-testid="sonar-brief">
      <p className="sonar-brief__kicker">PROJECT BRIEF / READY TO SEND</p>
      <h4 className="sonar-brief__name">{brief.project_name?.trim() || "Untitled project"}</h4>
      {brief.summary?.trim() ? <p className="sonar-brief__summary">{brief.summary}</p> : null}
      {brief.project_type?.trim() ? <p className="sonar-brief__type meta">{brief.project_type}</p> : null}

      {listSections.map(({ key, title }) => (
        <div key={String(key)} className="sonar-brief__section">
          <p className="meta">{title}</p>
          <BriefList items={brief[key] as string[]} />
        </div>
      ))}

      {brief.recommended_approach?.trim() ? (
        <div className="sonar-brief__section">
          <p className="meta">Recommended approach</p>
          <p className="sonar-brief__approach">{brief.recommended_approach}</p>
        </div>
      ) : null}

      {phases.length > 0 ? (
        <div className="sonar-brief__section">
          <p className="meta">Phases</p>
          <ul className="sonar-brief__list">
            {phases.map((phase, index) => (
              <li key={index}>
                <b>{phase.name?.trim() || "Phase"}</b>
                {phase.scope?.trim() ? <> — {phase.scope}</> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {brief.integrations && brief.integrations.length > 0 ? (
        <div className="sonar-brief__section">
          <p className="meta">Integrations</p>
          <BriefList items={brief.integrations} />
        </div>
      ) : null}

      {brief.constraints?.deadline_context?.trim() ||
      brief.constraints?.budget_note?.trim() ||
      brief.constraints?.compliance?.trim() ? (
        <div className="sonar-brief__section">
          <p className="meta">Constraints</p>
          <ul className="sonar-brief__list">
            {brief.constraints.deadline_context?.trim() ? <li>Deadline context: {brief.constraints.deadline_context}</li> : null}
            {brief.constraints.budget_note?.trim() ? <li>Budget note: {brief.constraints.budget_note}</li> : null}
            {brief.constraints.compliance?.trim() ? <li>Compliance: {brief.constraints.compliance}</li> : null}
          </ul>
        </div>
      ) : null}

      <div className="sonar-brief__actions">
        <button type="button" className="sonar-brief__button" onClick={copyBrief}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy brief"}
        </button>
        {mailto ? (
          <a className="sonar-brief__button" href={mailto}>
            <Mail size={14} />
            Email to the team
          </a>
        ) : null}
      </div>
      <p className="sonar-brief__note">Copy or email this brief — the team follows up from there.</p>
    </div>
  );
}
