import { ClosingCTA } from "../components/ClosingCTA";
import { DemoFlag, PageHeader, TextLink } from "../components/Primitives";
import { ProjectVisual } from "../components/ProjectShowcase";
import { SEO } from "../components/SEO";
import { projects } from "../data/projects";

export function Work() {
  return <><SEO title="Work" description="Explore the product and system architecture behind Runtime Systems case-study demos." /><PageHeader eyebrow="Work / 06 systems" title="Products are visible. Systems make them possible." description="A replaceable showcase structure for Runtime Systems work. The current entries are clearly identified demonstration content—not client claims." />
    <section className="work-index container">
      {projects.map((project, index) => <article key={project.slug} className="work-row" data-reveal><div className="work-row__top"><span>0{index + 1}</span><span>{project.category}</span><DemoFlag /></div><ProjectVisual project={project} index={index} /><div className="work-row__copy"><h2>{project.title}</h2><p>{project.shortDescription}</p><TextLink href={`/work/${project.slug}`}>Open case architecture</TextLink></div></article>)}
    </section><ClosingCTA /></>;
}

