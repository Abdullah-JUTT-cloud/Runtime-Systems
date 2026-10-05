export function RuntimeFallback() {
  return (
    <div className="runtime-fallback" aria-label="Runtime Core system visualization">
      <span className="fallback-glow" aria-hidden="true" />
      <span className="fallback-sweep" aria-hidden="true" />
      <span className="fallback-ticks" aria-hidden="true" />
      <span className="fallback-orbit fallback-orbit--outer" aria-hidden="true"><i className="fallback-bead fallback-bead--signal" /></span>
      <span className="fallback-orbit fallback-orbit--mid" aria-hidden="true"><i className="fallback-bead" /></span>
      <span className="fallback-orbit fallback-orbit--inner" aria-hidden="true" />
      <span className="fallback-cross" aria-hidden="true" />
      <span className="fallback-core" aria-hidden="true"><i /><i /><i /><i /></span>
      {[0, 1, 2, 3, 4, 5].map((node) => <span key={node} className={`fallback-node fallback-node--${node}`} aria-hidden="true" />)}
      <span className="fallback-label fallback-label--top" aria-hidden="true">RUNTIME / CORE</span>
      <span className="fallback-label fallback-label--bottom" aria-hidden="true">SYS.STATUS / ONLINE</span>
    </div>
  );
}
