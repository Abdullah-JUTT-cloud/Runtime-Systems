import { win } from "./Sheet";

/* MOBILE — two devices slide together over a real network, the sync link opens
   with live packets, the status flips OFFLINE to SYNCED, and PUSH drops in. */
export function MobileScene() {
  return (
    <g>
      <g style={{ opacity: win(0.05, 0.3), transform: `translateX(calc((1 - ${win(0.05, 0.3)}) * -150px))` }}>
        <rect className="sheet-device" x={150} y={190} width={170} height={330} rx={26} />
        {[0, 1, 2].map((i) => <rect key={i} className="sheet-bar" x={172} y={252 + i * 52} width={126} height={34} style={{ opacity: win(0.12 + i * 0.05, 0.15) }} />)}
        <text className="sheet-text sheet-text--muted" x={166} y={222}>APP</text>
      </g>
      <g style={{ opacity: win(0.15, 0.3), transform: `translateX(calc((1 - ${win(0.15, 0.3)}) * 150px))` }}>
        <rect className="sheet-device" x={540} y={210} width={150} height={300} rx={24} />
        {[0, 1].map((i) => <rect key={i} className="sheet-bar" x={560} y={268 + i * 48} width={110} height={30} style={{ opacity: win(0.22 + i * 0.05, 0.15) }} />)}
        <text className="sheet-text sheet-text--muted" x={556} y={242}>OS</text>
      </g>

      <line className="sheet-line" x1={322} y1={360} x2={538} y2={360} pathLength={1}
        style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0.4, 0.18)} * 1px)` }} />
      <g style={{ opacity: win(0.55, 0.15) }}>
        {[0, 0.8, 1.6].map((delay) => (
          <circle key={delay} className="sheet-packet" cx={322} cy={360} r={4} style={{ animationDelay: `-${delay}s` }} />
        ))}
      </g>

      <g style={{ opacity: win(0.45, 0.15) }}>
        <line className="sheet-leader" x1={235} y1={536} x2={235} y2={548} />
        <line className="sheet-leader" x1={615} y1={536} x2={615} y2={548} />
        <line className="sheet-leader" x1={235} y1={542} x2={615} y2={542} />
        <text className="sheet-text sheet-text--muted" x={425} y={566} textAnchor="middle">REAL NETWORKS / REAL DAYS</text>
      </g>

      <text className="sheet-text sheet-text--muted" x={430} y={614} textAnchor="middle"
        style={{ opacity: `calc(1 - ${win(0.68, 0.15)})` }}>STATUS / OFFLINE</text>
      <text className="sheet-text sheet-text--accent" x={430} y={614} textAnchor="middle"
        style={{ opacity: win(0.68, 0.15) }}>STATUS / SYNCED</text>

      <g style={{ opacity: win(0.78, 0.16), transform: `translateY(calc((1 - ${win(0.78, 0.16)}) * -90px))` }}>
        <rect className="sheet-accentbox" x={598} y={132} width={76} height={34} />
        <text className="sheet-text sheet-text--accent" x={636} y={154} textAnchor="middle">PUSH</text>
      </g>
    </g>
  );
}
