export type Project = {
  id: string;
  category: string;
  status: string;
  title: string;
  slug: string;
  liveUrl?: string;
  shortDescription: string;
  detailedDescription: string;
  clientType: string;
  year: string;
  technologies: string[];
  services: string[];
  heroTone: string;
  visualStack?: string[];
  gallery: { title: string; caption: string; tone: string; image?: string }[];
  metrics: { value: string; label: string }[];
  challenge: string;
  solution: string;
  architecture: { label: string; detail: string }[];
  results: string;
  testimonial: null;
  featured: boolean;
  techStack: string[];
  caseStudy: {
    overview: string;
    clientType: string;
    services: string;
    detailedTechnology: string;
  };
};

export const projects: Project[] = [
  {
    id: "01",
    category: "HEALTHCARE TECHNOLOGY",
    status: "ACTIVE",
    title: "MEDALERTO",
    slug: "medalerto-os",
    liveUrl: "https://medalerto.me/",
    shortDescription: "A coordinated care platform designed around time-critical clinical workflows.",
    detailedDescription: "MedAlerto is an all-in-one healthcare SaaS platform that simplifies workflows for modern medical practices. It unifies prescriptions, appointment scheduling, and patient history into a single intuitive interface. The system features AI-based suggestions to help doctors save time, manage follow-ups, and handle patient care efficiently.",
    clientType: "Healthcare SaaS / Medical Practices",
    year: "2025",
    technologies: ["React Native", "Node.js", "PostgreSQL", "Redis", "AI/LLM Integration"],
    services: ["Product Engineering", "Full-Stack Development", "AI Integration"],
    heroTone: "coral",
    gallery: [
      { title: "Care triage", caption: "Urgent patient cases stay prioritized across the workflow.", tone: "coral", image: "/Med1.png" },
      { title: "Clinical timeline", caption: "Visits, prescriptions, and history share one operational view.", tone: "sand", image: "/Med2.png" },
      { title: "Practice dashboard", caption: "Doctors move from information to action without friction.", tone: "mint", image: "/Med3.png" },
    ],
    metrics: [
      { value: "Role-aware", label: "Clinical workflows" },
      { value: "AI-assisted", label: "Follow-up suggestions" },
      { value: "Event-driven", label: "Operations layer" },
    ],
    challenge: "Healthcare operations are spread across bookings, records, and patient communication. Teams needed a single system that prioritized urgency without making the workflow harder to follow.",
    solution: "The platform consolidates patient signals, operational tasks, and recommendation logic into a role-aware workflow that keeps clinicians focused on the next best action.",
    architecture: [
      { label: "Practice workflows", detail: "Unified scheduling, prescriptions, and patient context" },
      { label: "AI suggestions", detail: "Context-aware recommendations for timely follow-up" },
      { label: "Patient records", detail: "Structured care history with secure access controls" },
      { label: "Operations layer", detail: "Event-driven notifications and backend orchestration" },
    ],
    results: "This case study demonstrates how health operations can be simplified with a thoughtful, clinician-first product system built around trust, speed, and clarity.",
    testimonial: null,
    featured: true,
    techStack: ["REACT NATIVE", "NODE.JS", "POSTGRESQL", "AI"],
    caseStudy: {
      overview: "MedAlerto is an all-in-one healthcare SaaS platform that simplifies workflows for modern medical practices. It unifies prescriptions, appointment scheduling, and patient history into a single intuitive interface. The system features AI-based suggestions to help doctors save time, manage follow-ups, and handle patient care efficiently.",
      clientType: "Healthcare SaaS / Medical Practices",
      services: "Product Engineering · Full-Stack Development · AI Integration",
      detailedTechnology: "React Native, Node.js, PostgreSQL, Redis, AI/LLM Integration",
    },
  },
  {
    id: "02",
    category: "E-COMMERCE / RETAIL",
    status: "ACTIVE",
    title: "MAAZ SAFDER",
    slug: "maaz-safder",
    liveUrl: "https://maazsafder.store/",
    shortDescription: "A premium e-commerce storefront for an elegant perfume and chocolate brand.",
    detailedDescription: "An e-commerce platform built for a premium perfume and chocolate brand based in Karachi, Sindh. The platform highlights the brand's signature fragrances, new arrivals, and top sellers alongside a dedicated chocolates section, providing a seamless shopping experience.",
    clientType: "Retail / D2C Brand",
    year: "2024",
    technologies: ["Next.js", "Payment Gateways", "E-commerce Frameworks", "Frontend Engineering"],
    services: ["Web Development", "E-commerce Architecture"],
    heroTone: "blue",
    gallery: [
      { title: "Luxury storefront", caption: "Premium product storytelling is paired with streamlined browsing.", tone: "blue", image: "/M1.png" },
      { title: "Top sellers", caption: "Best-performing products are surfaced with confidence and clarity.", tone: "ice", image: "/M2.png" },
      { title: "Chocolates section", caption: "A dedicated category supports the broader brand experience.", tone: "sand", image: "/M3.png" },
    ],
    metrics: [
      { value: "Conversion-first", label: "Storefront architecture" },
      { value: "Dual catalog", label: "Fragrances + chocolates" },
      { value: "Integrated", label: "Payment gateways" },
    ],
    challenge: "The brand needed a storefront that felt premium, trustworthy, and conversion-oriented while conveying a distinct luxury identity across both fragrances and chocolate products.",
    solution: "A high-end storefront architecture paired curated product storytelling with a conversion-friendly buying flow, creating a polished digital retail experience for a premium brand.",
    architecture: [
      { label: "Storefront UX", detail: "Luxury-first product discovery and merchandising" },
      { label: "Catalog layout", detail: "New arrivals, best sellers, and category-driven browsing" },
      { label: "Checkout flow", detail: "Streamlined purchase journeys with payment integration" },
      { label: "Brand system", detail: "Editorial presentation aligned with product positioning" },
    ],
    results: "The experience is structured to make premium products feel aspirational while still making the buying path clear and efficient.",
    testimonial: null,
    featured: true,
    techStack: ["NEXT.JS", "E-COMMERCE", "PAYMENTS"],
    caseStudy: {
      overview: "An e-commerce platform built for a premium perfume and chocolate brand based in Karachi, Sindh. The platform highlights the brand's signature fragrances, new arrivals, and top sellers alongside a dedicated chocolates section, providing a seamless shopping experience.",
      clientType: "Retail / D2C Brand",
      services: "Web Development · E-commerce Architecture",
      detailedTechnology: "Next.js, E-commerce Frameworks, Payment Gateways",
    },
  },
  {
    id: "03",
    category: "E-COMMERCE / LUXURY TIMEPIECES",
    status: "ACTIVE",
    title: "WATCHCENTER",
    slug: "watchcenter",
    shortDescription: "A premium watch retail platform for browsing, comparing, and buying timepieces.",
    detailedDescription: "WatchCenter is a dedicated e-commerce platform for luxury and everyday timepieces. It brings curated collections, rich product detail pages, and structured filtering by brand, movement, case size, and price into one storefront, supported by a smooth cart and checkout experience.",
    clientType: "Luxury Retail / E-commerce",
    year: "2025",
    technologies: ["React", "Node.js", "E-commerce Architecture", "Payment Gateway Integration"],
    services: ["Web Development", "E-commerce Architecture", "Frontend Engineering"],
    heroTone: "lime",
    gallery: [
      { title: "Curated collections", caption: "Timepieces are presented with premium product storytelling.", tone: "lime", image: "/W2.png" },
      { title: "Product detail", caption: "Specifications, provenance, and pricing stay clear and comparable.", tone: "mint", image: "/W3.png" },
      { title: "Storefront experience", caption: "Browsing, filtering, and buying flow without friction.", tone: "ice", image: "/W4.png" },
    ],
    metrics: [
      { value: "Conversion-first", label: "Storefront architecture" },
      { value: "Structured", label: "Catalog filtering" },
      { value: "Integrated", label: "Checkout flow" },
    ],
    challenge: "Watch buyers compare across brands, movement types, sizes, and price points. The storefront needed to make deep catalogs feel curated and easy to navigate while keeping the buying path short and trustworthy.",
    solution: "A conversion-focused storefront combines premium product presentation with structured filtering and a streamlined checkout, so large catalogs feel organized and purchases feel confident.",
    architecture: [
      { label: "Catalog layer", detail: "Structured product data with filtering by brand, movement, and price" },
      { label: "Storefront UX", detail: "Premium product pages and collection-driven browsing" },
      { label: "Cart and checkout", detail: "Streamlined purchase flow with payment gateway integration" },
      { label: "Content layer", detail: "Editable collections and product storytelling surfaces" },
    ],
    results: "The platform is structured to make browsing a large timepiece catalog feel curated and decisive, with a buying path that stays clear from discovery to checkout.",
    testimonial: null,
    featured: true,
    techStack: ["REACT", "NODE.JS", "E-COMMERCE", "PAYMENTS"],
    caseStudy: {
      overview: "WatchCenter is a dedicated e-commerce platform for luxury and everyday timepieces. It brings curated collections, rich product detail pages, and structured filtering by brand, movement, case size, and price into one storefront, supported by a smooth cart and checkout experience.",
      clientType: "Luxury Retail / E-commerce",
      services: "Web Development · E-commerce Architecture · Frontend Engineering",
      detailedTechnology: "React, Node.js, E-commerce Architecture, Payment Gateway Integration",
    },
  },
  {
    id: "04",
    category: "AI / AUTOMATION",
    status: "ACTIVE",
    title: "URVO",
    slug: "urvo",
    liveUrl: "https://urvo.io/",
    shortDescription: "A conversational AI voice agent platform for home services.",
    detailedDescription: "A conversational AI voice agent platform enabling businesses to build, deploy, and monitor low-latency voice agents. Handles inbound and outbound calls, automates customer workflows, and integrates directly with existing CRMs.",
    clientType: "B2B SaaS / Automation",
    year: "2024",
    technologies: ["Conversational AI", "Voice APIs", "CRM Webhooks", "Node.js"],
    services: ["AI Voice Systems", "API Integration", "Dashboard Development"],
    heroTone: "orange",
    gallery: [
      { title: "Voice orchestration", caption: "Calls are automated with structured outcomes and monitoring.", tone: "orange", image: "/U1.png" },
      { title: "CRM pipeline", caption: "Business workflows stay connected to customer interactions.", tone: "violet", image: "/U2.png" },
      { title: "Automation controls", caption: "Teams track agents, calls, and business outcomes in one place.", tone: "teal", image: "/U3.png" },
    ],
    metrics: [
      { value: "Low-latency", label: "Voice agent flows" },
      { value: "Two-way", label: "Inbound + outbound calls" },
      { value: "CRM-connected", label: "Workflow automation" },
    ],
    challenge: "Businesses needed a reliable way to automate voice-led customer interactions without losing control, oversight, or natural conversation quality.",
    solution: "The platform blends low-latency conversation design, CRM connectivity, and operational monitoring so voice automation can support real business outcomes at scale.",
    architecture: [
      { label: "Voice agents", detail: "Real-time conversational flows for inbound and outbound calls" },
      { label: "Integrations", detail: "CRM webhooks and endpoint-driven automation" },
      { label: "Monitoring", detail: "Call quality, outcomes, and system observability" },
      { label: "Operational control", detail: "Business workflows built around measurable outcomes" },
    ],
    results: "The system is structured to help service businesses automate calls intelligently while keeping humans in the loop where real decisions matter.",
    testimonial: null,
    featured: true,
    techStack: ["AI", "VOICE", "CRM INTEGRATION"],
    caseStudy: {
      overview: "A conversational AI voice agent platform enabling businesses to build, deploy, and monitor low-latency voice agents. Handles inbound and outbound calls, automates customer workflows, and integrates directly with existing CRMs.",
      clientType: "B2B SaaS / Automation",
      services: "AI Voice Systems · API Integration · Dashboard Development",
      detailedTechnology: "Conversational AI, Voice APIs, CRM Webhooks, Node.js",
    },
  },
  {
    id: "05",
    category: "INTERACTIVE EXPERIENCE / GRAPHIC NOVEL",
    status: "ACTIVE",
    title: "SANTIONI SPIRITS",
    slug: "santioni-spirits",
    liveUrl: "https://santionispirits.com/",
    shortDescription: "An interactive graphic novel and storytelling web experience for a luxury spirits brand.",
    detailedDescription: "A digital brand experience built for Santioni Spirits that merges luxury product showcasing with an interactive graphic novel narrative. Features custom ink artwork, panel navigation, audio-visual storytelling, and seamless toggling between story and collection modes.",
    clientType: "Luxury Spirits / Interactive Media Brand",
    year: "2024",
    technologies: ["WebGL", "Canvas", "Audio", "React"],
    services: ["Interactive Storytelling", "Creative Frontend Engineering", "Canvas/WebGL Development"],
    heroTone: "sand",
    visualStack: ["/SANTIONI.png", "/S1.png", "/S2.png", "/S3.png", "/S4.png"],
    gallery: [
      { title: "Story panels", caption: "Narrative frames guide the audience through the brand world.", tone: "sand", image: "/S1.png" },
      { title: "Collection mode", caption: "The product catalog stays elegant and easy to browse.", tone: "ice", image: "/S2.png" },
      { title: "Audio experience", caption: "Atmospheric sound and motion reinforce product storytelling.", tone: "violet", image: "/S3.png" },
      { title: "Ink artwork", caption: "Custom illustrated panels carry the brand's visual identity.", tone: "sand", image: "/S4.png" },
      { title: "Brand visual", caption: "The signature artwork anchors the story and the collection.", tone: "ice" },
    ],
    metrics: [
      { value: "Hybrid", label: "Story + catalog modes" },
      { value: "Canvas/WebGL", label: "Narrative rendering" },
      { value: "Audio-visual", label: "Storytelling layers" },
    ],
    challenge: "Luxury storytelling needs to feel premium, tactile, and immersive without becoming heavy or difficult to navigate for first-time users.",
    solution: "A hybrid narrative UI blends editorial motion, illustrated panels, and premium product discovery into a modern experience that feels both cinematic and practical.",
    architecture: [
      { label: "Narrative layer", detail: "Interactive story sequence with multiple visual chapters" },
      { label: "Brand system", detail: "Luxury treatment of type, motion, and product framing" },
      { label: "Interaction layer", detail: "Canvas/WebGL and audio-enhanced storytelling surfaces" },
      { label: "Collection mode", detail: "Seamless switching between story and product browsing" },
    ],
    results: "The experience shows how high-end product storytelling can feel cinematic while still delivering direct product discovery and branded clarity.",
    testimonial: null,
    featured: true,
    techStack: ["WEBGL", "CANVAS", "AUDIO", "REACT"],
    caseStudy: {
      overview: "A digital brand experience built for Santioni Spirits that merges luxury product showcasing with an interactive graphic novel narrative. Features custom ink artwork, panel navigation, audio-visual storytelling, and seamless toggling between story and collection modes.",
      clientType: "Luxury Spirits / Interactive Media Brand",
      services: "Interactive Storytelling · Creative Frontend Engineering · Canvas/WebGL Development",
      detailedTechnology: "WebGL, HTML5 Canvas, Custom CSS Animations, Interactive Audio",
    },
  },
];
