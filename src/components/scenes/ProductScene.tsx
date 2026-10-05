import { win } from "./Sheet";

/* PRODUCT — an interface assembles itself: frame rises, nav slides in, content
   lines extend, cards land, and the DATA block connects from outside. */
export function ProductScene() {
  return (
    <g>
      <rect className="sheet-box" x={120} y={150} width={420} height={330}
        style={{ opacity: win(0, 0.18), transform: `translateY(calc((1 - ${win(0, 0.18)}) * 90px))` }} />
      <rect className="sheet-box--muted" x={140} y={172} width={380} height={26}
        style={{ opacity: win(0.16, 0.2), transform: `translateX(calc((1 - ${win(0.16, 0.2)}) * -140px))` }} />
      {[300, 240, 178].map((w, i) => (
        <rect key={w} className={i === 0 ? "sheet-inkbar" : "sheet-bar"} x={140} y={228 + i * 28} width={w} height={10}
          style={{ opacity: win(0.3 + i * 0.07, 0.16), transform: `scaleX(${win(0.3 + i * 0.07, 0.16)})`, transformOrigin: "left", transformBox: "fill-box" }} />
      ))}
      {[{ x: 140, w: 180 }, { x: 340, w: 160 }].map((card, i) => (
        <g key={card.x} style={{ opacity: win(0.5 + i * 0.08, 0.18), transform: `translateY(calc((1 - ${win(0.5 + i * 0.08, 0.18)}) * 70px))` }}>
          <rect className="sheet-box" x={card.x} y={366} width={card.w} height={86} />
          <rect className="sheet-accentbar" x={card.x + 14} y={382} width={34} height={7} />
          <rect className="sheet-bar" x={card.x + 14} y={400} width={card.w - 28} height={7} />
          <rect className="sheet-bar" x={card.x + 14} y={416} width={card.w - 60} height={7} />
        </g>
      ))}
      <path className="sheet-line--accent" d="M540 304 H580" pathLength={1}
        style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0.6, 0.18)} * 1px)` }} />
      <rect className="sheet-accentbox" x={580} y={280} width={96} height={48} style={{ opacity: win(0.66, 0.14) }} />
      <text className="sheet-text sheet-text--accent" x={628} y={309} textAnchor="middle">DATA</text>
      <g style={{ opacity: win(0.78, 0.14) }}>
        <rect className="sheet-box--ink" x={600} y={400} width={84} height={34} />
        <text className="sheet-text sheet-text--inv" x={642} y={422} textAnchor="middle">RELEASE</text>
      </g>
      {[
        { y: 162, label: "01 / INTERFACE" },
        { y: 205, label: "02 / NAV / FLOW" },
        { y: 262, label: "03 / SURFACE" },
        { y: 408, label: "04 / MODULES" },
      ].map((l, i) => (
        <g key={l.label} style={{ opacity: win(0.45 + i * 0.09, 0.2) }}>
          <line className="sheet-leader" x1={544} y1={l.y} x2={562} y2={l.y} />
          <text className="sheet-text" x={570} y={l.y + 4.5}>{l.label}</text>
        </g>
      ))}
    </g>
  );
}
