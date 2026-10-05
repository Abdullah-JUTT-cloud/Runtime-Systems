import { win } from "./Sheet";

/* AI — scattered context is absorbed into the model core, guard rails close,
   and an output beam draws to a CONTROL gate that ticks. */
const DOTS = [
  { x: 200, y: 180, label: "CONTEXT" },
  { x: 168, y: 350, label: "MEMORY" },
  { x: 215, y: 515, label: "TOOLS" },
  { x: 640, y: 180, label: "DOCUMENTS" },
  { x: 706, y: 490, label: "EVAL" },
];

export function AiScene() {
  const CX = 430, CY = 350;
  return (
    <g>
      <circle className="sheet-ring" cx={CX} cy={CY} r={150}
        style={{ opacity: win(0, 0.3), transform: `scale(calc(1 + (1 - ${win(0, 0.3)}) * 0.22))`, transformOrigin: "center", transformBox: "fill-box" }} />
      <circle className="sheet-ring" cx={CX} cy={CY} r={95}
        style={{ opacity: win(0.05, 0.3), transform: `scale(calc(1 + (1 - ${win(0.05, 0.3)}) * 0.22))`, transformOrigin: "center", transformBox: "fill-box" }} />
      <circle className="sheet-core" cx={CX} cy={CY} r={58} style={{ opacity: win(0.08, 0.25) }} />
      <circle className="sheet-ring" cx={CX} cy={CY} r={34} style={{ opacity: win(0.15, 0.25) }} />
      <text className="sheet-text" x={CX} y={CY + 4.5} textAnchor="middle">MODEL</text>

      {DOTS.map((dot, i) => {
        const w = win(0.12 + i * 0.09, 0.24);
        return (
          <g key={dot.label} style={{ opacity: w, transform: `translate(calc((1 - ${w}) * ${CX - dot.x}px), calc((1 - ${w}) * ${CY - dot.y}px))` }}>
            <circle className="sheet-dot" cx={dot.x} cy={dot.y} r={8} />
            <text className="sheet-text sheet-text--muted" x={dot.x} y={dot.y - 16} textAnchor="middle">{dot.label}</text>
          </g>
        );
      })}

      <line className="sheet-line--strong" x1={285} y1={258} x2={285} y2={442}
        style={{ opacity: win(0.38, 0.18), transform: `translateX(calc((1 - ${win(0.38, 0.18)}) * -30px))` }} />
      <line className="sheet-line--strong" x1={575} y1={258} x2={575} y2={442}
        style={{ opacity: win(0.38, 0.18), transform: `translateX(calc((1 - ${win(0.38, 0.18)}) * 30px))` }} />
      <text className="sheet-text sheet-text--muted" x={285} y={242} textAnchor="middle" style={{ opacity: win(0.42, 0.18) }}>POLICY</text>
      <text className="sheet-text sheet-text--muted" x={575} y={242} textAnchor="middle" style={{ opacity: win(0.42, 0.18) }}>HUMAN</text>

      <line className="sheet-line--accent" x1={492} y1={350} x2={640} y2={350} pathLength={1}
        style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0.55, 0.18)} * 1px)` }} />
      <g style={{ opacity: win(0.6, 0.14) }}>
        <rect className="sheet-box" x={640} y={318} width={112} height={64} />
        <text className="sheet-text" x={696} y={340} textAnchor="middle">CONTROL</text>
      </g>
      <polyline className="sheet-line--accent" points="676,362 690,374 714,348" pathLength={1} fill="none"
        style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0.78, 0.16)} * 1px)` }} />
      <text className="sheet-text sheet-text--muted" x={CX} y={622} textAnchor="middle" style={{ opacity: win(0.72, 0.2) }}>EVAL / GATED OUTPUT</text>
    </g>
  );
}
