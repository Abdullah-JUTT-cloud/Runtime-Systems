import { ClosingCTA } from "../components/ClosingCTA";
import { Button, SectionLabel } from "../components/Primitives";
import { SEO } from "../components/SEO";
import { ServiceVisual } from "../components/ServiceVisual";
import { projects } from "../data/projects";
import type { Service } from "../data/services";
import { Link } from "../lib/router";

export function ServiceDetail({ service }: { service: Service }) {
  const related = projects.filter((p) => p.services.some((s) => s.toLowerCase().includes(service.shortTitle.toLowerCase()) || service.id === "product")).slice(0, 2);
  return <><SEO title={service.title} description={service.overview} />
    <header className="service-hero" style={{ "--service-accent": service.accent } as React.CSSProperties}><div className="container service-hero__inner"><div><p className="meta">ENGINE / {service.id.toUpperCase()}</p><h1>{service.title}</h1><p>{service.thesis}</p><Button href="/start-project">Start a Project</Button></div><ServiceVisual service={service} hero /></div></header>
    <section className="service-overview container section-space"><SectionLabel>Service overview</SectionLabel><div><h2>Built around the decisions that compound.</h2><p>{service.overview}</p></div></section>
    <section className="service-problems section-space"><div className="container"><SectionLabel>Problems solved</SectionLabel><div className="problem-grid">{service.problems.map((problem, index) => <article key={problem}><span>0{index + 1}</span><h3>{problem}</h3><p>We reduce ambiguity, model the system, and create a path from the current constraint to a maintainable runtime.</p></article>)}</div></div></section>
    <section className="service-capabilities container section-space"><SectionLabel>Engineering capability</SectionLabel><div className="service-capabilities__grid"><h2>What enters the build.</h2><div>{service.capabilities.map((item) => <div key={item}><span>NODE</span><h3>{item}</h3><i /></div>)}</div></div><div className="tech-rail">{service.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div></section>
    <section className="workflow section-space"><div className="container"><SectionLabel>Workflow</SectionLabel><div className="workflow__track">{["Frame", "Model", "Prototype", "Engineer", "Validate", "Evolve"].map((step, index) => <div key={step}><span>0{index + 1}</span><b>{step}</b></div>)}</div></div></section>
    {related.length > 0 && <section className="related-work container section-space"><SectionLabel>Related demo systems</SectionLabel><div>{related.map((project) => <Link href={`/work/${project.slug}`} key={project.slug}><span>{project.category}</span><h3>{project.title}</h3><p>{project.shortDescription}</p><b>Open case →</b></Link>)}</div></section>}
    <ClosingCTA title={`Put ${service.shortTitle.toLowerCase()} into motion.`} />
  </>;
}
