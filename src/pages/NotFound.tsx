import { Button } from "../components/Primitives";
import { SEO } from "../components/SEO";

export function NotFound() {
  return <main className="not-found"><SEO title="Resource Not Found" /><div className="not-found__graphic"><span /><span /><span /><b>404</b></div><div><p className="meta">SYSTEM.ERROR / RESOURCE_MISSING</p><h1>Process failed.</h1><p>The requested resource does not exist in this runtime.</p><Button href="/">Return to System</Button></div></main>;
}

