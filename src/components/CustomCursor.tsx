import { useEffect, useRef } from "react";

/** Custom cursor ring. Moves without React re-renders for smooth 60fps tracking. */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const node = ref.current;
    if (!node) return;

    let raf = 0;
    let x = -100;
    let y = -100;
    const render = () => {
      raf = 0;
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!raf) raf = requestAnimationFrame(render);
    };
    const over = (event: PointerEvent) => {
      node.classList.toggle("is-active", !!(event.target as Element).closest("a, button, [data-cursor]"));
    };
    const hide = () => { node.style.opacity = "0"; };
    const show = () => { node.style.opacity = "1"; };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    document.documentElement.addEventListener("pointerenter", show);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", hide);
      document.documentElement.removeEventListener("pointerenter", show);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor" aria-hidden="true"><i /></div>;
}
