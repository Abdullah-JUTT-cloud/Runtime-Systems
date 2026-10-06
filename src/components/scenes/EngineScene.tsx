import { useEffect, useState } from "react";
import type { Service } from "../../data/services";
import { Sheet } from "./Sheet";
import { ProductScene } from "./ProductScene";
import { AiScene } from "./AiScene";
import { MobileScene } from "./MobileScene";
import { BackendScene } from "./BackendScene";
import { CloudScene } from "./CloudScene";

const SCENES: Record<string, (props: { compact: boolean }) => JSX.Element> = {
  product: ProductScene,
  ai: AiScene,
  mobile: MobileScene,
  backend: BackendScene,
  "cloud-devops": CloudScene,
};

/** Compact sheets use a portrait viewBox with redesigned, larger-type layouts. */
export function useCompactSheet() {
  const [compact, setCompact] = useState(() => (typeof window !== "undefined" ? window.matchMedia("(max-width: 720px)").matches : false));
  useEffect(() => {
    const query = window.matchMedia("(max-width: 720px)");
    const apply = () => setCompact(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return compact;
}

export function EngineScene({ service, index }: { service: Service; index: number }) {
  const compact = useCompactSheet();
  const Scene = SCENES[service.id] ?? ProductScene;
  return (
    <Sheet service={service} index={index} viewBox={compact ? "0 0 420 620" : "0 0 860 700"}>
      <Scene compact={compact} />
    </Sheet>
  );
}
