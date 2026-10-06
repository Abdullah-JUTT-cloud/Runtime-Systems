import { win } from "./Sheet";

/* CLOUD — desktop: a deploy cartridge rides the conveyor beneath BUILD, TEST
   and RELEASE, fades as it docks at OBSERVE, and a live signal rises; ROLLBACK
   stands armed. Compact: the same run laid out vertically. */
export function CloudScene({ compact }: { compact: boolean }) {
  if (compact) {
    const stations = [
      { y: 92, label: "BUILD" },
      { y: 182, label: "TEST" },
      { y: 272, label: "RELEASE" },
      { y: 362, label: "OBSERVE" },
    ];
    return (
      <g>
        <line className="sheet-line--strong" x1={210} y1={64} x2={210} y2={416} pathLength={1}
          style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0, 0.15)} * 1px)` }} />
        {stations.map((s, i) => (
          <g key={s.label}>
            <rect className="sheet-box" x={140} y={s.y} width={140} height={54}
              style={{ opacity: win(0.14 + i * 0.11, 0.14), transform: `scale(${win(0.14 + i * 0.11, 0.14)})`, transformOrigin: "center", transformBox: "fill-box" }} />
            <text className="sheet-text" x={210} y={s.y + 33} textAnchor="middle" style={{ opacity: win(0.16 + i * 0.11, 0.14) }}>{s.label}</text>
            <polyline className="sheet-line--accent" points={`124,${s.y + 14} 114,${s.y + 24} 96,${s.y - 2}`} pathLength={1} fill="none"
              style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0.2 + i * 0.11, 0.12)} * 1px)` }} />
          </g>
        ))}
        <rect className="sheet-accentbox" x={195} y={30} width={28} height={28}
          style={{ transform: `translateY(calc(${win(0.06, 0.62)} * 336px))`, opacity: `calc(1 - ${win(0.68, 0.14)})` }} />
        <polyline className="sheet-line--accent" points="280,389 292,389 300,369 308,395 316,355 328,355" pathLength={1} fill="none"
          style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0.74, 0.2)} * 1px)` }} />
        <text className="sheet-text sheet-text--accent" x={338} y={359} style={{ opacity: win(0.82, 0.14) }}>LIVE</text>
        <g style={{ opacity: win(0.85, 0.15) }}>
          <rect className="sheet-box--ink" x={110} y={470} width={200} height={44} />
          <text className="sheet-text sheet-text--inv" x={210} y={497} textAnchor="middle">ROLLBACK / ARMED</text>
        </g>
      </g>
    );
  }
  const stations = [
    { x: 170, label: "BUILD" },
    { x: 340, label: "TEST" },
    { x: 510, label: "RELEASE" },
    { x: 680, label: "OBSERVE" },
  ];
  return (
    <g>
      <line className="sheet-line--strong" x1={110} y1={390} x2={750} y2={390} pathLength={1}
        style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0, 0.15)} * 1px)` }} />
      {stations.map((s, i) => (
        <g key={s.label}>
          <rect className="sheet-box" x={s.x - 58} y={310} width={116} height={68}
            style={{ opacity: win(0.14 + i * 0.11, 0.14), transform: `scale(${win(0.14 + i * 0.11, 0.14)})`, transformOrigin: "center", transformBox: "fill-box" }} />
          <line className="sheet-leader" x1={s.x} y1={378} x2={s.x} y2={390} style={{ opacity: win(0.16 + i * 0.11, 0.14) }} />
          <text className="sheet-text" x={s.x} y={350} textAnchor="middle" style={{ opacity: win(0.16 + i * 0.11, 0.14) }}>{s.label}</text>
          <polyline className="sheet-line--accent" points={`${s.x - 12},278 ${s.x - 3},287 ${s.x + 13},263`} pathLength={1} fill="none"
            style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0.2 + i * 0.11, 0.12)} * 1px)` }} />
        </g>
      ))}
      <rect className="sheet-accentbox" x={104} y={375} width={30} height={30}
        style={{ transform: `translateX(calc(${win(0.06, 0.62)} * 560px))`, opacity: `calc(1 - ${win(0.68, 0.14)})` }} />
      <polyline className="sheet-line--accent" points="738,344 756,344 765,320 774,356 783,308 799,308" pathLength={1} fill="none"
        style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0.72, 0.2)} * 1px)` }} />
      <text className="sheet-text sheet-text--muted" x={846} y={300} textAnchor="end" style={{ opacity: win(0.8, 0.14) }}>SIGNAL / LIVE</text>
      <g style={{ opacity: win(0.85, 0.15) }}>
        <rect className="sheet-box--ink" x={300} y={470} width={260} height={44} />
        <text className="sheet-text sheet-text--inv" x={430} y={497} textAnchor="middle">ROLLBACK / ARMED</text>
      </g>
    </g>
  );
}
