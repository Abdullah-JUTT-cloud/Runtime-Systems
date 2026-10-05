import { win } from "./Sheet";

/* BACKEND — the quiet machinery wires itself: orthogonal lines draw from the
   gateway to the services, on to the stores, and each node fills on arrival. */
const SVC_Y = [195, 352, 509];

export function BackendScene() {
  return (
    <g>
      <g style={{ opacity: win(0, 0.14), transform: `translateX(calc((1 - ${win(0, 0.14)}) * -120px))` }}>
        <rect className="sheet-box--ink" x={110} y={312} width={116} height={60} />
        <text className="sheet-text sheet-text--inv" x={168} y={347} textAnchor="middle">GATEWAY</text>
      </g>

      {SVC_Y.map((y, i) => (
        <g key={y}>
          <path className="sheet-line" d={`M226 342 H330 V${y} H420`} pathLength={1} fill="none"
            style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0.1 + i * 0.12, 0.18)} * 1px)` }} />
          <g style={{ opacity: win(0.24 + i * 0.12, 0.14) }}>
            <rect className="sheet-box" x={420} y={y - 27} width={104} height={54} />
            <text className="sheet-text" x={472} y={y + 4.5} textAnchor="middle">SVC {String.fromCharCode(65 + i)}</text>
          </g>
          <path className="sheet-line" d={`M524 ${y} H660`} pathLength={1} fill="none"
            style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0.28 + i * 0.12, 0.16)} * 1px)` }} />
        </g>
      ))}

      <g style={{ opacity: win(0.34, 0.14) }}>
        <rect className="sheet-box" x={660} y={168} width={116} height={54} />
        <text className="sheet-text" x={718} y={200} textAnchor="middle">DB</text>
      </g>
      <g style={{ opacity: win(0.46, 0.14) }}>
        <rect className="sheet-box" x={660} y={325} width={116} height={54} />
        <text className="sheet-text" x={718} y={357} textAnchor="middle">CACHE</text>
      </g>
      <g style={{ opacity: win(0.58, 0.14) }}>
        <rect className="sheet-box" x={660} y={482} width={116} height={54} rx={27} />
        <text className="sheet-text" x={718} y={506} textAnchor="middle">QUEUE</text>
      </g>
      {[0, 1, 2].map((i) => (
        <circle key={i} className="sheet-accentdot" cx={704 + i * 14} cy={523} r={3.2} style={{ opacity: win(0.62 + i * 0.06, 0.1) }} />
      ))}

      <text className="sheet-text sheet-text--muted" x={430} y={642} textAnchor="middle" style={{ opacity: win(0.8, 0.2) }}>
        OBSERVABLE / RECOVERABLE / PREDICTABLE
      </text>
    </g>
  );
}
