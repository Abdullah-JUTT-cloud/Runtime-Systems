import type { Service } from "../../data/services";
import { Sheet } from "./Sheet";
import { ProductScene } from "./ProductScene";
import { AiScene } from "./AiScene";
import { MobileScene } from "./MobileScene";
import { BackendScene } from "./BackendScene";
import { CloudScene } from "./CloudScene";

const SCENES: Record<string, () => JSX.Element> = {
  product: ProductScene,
  ai: AiScene,
  mobile: MobileScene,
  backend: BackendScene,
  "cloud-devops": CloudScene,
};

export function EngineScene({ service, index }: { service: Service; index: number }) {
  const Scene = SCENES[service.id] ?? ProductScene;
  return <Sheet service={service} index={index}><Scene /></Sheet>;
}
