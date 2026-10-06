import { CheckCircle2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { ClosingCTA } from "../components/ClosingCTA";
import { Button, SectionLabel } from "../components/Primitives";
import { SEO } from "../components/SEO";
import { EngineScene } from "../components/scenes/EngineScene";
import { ENGINE_NOTES } from "../lib/engineSignals";
import { projects } from "../data/projects";
import { services } from "../data/services";
import type { Service } from "../data/services";
import { Link } from "../lib/router";

/* One pipeline for every engagement; the deliverable is what each gate leaves behind. */
const STAGES = [
  { name: "Frame", phase: "Discovery", text: "Boundaries, users, and constraints go on paper first, so the build starts with decisions instead of assumptions.", out: "Discovery brief" },
  { name: "Model", phase: "Architecture", text: "Data shapes, service boundaries, and failure paths are drawn before interfaces, so the structure can carry the product.", out: "Architecture map" },
  { name: "Prototype", phase: "Prototyping", text: "The riskiest workflow is made real early — clickable, testable, and honest about what the system cannot do yet.", out: "Working slice" },
  { name: "Engineer", phase: "Engineering", text: "Production build moves in weekly increments, each one demoed, reviewed, and merged against the architecture map.", out: "Weekly demo" },
  { name: "Validate", phase: "Verification", text: "Evals, load, edge cases, and device realities are exercised before launch, so users never run the first experiment.", out: "Release checklist" },
  { name: "Evolve", phase: "Operation", text: "Observability, handover docs, and operational support keep the system improvable long after the first release.", out: "Operational support" },
];

/** Scroll-driven pipeline: the rail fills as the section passes through the viewport
    and each gate lights up once the fill passes its node. */
function usePipelineProgress(reduced: boolean) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const fill = fillRef.current;
    const stages = Array.from(root.querySelectorAll<HTMLElement>(".pipeline__stage"));
    if (reduced || !fill) {
      fill?.style.setProperty("transform", "scaleY(1)");
      stages.forEach((stage) => stage.classList.add("is-passed"));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.72 - rect.top) / rect.height));
      fill.style.setProperty("transform", `scaleY(${progress.toFixed(4)})`);
      const fillY = rect.top + rect.height * progress;
      stages.forEach((stage) => {
        const node = stage.querySelector<HTMLElement>(".pipeline__node");
        if (!node) return;
        const box = node.getBoundingClientRect();
        stage.classList.toggle("is-passed", box.top + box.height / 2 <= fillY + 1);
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return { rootRef, fillRef };
}

export function ServiceDetail({ service }: { service: Service }) {
  const related = projects.filter((p) => p.services.some((s) => s.toLowerCase().includes(service.shortTitle.toLowerCase()) || service.id === "product")).slice(0, 2);
  const engineIndex = Math.max(0, services.findIndex((s) => s.id === service.id));
  const meta = ENGINE_NOTES[service.id] ?? ENGINE_NOTES.product;

  const reducedQuery = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
  const { rootRef: pipelineRef, fillRef } = usePipelineProgress(reducedQuery);

  return (
    <>
      <SEO title={service.title} description={service.overview} />
      <header className="service-hero" style={{ "--service-accent": service.accent } as React.CSSProperties}>
        <div className="container service-hero__inner">
          <div>
            <p className="meta">ENGINE / {service.id.toUpperCase()}</p>
            <h1>{service.title}</h1>
            <p>{service.thesis}</p>
            <Button href="/start-project">Start a Project</Button>
          </div>
          <EngineScene service={service} index={engineIndex} />
        </div>
        <div className="container">
          <dl className="service-hero__spec">
            <div><dt>Channel</dt><dd>0{engineIndex + 1} / 0{services.length}</dd></div>
            <div><dt>Signal</dt><dd>{meta.note}</dd></div>
            <div><dt>Carrier</dt><dd>{meta.freq}</dd></div>
            <div><dt>Stack</dt><dd>0{service.technologies.length} modules</dd></div>
            <div><dt>Status</dt><dd className="is-ok"><i aria-hidden="true" />Operational</dd></div>
          </dl>
        </div>
      </header>

      <section className="service-overview container section-space"><SectionLabel>Service overview</SectionLabel><div><h2>Built around the decisions that compound.</h2><p>{service.overview}</p></div></section>

      <section className="service-problems section-space"><div className="container"><SectionLabel>Problems solved</SectionLabel><div className="problem-grid">{service.problems.map((problem, index) => <article key={problem}><span>0{index + 1}</span><h3>{problem}</h3><p>{service.problemNotes[index]}</p></article>)}</div></div></section>

      <section className="service-capabilities container section-space"><SectionLabel>Engineering capability</SectionLabel><div className="service-capabilities__grid"><h2>What enters the build.</h2><div>{service.capabilities.map((item) => <div key={item}><span>NODE</span><h3>{item}</h3><i /></div>)}</div></div><div className="tech-rail">{service.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div></section>

      <section className="workflow section-space">
        <div className="container">
          <SectionLabel>Workflow</SectionLabel>
          <div className="workflow__head" data-reveal>
            <h2>One pipeline.<br />Six gates.</h2>
            <p>Every engagement runs the same operating envelope. The depth changes with the problem — the discipline doesn’t. Each gate closes with an artifact you keep.</p>
          </div>
          <div className="pipeline" ref={pipelineRef}>
            <i className="pipeline__rail" aria-hidden="true" />
            <span className="pipeline__fill" ref={fillRef} aria-hidden="true" />
            {STAGES.map((stage, index) => (
              <article className="pipeline__stage" key={stage.name} data-reveal data-reveal-delay={index * 60}>
                <span className="pipeline__node" aria-hidden="true" />
                <div className="pipeline__main">
                  <p className="meta"><span>0{index + 1}</span> / {stage.phase.toUpperCase()}</p>
                  <h3>{stage.name}</h3>
                  <p>{stage.text}</p>
                </div>
                <p className="pipeline__out"><CheckCircle2 size={14} aria-hidden="true" />{stage.out}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && <section className="related-work container section-space"><SectionLabel>Related case studies</SectionLabel><div>{related.map((project) => <Link href={`/work/${project.slug}`} key={project.slug}><span>{project.category}</span><h3>{project.title}</h3><p>{project.shortDescription}</p><b>Open case →</b></Link>)}</div></section>}
      <ClosingCTA title={`Put ${service.shortTitle.toLowerCase()} into motion.`} />
    </>
  );
}
