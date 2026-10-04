import { lazy, Suspense } from "react";
import { ArrowDown, CheckCircle2, Globe2, Layers3, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { ArchitectureGraph } from "../components/ArchitectureGraph";
import { Button, SectionLabel, TextLink } from "../components/Primitives";
import { ProjectShowcase } from "../components/ProjectShowcase";
import { ServiceExplorer } from "../components/ServiceExplorer";
import { ClosingCTA } from "../components/ClosingCTA";
import { GlobalNetwork } from "../components/GlobalNetwork";
import { RuntimeFallback } from "../components/runtime/RuntimeFallback";
import { insights } from "../data/insights";
import { SEO } from "../components/SEO";

const RuntimeCore = lazy(() => import("../components/runtime/RuntimeCore").then((module) => ({ default: module.RuntimeCore })));

const trustSignals = ["Senior engineering leadership", "AI-ready product delivery", "Cloud, mobile, and backend ownership", "Lahore-built / worldwide-ready"];

const buildCards = [
  { title: "AI & machine learning", image: "/images/ai-lab.jpg", tags: "Agents / RAG / LLM apps", text: "Practical AI systems with evals, guardrails, useful interfaces, and observable runtime behavior." },
  { title: "Web platforms", image: "/images/web-platform.jpg", tags: "React / Next.js / Node", text: "SaaS, internal tools, marketplaces, dashboards, and customer portals built for scale." },
  { title: "Mobile products", image: "/images/mobile-product.jpg", tags: "iOS / Android / React Native", text: "Mobile apps designed around offline use, release quality, device constraints, and real workflows." },
  { title: "Cloud & DevOps", image: "/images/cloud-ops.jpg", tags: "AWS / CI/CD / Observability", text: "Infrastructure, deployment pipelines, monitoring, and environments that make shipping predictable." },
  { title: "Product & UX design", image: "/images/product-design.jpg", tags: "Flows / Systems / Interfaces", text: "Interfaces that translate complex systems into clear decisions for users and operators." },
  { title: "QA & evaluation", image: "/images/qa-eval.jpg", tags: "Automation / Evals / Reliability", text: "Testing strategy for product behavior, AI outputs, integrations, and critical release paths." },
];

const industryCards = [
  { title: "Healthcare & clinics", image: "/images/industry-health.jpg", text: "Scheduling, patient workflows, clinical admin, AI triage support, and secure data surfaces." },
  { title: "Banking & fintech", image: "/images/industry-fintech.jpg", text: "KYC flows, dashboards, risk operations, payment integrations, and AI-assisted review queues." },
  { title: "Commerce & retail", image: "/images/industry-commerce.jpg", text: "Premium storefronts, inventory flows, checkout systems, loyalty, and analytics-ready operations." },
  { title: "Logistics & field ops", image: "/images/industry-logistics.jpg", text: "Route visibility, mobile field tools, sync-heavy workflows, dispatch, and operations control rooms." },
  { title: "SaaS & B2B", image: "/images/industry-saas.jpg", text: "Multi-tenant platforms, admin consoles, billing-aware product architecture, and integrations." },
  { title: "EdTech & learning", image: "/images/industry-edtech.jpg", text: "Tutor tools, assessment workflows, AI learning assistants, content systems, and progress tracking." },
];

const assurance = [
  { icon: ShieldCheck, title: "Security-aware delivery", text: "Role-based access, audit trails, secret handling, validation, and data boundaries are considered from the first build plan." },
  { icon: Workflow, title: "Observable systems", text: "We design logs, metrics, traces, error states, and support visibility so production behavior can be understood quickly." },
  { icon: Layers3, title: "Scalable architecture", text: "Service boundaries, data models, API contracts, and release paths are shaped before complexity becomes expensive." },
  { icon: Globe2, title: "Distributed collaboration", text: "Async updates, clear milestones, demo rituals, and decision records keep global teams aligned without meeting fatigue." },
];

const engagementPaths = [
  { name: "Product sprint", scope: "2-4 weeks", text: "Clarify product shape, prototype the critical workflow, validate architecture, and leave with a build-ready plan." },
  { name: "Build team", scope: "Monthly", text: "A focused engineering pod for web, mobile, AI, backend, or cloud work with weekly demos and release planning." },
  { name: "Systems partner", scope: "Ongoing", text: "Longer-term product and infrastructure ownership for teams that need senior engineering judgment as they scale." },
];

export function Home() {
  return (
    <>
      <SEO />
      <section className="hero">
        <div className="hero__grid" aria-hidden="true" />
        <div className="hero__meta hero__meta--left"><span>RUNTIME SYSTEMS</span><span>ENGINEERING STUDIO</span></div>
        <div className="hero__meta hero__meta--right"><span>LAHORE / WORLDWIDE</span><span><i /> STATUS / ONLINE</span></div>
        <div className="hero__visual">
          <Suspense fallback={<RuntimeFallback />}><RuntimeCore /></Suspense>
        </div>
        <div className="container hero__content">
          <p className="hero__kicker">APPLICATIONS × AI × DATA × INFRASTRUCTURE</p>
          <h1><span>We engineer</span><span>what comes <em>next.</em></span></h1>
          <div className="hero__bottom">
            <p>Intelligent products, scalable platforms, and the infrastructure that keeps them moving.</p>
            <div className="button-row"><Button href="/start-project">Start a Project</Button><Button href="/work" secondary>Explore Our Work</Button></div>
          </div>
        </div>
        <a href="#philosophy" className="scroll-cue"><ArrowDown size={15} /> SCROLL TO TRACE SYSTEM</a>
      </section>

      <section className="trust-strip" aria-label="Runtime Systems trust signals">
        <div className="container trust-strip__inner">
          <p>For founders, operators, and product teams that need software to work in production.</p>
          <div>
            {trustSignals.map((signal) => <span key={signal}>{signal}</span>)}
          </div>
        </div>
      </section>

      <section className="philosophy" id="philosophy">
        <div className="container">
          <SectionLabel index="01">Operating principle</SectionLabel>
          <div className="philosophy__statement" data-reveal>
            <h2>Ideas are cheap.<br /><em>Systems aren’t.</em></h2>
            <div className="philosophy__aside"><span className="system-index">SYS.PHILOSOPHY / 01</span><p>A product earns its value after launch-under load, through change, and in the hands of real people. That is the environment we design for.</p></div>
          </div>
          <div className="principles">
            {[ ["ARCHITECTURE", "Structure before velocity", "We model boundaries, data, and failure before complexity compounds."], ["PRODUCT", "Decisions over deliverables", "We connect each engineering choice to the behavior the product needs."], ["RUNTIME", "Built for the long run", "Reliability, observability, and maintainability begin with the first commit."] ].map(([label, title, text], i) => <article key={label} data-reveal data-reveal-delay={i * 110}><span>0{i + 1} / {label}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="capabilities section-space">
        <div className="container">
          <SectionLabel index="02">Core capabilities</SectionLabel>
          <div className="section-heading" data-reveal><h2>One system.<br />Multiple engines.</h2><p>Choose a layer. See how the runtime reconfigures around the problem.</p></div>
          <ServiceExplorer />
        </div>
      </section>

      <section className="build-mosaic section-space">
        <div className="container">
          <SectionLabel index="03">What we build</SectionLabel>
          <div className="section-heading" data-reveal><h2>Production software with the hard parts included.</h2><p>From AI agents and mobile apps to cloud infrastructure, Runtime Systems builds the product surface and the machinery underneath it.</p></div>
          <div className="build-mosaic__grid">
            {buildCards.map((card, index) => (
              <article key={card.title} data-reveal data-reveal-delay={index * 70}>
                <img src={card.image} alt="" loading="lazy" />
                <div>
                  <p className="meta">{card.tags}</p>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="industry-section section-space">
        <div className="container">
          <SectionLabel index="04">Solutions by industry</SectionLabel>
          <div className="section-heading" data-reveal><h2>Software for teams with real operational pressure.</h2><p>We adapt the system shape to the industry: workflows, data sensitivity, release risk, support needs, and the people who rely on the product every day.</p></div>
          <div className="industry-grid">
            {industryCards.map((card, index) => (
              <article key={card.title} data-reveal data-reveal-delay={index * 65}>
                <img src={card.image} alt="" loading="lazy" />
                <div><h3>{card.title}</h3><p>{card.text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="network-section section-space" id="global-network">
        <div className="container">
          <SectionLabel index="05">Global delivery map</SectionLabel>
          <div className="section-heading" data-reveal><h2>Built in Lahore.<br />Designed to travel.</h2><p>Runtime Systems works across borders with architecture, release planning, and deployment choices shaped around the product’s operating environment.</p></div>
          <GlobalNetwork />
        </div>
      </section>

      <section className="assurance-section section-space">
        <div className="container">
          <SectionLabel index="06">Why teams trust us</SectionLabel>
          <div className="section-heading" data-reveal><h2>Professional delivery is a system too.</h2><p>Trust comes from visible work, clear decisions, and production habits that make the software easier to own after launch.</p></div>
          <div className="assurance-grid">
            {assurance.map(({ icon: Icon, title, text }, index) => (
              <article key={title} data-reveal data-reveal-delay={index * 80}>
                <Icon size={24} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <div className="delivery-ledger" data-reveal>
            {["Discovery brief", "Architecture map", "Weekly demo", "Release checklist", "Handover docs", "Operational support"].map((item, index) => <span key={item}><CheckCircle2 size={15} />0{index + 1} / {item}</span>)}
          </div>
        </div>
      </section>

      <section className="selected-work section-space">
        <div className="container">
          <SectionLabel index="07">Selected work / representative cases</SectionLabel>
          <div className="section-heading" data-reveal><h2>Systems in motion.</h2><p>Public work examples and representative architecture notes showing the kinds of product systems Runtime Systems builds.</p></div>
        </div>
        <ProjectShowcase />
        <div className="container work-link"><TextLink href="/work">View all project architecture</TextLink></div>
      </section>

      <section className="engagement-section section-space">
        <div className="container">
          <SectionLabel index="08">Engagement models</SectionLabel>
          <div className="section-heading" data-reveal><h2>Start with the shape your product needs.</h2><p>Some teams need a short strategy sprint. Others need a dedicated build partner. We structure the engagement around the risk, timeline, and operating model.</p></div>
          <div className="engagement-grid">
            {engagementPaths.map((path, index) => <article key={path.name} data-reveal data-reveal-delay={index * 90}><span>0{index + 1}</span><p className="meta">{path.scope}</p><h3>{path.name}</h3><p>{path.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="inside section-space">
        <div className="container">
          <SectionLabel index="09">Inside the Runtime</SectionLabel>
          <div className="section-heading" data-reveal><h2>Capability is a diagram<br />you can interrogate.</h2><p>Explore the layers that turn an interface into a system.</p></div>
          <ArchitectureGraph />
        </div>
      </section>

      <section className="partner-section section-space">
        <div className="container partner-section__grid">
          <figure data-reveal>
            <img src="/images/runtime-partner.jpg" alt="Engineering team collaborating around laptops and planning boards." loading="lazy" />
            <figcaption><Sparkles size={18} /> Runtime Systems / Lahore engineering studio</figcaption>
          </figure>
          <div data-reveal>
            <SectionLabel index="10">About the studio</SectionLabel>
            <h2>A senior engineering partner for teams that refuse to ship fragile software.</h2>
            <p>Runtime Systems designs, builds, and runs software across product engineering, AI systems, mobile applications, backend architecture, and cloud infrastructure. We pair clean interfaces with serious runtime thinking so the result can survive real users, real data, and real operational pressure.</p>
            <div className="partner-links"><TextLink href="/about">Meet Runtime Systems</TextLink><TextLink href="/process">See our process</TextLink><TextLink href="/contact">Contact us</TextLink></div>
          </div>
        </div>
      </section>

      <section className="signal-section section-space">
        <div className="container">
          <SectionLabel index="11">Signals from engineering</SectionLabel>
          <div className="insight-list">
            {insights.slice(0, 3).map((article, index) => <article key={article.slug} data-reveal data-reveal-delay={index * 90}><span>0{index + 1}</span><div><p className="meta">{article.category} / {article.readTime}</p><h3>{article.title}</h3><p>{article.summary}</p></div><TextLink href="/insights">Read article</TextLink></article>)}
          </div>
        </div>
      </section>
      <ClosingCTA title="Build what keeps running." />
    </>
  );
}
