import { Suspense, lazy, useEffect, useState } from "react";

// Lazy-loaded so the widget never slows the initial page load, delays the
// hero, or competes with the 3D Runtime Core for the first paint.
const SonarWidget = lazy(() => import("./sonar/SonarWidget"));

function loadAfterPaint(): boolean {
  if (typeof window === "undefined") return false;
  const ric = (window as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number })
    .requestIdleCallback;
  return typeof ric === "function";
}

export function SonarMount() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loadAfterPaint()) {
      const ric = (window as unknown as {
        requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
      }).requestIdleCallback;
      const handle = ric(() => setReady(true), { timeout: 2000 });
      return () => {
        if ("cancelIdleCallback" in window) window.cancelIdleCallback(handle);
      };
    }
    const timer = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <SonarWidget />
    </Suspense>
  );
}
