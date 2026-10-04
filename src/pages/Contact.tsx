import { CalendarDays, Mail, MapPin, MessageCircle, Phone, Radar, ShieldCheck } from "lucide-react";
import { Button, PageHeader, SectionLabel, TextLink } from "../components/Primitives";
import { SEO } from "../components/SEO";
import { site } from "../data/site";
import { openSonar } from "../components/sonar/sonarOpen";

const phoneDisplay = "+92 321 4194045";
const whatsappHref = "https://wa.me/923214194045";
const mailHref = `mailto:${site.email}`;

const contactRoutes = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: phoneDisplay,
    href: whatsappHref,
    detail: "Fastest route for project questions, availability, and quick coordination.",
  },
  {
    icon: Mail,
    label: "Email",
    value: site.email,
    href: mailHref,
    detail: "Best for briefs, documents, RFPs, architecture notes, and longer context.",
  },
  {
    icon: CalendarDays,
    label: "Intro call",
    value: site.booking.note,
    href: site.booking.href,
    detail: "Book a focused conversation when you want to walk through the work live.",
  },
];

const contactNotes = [
  "Tell us what you are building, what already exists, and where the current bottleneck is.",
  "Share links, docs, screenshots, or product notes if they help us understand the system faster.",
  "For new builds, use Start a Project when you want a structured brief instead of a direct message.",
];

export function Contact() {
  return <>
    <SEO title="Contact Us" description="Contact Runtime Systems by email, WhatsApp, or intro call." />
    <PageHeader eyebrow="Contact / Runtime Systems" title="Talk to the team building the system." description="Reach Runtime Systems directly for software engineering, AI products, mobile apps, backend systems, and cloud infrastructure work." />

    <section className="contact-page container">
      <div className="contact-console" data-reveal>
        <div className="contact-console__main">
          <SectionLabel index="01">Direct channels</SectionLabel>
          <h2>Use the line that matches your urgency.</h2>
          <p>WhatsApp is best for a quick first touch. Email is best when the project has context, attachments, or stakeholders. The project brief is still available when you want to structure the request step by step.</p>
          <div className="button-row">
            <Button href="/start-project">Start a Project</Button>
            <Button href="/process" secondary>See Our Process</Button>
          </div>
          <button type="button" className="button sonar-cta" onClick={openSonar}>
            <span>Plan your project with SONAR</span>
            <Radar size={17} />
          </button>
        </div>
        <div className="contact-console__status" aria-label="Studio status">
          <span><i /> Studio online</span>
          <b>Lahore</b>
          <em>Serving teams worldwide</em>
        </div>
      </div>

      <div className="contact-routes">
        {contactRoutes.map(({ icon: Icon, label, value, href, detail }, index) => (
          <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="contact-card" data-reveal data-reveal-delay={index * 90}>
            <span>0{index + 1}</span>
            <Icon size={28} />
            <div>
              <p className="meta">{label}</p>
              <h2>{value}</h2>
              <p>{detail}</p>
            </div>
            <b>Open</b>
          </a>
        ))}
      </div>

      <div className="contact-detail-grid">
        <article data-reveal>
          <MapPin size={22} />
          <p className="meta">Studio</p>
          <h3>{site.location}</h3>
          <p>Runtime Systems works from Lahore with remote collaboration patterns for clients across time zones.</p>
        </article>
        <article data-reveal data-reveal-delay={80}>
          <ShieldCheck size={22} />
          <p className="meta">Response</p>
          <h3>Clear next step</h3>
          <p>We reply with either a quick answer, a request for missing context, or a recommended call when the scope needs discussion.</p>
        </article>
        <article data-reveal data-reveal-delay={160}>
          <Phone size={22} />
          <p className="meta">Phone / WhatsApp</p>
          <h3>{phoneDisplay}</h3>
          <p>Clicking the WhatsApp contact card opens a chat with Runtime Systems using the same number.</p>
        </article>
      </div>

      <section className="contact-prep" data-reveal>
        <div>
          <p className="meta">Before you message</p>
          <h2>Useful context gets you a better answer.</h2>
        </div>
        <ul>
          {contactNotes.map((note, index) => <li key={note}><span>0{index + 1}</span>{note}</li>)}
        </ul>
      </section>

      <div className="contact-bottom" data-reveal>
        <TextLink href="/start-project">Open structured project brief</TextLink>
        <a href={mailHref}>{site.email}</a>
      </div>
    </section>
  </>;
}
