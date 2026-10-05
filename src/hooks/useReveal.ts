import { useEffect } from "react";

/**
 * Reveals every `[data-reveal]` element as it enters the viewport.
 * Optional per-element stagger: `data-reveal-delay={delayInMs}`.
 * `key` should change when the route changes so newly mounted sections
 * are observed as well. A debounced MutationObserver also picks up nodes
 * that mount later — filter/tab switches, lazy lists — which the initial
 * scan alone would miss, leaving them stuck at opacity 0.
 */
export function useReveal(key?: string) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const node = entry.target as HTMLElement;
          const delay = Number(node.dataset.revealDelay ?? 0);
          node.style.transitionDelay = delay ? `${delay}ms` : "";
          node.classList.add("is-visible");
          observer.unobserve(node);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );

    const observeAll = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)").forEach((node) => {
        observer.observe(node);
      });
    };
    observeAll();

    let raf = 0;
    const mutation = new MutationObserver(() => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        observeAll();
      });
    });
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [key]);
}
