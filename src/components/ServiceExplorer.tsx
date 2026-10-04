import { useState } from "react";
import { services } from "../data/services";
import { TextLink } from "./Primitives";
import { ServiceVisual } from "./ServiceVisual";

export function ServiceExplorer() {
  const [active, setActive] = useState(0);
  const service = services[active];
  return (
    <div className="service-explorer">
      <div className="service-explorer__list" role="tablist" aria-label="Engineering capabilities">
        {services.map((item, index) => <button key={item.id} role="tab" aria-selected={active === index} onClick={() => setActive(index)} className={active === index ? "is-active" : ""}><span>0{index + 1}</span>{item.title}</button>)}
      </div>
      <div className="service-explorer__visual" style={{ "--service-accent": service.accent } as React.CSSProperties}>
        <ServiceVisual service={service} />
        <div className="service-explorer__copy">
          <p className="meta">ENGINE / {service.id.toUpperCase()}</p>
          <h3>{service.thesis}</h3>
          <p>{service.overview}</p>
          <div className="token-list">{service.capabilities.map((item) => <span key={item}>{item}</span>)}</div>
          <TextLink href={service.href}>Explore capability</TextLink>
        </div>
      </div>
    </div>
  );
}
