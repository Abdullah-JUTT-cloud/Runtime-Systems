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
  {
    slug: "ship-the-boring-parts-first",
    category: "Engineering",
    title: "Ship the boring parts first",
    summary: "Why logging, config, and error paths deserve the first sprint, not the last one.",
    date: "Runtime note",
    readTime: "6 min",
    image: "/images/web-platform.jpg",
    imageAlt: "Developer workspace with a web platform dashboard open across monitors.",
    takeaways: ["Build the error path first", "Treat config as product surface", "Make the second week calmer"],
    sections: [
      {
        heading: "The exciting 20% is not the system",
        body: [
          "Every product has a demo path: the happy flow that looks great in a walkthrough. The system is the other part — retries, validation, permissions, log lines someone will read at 2 a.m., and the config screen an operator has to trust.",
          "Teams that build the boring parts first discover the real constraints while change is still cheap. Teams that defer them discover the constraints during launch week, when every fix is expensive and visible.",
        ],
      },
      {
        heading: "Operational code is user experience",
        body: [
          "A clear error message, a readable audit trail, and a predictable restart are features users and support teams feel directly. They reduce escalations, shorten incidents, and make the product feel safe to depend on.",
          "Runtime Systems schedules this work into the first builds on purpose. It is far easier to keep a calm codebase calm than to retrofit observability and honest failure states onto a system that never had them.",
        ],
      },
    ],
  },
  {
    slug: "design-the-eval-before-the-prompt",
    category: "AI",
    title: "Design the eval before the prompt",
    summary: "A test suite for model behavior is the fastest way to make AI work shippable.",
    date: "Runtime note",
    readTime: "8 min",
    image: "/images/ai-lab.jpg",
    imageAlt: "Machine learning workspace with experiment dashboards and test runs.",
    takeaways: ["Define success before tuning", "Build a small golden set", "Re-run evals on every change"],
    sections: [
      {
        heading: "Prompt tuning without measurement is guessing",
        body: [
          "Adjusting prompts, retrieval settings, or model versions without a fixed evaluation set produces impressions, not evidence. One impressive demo answer can hide twenty quiet failures that customers will find first.",
          "A small golden set of real inputs — including the awkward, adversarial, and empty ones — turns model changes into measurable decisions. The team can see whether quality moved instead of debating anecdotes.",
        ],
      },
      {
        heading: "Evals belong in the delivery loop",
        body: [
          "An eval suite earns its value when it runs automatically: on prompt changes, on model upgrades, on retrieval index updates, and before release. Regression becomes visible the day it appears, not the month after customers report it.",
          "Runtime Systems treats evals as part of the definition of done for AI features. The same discipline that keeps conventional software stable — tests, thresholds, review — is what makes AI behavior governable in production.",
        ],
      },
    ],
  },
  {
    slug: "boundaries-are-product-decisions",
    category: "Architecture",
    title: "Boundaries are product decisions",
    summary: "Where one system ends and the next begins shapes speed, cost, and what can change.",
    date: "Runtime note",
    readTime: "7 min",
    image: "/images/runtime-partner.jpg",
    imageAlt: "Engineers sketching service boundaries and data flows on a whiteboard.",
    takeaways: ["Draw boundaries around change", "Own the data model", "Keep one team per boundary"],
    sections: [
      {
        heading: "Every boundary is a bet about the future",
        body: [
          "Splitting a system into services, modules, or integrations decides which future changes are cheap and which require coordination across teams. A boundary drawn around a feature that always changes together creates drag; a boundary around a genuinely independent capability creates speed.",
          "The right split follows the product's pressure points: what ships independently, what fails independently, and which data has one authoritative owner.",
        ],
      },
      {
        heading: "The data model is the contract",
        body: [
          "Interfaces can be redesigned in a sprint; a corrupted data model follows the product for years. Boundaries should guarantee that each domain's records have one owner, one writer, and a clear history.",
          "Runtime Systems starts architecture work from the data: what exists, who changes it, how long it lives, and what must survive a pivot. Service maps and API contracts become easier and far more durable once that is settled.",
        ],
      },
    ],
  },
  {
    slug: "alerts-are-a-user-interface",
    category: "Systems",
    title: "Alerts are a user interface",
    summary: "Monitoring that treats on-call engineers as users stops pages nobody can act on.",
    date: "Runtime note",
    readTime: "6 min",
    image: "/images/qa-eval.jpg",
    imageAlt: "Monitoring dashboards with service health metrics during a review session.",
    takeaways: ["Page on symptoms, not causes", "Every alert needs a runbook", "Delete alerts nobody acts on"],
    sections: [
      {
        heading: "A page is a request for human attention",
        body: [
          "Every alert interrupts someone's life. If the responder cannot look at the page, form a hypothesis, and take a safe action, the alert is noise — and noise trains people to ignore the system exactly when it matters.",
          "Good alerting pages on user-visible symptoms: latency above a budget, error rate above a threshold, sync falling behind. Causes are explored in dashboards, not broadcast at 3 a.m.",
        ],
      },
      {
        heading: "Observability is maintained, not installed",
        body: [
          "Dashboards and alerts drift out of date as the product changes. An alert that has fired ten times with no action is a decision waiting to be made: fix the cause, fix the threshold, or delete the alert.",
          "Runtime Systems reviews signal quality as part of regular delivery — adding coverage for new behavior, pruning dead rules, and keeping runbooks linked to every page so the responder's next step is always written down.",
        ],
      },
    ],
  },
  {
    slug: "interfaces-are-commitments",
    category: "Product",
    title: "Interfaces are commitments",
    summary: "Every screen a team ships teaches users what the product will keep doing for them.",
    date: "Runtime note",
    readTime: "6 min",
    image: "/images/product-design.jpg",
    imageAlt: "Product designer reviewing interface flows with annotated screens.",
    takeaways: ["Design the empty and error states", "Ship fewer promises, keep them", "Test with real data shapes"],
    sections: [
      {
        heading: "Users read behavior, not roadmaps",
        body: [
          "A button that works once is a promise that it will work every time. A filter that silently drops results teaches users to distrust the whole page. Product quality is the accumulation of kept promises, and the interface is where those promises are visible.",
          "That is why the empty state, the loading state, and the failure state deserve the same craft as the happy path. They are the moments when users decide whether the product respects them.",
        ],
      },
      {
        heading: "Design with the data you actually have",
        body: [
          "Screens designed against tidy placeholder data break against real names, real volumes, and real gaps. Long strings, missing values, time zones, and duplicate records are not edge cases; they are Tuesday.",
          "Runtime Systems pairs design and engineering against realistic data shapes from the first build, so the interface that ships is the interface that was actually tested.",
        ],
      },
    ],
  },
  {
    slug: "environments-are-part-of-the-product",
    category: "DevOps",
    title: "Environments are part of the product",
    summary: "Deployment pipelines and staging fidelity decide how safely a team can move.",
    date: "Runtime note",
    readTime: "6 min",
    image: "/images/cloud-ops.jpg",
    imageAlt: "Cloud operations workspace with deployment pipelines and infrastructure views.",
    takeaways: ["Make staging honest", "Deploy small and often", "Automate the rollback path"],
    sections: [
      {
        heading: "Releases are a habit, not an event",
        body: [
          "Teams that deploy monthly treat every release as a risk pile-up. Teams that deploy daily spread the same change over many small, reversible steps — and get feedback from production while the change is still fresh in mind.",
          "The difference is not courage; it is pipeline. Build, test, migrate, deploy, and verify as one automated path that anyone on the team can trigger without a checklist ceremony.",
        ],
      },
      {
        heading: "Staging must earn its name",
        body: [
          "A staging environment that runs different data, different scale, or different integrations validates nothing. It quietly converts every release into a production experiment.",
          "Runtime Systems keeps staging honest — production-shaped data, real third-party sandboxes, and rehearsed rollbacks — so the first time a change meets reality is not in front of customers.",
        ],
      },
    ],
  },
];

export const insightCategories = ["Engineering", "AI", "Architecture", "Product", "Systems", "DevOps"] as const;
