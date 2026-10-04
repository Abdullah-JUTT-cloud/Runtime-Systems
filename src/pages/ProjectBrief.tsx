import { ArrowLeft, ArrowRight, Calendar, Check, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { SEO } from "../components/SEO";
import { SystemWordmark } from "../components/Primitives";
import { site } from "../data/site";
import { Link } from "../lib/router";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xdekqqwk";

const buildTypes = ["Website", "Mobile App", "SaaS", "AI Product", "Backend System", "Automation", "Other"];
const stages = ["Idea", "Prototype", "Existing Product", "Scaling", "Legacy System"];

type Brief = { build: string; stage: string; description: string; budget: string; timeline: string; name: string; email: string; company: string; phone: string };
const initialBrief: Brief = { build: "", stage: "", description: "", budget: "", timeline: "", name: "", email: "", company: "", phone: "" };

type SendState = "idle" | "sending" | "error";

export function ProjectBrief() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initialBrief);
  const [send, setSend] = useState<SendState>("idle");
  const [done, setDone] = useState(false);
  const update = (key: keyof Brief, value: string) => setData((current) => ({ ...current, [key]: value }));
  const valid = step === 1 ? !!data.build : step === 2 ? !!data.stage : step === 3 ? !!data.description && !!data.budget && !!data.timeline : !!data.name && /^\S+@\S+\.\S+$/.test(data.email);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!valid || send === "sending") return;
    setSend("sending");
    try {
      const body = new FormData();
      body.append("_subject", `New project brief — ${data.name || data.email}`);
      body.append("_replyto", data.email);
      for (const key of Object.keys(data) as (keyof Brief)[]) body.append(key, data[key]);
      body.append("bookingLink", site.booking.href);
      body.append("_gotcha", "");
      const response = await fetch(FORMSPREE_ENDPOINT, { method: "POST", body, headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`Brief delivery failed (${response.status})`);
      setDone(true);
      setSend("idle");
    } catch {
      setSend("error");
    }
  };

  const restart = () => { setDone(false); setStep(1); setData(initialBrief); setSend("idle"); };

  return <main className="brief"><SEO title="Start a Project" description="Tell Runtime Systems what you are building through a focused project brief." />
    <header className="brief__top">
      <Link href="/" className="brief__brand" ariaLabel="Runtime Systems — return to home page"><SystemWordmark /></Link>
      <Link href="/" className="brief__exit"><span>Close brief</span><X size={15} /></Link>
    </header>
    <div className="brief__rail"><span>PROJECT.BRIEF</span><div>{[1,2,3,4].map((item) => <i key={item} className={step >= item ? "is-active" : ""} />)}</div><span>0{step} / 04</span></div>
    {!done ? <form onSubmit={submit} className="brief__form">
      <div className="brief__heading"><span>STEP / 0{step}</span><h1>{step === 1 ? "What are you building?" : step === 2 ? "Where is the system now?" : step === 3 ? "Define the operating range." : "Who should we talk to?"}</h1><p>{step === 1 ? "Choose the closest shape. We’ll refine the language together." : step === 2 ? "The starting state changes the right path forward." : step === 3 ? "Context helps us respond with useful next steps." : "A direct line to continue the conversation."}</p></div>
      {step === 1 && <fieldset className="option-grid"><legend className="sr-only">What are you building?</legend>{buildTypes.map((item) => <button type="button" key={item} onClick={() => update("build", item)} className={data.build === item ? "is-selected" : ""}><span>{item}</span>{data.build === item && <Check size={18} />}</button>)}</fieldset>}
      {step === 2 && <fieldset className="option-grid option-grid--stage"><legend className="sr-only">Project stage</legend>{stages.map((item, index) => <button type="button" key={item} onClick={() => update("stage", item)} className={data.stage === item ? "is-selected" : ""}><small>0{index + 1}</small><span>{item}</span>{data.stage === item && <Check size={18} />}</button>)}</fieldset>}
      {step === 3 && <div className="form-grid"><label className="form-field form-field--wide"><span>Project description</span><textarea value={data.description} onChange={(e) => update("description", e.target.value)} placeholder="What should this system make possible?" rows={5} /></label><label className="form-field"><span>Budget range</span><select value={data.budget} onChange={(e) => update("budget", e.target.value)}><option value="">Select range</option><option>$5k–$15k</option><option>$15k–$35k</option><option>$35k–$75k</option><option>$75k+</option><option>Not defined</option></select></label><label className="form-field"><span>Timeline</span><select value={data.timeline} onChange={(e) => update("timeline", e.target.value)}><option value="">Select timeline</option><option>1–2 months</option><option>3–4 months</option><option>5–8 months</option><option>Ongoing</option><option>Not defined</option></select></label></div>}
      {step === 4 && <div className="form-grid"><label className="form-field"><span>Name</span><input value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" autoComplete="name" /></label><label className="form-field"><span>Work email</span><input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="you@company.com" autoComplete="email" /></label><label className="form-field"><span>Company</span><input value={data.company} onChange={(e) => update("company", e.target.value)} placeholder="Company or product" autoComplete="organization" /></label><label className="form-field"><span>Phone <small>Optional</small></span><input type="tel" value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+00 000 0000000" autoComplete="tel" /></label><p className="form-note">Your brief is delivered straight to the Runtime Systems inbox through Formspree. Want an answer today? Book an intro call on the next screen.</p></div>}
      {send === "error" && <p className="form-error" role="alert">The brief could not be sent just now — please try again, or book an intro call / email <a href={`mailto:${site.email}`}>{site.email}</a> directly.</p>}
      <div className="brief__actions">{step > 1 ? <button type="button" className="brief-back" onClick={() => setStep(step - 1)}><ArrowLeft size={17} /> Back</button> : <span />}{step < 4 ? <button type="button" disabled={!valid} onClick={() => valid && setStep(step + 1)}>Continue <ArrowRight size={17} /></button> : <button type="submit" disabled={!valid || send === "sending"}>{send === "sending" ? "Sending brief…" : <><span>Send Project Brief</span> <ArrowRight size={17} /></>}</button>}</div>
      <a className="brief__prefer" href={site.booking.href} target="_blank" rel="noreferrer">PREFER TO TALK FIRST? <b>BOOK A 15-MIN CALL ↗</b></a>
    </form> : <div className="brief__complete"><div className="brief-check"><Check /></div><span>PROJECT.BRIEF / COMPLETE</span><h1>Let’s build<br />the system.</h1><p>Your brief has been sent. We’ll reply to <b>{data.email}</b> shortly. Want to move faster?</p><a className="brief-book" href={site.booking.href} target="_blank" rel="noreferrer"><Calendar size={16} /><span>Book an appointment — 15 min intro call</span><b>↗</b></a><div className="brief__complete-actions"><button onClick={restart}>Start another brief</button><Link href="/" className="brief-home-link">Return to home</Link></div></div>}
    <aside className="brief__aside"><Link href="/" className="brief__aside-brand" ariaLabel="Runtime Systems — return to home page">RUNTIME SYSTEMS</Link><p>ENGINEERING STUDIO<br />LAHORE / WORLDWIDE</p><a className="brief__aside-book" href={site.booking.href} target="_blank" rel="noreferrer">BOOK / 15-MIN INTRO CALL ↗</a><div><i /><span>RESPONSE CHANNEL / READY</span></div></aside>
  </main>;
}
