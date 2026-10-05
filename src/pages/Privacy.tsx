import { CheckCircle2 } from "lucide-react";
import { ClosingCTA } from "../components/ClosingCTA";
import { PageHeader, SectionLabel, TextLink } from "../components/Primitives";
import { SEO } from "../components/SEO";
import { site } from "../data/site";

const sections = [
  {
    title: "What this site collects",
    body: [
      "This is a static marketing site. It runs no accounts, no analytics trackers, and no advertising cookies. The only personal data that reaches Runtime Systems is what you choose to send us.",
      "The Start a Project brief collects your name, work email, company, an optional phone number, and the project details you type. Submitting the form delivers that brief to the Runtime Systems inbox through Formspree, a form-delivery service.",
    ],
  },
  {
    title: "How your details are used",
    body: [
      "Brief details are used for one purpose: understanding your project so we can respond with a relevant reply — usually a call invitation, a short proposal, or follow-up questions.",
      "We do not sell, rent, or share your details with anyone, and we do not add them to marketing lists or newsletters.",
    ],
  },
  {
    title: "Third-party services",
    body: [
      "Formspree processes the project-brief form and forwards it to our inbox. Cal.com hosts the booking page if you schedule an intro call. Email and WhatsApp conversations happen on those platforms under their own privacy terms.",
      "These services receive only the information you provide when you use them. The site itself loads all fonts and assets from its own hosting — no cross-site tracking scripts are included.",
    ],
  },
  {
    title: "Storage and retention",
    body: [
      "Submitted briefs live in the Runtime Systems email inbox and are kept only as long as needed to handle the conversation. Ask us to delete a brief and it is gone.",
      "Your browser may keep the site's theme and a session marker for the assistant experience on your own device. Nothing about you is stored on our servers by browsing the site.",
    ],
  },
  {
    title: "Your controls",
    body: [
      "You can ask what we hold about you, ask for corrections, or ask for deletion at any time — one email is enough and we act on it promptly.",
      "Booking an intro call happens on Cal.com's own interface, where their privacy policy applies to the details you enter there.",
    ],
  },
];

export function Privacy() {
  return <>
    <SEO title="Privacy Policy" description="How Runtime Systems handles the personal details you share through the project brief, booking, and contact channels." />
    <PageHeader eyebrow="Legal / Privacy" title="Your details stay yours." description="This site collects the minimum needed to answer you, shares it with no one, and deletes it on request. Here is exactly how that works." />

    <section className="privacy-page container">
      <div className="privacy-page__grid">
        {sections.map((section, index) => (
          <article key={section.title} data-reveal data-reveal-delay={index * 80}>
            <span className="meta">0{index + 1}</span>
            <h2>{section.title}</h2>
            {section.body.map((paragraph) => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)}
          </article>
        ))}
        <article data-reveal data-reveal-delay={sections.length * 80}>
          <span className="meta">0{sections.length + 1}</span>
          <h2>Questions or requests</h2>
          <p>Privacy questions, data requests, or corrections — send one email and we handle the rest.</p>
          <ul className="privacy-page__list">
            <li><CheckCircle2 size={15} /><TextLink href={`mailto:${site.email}`}>{site.email}</TextLink></li>
            <li><CheckCircle2 size={15} /><span>WhatsApp {site.phone}</span></li>
          </ul>
          <p className="meta">Effective October 2026 · may be updated as the site evolves</p>
        </article>
      </div>
    </section>
    <ClosingCTA title="Have a project in mind?" />
  </>;
}
