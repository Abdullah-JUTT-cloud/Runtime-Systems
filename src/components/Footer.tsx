import { useEffect, useState } from "react";
import { footerLinks, site, socials } from "../data/site";
import { Link } from "../lib/router";
import { SystemWordmark } from "./Primitives";

const TICKER = ["Build what keeps running", "Systems in motion", "Available worldwide", "Engineered in Lahore"];

const formatKarachiTime = () =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    hourCycle: "h23",
    timeZone: "Asia/Karachi",
  }).format(new Date());

export function Footer() {
  const [clock, setClock] = useState(formatKarachiTime);
  useEffect(() => {
    const id = window.setInterval(() => setClock(formatKarachiTime()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const backToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="footer">
      <div className="footer__ticker" aria-hidden="true">
        <div className="footer__ticker-track">
          {[0, 1].map((half) => (
            <div className="footer__ticker-group" key={half}>
              {[...TICKER, ...TICKER].map((phrase, index) => (
                <span key={`${half}-${index}`}>{phrase}<i>◆</i></span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="container footer__top">
        <div>
          <SystemWordmark />
          <h2>Build for launch.<br /><em>Engineer for runtime.</em></h2>
        </div>
        <Link href="/start-project" className="footer__orb" ariaLabel="Start a project"><span>Start a<br />project</span><b>↗</b></Link>
      </div>
      <div className="container footer__grid">
        <div>
          <p className="meta"><b>01</b> / LOCATION</p>
          <p className="footer__clock">{clock}<span>PKT · UTC+5</span></p>
          <p>{site.location}<br />{site.reach}</p>
          <div className="footer__contact">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
          </div>
        </div>
        <div>
          <p className="meta"><b>02</b> / SYSTEM MAP</p>
          {footerLinks.map((link) => "external" in link && link.external ? <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a> : <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </div>
        <div>
          <p className="meta"><b>03</b> / SIGNALS</p>
          {socials.map((social) => social.placeholder ? <span key={social.label} className="is-muted" title="Link to be added">{social.label} / soon</span> : <a key={social.label} href={social.href} target="_blank" rel="noreferrer">{social.label} ↗</a>)}
        </div>
      </div>
      <div className="footer__mega" aria-hidden="true">Runtime Systems</div>
      <div className="container footer__bottom">
        <span>© 2026 Runtime Systems</span>
        <span className="system-status"><i /> ALL SYSTEMS OPERATIONAL</span>
        <span className="footer__end">
          ENGINEERED IN LAHORE
          <button type="button" className="footer__top-btn" onClick={backToTop}>Back to top ↑</button>
        </span>
      </div>
    </footer>
  );
}
