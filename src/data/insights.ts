export type InsightSection = {
  heading: string;
  body: string[];
};

export type Insight = {
  slug: string;
  category: "Engineering" | "AI" | "Architecture" | "Product" | "Systems" | "DevOps";
  title: string;
  summary: string;
  date: string;
  readTime: string;
  image: string;
  imageAlt: string;
  takeaways: string[];
  sections: InsightSection[];
};

export const insights: Insight[] = [
  {
    slug: "ai-systems-need-interfaces",
    category: "AI",
    title: "AI systems need interfaces, not just models",
    summary: "Why the operating surface around an AI system determines whether it earns trust.",
    date: "Runtime note",
    readTime: "9 min",
    image: "/images/article-ai-interface.jpg",
    imageAlt: "Engineers reviewing product interfaces around a shared workspace.",
    takeaways: ["Expose confidence and uncertainty", "Design human override paths", "Measure behavior in production"],
    sections: [
      {
        heading: "The model is only one part of the product",
        body: [
          "Most AI projects fail to earn trust because the team treats the model as the product. Users do not experience embeddings, prompts, vector stores, or tool calls directly. They experience an interface that either helps them understand what happened or leaves them guessing.",
          "A strong AI system gives people an operating surface: clear inputs, visible assumptions, citations where needed, editable outputs, confirmation steps for risky actions, and a direct path back to a human workflow.",
        ],
      },
      {
        heading: "Design for the moments where AI is unsure",
        body: [
          "Confidence should change the interface. High-confidence routine work can move quickly. Low-confidence answers need more context, a softer recommendation, or an explicit request for review. The interface should make that state visible without turning every interaction into a warning label.",
          "This is especially important in healthcare, finance, logistics, and internal operations where one polished but wrong answer can damage trust faster than ten useful answers can build it.",
        ],
      },
      {
        heading: "Trust is measured after launch",
        body: [
          "Runtime Systems treats AI features as production systems. We define eval cases, refusal behavior, fallback rules, cost budgets, latency limits, and audit trails before release. The goal is not to make AI feel magical. The goal is to make it dependable enough to sit inside real work.",
          "When teams can inspect what the system used, why it responded, and how often it succeeds, AI stops being a demo and becomes software the business can govern.",
        ],
      },
    ],
  },
  {
    slug: "designing-for-runtime",
    category: "Architecture",
    title: "Designing for runtime, not handoff",
    summary: "A practical framework for connecting product intent to production behavior.",
    date: "Runtime note",
    readTime: "8 min",
    image: "/images/article-runtime.jpg",
    imageAlt: "Product team mapping software decisions on a wall.",
    takeaways: ["Model system boundaries early", "Name operational risks", "Make release behavior visible"],
    sections: [
      {
        heading: "A handoff is not a finish line",
        body: [
          "Many product plans are written as if the work ends when the screen is approved or the feature is merged. Runtime begins when customers, internal users, devices, networks, background jobs, and third-party APIs all start interacting with the system at once.",
          "Designing for runtime means asking how the product behaves under load, during partial failure, across roles, and through future changes. It turns architecture into a product decision instead of a back-office concern.",
        ],
      },
      {
        heading: "Every feature has an operating model",
        body: [
          "A checkout flow needs payment retries, inventory locks, and support visibility. A voice agent needs latency budgets, transcript storage, consent handling, and escalation. A clinical dashboard needs audit trails and careful permissions.",
          "These are not details to postpone. They are part of the user experience. The earlier they are named, the less expensive they are to build well.",
        ],
      },
      {
        heading: "The best architecture is legible",
        body: [
          "Teams move faster when service boundaries, data ownership, and release responsibilities are easy to understand. We prefer diagrams, runbooks, and naming systems that product, design, and engineering can all use.",
          "Legibility reduces operational drag. It helps new engineers join, helps stakeholders make decisions, and gives the business a clearer picture of what it owns.",
        ],
      },
    ],
  },
  {
    slug: "events-as-product-language",
    category: "Systems",
    title: "Events are a product language",
    summary: "How event-driven architecture can make complex operations easier to understand.",
    date: "Runtime note",
    readTime: "7 min",
    image: "/images/article-events.jpg",
    imageAlt: "Close-up of infrastructure cables and connected system hardware.",
    takeaways: ["Name events as business facts", "Version contracts deliberately", "Use events to explain operations"],
    sections: [
      {
        heading: "Events should describe what the business recognizes",
        body: [
          "A useful event is more than a technical notification. It records that something meaningful happened: appointment booked, policy approved, shipment delayed, payment failed, lead qualified.",
          "When event names match business language, the architecture becomes easier to reason about. Product managers, analysts, support teams, and engineers can discuss the same system without translating every sentence.",
        ],
      },
      {
        heading: "Contracts protect teams from surprise",
        body: [
          "Event-driven systems become fragile when payloads change without ownership. A good event contract defines the producer, consumers, schema, versioning approach, retention expectations, and failure behavior.",
          "This does not need to be heavyweight. It needs to be explicit enough that a growing team can change the product without silently breaking the work of another team.",
        ],
      },
      {
        heading: "The event stream can become the product memory",
        body: [
          "Events help reconstruct what happened when a customer asks a support question or when an operations team needs to audit a decision. They turn runtime behavior into a record that can be inspected and improved.",
          "For AI systems, events are also the foundation for evals, feedback loops, and cost analysis. The better the event language, the more learnable the product becomes.",
        ],
      },
    ],
  },
  {
    slug: "mobile-is-an-environment",
    category: "Engineering",
    title: "Mobile is an environment, not a viewport",
    summary: "Designing for unreliable networks, interruptions, and use in motion.",
    date: "Runtime note",
    readTime: "7 min",
    image: "/images/article-mobile.jpg",
    imageAlt: "Mobile engineering workspace with phones and development tools.",
    takeaways: ["Assume interruption", "Design sync as a feature", "Respect device constraints"],
    sections: [
      {
        heading: "A phone is not a small desktop",
        body: [
          "Mobile products live in pockets, clinics, warehouses, cars, shops, and field sites. The user may be offline, interrupted, one-handed, moving, or switching between tasks every few seconds.",
          "The product has to respect that environment. Layout matters, but state, resilience, background behavior, and clear recovery matter just as much.",
        ],
      },
      {
        heading: "Offline behavior is part of the promise",
        body: [
          "If the app captures orders, patient notes, route updates, inspections, or field reports, sync cannot be an afterthought. The interface should show what is saved locally, what is waiting to upload, what failed, and what needs human attention.",
          "Honest sync design prevents duplicate work and prevents users from losing confidence in the product during the exact moments it should be helping them.",
        ],
      },
      {
        heading: "Release quality comes from constraints",
        body: [
          "Mobile engineering needs performance budgets, device testing, crash monitoring, permission strategy, notification discipline, and app-store release planning. These constraints are not bureaucracy. They are what keep the experience reliable in the wild.",
          "Runtime Systems builds mobile products around the full environment so the app can stay useful after the first clean demo on a fast office network.",
        ],
      },
    ],
  },
];

export const insightCategories = ["Engineering", "AI", "Architecture", "Product", "Systems", "DevOps"] as const;
