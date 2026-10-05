import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Link, useRouter } from "../../lib/router";
import { runtimeIntro } from "./runtimeIntro.config";
import "./runtimeIntro.css";

/**
 * First-visit cinematic introduction. Shows once per browsing session on the
 * homepage only and stays on stage until the visitor dismisses it (close
 * button, Escape, backdrop click on fine pointers) — then it hands the stage
 * back to the hero while SONAR waits in the wings. Copy comes from
 * runtimeIntro.config.ts.
 */

const STORAGE_KEY = "runtime-intro-seen";

function hasSeenIntro() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false; // storage unavailable — site must keep working
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // private mode / blocked storage — the intro simply becomes per-mount
  }
}

/** `**word**` inside a headline line renders in the signal accent color. */
function renderHeadlineLine(line: string) {
  return line
    .split(/(\*\*[^*]+\*\*)/g)
    .filter((part) => part.length > 0)
    .map((part, index) =>
      part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
        <em key={index} className="runtime-intro__accent">
          {part.slice(2, -2)}
        </em>
      ) : (
        <Fragment key={index}>{part}</Fragment>
      ),
    );
}

/** Faint constellation drawn once — pure SVG, no runtime cost. */
const CONSTELLATION_NODES: Array<[number, number]> = [
  [180, 140], [420, 260], [760, 180], [1020, 320], [360, 560], [700, 660], [900, 520],
];

export function RuntimeIntro() {
  const { path } = useRouter();
  const [show, setShow] = useState(() => !hasSeenIntro());
  const [leaving, setLeaving] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const leavingRef = useRef(false);
  const finePointer = useRef(false);

  const onHome = path === "/";
  const active = show && onHome;

  const dismiss = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    markIntroSeen();
    // Release the stage immediately so the hero entrance and SONAR come back
    // while the panel is still fading out — one continuous handover.
    document.documentElement.classList.remove("runtime-intro-open");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setLeaving(true);
    window.setTimeout(() => setShow(false), reduced ? 320 : 640);
  }, []);

  useEffect(() => {
    if (!active) return;
    finePointer.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.documentElement.classList.add("runtime-intro-open");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;
      if (!(current instanceof HTMLElement) || !panel.contains(current)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    primaryRef.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active, dismiss]);

  // Hand focus back to whatever opened the intro once it is gone.
  useEffect(() => {
    if (show) return;
    const el = previousFocus.current;
    if (el && document.contains(el)) el.focus({ preventScroll: true });
    previousFocus.current = null;
  }, [show]);

  if (!active) return null;

  return (
    <div className={`runtime-intro${leaving ? " runtime-intro--leaving" : ""}`}>
      <div
        className="runtime-intro__stage"
        aria-hidden="true"
        onClick={() => {
          if (finePointer.current) dismiss();
        }}
      >
        <i className="runtime-intro__wash runtime-intro__wash--cool" />
        <i className="runtime-intro__wash runtime-intro__wash--cyan" />
        <i className="runtime-intro__wash runtime-intro__wash--warm" />
        <i className="runtime-intro__grid" />
        <svg
          className="runtime-intro__constellation"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          focusable="false"
        >
          <g fill="none" stroke="rgb(24 24 23 / 9%)" strokeWidth="1">
            <path d="M180 140 L420 260 L760 180 L1020 320" />
            <path d="M420 260 L360 560 L700 660" />
            <path d="M760 180 L900 520 L700 660" />
            <path d="M1020 320 L900 520" />
          </g>
          {CONSTELLATION_NODES.map(([x, y], index) => (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3.5"
              fill={index % 3 === 0 ? "rgb(255 75 43 / 32%)" : "rgb(24 24 23 / 20%)"}
            />
          ))}
        </svg>
        {[0, 1, 2, 3, 4, 5].map((node) => (
          <i key={node} className={`runtime-intro__node runtime-intro__node--${node}`} />
        ))}
        <i className="runtime-intro__sweep" />
        <i className="runtime-intro__vignette" />
      </div>

      <section
        ref={panelRef}
        className="runtime-intro__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Runtime Systems introduction"
      >
        <span className="runtime-intro__corners" aria-hidden="true">
          <i /><i /><i /><i />
        </span>

        <button type="button" className="runtime-intro__close" aria-label="Close introduction" onClick={dismiss}>
          <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" focusable="false">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>

        <p className="runtime-intro__brand">
          <img src="/favicon.svg" alt="" className="runtime-intro__mark" />
          <span>{runtimeIntro.eyebrow}</span>
        </p>

        {/* Lightweight CSS stand-in for the homepage Runtime Core. */}
        <span className="runtime-intro__core" aria-hidden="true">
          <i className="runtime-intro__core-glow" />
          <i className="runtime-intro__core-ticks" />
          <i className="runtime-intro__core-disc" />
          <i className="runtime-intro__core-geodesic" />
          <i className="runtime-intro__core-orbit" />
          <i className="runtime-intro__core-tilt" />
          <i className="runtime-intro__core-nucleus" />
        </span>

        <h2 className="runtime-intro__headline">
          {runtimeIntro.headline.map((line, index) => (
            <span className="runtime-intro__mask" key={line}>
              <span className="runtime-intro__line" style={{ animationDelay: `${0.5 + index * 0.16}s` }}>
                {renderHeadlineLine(line)}
              </span>
            </span>
          ))}
        </h2>

        <p className="runtime-intro__description">{runtimeIntro.description}</p>

        <div className="runtime-intro__actions">
          <button ref={primaryRef} type="button" className="runtime-intro__enter" onClick={dismiss}>
            {runtimeIntro.primaryCta}
          </button>
          <Link className="runtime-intro__explore" href={runtimeIntro.secondaryCta.href} onClick={dismiss}>
            {runtimeIntro.secondaryCta.label}
          </Link>
        </div>

        <footer className="runtime-intro__meta">
          {runtimeIntro.meta.map((item) => (
            <span key={item.label}>
              <b>{item.label}</b>
              <span>
                {item.dot ? <i className="runtime-intro__live-dot" aria-hidden="true" /> : null}
                {item.value}
              </span>
            </span>
          ))}
        </footer>
      </section>
    </div>
  );
}
