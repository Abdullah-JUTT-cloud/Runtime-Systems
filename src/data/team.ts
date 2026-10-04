export type TeamMember = {
  name: string;
  label: string;
  role: string;
  photo?: string;
  bio: string;
  specialization: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
  portfolioLabel?: string;
  placeholder: boolean;
};

export const team: TeamMember[] = [
  {
    name: "Founder & CEO",
    label: "Founder / CEO",
    role: "Product strategy · systems architecture · delivery leadership",
    photo: "/FounderCEO.jpeg",
    bio: "Leads Runtime Systems with a product-first view: translating operational pressure into system design, product clarity, and execution strategy. The focus is always on what will still work when the product is in production, under change, and being used by real teams.",
    specialization: ["Product strategy", "Systems design", "Technical leadership", "Execution planning"],
    portfolio: "https://www.abdullahjutt.dev/",
    portfolioLabel: "abdullahjutt.dev",
    placeholder: false,
  },
  {
    name: "Taha",
    label: "AI Developer",
    role: "AI developer · Agentic AI · Model training · LLM systems",
    photo: "/TAHA.jpeg",
    bio: "Designs and deploys AI systems that turn models into useful operational capabilities: agentic workflows, training pipelines, prompt architecture, RAG systems, OKR pipelines, and LLM-driven product experiences built for real-world constraints.",
    specialization: ["Agentic AI", "Model training", "LLM systems", "RAG", "OKR pipelines", "AI product workflows"],
    placeholder: false,
  },
  {
    name: "Anas",
    label: "Full Stack Developer",
    role: "Full Stack Developer",
    photo: "/AnasYousaf-FormalPicture.png",
    bio: "Builds dependable product experiences across the stack, pairing frontend polish with backend reliability. He focuses on shipping systems that are maintainable, observable, and easy for product teams to evolve without dragging engineering down.",
    specialization: ["Frontend engineering", "Backend services", "API design", "System reliability"],
    placeholder: false,
  },
];

