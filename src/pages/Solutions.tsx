import { ClosingCTA } from "../components/ClosingCTA";
import { PageHeader, SectionLabel } from "../components/Primitives";
import { SEO } from "../components/SEO";

const solutions = [
  { title: "Startups", line: "Idea → architecture → product → launch → scale", text: "Build the right foundation without pretending the first version is the final one.", outputs: ["Technical direction", "Product foundation", "Launch-ready system"] },
  { title: "Enterprise", line: "Legacy → integration → modern operation", text: "Improve critical workflows without losing the knowledge already embedded in the business.", outputs: ["System modernization", "Internal platforms", "Reliable integrations"] },
  { title: "AI Transformation", line: "Manual process → governed intelligence", text: "Find the work AI can meaningfully improve, then engineer it into the operating model.", outputs: ["Workflow analysis", "AI-assisted operations", "Human control layers"] },
  { title: "Digital Products", line: "Opportunity → product → durable platform", text: "Turn a customer or operational need into a product that can keep changing after release.", outputs: ["SaaS", "Platforms", "Marketplaces", "Mobile products"] },
];

export function Solutions() {
  return <><SEO title="Solutions" description="Business-focused software, AI, modernization, and digital product solutions." /><PageHeader eyebrow="Solutions / Business systems" title="Start with the constraint, not the stack." description="Technology matters. But the first question is what must become possible for the business, the team, or the customer." />
    <section className="solutions container">{solutions.map((solution, index) => <article key={solution.title} className="solution-row" data-reveal><span>0{index + 1}</span><div><p className="meta">{solution.line}</p><h2>{solution.title}</h2></div><div><p>{solution.text}</p><ul>{solution.outputs.map((output) => <li key={output}>{output}</li>)}</ul></div></article>)}</section>
    <section className="decision-section section-space"><div className="container"><SectionLabel>Decision path</SectionLabel><div className="decision-path"><div><span>01</span><b>What is blocked?</b></div><i /><div><span>02</span><b>What must change?</b></div><i /><div><span>03</span><b>What needs to run?</b></div></div></div></section>
    <ClosingCTA title="Bring us the business problem." /></>;
}

