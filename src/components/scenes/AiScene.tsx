import { win } from "./Sheet";

/* AI — desktop: scattered context feeds a ringed MODEL core between guard rails,
   with an output beam to a CONTROL gate. Compact: the same field, portrait. */
export function AiScene({ compact }: { compact: boolean }) {
  if (compact) {
    const CX = 190, CY = 175;
    const dots = [
      { x: 70, y: 62, label: "CONTEXT" },
      { x: 340, y: 62, label: "DOCUMENTS" },
      { x: 56, y: 288, label: "MEMORY" },
      { x: 348, y: 288, label: "EVAL" },
    ];
    return (
      <g>
        <circle className="sheet-ring" cx={CX} cy={CY} r={122}
          style={{ opacity: win(0, 0.3), transform: `scale(calc(1 + (1 - ${win(0, 0.3)}) * 0.2))`, transformOrigin: "center", transformBox: "fill-box" }} />
        <circle className="sheet-ring" cx={CX} cy={CY} r={80}
          style={{ opacity: win(0.05, 0.3), transform: `scale(calc(1 + (1 - ${win(0.05, 0.3)}) * 0.2))`, transformOrigin: "center", transformBox: "fill-box" }} />
        <circle className="sheet-core" cx={CX} cy={CY} r={48} style={{ opacity: win(0.08, 0.25) }} />
        <circle className="sheet-ring" cx={CX} cy={CY} r={28} style={{ opacity: win(0.15, 0.25) }} />
        <text className="sheet-text" x={CX} y={CY + 4.5} textAnchor="middle">MODEL</text>
        {dots.map((dot, i) => (
          <g key={dot.label} style={{ opacity: win(0.14 + i * 0.09, 0.2) }}>
            <circle className="sheet-dot" cx={dot.x} cy={dot.y} r={7} />
            <text className="sheet-text sheet-text--muted" x={dot.x} y={dot.y - 15} textAnchor="middle">{dot.label}</text>
          </g>
        ))}
        <line className="sheet-line--strong" x1={128} y1={96} x2={128} y2={254}
          style={{ opacity: win(0.4, 0.18), transform: `translateX(calc((1 - ${win(0.4, 0.18)}) * -24px))` }} />
        <line className="sheet-line--strong" x1={252} y1={96} x2={252} y2={254}
          style={{ opacity: win(0.4, 0.18), transform: `translateX(calc((1 - ${win(0.4, 0.18)}) * 24px))` }} />
        <text className="sheet-text sheet-text--muted" x={128} y={82} textAnchor="middle" style={{ opacity: win(0.44, 0.18) }}>POLICY</text>
        <text className="sheet-text sheet-text--muted" x={252} y={82} textAnchor="middle" style={{ opacity: win(0.44, 0.18) }}>HUMAN</text>
        <line className="sheet-line--accent" x1={240} y1={175} x2={330} y2={175} pathLength={1}
          style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0.55, 0.18)} * 1px)` }} />
        <g style={{ opacity: win(0.6, 0.14) }}>
          <rect className="sheet-box" x={330} y={145} width={72} height={60} />
          <text className="sheet-text" x={366} y={168} textAnchor="middle">CTRL</text>
        </g>
        <polyline className="sheet-line--accent" points="352,184 362,193 382,172" pathLength={1} fill="none"
          style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0.78, 0.16)} * 1px)` }} />
        <text className="sheet-text sheet-text--muted" x={210} y={420} textAnchor="middle" style={{ opacity: win(0.72, 0.2) }}>EVAL / GATED OUTPUT</text>
      </g>
    );
  }
  const CX = 430, CY = 350;
  const dots = [
    { x: 200, y: 180, label: "CONTEXT" },
    { x: 168, y: 350, label: "MEMORY" },
    { x: 215, y: 515, label: "TOOLS" },
    { x: 640, y: 180, label: "DOCUMENTS" },
    { x: 706, y: 490, label: "EVAL" },
  ];
  return (
    <g>
      <circle className="sheet-ring" cx={CX} cy={CY} r={150}
        style={{ opacity: win(0, 0.3), transform: `scale(calc(1 + (1 - ${win(0, 0.3)}) * 0.22))`, transformOrigin: "center", transformBox: "fill-box" }} />
      <circle className="sheet-ring" cx={CX} cy={CY} r={95}
        style={{ opacity: win(0.05, 0.3), transform: `scale(calc(1 + (1 - ${win(0.05, 0.3)}) * 0.22))`, transformOrigin: "center", transformBox: "fill-box" }} />
      <circle className="sheet-core" cx={CX} cy={CY} r={58} style={{ opacity: win(0.08, 0.25) }} />
      <circle className="sheet-ring" cx={CX} cy={CY} r={34} style={{ opacity: win(0.15, 0.25) }} />
      <text className="sheet-text" x={CX} y={CY + 4.5} textAnchor="middle">MODEL</text>
      {dots.map((dot, i) => {
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
