import { win } from "./Sheet";

/* CLOUD — a deploy cartridge rides the conveyor through BUILD, TEST and
   RELEASE; OBSERVE sprouts a rising signal, and ROLLBACK stands armed. */
const STATIONS = [
  { x: 170, label: "BUILD" },
  { x: 340, label: "TEST" },
  { x: 510, label: "RELEASE" },
  { x: 680, label: "OBSERVE" },
];

export function CloudScene() {
  return (
    <g>
      <line className="sheet-line--strong" x1={110} y1={380} x2={750} y2={380} pathLength={1}
        style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0, 0.15)} * 1px)` }} />

      {STATIONS.map((s, i) => (
        <g key={s.label}>
          <rect className="sheet-box" x={s.x - 58} y={346} width={116} height={68}
            style={{ opacity: win(0.14 + i * 0.11, 0.14), transform: `scale(${win(0.14 + i * 0.11, 0.14)})`, transformOrigin: "center", transformBox: "fill-box" }} />
          <text className="sheet-text" x={s.x} y={386} textAnchor="middle" style={{ opacity: win(0.16 + i * 0.11, 0.14) }}>{s.label}</text>
          <polyline className="sheet-line--accent" points={`${s.x - 12},318 ${s.x - 3},327 ${s.x + 13},303`} pathLength={1} fill="none"
            style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0.2 + i * 0.11, 0.12)} * 1px)` }} />
        </g>
      ))}

      <rect className="sheet-accentbox" x={104} y={362} width={30} height={30}
        style={{ transform: `translateX(calc(${win(0.06, 0.86)} * 468px))` }} />

      <polyline className="sheet-line--accent" points="738,346 738,296 772,296 772,248 804,248" pathLength={1} fill="none"
        style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0.78, 0.2)} * 1px)` }} />
      <text className="sheet-text sheet-text--muted" x={804} y={236} textAnchor="end" style={{ opacity: win(0.86, 0.14) }}>SIGNAL / LIVE</text>

      <g style={{ opacity: win(0.85, 0.15) }}>
        <rect className="sheet-box--ink" x={300} y={470} width={260} height={44} />
        <text className="sheet-text sheet-text--inv" x={430} y={497} textAnchor="middle">ROLLBACK / ARMED</text>
      </g>
    </g>
  );
}
