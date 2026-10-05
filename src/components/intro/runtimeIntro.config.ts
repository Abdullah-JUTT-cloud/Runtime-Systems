export type RuntimeIntroMeta = { label: string; value: string; dot?: boolean };

export type RuntimeIntroContent = {
  eyebrow: string;
  /** One entry per display line — line breaks are controlled, never accidental. */
  headline: string[];
  description: string;
  primaryCta: string;
  secondaryCta: { label: string; href: string };
  meta: RuntimeIntroMeta[];
};

/**
 * All first-visit intro copy lives here — replace strings without touching
 * the component. Keep claims substantiated: no client counts, rankings, or
 * uptime figures unless real data backs them.
 */
export const runtimeIntro: RuntimeIntroContent = {
  eyebrow: "RUNTIME SYSTEMS",
  headline: ["BUILT FOR", "**AMBITIOUS** TEAMS."],
  description:
    "We engineer high-performance digital products, AI systems, and scalable software for teams that expect more from technology.",
  primaryCta: "ENTER RUNTIME",
  secondaryCta: { label: "EXPLORE OUR WORK", href: "/work" },
  meta: [
    { label: "SYSTEM", value: "INITIALIZING" },
    { label: "ENGINE", value: "RUNTIME" },
    { label: "NETWORK", value: "ONLINE", dot: true },
    { label: "LOCATION", value: "LAHORE · WORLDWIDE" },
  ],
};
