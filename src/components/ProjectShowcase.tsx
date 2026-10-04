import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "../data/projects";
import { DemoFlag } from "./Primitives";

export function projectAssetFor(project: typeof projects[number]) {
  const slugMap: Record<string, string> = {
    "medalerto-os": "/MedAlerto.png",
    "maaz-safder": "/MaazSafder.png",
    "watchfinder": "/Watchfinder.png",
    urvo: "/urvo.png",
    "santioni-spirits": "/SANTIONI.png",
  };

  return slugMap[project.slug] ?? "/favicon.svg";
}

export function ProjectVisual({ project, index = 0 }: { project: typeof projects[number]; index?: number }) {
  return (
    <div className={`project-visual project-visual--${project.slug} tone-${project.heroTone}`} aria-hidden="true">
      <div className="project-visual__bar" aria-hidden="true"><span /> <span /></div>
      <div className="project-visual__screen">
        <img src={projectAssetFor(project)} alt={project.title} className="project-visual__image" />
      </div>
    </div>
  );
}

export function ProjectShowcase() {
  const featured = projects.filter((project) => project.featured);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startLeft: 0 });
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [activeProject, setActiveProject] = useState<typeof projects[number] | null>(null);

  useEffect(() => {
    document.body.style.overflow = activeProject ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeProject]);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const horizontal = getComputedStyle(track).overflowX === "auto";
    setProgress(horizontal && max > 4 ? track.scrollLeft / max : 0);
    setEdges({ start: track.scrollLeft <= 4, end: !horizontal || track.scrollLeft >= max - 4 });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => sync();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const raf = requestAnimationFrame(sync);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [sync]);

  const nudge = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const panel = track.querySelector<HTMLElement>(".project-panel");
    const step = panel ? panel.offsetWidth + 32 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const target = event.target as HTMLElement | null;
    if (target && target.closest("button, a, [role='button']")) return;
    const track = trackRef.current;
    if (!track) return;
    drag.current = { active: true, moved: false, startX: event.clientX, startLeft: track.scrollLeft };
    track.classList.add("is-dragging");
    try { track.setPointerCapture(event.pointerId); } catch { /* no capture support */ }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !drag.current.active) return;
    const delta = event.clientX - drag.current.startX;
    if (Math.abs(delta) > 5) drag.current.moved = true;
    track.scrollLeft = drag.current.startLeft - delta;
  };

  const endDrag = (event?: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !drag.current.active) return;
    drag.current.active = false;
    track.classList.remove("is-dragging");
    if (event) { try { track.releasePointerCapture(event.pointerId); } catch { /* already released */ } }
  };

  const onClickCapture = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (target && target.closest("button, a, [role='button']")) return;
    if (!drag.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    drag.current.moved = false;
  };

  return (
    <div className="showcase">
      <div
        className="project-showcase"
        ref={trackRef}
        role="group"
        aria-label="Featured case studies — drag, scroll, or use the arrows to browse"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(event) => endDrag(event)}
        onClickCapture={onClickCapture}
      >
        {featured.map((project, index) => (
          <article className="project-panel" key={project.slug} data-reveal data-reveal-delay={index * 90}>
            <div className="project-panel__meta"><span>0{index + 1}</span><span>{project.category}</span><DemoFlag /></div>
            <ProjectVisual project={project} index={index} />
            <div className="project-panel__copy">
              <h3>{project.title}</h3>
              <p>{project.shortDescription}</p>
              <div className="token-list">{project.technologies.slice(0, 4).map((tech) => <span key={tech}>{tech}</span>)}</div>
              <div className="project-panel__actions">
                <button type="button" className="project-panel__cta" onClick={() => setActiveProject(project)}>View case study</button>
                {project.liveUrl ? (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="project-panel__link">Live site</a>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="container showcase-controls">
        <div className="showcase-meter" aria-hidden="true"><i style={{ transform: `scaleX(${Math.max(0.1, progress)})` }} /></div>
        <div className="showcase-hint">DRAG / SCROLL TO EXPLORE</div>
        <div className="showcase-arrows">
          <button type="button" onClick={() => nudge(-1)} disabled={edges.start} aria-label="Previous case study"><ArrowLeft size={16} /></button>
          <button type="button" onClick={() => nudge(1)} disabled={edges.end} aria-label="Next case study"><ArrowRight size={16} /></button>
        </div>
      </div>

      {activeProject && (
        <div className="case-study-modal" role="dialog" aria-modal="true" aria-labelledby="case-study-title" onClick={() => setActiveProject(null)}>
          <div className="case-study-modal__backdrop" aria-hidden="true" />
          <div className="case-study-modal__panel" onClick={(event) => event.stopPropagation()}>
            <div className="case-study-modal__toolbar">
              <button type="button" className="case-study-modal__close" aria-label="Close case study" onClick={() => setActiveProject(null)}>×</button>
            </div>
            <header className="case-study-modal__header">
              <div className="case-study-modal__meta"><span>{activeProject.category}</span><span>{activeProject.year}</span></div>
              <h2 id="case-study-title">{activeProject.title}</h2>
              <p>{activeProject.caseStudy?.overview ?? activeProject.shortDescription}</p>
              {activeProject.liveUrl ? (
                <a href={activeProject.liveUrl} target="_blank" rel="noreferrer" className="case-study-modal__link">Visit live site</a>
              ) : null}
            </header>
            <ProjectVisual project={activeProject} />
            <div className="case-study-modal__body">
              <p>{activeProject.caseStudy?.overview ?? activeProject.detailedDescription}</p>
              <dl className="case-study-modal__meta-list">
                <div><dt>Client Type</dt><dd>{activeProject.caseStudy?.clientType ?? activeProject.clientType}</dd></div>
                <div><dt>Services</dt><dd>{activeProject.caseStudy?.services ?? activeProject.services.join(" · ")}</dd></div>
                <div><dt>Technology</dt><dd>{activeProject.caseStudy?.detailedTechnology ?? activeProject.technologies.join(" · ")}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
