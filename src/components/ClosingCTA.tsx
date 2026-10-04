import { Button, SectionLabel } from "./Primitives";
import { site } from "../data/site";

export function ClosingCTA({ title = "Have a system in mind?", label = "PROJECT.INIT" }: { title?: string; label?: string }) {
  return <section className="closing-cta"><div className="container"><SectionLabel>{label}</SectionLabel><div className="closing-cta__grid"><h2>{title}</h2><div><p>Bring us the hard part. We’ll help define the architecture, product, and path to runtime.</p><div className="button-row"><Button href="/start-project">Start a Project</Button><a className="booking-link" href={site.booking.href} target="_blank" rel="noreferrer"><span>{site.booking.label}</span><small>{site.booking.note} ↗</small></a></div></div></div></div></section>;
}
