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
    accent: "#00a184",
  },
];

