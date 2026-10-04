export function RuntimeFallback() {
  return (
    <div className="runtime-fallback" aria-label="Runtime Core system visualization">
      <span className="fallback-glow" aria-hidden="true" />
      <span className="fallback-orbit fallback-orbit--outer" aria-hidden="true"><i className="fallback-bead fallback-bead--signal" /></span>
      <span className="fallback-orbit fallback-orbit--mid" aria-hidden="true"><i className="fallback-bead" /></span>
      <span className="fallback-orbit fallback-orbit--inner" aria-hidden="true" />
      <span className="fallback-core" aria-hidden="true"><i /><i /><i /><i /></span>
      {[0, 1, 2, 3, 4, 5].map((node) => <span key={node} className={`fallback-node fallback-node--${node}`} aria-hidden="true" />)}
    </div>
  );
}
