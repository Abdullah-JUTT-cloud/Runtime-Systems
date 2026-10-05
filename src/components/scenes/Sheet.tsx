import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Service } from "../../data/services";

/*
  Shared drafting-sheet frame for the five engine scenes. When the sheet enters
  the viewport, --p transitions 0→1 once (registered custom property) and every
  scene maps that single ramp through its own calc() windows, so each element
  joins the assembly on its own beat. Afterwards the scenes idle (packets,
  marching rings, pulsing dots) unless reduced motion is set.
*/

export const win = (start: number, dur: number) => `clamp(0, (var(--p) - ${start}) / ${dur}, 1)`;

export function Sheet({ service, index, children }: { service: Service; index: number; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || !("IntersectionObserver" in window)) {
      setLive(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={`engine-sheet${live ? " is-live" : ""}${reduced ? " is-static" : ""}`}
      style={{ "--sheet-accent": service.accent } as React.CSSProperties}
      aria-hidden="true"
    >
      <span className="sheet-tick sheet-tick--tl" />
      <span className="sheet-tick sheet-tick--tr" />
      <span className="sheet-tick sheet-tick--bl" />
      <span className="sheet-tick sheet-tick--br" />
      <i className="engine-sheet__progress" />
      <svg className="engine-sheet__svg" viewBox="0 0 860 700">{children}</svg>
      <div className="engine-sheet__block">
        <div><span>DWG NO</span><b>RS-0{index + 1}/{String.fromCharCode(65 + index)}</b></div>
        <div><span>ENGINE</span><b>{service.shortTitle.toUpperCase()}</b></div>
        <div><span>DRIVE</span><b>AUTO</b></div>
        <div><span>SCALE</span><b>1 : 1</b></div>
        <div><span>REV</span><b>C</b></div>
        <div><span>SHEET</span><b>1 / 1</b></div>
      </div>
    </div>
  );
}
