import { ClosingCTA } from "../components/ClosingCTA";
import { PageHeader, TextLink } from "../components/Primitives";
import { SEO } from "../components/SEO";
import { services } from "../data/services";

export function Services() {
  return <><SEO title="Services" description="Product, AI, mobile, backend, and cloud engineering from Runtime Systems." /><PageHeader eyebrow="Capabilities / 05 engines" title="Engineering, end to end." description="Not a menu of disconnected deliverables. A connected set of engineering capabilities built to move a product from uncertainty into reliable operation." />
    <section className="services-page container">
      {services.map((service, index) => <article key={service.id} className="service-band" style={{ "--service-accent": service.accent } as React.CSSProperties} data-reveal><div className="service-band__index">0{index + 1}<span /></div><div className="service-band__title"><p className="meta">ENGINE / {service.id.toUpperCase()}</p><h2>{service.title}</h2><p>{service.thesis}</p></div><div><p>{service.overview}</p><ul>{service.capabilities.map((item) => <li key={item}>{item}</li>)}</ul><TextLink href={service.href}>Explore service</TextLink></div></article>)}
    </section><ClosingCTA title="Choose the problem. We’ll assemble the system." /></>;
}

