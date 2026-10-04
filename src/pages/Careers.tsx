import { ClosingCTA } from "../components/ClosingCTA";
import { PageHeader, SectionLabel } from "../components/Primitives";
import { SEO } from "../components/SEO";

export function Careers() {
  return <><SEO title="Careers" description="Engineering culture and future opportunities at Runtime Systems." /><PageHeader eyebrow="Careers / Build the runtime" title="For people who care what happens after deploy." description="We value precise thinking, direct communication, technical ownership, and the patience to solve root causes." />
    <section className="culture container section-space"><SectionLabel>Engineering culture</SectionLabel><div className="culture-grid"><article><span>01</span><h2>Own the system</h2><p>Work past the ticket. Understand the user, architecture, production behavior, and why the decision matters.</p></article><article><span>02</span><h2>Make it legible</h2><p>Clear code, clear decisions, clear feedback. Complexity is real; confusion does not have to be.</p></article><article><span>03</span><h2>Keep learning</h2><p>Tools change. Fundamentals compound. We expect curiosity without chasing every wave.</p></article></div></section>
    <section className="openings section-space"><div className="container"><SectionLabel>Current openings</SectionLabel><div className="empty-state"><span>HIRING.STATUS / QUIET</span><h2>No roles are open right now.</h2><p>We do not list speculative positions as active jobs. If Runtime Systems is the kind of environment you are looking for, you can still introduce yourself.</p><a href="mailto:hello@runtimesystems.tech?subject=Speculative%20application">Send a speculative application ↗</a></div></div></section>
    <ClosingCTA title="Prefer to build as a partner?" /></>;
}

