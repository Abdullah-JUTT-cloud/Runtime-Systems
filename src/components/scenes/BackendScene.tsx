import { win } from "./Sheet";

/* BACKEND — desktop: the bus wires itself from GATEWAY through services to
   stores. Compact: a vertical bus, same choreography. */
export function BackendScene({ compact }: { compact: boolean }) {
  if (compact) {
    const nodeY = [196, 290, 384];
    return (
      <g>
        <g style={{ opacity: win(0, 0.14), transform: `translateY(calc((1 - ${win(0, 0.14)}) * -80px))` }}>
          <rect className="sheet-box--ink" x={130} y={52} width={160} height={54} />
          <text className="sheet-text sheet-text--inv" x={210} y={84} textAnchor="middle">GATEWAY</text>
        </g>
        <path className="sheet-line" d="M210 106 V384" pathLength={1} fill="none"
          style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0.08, 0.2)} * 1px)` }} />
        {nodeY.map((y, i) => (
          <g key={y}>
            <path className="sheet-line" d={`M210 ${y} H180`} pathLength={1} fill="none"
              style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0.18 + i * 0.12, 0.16)} * 1px)` }} />
            <g style={{ opacity: win(0.26 + i * 0.12, 0.14) }}>
              <rect className="sheet-box" x={40} y={y - 25} width={140} height={50} />
              <text className="sheet-text" x={110} y={y + 4.5} textAnchor="middle">SVC {String.fromCharCode(65 + i)}</text>
            </g>
            <path className="sheet-line" d={`M210 ${y} H300`} pathLength={1} fill="none"
              style={{ strokeDasharray: "1px", strokeDashoffset: `calc(1px - ${win(0.3 + i * 0.12, 0.16)} * 1px)` }} />
          </g>
        ))}
        <g style={{ opacity: win(0.34, 0.14) }}>
          <rect className="sheet-box" x={300} y={171} width={90} height={50} />
          <text className="sheet-text" x={345} y={201} textAnchor="middle">DB</text>
        </g>
        <g style={{ opacity: win(0.46, 0.14) }}>
          <rect className="sheet-box" x={300} y={265} width={90} height={50} />
          <text className="sheet-text" x={345} y={295} textAnchor="middle">CACHE</text>
        </g>
        <g style={{ opacity: win(0.58, 0.14) }}>
          <rect className="sheet-box" x={300} y={359} width={90} height={50} rx={25} />
          <text className="sheet-text" x={345} y={389} textAnchor="middle">QUEUE</text>
        </g>
        <text className="sheet-text sheet-text--muted" x={210} y={470} textAnchor="middle" style={{ opacity: win(0.8, 0.2) }}>
          OBSERVABLE / RECOVERABLE
        </text>
      </g>
    );
  }
  const svcY = [195, 352, 509];
  return (
    <g>
      <g style={{ opacity: win(0, 0.14), transform: `translateX(calc((1 - ${win(0, 0.14)}) * -120px))` }}>
        <rect className="sheet-box--ink" x={110} y={312} width={116} height={60} />
        <text className="sheet-text sheet-text--inv" x={168} y={347} textAnchor="middle">GATEWAY</text>
      </g>
      {svcY.map((y, i) => (
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
