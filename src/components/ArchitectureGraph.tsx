import { useState } from "react";

const layers = [
  { name: "Client", code: "L0", tech: ["Web", "iOS", "Android"], detail: "The touchpoints where people enter the system." },
  { name: "Application", code: "L1", tech: ["React", "Next.js", "React Native"], detail: "Product logic and interfaces shaped around real workflows." },
  { name: "API", code: "L2", tech: ["Node.js", "Spring Boot", "REST", "GraphQL"], detail: "Clear contracts connecting products to domain capability." },
  { name: "Services", code: "L3", tech: ["Domains", "Workers", "Real-time"], detail: "Independent system responsibilities with deliberate boundaries." },
  { name: "Events", code: "L4", tech: ["Kafka", "Queues", "Webhooks"], detail: "Asynchronous movement that keeps work resilient and observable." },
  { name: "Data", code: "L5", tech: ["PostgreSQL", "MongoDB", "Redis"], detail: "Models designed around integrity, access, and change." },
  { name: "Infrastructure", code: "L6", tech: ["Docker", "Cloud", "CI/CD"], detail: "The runtime conditions that make delivery repeatable." },
];

export function ArchitectureGraph({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(2);
  return (
    <div className={`architecture ${compact ? "architecture--compact" : ""}`}>
      <div className="architecture__rail" role="tablist" aria-label="System architecture layers">
        {layers.map((layer, index) => (
          <button key={layer.name} role="tab" aria-selected={active === index} onClick={() => setActive(index)} className={active === index ? "is-active" : ""}>
            <span>{layer.code}</span><b>{layer.name}</b><i />
          </button>
        ))}
      </div>
      <div className="architecture__detail" aria-live="polite">
        <div><span>ACTIVE LAYER / {layers[active].code}</span><i /></div>
        <h3>{layers[active].name}</h3>
        <p>{layers[active].detail}</p>
        <ul>{layers[active].tech.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    </div>
  );
}

