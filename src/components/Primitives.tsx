import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import { Link } from "../lib/router";

export function SectionLabel({ index, children }: { index?: string; children: ReactNode }) {
  return <div className="section-label"><span>{index || "SYS"}</span><span>{children}</span></div>;
}

export function Button({ href, children, secondary = false, className = "" }: { href: string; children: ReactNode; secondary?: boolean; className?: string }) {
  return <Link href={href} className={`button ${secondary ? "button--secondary" : ""} ${className}`}><span>{children}</span><ArrowDownRight size={17} /></Link>;
}

export function TextLink({ href, children, onClick }: { href: string; children: ReactNode; onClick?: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  return <Link href={href} className="text-link" onClick={onClick}><span>{children}</span><ArrowRight size={15} /></Link>;
}

export function DemoFlag() {
  return <span className="demo-flag">Demo content</span>;
}

/** External destination with a live indicator and a signal-red wipe on hover. */
export function PortfolioButton({ href, children, meta }: { href: string; children: ReactNode; meta?: string }) {
  return (
    <a className="portfolio-button" href={href} target="_blank" rel="noreferrer">
      <i className="portfolio-button__dot" />
      <span>{children}</span>
      {meta && <em>{meta}</em>}
      <ArrowUpRight size={16} />
    </a>
  );
}

export function PageHeader({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return (
    <header className="page-header container">
      <SectionLabel>{eyebrow}</SectionLabel>
      <div className="page-header__grid">
        <h1>{title}</h1>
        <div className="page-header__aside"><p>{description}</p>{children}</div>
      </div>
    </header>
  );
}

export function SystemWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`wordmark ${compact ? "wordmark--compact" : ""}`}>
      <span className="wordmark__glyph"><i /><i /><i /><i /></span>
      <span>Runtime<span className="wordmark__systems"> Systems</span></span>
    </span>
  );
}

