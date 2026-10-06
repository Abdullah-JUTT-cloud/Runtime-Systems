import { win } from "./Sheet";

/* MOBILE — desktop: two devices slide together over a real network with live
   sync packets and an OFFLINE to SYNCED flip. Compact: the same handshake,
   stacked for portrait. */
export function MobileScene({ compact }: { compact: boolean }) {
  if (compact) {
    return (
      <g>
        <g style={{ opacity: win(0.05, 0.3), transform: `translateY(calc((1 - ${win(0.05, 0.3)}) * -90px))` }}>
          <rect className="sheet-device" x={48} y={56} width={140} height={264} rx={24} />
          {[0, 1, 2].map((i) => <rect key={i} className="sheet-bar" x={66} y={112 + i * 44} width={104} height={28} style={{ opacity: win(0.12 + i * 0.05, 0.15) }} />)}
          <text className="sheet-text sheet-text--muted" x={62} y={86}>APP</text>
        </g>
        <g style={{ opacity: win(0.15, 0.3), transform: `translateY(calc((1 - ${win(0.15, 0.3)}) * 90px))` }}>
          <rect className="sheet-device" x={232} y={220} width={140} height={264} rx={24} />
          {[0, 1].map((i) => <rect key={i} className="sheet-bar" x={250} y={276 + i * 42} width={104} height={26} style={{ opacity: win(0.22 + i * 0.05, 0.15) }} />)}
          <text className="sheet-text sheet-text--muted" x={246} y={250}>OS</text>
        </g>

        <line className="sheet-line" x1={188} y1={260} x2={232} y2={260} pathLength={1}
          style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0.4, 0.18)} * 1px)` }} />
        <g style={{ opacity: win(0.55, 0.15) }}>
          {[0, 0.8, 1.6].map((delay) => (
            <circle key={delay} className="sheet-packet sheet-packet--v" cx={188} cy={260} r={4} style={{ animationDelay: `-${delay}s` }} />
          ))}
        </g>

        <g style={{ opacity: win(0.45, 0.15) }}>
          <line className="sheet-leader" x1={118} y1={552} x2={118} y2={566} />
          <line className="sheet-leader" x1={302} y1={552} x2={302} y2={566} />
          <line className="sheet-leader" x1={118} y1={559} x2={302} y2={559} />
          <text className="sheet-text sheet-text--muted" x={210} y={546} textAnchor="middle">REAL NETWORKS / REAL DAYS</text>
        </g>

        <text className="sheet-text sheet-text--muted" x={210} y={486} textAnchor="middle"
          style={{ opacity: `calc(1 - ${win(0.68, 0.15)})` }}>STATUS / OFFLINE</text>
        <text className="sheet-text sheet-text--accent" x={210} y={486} textAnchor="middle"
          style={{ opacity: win(0.68, 0.15) }}>STATUS / SYNCED</text>

        <g style={{ opacity: win(0.78, 0.16), transform: `translateY(calc((1 - ${win(0.78, 0.16)}) * -70px))` }}>
          <rect className="sheet-accentbox" x={300} y={30} width={72} height={34} />
          <text className="sheet-text sheet-text--accent" x={336} y={52} textAnchor="middle">PUSH</text>
        </g>
      </g>
    );
  }
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
