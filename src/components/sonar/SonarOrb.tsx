/**
 * The SONAR orb — a fluid "intelligence core" rendered with layered CSS
 * gradients only (no canvas/WebGL) so the always-visible launcher stays
 * cheap to animate. Layers, back to front: deep sphere base, a slowly
 * rotating conic energy sweep, drifting aqua and warm blobs, a breathing
 * core highlight, a glass sheen, and the sonar-pulse mark.
 *
 * Variants set the internal blur/scale rhythm; layout size comes from CSS.
 */
export type SonarOrbVariant = "lg" | "sm" | "xs";

export function SonarOrb({
  variant = "lg",
  thinking = false,
  className = "",
}: {
  variant?: SonarOrbVariant;
  thinking?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`sonar-orb sonar-orb--${variant}${thinking ? " sonar-orb--thinking" : ""}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <span className="sonar-orb__field">
        <span className="sonar-orb__sweep" />
        <span className="sonar-orb__blob sonar-orb__blob--aqua" />
        <span className="sonar-orb__blob sonar-orb__blob--warm" />
        <span className="sonar-orb__core" />
        <span className="sonar-orb__shimmer" />
      </span>
      {variant !== "xs" ? <SonarMark className="sonar-orb__mark" /> : null}
    </span>
  );
}

/**
 * Minimal SONAR mark: a pulse dot with paired arcs widening to both sides —
 * a sonar return, not a chat bubble. Drawn inline so it inherits color.
 */
export function SonarMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="1.9" fill="currentColor" stroke="none" />
      <path d="M8.5 8.5a5 5 0 0 0 0 7" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M6 6a8.5 8.5 0 0 0 0 12" />
      <path d="M18 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  );
}
