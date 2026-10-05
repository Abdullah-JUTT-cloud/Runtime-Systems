import { ArchitectureGraph } from "../components/ArchitectureGraph";
import { ClosingCTA } from "../components/ClosingCTA";
import { Button, DemoFlag, SectionLabel } from "../components/Primitives";
import { ProjectVisual, projectAssetFor } from "../components/ProjectShowcase";
import { SEO } from "../components/SEO";
import type { Project } from "../data/projects";

export function ProjectDetail({ project }: { project: Project }) {
  return <><SEO title={project.title} description={project.shortDescription} />
    <header className="case-hero container">
      <div className="case-hero__meta"><span>{project.category}</span><span>{project.year}</span><DemoFlag /></div>
      <h1>{project.title}</h1><p>{project.shortDescription}</p>
      <ProjectVisual project={project} />
    </header>
    <section className="case-overview container section-space"><SectionLabel>Case overview</SectionLabel><div className="case-overview__grid"><h2>What the product is.</h2><div><p>{project.detailedDescription}</p><dl><div><dt>Client type</dt><dd>{project.clientType}</dd></div><div><dt>Services</dt><dd>{project.services.join(" · ")}</dd></div><div><dt>Technology</dt><dd>{project.technologies.join(" · ")}</dd></div></dl></div></div></section>
    <section className="case-split section-space"><div className="container case-split__grid"><article><span>01 / THE CHALLENGE</span><h2>Make the hard part legible.</h2><p>{project.challenge}</p></article><article><span>02 / THE SYSTEM</span><h2>Structure before surface.</h2><p>{project.solution}</p></article></div></section>
    <section className="case-architecture section-space"><div className="container"><SectionLabel>Architecture</SectionLabel><div className="section-heading"><h2>Inside {project.title}.</h2><p>Interactive reference architecture for this demonstration case.</p></div><ArchitectureGraph compact /></div></section>
    <section className="engineering section-space container"><SectionLabel>Engineering</SectionLabel><div className="engineering__grid"><h2>Decisions with consequences.</h2><div>{project.architecture.map((layer, index) => <article key={layer.label}><span>0{index + 1}</span><div><h3>{layer.label}</h3><p>{layer.detail}</p></div></article>)}</div></div></section>
    <section className="gallery section-space"><div className="container"><SectionLabel>Product surfaces</SectionLabel><div className="gallery__grid">{project.gallery.map((item, index) => <figure key={item.title} className={`gallery-card gallery-card--${index + 1} tone-${item.tone}`}><div><span>SCREEN / 0{index + 1}</span><img src={item.image ?? projectAssetFor(project)} alt={`${project.title} ${item.title} screenshot`} loading="lazy" /></div><figcaption><strong>{item.title}</strong><span>{item.caption}</span></figcaption></figure>)}</div></div></section>
    <section className="results section-space container"><SectionLabel>Results</SectionLabel><div className="results__grid"><h2>Proof belongs here.</h2><div><p>{project.results}</p><div className="metrics">{project.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span><small>Demo content</small></div>)}</div><Button href="/start-project">Discuss a Similar System</Button></div></div></section>
    <ClosingCTA title="Have a system like this?" />
  </>;
}
