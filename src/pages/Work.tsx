import { ClosingCTA } from "../components/ClosingCTA";
import { PageHeader, TextLink } from "../components/Primitives";
import { ProjectVisual, ProjectVisualVertical } from "../components/ProjectShowcase";
import { SEO } from "../components/SEO";
import { projects } from "../data/projects";

export function Work() {
  return <><SEO title="Work" description="Explore the product and system architecture behind Runtime Systems case studies." /><PageHeader eyebrow="Work / 06 systems" title="Products are visible. Systems make them possible." description="Case studies from Runtime Systems — the products, the engineering decisions, and the architecture behind each build." />
    <section className="work-index container">
      {projects.map((project, index) => <article key={project.slug} className="work-row" data-reveal><div className="work-row__top"><span>0{index + 1}</span><span>{project.category}</span></div>{project.visualStack ? <ProjectVisualVertical project={project} /> : <ProjectVisual project={project} index={index} />}<div className="work-row__copy"><h2>{project.title}</h2><p>{project.shortDescription}</p><div className="work-row__links"><TextLink href={`/work/${project.slug}`}>Open case architecture</TextLink>{project.liveUrl && <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer">Live site</a>}</div></div></article>)}
    </section><ClosingCTA /></>;
}

