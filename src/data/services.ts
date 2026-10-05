export type Service = {
  id: string;
  title: string;
  shortTitle: string;
  href: string;
  thesis: string;
  overview: string;
  capabilities: string[];
  technologies: string[];
  problems: string[];
  /** One supporting note per problem, same order and length. */
  problemNotes: string[];
  accent: string;
};

export const services: Service[] = [
  {
    id: "product",
    title: "Product Engineering",
    shortTitle: "Product",
    href: "/services/web-engineering",
    thesis: "Digital products designed as systems, not feature lists.",
    overview: "We connect product decisions to architecture, interaction, and delivery so the software stays coherent as it grows.",
    capabilities: ["SaaS applications", "Web platforms", "Enterprise software", "Product development", "MVP engineering"],
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    problems: ["Unclear product architecture", "Slow iteration cycles", "Disconnected design and engineering"],
    problemNotes: [
      "We map the product's boundaries and data flows first, so every new feature lands on a structure that can carry it.",
      "We set up an architecture and delivery rhythm that lets the team ship every week without reworking the foundations.",
      "We connect design intent to implementation through a shared component and interaction system both sides can trust.",
    ],
    accent: "#ff5a36",
  },
  {
    id: "ai",
    title: "AI Engineering",
    shortTitle: "AI",
    href: "/services/ai",
    thesis: "AI that belongs inside the workflow—not beside it.",
    overview: "We design governed AI systems with reliable context, observable behavior, and deliberate human control.",
    capabilities: ["AI agents", "LLM integrations", "RAG systems", "Intelligent automation", "Computer vision", "Voice systems"],
    technologies: ["LLM APIs", "Python", "Vector search", "Evaluation pipelines", "Guardrails"],
    problems: ["Manual knowledge work", "Unreliable AI prototypes", "Unstructured internal information"],
    problemNotes: [
      "We identify the workflows where AI removes real toil and automate them with human oversight where decisions matter.",
      "We turn prototypes into evaluated systems — test cases, guardrails, and fallback behavior defined before release.",
      "We structure internal knowledge into retrieval-ready sources so AI answers from facts instead of guesses.",
    ],
    accent: "#9ea900",
  },
  {
    id: "mobile",
    title: "Mobile Engineering",
    shortTitle: "Mobile",
    href: "/services/mobile",
    thesis: "Mobile products built for real hands, real networks, real days.",
    overview: "We engineer mobile experiences around device realities, resilient state, and the interaction patterns people actually use.",
    capabilities: ["React Native", "iOS", "Android", "Cross-platform applications", "Offline-first workflows"],
    technologies: ["React Native", "Expo", "Swift", "Kotlin", "Push infrastructure"],
    problems: ["Inconsistent cross-platform UX", "Fragile offline behavior", "Slow release workflows"],
    problemNotes: [
      "We build a shared interaction system so iOS and Android feel like one product without losing platform conventions.",
      "We design sync, conflict handling, and local storage as core product features, not afterthoughts.",
      "We stand up build, testing, and release pipelines that make app-store delivery predictable instead of painful.",
    ],
    accent: "#3478f6",
  },
  {
    id: "backend",
    title: "Backend & Systems",
    shortTitle: "Systems",
    href: "/services/backend-systems",
    thesis: "The quiet machinery that keeps products credible.",
    overview: "We design service boundaries, data models, integrations, and runtime behavior for systems that need to stay predictable under change.",
    capabilities: ["APIs", "Distributed systems", "Microservices", "Event-driven systems", "Real-time systems", "Database architecture"],
    technologies: ["Node.js", "Spring Boot", "PostgreSQL", "MongoDB", "Redis", "Kafka"],
    problems: ["Scaling bottlenecks", "Unclear service boundaries", "Operational instability"],
    problemNotes: [
      "We profile the load paths first and remove the bottlenecks that surface earliest under real traffic.",
      "We draw service boundaries around change and data ownership, so teams can move without stepping on each other.",
      "We add the observability and failure handling that keep incidents rare, short, and understandable.",
    ],
    accent: "#151515",
  },
  {
    id: "cloud-devops",
    title: "Cloud & DevOps",
    shortTitle: "Cloud",
    href: "/services/cloud-devops",
    thesis: "Delivery infrastructure engineered as part of the product.",
    overview: "We make deployment, observability, and recovery intentional so teams can ship without treating production as a surprise.",
    capabilities: ["Docker", "CI/CD", "Cloud deployment", "Monitoring", "Infrastructure design"],
    technologies: ["Docker", "GitHub Actions", "AWS", "Observability", "Infrastructure as code"],
    problems: ["Manual deployments", "Low production visibility", "Environment drift"],
    problemNotes: [
      "We automate the build-to-deploy path so releases become small, frequent, and reversible.",
      "We wire the metrics, logs, and alerts that make production behavior legible to the whole team.",
      "We define infrastructure as code so every environment matches production by construction.",
    ],
    accent: "#00a184",
  },
];

