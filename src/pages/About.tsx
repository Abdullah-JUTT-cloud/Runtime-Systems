import { ClosingCTA } from "../components/ClosingCTA";
import { PageHeader, PortfolioButton, SectionLabel } from "../components/Primitives";
import { SEO } from "../components/SEO";
import { team } from "../data/team";

const standards = [
  ["Ownership", "We stay accountable for how the whole system behaves, not only the code assigned to us."],
  ["Clarity", "We make architecture, risk, and tradeoffs visible enough to support good decisions."],
  ["Durability", "We optimize for change, operability, and the team that inherits every decision."],
  ["Evidence", "We test assumptions early and distinguish a compelling demo from a dependable system."],
];

export function About() {
  return <><SEO title="About" description="Why Runtime Systems exists and how we think about software, AI, product, and quality." /><PageHeader eyebrow="About / Runtime Systems" title="Most software is built to launch. We build software to run." description="Runtime Systems exists because the most important engineering work begins where the launch story usually ends: scale, change, reliability, and real operational pressure." />
    <section className="manifesto section-space"><div className="container"><SectionLabel>Why runtime</SectionLabel><div className="manifesto__text"><p>Software is not a stack of screens.</p><p>It is a network of decisions, users, data, infrastructure, and consequences.</p><p><em>We engineer that network.</em></p></div></div></section>
    <section className="standards container section-space"><SectionLabel>Operating standards</SectionLabel><div>{standards.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="ai-position section-space"><div className="container"><SectionLabel>Our position on AI</SectionLabel><div><h2>Intelligence needs an operating model.</h2><p>We treat AI as a system capability: grounded in context, observable in behavior, constrained by policy, and designed around the people responsible for its output.</p></div></div></section>
    <section className="team container section-space"><SectionLabel>Team</SectionLabel>{team.length ? <div className="team-grid">{team.map((member) => <article key={member.name} className="team-card"><div className={`team-card__media${member.name === "Anas" ? " team-card__media--anas" : ""}`}><img src={member.photo} alt={member.name} loading="lazy" /></div><div className="team-card__body"><p className="meta">{member.label}</p><h3>{member.name}</h3><p className="team-card__role">{member.role}</p><p className="team-card__bio">{member.bio}</p><div className="token-list">{member.specialization.map((item) => <span key={item}>{item}</span>)}</div>{member.portfolio && <PortfolioButton href={member.portfolio} meta={member.portfolioLabel}>View portfolio</PortfolioButton>}</div></article>)}</div> : <div className="team-empty"><span>TEAM.DATA / PENDING</span><h2>Real people. Real profiles. No placeholders.</h2><p>This section is wired for verified names, roles, bios, specialties, photos, LinkedIn, and GitHub profiles. It will remain intentionally empty until that information is provided.</p></div>}</section>
    <ClosingCTA title="Build with engineers who think in systems." /></>;
}

