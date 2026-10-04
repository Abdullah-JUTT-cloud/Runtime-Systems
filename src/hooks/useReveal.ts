import { useEffect } from "react";

/**
 * Reveals every `[data-reveal]` element as it enters the viewport.
 * Optional per-element stagger: `data-reveal-delay={delayInMs}`.
 * `key` should change when the route changes so newly mounted sections
 * are observed as well.
 */
export function useReveal(key?: string) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!nodes.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
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

    nodes.forEach((node) => {
      node.classList.remove("is-visible");
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, [key]);
}
