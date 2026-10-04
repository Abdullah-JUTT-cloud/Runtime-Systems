import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, RotateCcw, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "../../lib/router";
import { BriefCard } from "./BriefCard";
import { Composer } from "./Composer";
import { MessageList } from "./MessageList";
import { SonarOrb } from "./SonarOrb";
import { useSonar } from "./useSonar";
import { useIsMobile } from "./useMobile";

const PANEL_ID = "sonar-panel";
const SIZE_STORAGE_KEY = "sonar.size.v1";
/** Pull-down distance (px, after resistance) that closes the mobile sheet. */
const SWIPE_CLOSE_THRESHOLD = 72;

type PanelSizeKey = "compact" | "medium" | "large";

const PANEL_SIZES: Record<PanelSizeKey, { w: number; h: number; label: string; next: PanelSizeKey }> = {
  compact: { w: 380, h: 560, label: "compact", next: "medium" },
  medium: { w: 420, h: 650, label: "medium", next: "large" },
  large: { w: 520, h: 780, label: "large", next: "compact" },
};

function loadSizeKey(): PanelSizeKey {
  try {
    const raw = localStorage.getItem(SIZE_STORAGE_KEY);
    if (raw === "compact" || raw === "medium" || raw === "large") return raw;
  } catch {
    // Storage unavailable; the default is fine.
  }
  return "medium";
}

const MORPH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function SonarPanel({
  onClose,
  launcherRef,
}: {
  onClose: () => void;
  launcherRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const { messages, status, quickReplies, brief, send, retry, reset } = useSonar();
  const panelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const [sizeKey, setSizeKey] = useState<PanelSizeKey>(loadSizeKey);
  const size = PANEL_SIZES[sizeKey];

  const cycleSize = useCallback(() => {
    setSizeKey((current) => {
      const next = PANEL_SIZES[current].next;
      try {
        localStorage.setItem(SIZE_STORAGE_KEY, next);
      } catch {
        // Preference just won't persist; the live size still changes.
      }
      return next;
    });
  }, []);

  // Move focus into the panel on open; return it to the launcher on close.
  useEffect(() => {
    const previousActive = document.activeElement as HTMLElement | null;
    const target = panelRef.current?.querySelector<HTMLElement>(".sonar-composer__textarea") ?? panelRef.current;
    target?.focus();
    return () => {
      if (document.body.contains(previousActive) && previousActive?.hasAttribute("data-sonar-launcher")) {
        previousActive.focus();
      } else {
        launcherRef.current?.focus();
      }
    };
  }, [launcherRef]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      // Basic focus trap while open.
      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Swipe-down-to-close on mobile: the header is the grab handle. The drag
  // offset is applied with resistance and springs back unless it passes the
  // close threshold.
  const touchStartY = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);

  const onHeaderTouchStart = (event: React.TouchEvent) => {
    if (event.touches.length !== 1) return;
    touchStartY.current = event.touches[0].clientY;
    setDragging(true);
  };
  const onHeaderTouchMove = (event: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const dy = event.touches[0].clientY - touchStartY.current;
    setDragY(dy > 0 ? Math.min(dy * 0.55, 140) : 0);
  };
  const onHeaderTouchEnd = () => {
    const shouldClose = dragY > SWIPE_CLOSE_THRESHOLD;
    touchStartY.current = null;
    setDragging(false);
    setDragY(0);
    if (shouldClose) onClose();
  };

  const lastUserText = [...messages].reverse().find((message) => message.role === "user")?.content ?? "";
  const loading = status === "loading";

  // Desktop: the panel grows out of the orb (small circle, bottom-right
  // origin). Mobile: full-height sheet sliding up.
  const desktopInitial = prefersReducedMotion
    ? false
    : { opacity: 0, scale: 0.16, width: size.w, height: size.h, borderRadius: 999 };
  const desktopAnimate = { opacity: 1, scale: 1, width: size.w, height: size.h, borderRadius: 16 };
  const desktopExit = prefersReducedMotion ? undefined : { opacity: 0, scale: 0.16, borderRadius: 999 };

  return (
    <motion.div
      className={`sonar-panel${isMobile ? " sonar-panel--mobile" : ""}`}
      id={PANEL_ID}
      role="dialog"
      aria-modal="false"
      aria-label="SONAR project advisor"
      ref={panelRef}
      tabIndex={-1}
      initial={isMobile ? (prefersReducedMotion ? false : { y: "100%" }) : desktopInitial}
      animate={isMobile ? { y: 0 } : desktopAnimate}
      exit={isMobile ? (prefersReducedMotion ? undefined : { y: "100%" }) : desktopExit}
      transition={
        isMobile
          ? { duration: 0.38, ease: MORPH_EASE }
          : {
              default: { duration: 0.42, ease: MORPH_EASE },
              width: { duration: 0.35, ease: MORPH_EASE },
              height: { duration: 0.35, ease: MORPH_EASE },
            }
      }
      style={isMobile ? undefined : { width: size.w, height: size.h }}
    >
      <motion.div
        className="sonar-panel__sheet"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12, duration: 0.28 }}
        style={
          isMobile && dragY > 0
            ? { transform: `translateY(${dragY}px)`, transition: dragging ? "none" : "transform .32s cubic-bezier(.22,1,.36,1)" }
            : undefined
        }
      >
        <header
          className="sonar-panel__header"
          onTouchStart={onHeaderTouchStart}
          onTouchMove={onHeaderTouchMove}
          onTouchEnd={onHeaderTouchEnd}
          onTouchCancel={onHeaderTouchEnd}
        >
          <span className="sonar-panel__orb">
            <SonarOrb variant="sm" thinking={loading} />
          </span>
          <div className="sonar-panel__heading">
            <div className="sonar-panel__title-row">
              <h2>SONAR</h2>
              <span className="sonar-panel__status" title="SONAR is online">
                <i aria-hidden="true" />
                Online
              </span>
            </div>
            <p className="meta">Runtime Systems project advisor</p>
          </div>
          <div className="sonar-panel__actions">
            <button
              type="button"
              className="sonar-icon-btn sonar-panel__resize"
              onClick={cycleSize}
              aria-label={`Resize chat panel. Current size: ${size.label}.`}
              title={`Panel size: ${size.label} (click to change)`}
            >
              <Maximize2 size={15} />
            </button>
            <button type="button" className="sonar-icon-btn" onClick={reset} aria-label="Start a new chat" title="New chat">
              <RotateCcw size={15} />
            </button>
            <button type="button" className="sonar-icon-btn" onClick={onClose} aria-label="Close SONAR" title="Close">
              <X size={17} />
            </button>
          </div>
        </header>

        <MessageList
          messages={messages}
          quickReplies={quickReplies}
          loading={loading}
          brief={brief}
          onQuickReply={send}
        />

        {status === "error" ? (
          <div className="sonar-error" role="alert">
            <p>SONAR couldn't reach the team's advisor service just now.</p>
            <div className="sonar-error__actions">
              <button type="button" className="sonar-brief__button" onClick={retry}>Try again</button>
              <Link href="/contact" className="sonar-error__link" onClick={onClose}>Contact us instead</Link>
            </div>
          </div>
        ) : null}

        <Composer loading={loading} onSend={send} />
        <p className="sonar-panel__sr-hint visually-hidden">
          {lastUserText ? "Your last message was sent." : "Press Escape to close."}
        </p>
      </motion.div>
    </motion.div>
  );
}
