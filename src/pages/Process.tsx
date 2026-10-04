import { ClosingCTA } from "../components/ClosingCTA";
import { PageHeader } from "../components/Primitives";
import { SEO } from "../components/SEO";

const stages = [
  ["01", "Discover", "Find the real constraint", "We examine the business, users, workflows, risk, and technical reality before prescribing a build."],
  ["02", "Architect", "Give complexity a shape", "We define boundaries, data, states, integration points, and the decisions that are expensive to reverse."],
  ["03", "Design", "Make the system understandable", "We turn the architecture into product flows and interfaces people can operate with confidence."],
  ["04", "Engineer", "Build the working relationships", "We implement the product as connected capabilities, not a collection of isolated screens."],
  ["05", "Validate", "Pressure-test the behavior", "We test the product, system contracts, failure modes, and operational assumptions."],
  ["06", "Deploy", "Move safely into reality", "We automate delivery, instrument the system, and make production behavior visible."],
  ["07", "Evolve", "Learn from runtime", "We use real behavior to improve the product, architecture, and next sequence of decisions."],
];

export function Process() {
  return <><SEO title="Process" description="The Runtime Systems engineering pipeline, from discovery through production evolution." /><PageHeader eyebrow="Process / Engineering pipeline" title="A straight line is not how systems get built." description="Our process moves forward, loops back, and sharpens decisions as evidence appears. The objective is not a handoff. It is a runtime." />
    <section className="process-flow container"><div className="process-line" aria-hidden="true" />{stages.map(([index, title, kicker, text], i) => <article key={title} className="process-stage" data-reveal><span>{index}</span><div className="process-stage__node"><i /></div><div><p className="meta">PIPELINE / {String(i + 1).padStart(2, "0")}</p><h2>{title}</h2><h3>{kicker}</h3><p>{text}</p></div></article>)}<div className="process-runtime"><span>OUTPUT / CONTINUOUS</span><strong>RUNTIME</strong><i /></div></section>
    <ClosingCTA title="Enter the pipeline." label="PIPELINE.START" /></>;
}

