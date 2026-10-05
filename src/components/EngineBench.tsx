import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { services } from "../data/services";
import { ENGINE_NOTES, easeInOut, signalFor, tracePath } from "../lib/engineSignals";
import type { Signal } from "../lib/engineSignals";
import { TextLink } from "./Primitives";

/*
  EngineBench — the capabilities section as a bench instrument.
  Five engine channels feed one signal scope; tuning a channel retunes the trace
  by morphing between the outgoing and incoming engine's signature waveform.
  The bench self-scans in AUTO mode until a visitor takes control (LIVE).
*/

const PACKET_OFFSETS = [0, 0.26, 0.55, 0.78];
const VIEW_W = 1000;
const VIEW_H = 300;
const CY = VIEW_H / 2;
const AMP = 100;
const SAMPLES = 170;
const GEOM = { samples: SAMPLES, w: VIEW_W, h: VIEW_H, amp: AMP };
const MORPH_SECONDS = 0.7;
const SCAN_MS = 7000;

export function EngineBench() {
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<"auto" | "live">("auto");
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const packetRefs = useRef<(SVGCircleElement | null)[]>([]);
  const probeRef = useRef<HTMLDivElement>(null);
  const probeTextRef = useRef<HTMLSpanElement>(null);
  const packetsRef = useRef<HTMLSpanElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const probeXRef = useRef<number | null>(null);
  const telemetryAtRef = useRef(0);

  const fromRef = useRef<Signal>(signalFor(services[0].id));
  const toRef = useRef<Signal>(fromRef.current);
  const blendRef = useRef(1);
  const activeRef = useRef(0);
  const lastFrameRef = useRef(0);

  const service = services[active];
  const meta = ENGINE_NOTES[service.id] ?? ENGINE_NOTES.product;

  const draw = useCallback((t: number) => {
    const d = tracePath(fromRef.current, toRef.current, blendRef.current, t, GEOM);
    const [main, echoA, echoB] = pathRefs.current;
    main?.setAttribute("d", d);
    echoA?.setAttribute("d", d);
    echoB?.setAttribute("d", d);

    const e = easeInOut(blendRef.current);
    const yAt = (x: number) => fromRef.current(x, t) * (1 - e) + toRef.current(x, t) * e;

    PACKET_OFFSETS.forEach((offset, i) => {
      const node = packetRefs.current[i];
      if (!node) return;
      const x = (offset + t * 0.075) % 1;
      node.setAttribute("cx", (x * VIEW_W).toFixed(1));
      node.setAttribute("cy", (CY - yAt(x) * AMP).toFixed(1));
    });

    const probe = probeRef.current;
    if (probe && probeXRef.current !== null) {
      const scope = scopeRef.current;
      if (scope) {
        const px = probeXRef.current * scope.clientWidth;
        probe.style.transform = `translateX(${px.toFixed(1)}px)`;
        probe.classList.toggle("bench-probe--flip", probeXRef.current > 0.72);
        if (probeTextRef.current) {
          probeTextRef.current.textContent = `T−${((1 - probeXRef.current) * 4).toFixed(2)}S / Δ${yAt(probeXRef.current).toFixed(2)}`;
        }
      }
    }

    const now = performance.now();
    if (now - telemetryAtRef.current > 250) {
      telemetryAtRef.current = now;
      if (packetsRef.current) packetsRef.current.textContent = String(1024 + Math.floor(t * 7.3)).padStart(6, "0");
      if (clockRef.current) {
        const elapsed = Math.floor(t);
        clockRef.current.textContent = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
      }
    }
  }, []);

  /* Retune: capture the signal exactly as it looks now and morph from there. */
  const tune = useCallback((index: number, byUser: boolean) => {
    if (byUser) setMode("live");
    if (index === activeRef.current) return;
    const e = easeInOut(blendRef.current);
    const prevFrom = fromRef.current;
    const prevTo = toRef.current;
    fromRef.current = (x, t) => prevFrom(x, t) * (1 - e) + prevTo(x, t) * e;
    toRef.current = signalFor(services[index].id);
    blendRef.current = 0;
    activeRef.current = index;
    setActive(index);
  }, []);

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
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /* Paint a static frame before the bench scrolls into view. */
  useEffect(() => {
    draw(0);
  }, [draw]);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      draw(0);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      const dt = Math.min(0.05, (now - lastFrameRef.current) / 1000);
      lastFrameRef.current = now;
      if (blendRef.current < 1) blendRef.current = Math.min(1, blendRef.current + dt / MORPH_SECONDS);
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    lastFrameRef.current = performance.now();
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, draw]);

  /* AUTO mode: the bench scans itself until a visitor takes control. */
  useEffect(() => {
    if (mode !== "auto" || !inView || reduced) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      tune((activeRef.current + 1) % services.length, false);
    }, SCAN_MS);
    return () => window.clearInterval(id);
  }, [mode, inView, reduced, tune]);

  const sparklines = useMemo(
    () =>
      services.map((item) => {
        const gen = signalFor(item.id);
        const points: string[] = [];
        for (let i = 0; i <= 44; i++) {
          const x = i / 44;
          points.push(`${(x * 96).toFixed(1)},${(11 - gen(x, 1.7) * 8).toFixed(1)}`);
        }
        return points.join(" ");
      }),
    []
  );

  const onKey = (event: React.KeyboardEvent) => {
    let next = -1;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (active + 1) % services.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (active - 1 + services.length) % services.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = services.length - 1;
    if (next < 0) return;
    event.preventDefault();
    tune(next, true);
    rootRef.current?.querySelector<HTMLButtonElement>(`#engine-tab-${services[next].id}`)?.focus();
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const scope = scopeRef.current;
    if (!scope) return;
    const rect = scope.getBoundingClientRect();
    probeXRef.current = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    probeRef.current?.classList.add("is-on");
  };

  const onPointerLeave = () => {
    probeXRef.current = null;
    probeRef.current?.classList.remove("is-on");
  };

  return (
    <div
      ref={rootRef}
      className={`engine-bench${reduced ? " is-static" : ""}`}
      style={{ "--bench-accent": service.accent } as React.CSSProperties}
      data-reveal
    >
      <div className="bench-head">
        <span>RUNTIME BUS / RB-05 / 5 CH</span>
        <span className="bench-head__status">
          <i className="bench-rec" aria-hidden="true" />
          REC
          <span className="bench-head__sig">SIG / {service.shortTitle.toUpperCase()} / {meta.freq}</span>
        </span>
      </div>

      <div className="bench-body">
        <div className="bench-rail" role="tablist" aria-label="Engineering engines" onKeyDown={onKey}>
          {services.map((item, index) => {
            const isActive = index === active;
            return (
              <button
                key={item.id}
                id={`engine-tab-${item.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls="engine-bench-panel"
                tabIndex={isActive ? 0 : -1}
                className={`bench-channel${isActive ? " is-active" : ""}`}
                onClick={() => tune(index, true)}
              >
                <span className="bench-channel__num">0{index + 1}</span>
                <span className="bench-channel__body">
                  <span className="bench-channel__name">{item.title}</span>
                  <svg className="bench-channel__sig" viewBox="0 0 96 22" aria-hidden="true">
                    <polyline points={sparklines[index]} />
                  </svg>
                </span>
                <i className="bench-channel__live" aria-hidden="true" />
                {isActive && mode === "auto" && !reduced && inView && <i className="bench-cycle" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        <div className="bench-main" role="tabpanel" id="engine-bench-panel" aria-labelledby={`engine-tab-${service.id}`}>
          <div className="bench-scope" ref={scopeRef} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
            <svg className="bench-scope__svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none" aria-hidden="true">
              <path className="bench-trace bench-trace--echo-b" ref={(el) => { pathRefs.current[2] = el; }} />
              <path className="bench-trace bench-trace--echo-a" ref={(el) => { pathRefs.current[1] = el; }} />
              <path className="bench-trace bench-trace--main" ref={(el) => { pathRefs.current[0] = el; }} />
              <g className="bench-packets">
                {PACKET_OFFSETS.map((offset, i) => (
                  <circle
                    key={offset}
                    className={i === 0 ? "bench-packet bench-packet--lead" : "bench-packet"}
                    r={i === 0 ? 4 : 2.4}
                    ref={(el) => { packetRefs.current[i] = el; }}
                  />
                ))}
              </g>
            </svg>
            <span className="bench-axis bench-axis--pos" aria-hidden="true">+1</span>
            <span className="bench-axis bench-axis--mid" aria-hidden="true">0</span>
            <span className="bench-axis bench-axis--neg" aria-hidden="true">−1</span>
            <span className="bench-tlabel bench-tlabel--a" aria-hidden="true">T−4S</span>
            <span className="bench-tlabel bench-tlabel--b" aria-hidden="true">T−2S</span>
            <span className="bench-tlabel bench-tlabel--c" aria-hidden="true">NOW</span>
            <span className="bench-sig-tag" aria-hidden="true">{meta.note}</span>
            <div className="bench-probe" ref={probeRef} aria-hidden="true"><span ref={probeTextRef} /></div>
          </div>

          <div className="bench-copy" key={service.id}>
            <div>
              <p className="meta">ENGINE / 0{active + 1} / {service.shortTitle.toUpperCase()}</p>
              <h3>{service.thesis}</h3>
            </div>
            <div>
              <p className="bench-copy__overview">{service.overview}</p>
              <div className="token-list">{service.capabilities.map((item) => <span key={item}>{item}</span>)}</div>
              <TextLink href={service.href}>Explore capability</TextLink>
            </div>
          </div>
        </div>
      </div>

      <div className="bench-foot">
        <span>PKTS <b ref={packetsRef}>001024</b></span>
        <span>T+ <b ref={clockRef}>00:00</b></span>
        <span>MODE <b className={mode === "live" ? "is-live" : ""}>{reduced ? "LIVE" : mode.toUpperCase()}</b></span>
        <span className="bench-foot__ok">BUS 5V / OK</span>
      </div>
    </div>
  );
}
