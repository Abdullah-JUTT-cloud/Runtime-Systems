import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SonarOrb } from "./SonarOrb";
import { SonarPanel } from "./SonarPanel";
import { SONAR_OPEN_EVENT } from "./sonarOpen";
import { useIsMobile } from "./useMobile";
import "./sonar.css";

/** Fast-scroll velocity (px/ms) above which the orb's idle motion is damped. */
const CALM_SCROLL_VELOCITY = 1.1;
const CALM_LINGER_MS = 260;

export default function SonarWidget() {
  const [open, setOpen] = useState(false);
  const [calm, setCalm] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(SONAR_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(SONAR_OPEN_EVENT, onOpen);
  }, []);

  // Scroll-aware micro-behavior: while the page scrolls quickly the orb
  // goes calm (animations paused, halo dimmed); it wakes again at rest.
  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = performance.now();
    let raf = 0;
    let calmTimer = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const now = performance.now();
        const y = window.scrollY;
        const velocity = Math.abs(y - lastY) / Math.max(now - lastT, 1);
        lastY = y;
        lastT = now;
        if (velocity > CALM_SCROLL_VELOCITY) {
          setCalm(true);
          window.clearTimeout(calmTimer);
          calmTimer = window.setTimeout(() => setCalm(false), CALM_LINGER_MS);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(raf);
      window.clearTimeout(calmTimer);
    };
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    // Return focus to the launcher after the panel unmounts.
    window.setTimeout(() => launcherRef.current?.focus(), 0);
  }, []);

  return (
    <>
      {/* Mobile-only backdrop: the sheet dominates the screen, so a light
          scrim is warranted there; desktop stays fully interactive. */}
      <AnimatePresence>
        {open && isMobile ? (
          <motion.div
            key="sonar-backdrop"
            className="sonar-backdrop"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            aria-hidden="true"
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? <SonarPanel key="panel" onClose={close} launcherRef={launcherRef} /> : null}
      </AnimatePresence>

      {/* The launcher unmounts while the panel is open — the orb lives on in
          the panel header instead of floating duplicated above the chat. */}
      <AnimatePresence>
        {!open ? (
          <motion.button
            type="button"
            ref={launcherRef}
            className="sonar-launcher"
            data-sonar-launcher=""
            data-calm={calm || undefined}
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label="Ask SONAR"
            initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, scale: 0.55, transition: { duration: 0.18 } }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="sonar-launcher__label" aria-hidden="true">
              Ask SONAR
            </span>
            <SonarOrb variant="lg" />
          </motion.button>
        ) : null}
      </AnimatePresence>
    </>
  );
}
