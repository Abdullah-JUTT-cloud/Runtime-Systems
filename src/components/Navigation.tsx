import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navigation } from "../data/site";
import { Link, useRouter } from "../lib/router";

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { path } = useRouter();
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <nav className={`nav ${scrolled ? "nav--scrolled" : ""} ${open ? "nav--menu-open" : ""}`} aria-label="Primary navigation">
      <div className="nav__inner">
        <Link href="/" className="nav__brand" ariaLabel="Runtime Systems home">
          <span className="wordmark nav__brand-wordmark">
            <img src="/favicon.svg" alt="" className="wordmark__favicon" />
            <span>Runtime<span className="wordmark__systems"> Systems</span></span>
          </span>
        </Link>
        <div className="nav__links">
          {navigation.map((item) => {
            const isActive = item.href === "/" ? path === "/" : path.startsWith(item.href);
            return <Link key={item.href} href={item.href} className={isActive ? "is-active" : ""}>{item.label}</Link>;
          })}
        </div>
        <Link href="/start-project" className="nav__cta">Start a Project <span>↗</span></Link>
        <button className="nav__menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
      </div>
      <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <p className="meta">SYSTEM.NAVIGATION / {open ? "OPEN" : "CLOSED"}</p>
        {navigation.map((item, index) => <Link key={item.href} href={item.href} style={{ transitionDelay: open ? `${0.06 + index * 0.055}s` : "0s" }}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}</Link>)}
        <Link href="/start-project" className="mobile-menu__cta" style={{ transitionDelay: open ? `${0.06 + navigation.length * 0.055}s` : "0s" }}><span>{String(navigation.length + 1).padStart(2, "0")}</span>Start a Project</Link>
        <div className="mobile-menu__foot"><span>LAHORE / WORLDWIDE</span><span className="system-status"><i /> ALL SYSTEMS OPERATIONAL</span></div>
      </div>
    </nav>
  );
}
