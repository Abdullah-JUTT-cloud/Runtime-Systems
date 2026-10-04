import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { worldMapDots } from "../data/worldMapDots";

type Coordinate = [number, number];

/** A viewBox expressed in map units, so every layer can be derived from the same crop. */
type Frame = { x: number; y: number; width: number; height: number };

const MAP_WIDTH = 960;
const MAP_HEIGHT = 390;

const DESKTOP_FRAME: Frame = { x: 0, y: 0, width: MAP_WIDTH, height: MAP_HEIGHT };

/**
 * Mobile frame: the same world projection, cropped to the Pacific margins that hold
 * nothing but island chains, then vertically expanded to whatever aspect the phone
 * frame actually is. Horizontally the crop is fixed so topology, routes and every
 * node stay on screen; vertically it stretches so the map fills a deliberate
 * dashboard panel instead of collapsing into a letterboxed desktop canvas.
 */
const MOBILE_WORLD_X = 140;
const MOBILE_WORLD_W = 730;
const MOBILE_FOCUS_X = 505;
const MOBILE_FOCUS_Y = 194;

/** Land dots are ~1.55u on desktop; the grid keeps the same 160u / 65u rhythm on any crop. */
const GRATICULE_STEP_X = 160;
const GRATICULE_STEP_Y = 65;

const project = ([lon, lat]: Coordinate): Coordinate => [
  ((lon + 180) / 360) * MAP_WIDTH,
  ((90 - lat) / 180) * MAP_HEIGHT,
];

const formatCoords = ([lon, lat]: Coordinate): string =>
  `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? "N" : "S"} ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? "E" : "W"}`;

/** Quadratic arc between two projected points, bowed north so links read like real great-circle flight paths. */
const arc = (from: Coordinate, to: Coordinate, bow: number): string => {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy) || 1;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const nx = -dy / length;
  const ny = dx / length;
  const side = ny <= 0 ? 1 : -1;
  const cx = midX + nx * length * bow * side;
  const cy = midY + ny * length * bow * side;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
};

const nodes = [
  { id: "hq", label: "Lahore HQ", short: "LAHORE HQ", rank: 1, coordinate: [74.36, 31.52] as Coordinate, core: true, tag: [0, -48], tagCompact: [0, -50] },
  { id: "na", label: "North America", short: "N. AMERICA", rank: 4, coordinate: [-74.01, 40.71] as Coordinate, tag: [0, 18], tagCompact: [0, 16] },
  { id: "eu", label: "London", short: "LONDON", rank: 2, coordinate: [-0.13, 51.51] as Coordinate, tag: [0, 18], tagCompact: [0, 16] },
  { id: "gulf", label: "Gulf", short: "GULF", rank: 3, coordinate: [55.27, 25.2] as Coordinate, tag: [-58, 22], tagCompact: [-46, 17] },
  { id: "apac", label: "APAC", short: "APAC", rank: 2, coordinate: [103.82, 1.35] as Coordinate, tag: [0, 18], tagCompact: [0, 16] },
  { id: "latam", label: "LATAM", short: "LATAM", rank: 3, coordinate: [-46.63, -23.55] as Coordinate, tag: [0, 18], tagCompact: [0, 16] },
].map((node) => ({ ...node, point: project(node.coordinate) }));

const pointOf = (id: string): Coordinate => {
  const match = nodes.find((node) => node.id === id);
  if (!match) throw new Error(`Unknown network node: ${id}`);
  return match.point;
};

type Link = { id: string; d: string; kind: "spoke" | "mesh"; duration: number };

const buildLink = (id: string, from: string, to: string, kind: Link["kind"]): Link => {
  const start = pointOf(from);
  const end = pointOf(to);
  return {
    id,
    d: arc(start, end, kind === "spoke" ? 0.26 : 0.2),
    kind,
    duration: kind === "spoke" ? 3.4 : 5.2,
  };
};

/** Hub spokes from Lahore, plus a peer mesh between client regions. */
const links: Link[] = [
  ...["na", "eu", "gulf", "apac", "latam"].map((id) => buildLink(`spoke-${id}`, "hq", id, "spoke")),
  buildLink("mesh-eu-na", "eu", "na", "mesh"),
  buildLink("mesh-na-latam", "na", "latam", "mesh"),
  buildLink("mesh-na-apac", "na", "apac", "mesh"),
];

const telemetry = [
  ["HQ", "Lahore-based core team", "PKT · UTC+5"],
  ["SYNC", "Overlap planned around client time zones", "Window set per team"],
  ["DEPLOY", "Cloud regions selected per product need", "Edge zones per region"],
];

/** Grid lines for a given crop, at the same 160u / 65u rhythm the desktop uses. */
const graticuleFor = (frame: Frame) => {
  const between = (start: number, end: number, step: number) => {
    const lines: number[] = [];
    for (let value = start; value < end; value += step) {
      if (value > frame.x && value < frame.x + frame.width) lines.push(value);
    }
    return lines;
  };
  const first = (origin: number, step: number) => Math.ceil(origin / step) * step;
  return {
    x: between(first(frame.x, GRATICULE_STEP_X), frame.x + frame.width, GRATICULE_STEP_X),
    y: between(first(frame.y, GRATICULE_STEP_Y), frame.y + frame.height, GRATICULE_STEP_Y),
  };
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * Phones and tablets get the stacked composition: a controlled-height map panel with
 * the readout and legend underneath, instead of the desktop overlay grid.
 */
type FrameMode = "desktop" | "tablet" | "mobile";

/**
 * Three compositions, not two: desktop keeps the overlay grid, tablet keeps the whole
 * world but stacks the panel, and phone gets the cropped topology frame.
 */
function useFrameMode(): FrameMode {
  const read = (): FrameMode => {
    if (typeof window === "undefined") return "desktop";
    if (window.matchMedia("(max-width: 720px)").matches) return "mobile";
    if (window.matchMedia("(max-width: 1024px)").matches) return "tablet";
    return "desktop";
  };
  const [mode, setMode] = useState<FrameMode>(read);
  useEffect(() => {
    const phone = window.matchMedia("(max-width: 720px)");
    const tablet = window.matchMedia("(max-width: 1024px)");
    const update = () => setMode(read());
    update();
    phone.addEventListener("change", update);
    tablet.addEventListener("change", update);
    return () => {
      phone.removeEventListener("change", update);
      tablet.removeEventListener("change", update);
    };
  }, []);
  return mode;
}

type Size = { width: number; height: number };

/**
 * Measures the rendered SVG box so the crop can match the panel the user actually has.
 * Only runs in the stacked layout, where the panel height is CSS-driven — the desktop
 * svg sizes itself from the viewBox, which would otherwise feed back into the observer.
 */
function useFrameBox(enabled: boolean) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [box, setBox] = useState<Size | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) {
      setBox(null);
      return;
    }
    const measure = () => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (!width || !height) return;
      setBox((current) =>
        current && current.width === width && current.height === height ? current : { width, height },
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("orientationchange", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", measure);
    };
  }, [enabled]);

  return [ref, box] as const;
}

export function GlobalNetwork() {
  const reducedMotion = usePrefersReducedMotion();
  const mode = useFrameMode();
  const stacked = mode !== "desktop";
  const [svgRef, frameBox] = useFrameBox(stacked);
  const [focus, setFocus] = useState("hq");
  const active = nodes.find((node) => node.id === focus) ?? nodes[0];

  const frame = useMemo<Frame>(() => {
    if (mode !== "mobile") return DESKTOP_FRAME;
    const height = frameBox ? MOBILE_WORLD_W * (frameBox.height / frameBox.width) : 470;
    return {
      x: MOBILE_FOCUS_X - MOBILE_WORLD_W / 2,
      y: MOBILE_FOCUS_Y - height / 2,
      width: MOBILE_WORLD_W,
      height,
    };
  }, [mode, frameBox]);

  /** Map units per rendered CSS pixel — drives every responsive size inside the svg. */
  const unitsPerPx = frameBox ? frame.width / frameBox.width : 1;

  const graticule = useMemo(() => graticuleFor(frame), [frame]);
  const viewBox = `${frame.x.toFixed(2)} ${frame.y.toFixed(2)} ${frame.width.toFixed(2)} ${frame.height.toFixed(2)}`;

  /** Labels are HTML inside foreignObject, so their box is sized in rendered pixels. */
  const labelBox = useMemo(
    () => ({ width: Math.ceil(150 * unitsPerPx), height: Math.ceil(24 * unitsPerPx) }),
    [unitsPerPx],
  );

  return (
    <div className="global-network" data-reveal>
      <div
        className="global-network__map"
        style={{ "--gn-u": unitsPerPx } as CSSProperties}
        aria-label="Runtime Systems global delivery topology"
      >
        <svg
          ref={svgRef}
          viewBox={viewBox}
          role="img"
          aria-label="Global delivery topology with Runtime Systems in Lahore connected to client regions."
        >
          <defs>
            <radialGradient id="network-glow">
              <stop offset="0%" stopColor="#ff4b2b" stopOpacity=".3" />
              <stop offset="45%" stopColor="#ff4b2b" stopOpacity=".07" />
              <stop offset="100%" stopColor="#ff4b2b" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ocean-glow" cx="50%" cy="46%" r="64%">
              <stop offset="0%" stopColor="#2c3f4b" stopOpacity=".5" />
              <stop offset="55%" stopColor="#20262a" stopOpacity=".2" />
              <stop offset="100%" stopColor="#0f0f0e" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="land-dot" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#b2cede" />
              <stop offset="45%" stopColor="#6d93a8" stopOpacity=".92" />
              <stop offset="100%" stopColor="#3f5f6e" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect className="global-network__ocean" x={frame.x} y={frame.y} width={frame.width} height={frame.height} fill="url(#ocean-glow)" aria-hidden="true" />

          <g className="global-network__graticule" aria-hidden="true">
            {graticule.x.map((x) => <line key={`gx-${x}`} x1={x} y1={frame.y} x2={x} y2={frame.y + frame.height} />)}
            {graticule.y.map((y) => <line key={`gy-${y}`} x1={frame.x} y1={y} x2={frame.x + frame.width} y2={y} />)}
          </g>

          <g className="global-network__land" aria-hidden="true">
            {worldMapDots.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.55" />)}
          </g>

          <g className="global-network__routes" aria-hidden="true">
            {links.map((link) => <path key={link.id} id={link.id} className={`global-network__rail ${link.kind === "mesh" ? "global-network__rail--mesh" : ""}`} d={link.d} pathLength="1" />)}
            {links.map((link, index) => (
              <path
                key={`${link.id}-trace`}
                className={`global-network__trace ${link.kind === "mesh" ? "global-network__trace--mesh" : ""}`}
                d={link.d}
                pathLength="1"
                style={{ animationDelay: `${(index % 5) * 0.42}s` }}
              />
            ))}
            {!reducedMotion && links.map((link, index) => (
              <circle key={`${link.id}-packet`} r={link.kind === "spoke" ? 2.4 : 1.7} className={`global-network__packet ${link.kind === "mesh" ? "global-network__packet--mesh" : ""}`}>
                <animateMotion dur={`${link.duration}s`} repeatCount="indefinite" begin={`-${index * 0.85}s`}>
                  <mpath href={`#${link.id}`} />
                </animateMotion>
              </circle>
            ))}
          </g>

          <g className="global-network__nodes">
            {nodes.map((node, index) => {
              const [tagX, tagY] = mode === "mobile" ? node.tagCompact : node.tag;
              return (
                <g
                  key={node.id}
                  className={`global-network__node ${node.core ? "global-network__node--core" : ""}`}
                  transform={`translate(${node.point[0]} ${node.point[1]})`}
                  onMouseEnter={() => setFocus(node.id)}
                  onMouseLeave={() => setFocus("hq")}
                >
                  <circle className="global-network__aura" r={node.core ? 128 : 62} />
                  {node.core && <circle className="global-network__ping" r="22" />}
                  {node.core && <circle className="global-network__ring--spin" r="28" />}
                  <circle className="global-network__ring" r={node.core ? 22 : 16} />
                  <circle className="global-network__node-dot" r={node.core ? 5 : 4} />
                  <foreignObject x={tagX - labelBox.width / 2} y={tagY} width={labelBox.width} height={labelBox.height}>
                    <div className={`global-network__tag global-network__tag--r${node.rank}`}>
                      <b>{String(index + 1).padStart(2, "0")}</b>
                      <span className="global-network__tag-full">{node.label}</span>
                      <span className="global-network__tag-short">{node.short}</span>
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="global-network__overlay">
        <div className="global-network__hud">
          <span>TOPOLOGY / {String(nodes.length).padStart(2, "0")} NODES / {String(links.length).padStart(2, "0")} LINKS</span>
          <b>{active.label}</b>
          <em>{formatCoords(active.coordinate)}</em>
        </div>
        <div className="global-network__legend">
          <span><i className="legend-line" /> Active route</span>
          <span><i className="legend-line legend-line--mesh" /> Peer mesh</span>
          <span><i className="legend-core" /> HQ</span>
        </div>
      </div>

      <aside className="global-network__telemetry" aria-label="Delivery model notes">
        {telemetry.map(([label, text, detail]) => (
          <div key={label}>
            <span>{label}</span>
            <p>{text}</p>
            <em>{detail}</em>
          </div>
        ))}
      </aside>
    </div>
  );
}
