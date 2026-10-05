/*
  Shared engine-signature math for the Home signal instrument (EngineBench).
  Each engine id maps to a pure (x, t) waveform whose shape encodes the
  discipline it represents.
*/

export type Signal = (x: number, t: number) => number;

export const clampSignal = (value: number) => Math.min(1, Math.max(-1, value));
const soft = (value: number) => Math.tanh(value * 3.2);
const field = (x: number) => Math.sin(x * 3.17) * 0.5 + Math.sin(x * 7.31 + 1.7) * 0.3 + Math.sin(x * 13.7 + 4.2) * 0.2;

export const SIGNALS: Record<string, Signal> = {
  // Product — layered plateaus: surfaces assembling into one coherent whole.
  product: (x, t) =>
    clampSignal(soft(Math.sin(x * 15.7 + t * 0.32) + 0.55 * Math.sin(x * 7.5 - t * 0.21)) * 0.58 + 0.16 * field(x * 0.8 + t * 0.18)),
  // AI — attention mass drifting across a noisy field of evidence.
  ai: (x, t) => {
    const c1 = 0.28 + 0.22 * Math.sin(t * 0.4);
    const c2 = 0.74 - 0.18 * Math.sin(t * 0.3 + 1.9);
    const blob = (c: number, w: number, a: number) => a * Math.exp(-((x - c) ** 2) / (2 * w * w));
    return clampSignal(0.16 * field(x * 2.3 + t * 0.5) + blob(c1, 0.075, 0.82) - blob(c2, 0.05, 0.55) + blob((c1 + c2) / 2, 0.035, 0.3));
  },
  // Mobile — handshakes: double pings riding a quiet carrier.
  mobile: (x, t) => {
    const beat = (offset: number) => Math.sin((x * 3.2 - t * 0.5 + offset) * Math.PI * 2);
    return clampSignal(Math.max(0, beat(0)) ** 42 * 0.92 + Math.max(0, beat(0.16)) ** 60 * 0.5 - 0.14 + 0.05 * field(x * 4 + t));
  },
  // Backend — a clocked bus: disciplined square carrier with faint jitter.
  backend: (x, t) =>
    clampSignal(0.52 * Math.sign(Math.sin(x * 18.8 - t * 1.15)) + 0.26 * Math.sign(Math.sin(x * 4.7 + t * 0.38)) + 0.045 * field(x * 6 + t * 1.4)),
  // Cloud — deploy ramps: climb, hold, verify, rollback notch, reset.
  "cloud-devops": (x, t) => {
    const u = (x * 2.6 + t * 0.16) % 1;
    const ramp = u < 0.58 ? -0.42 + (u / 0.58) * 1.12 : 0.7;
    const notch = u > 0.78 && u < 0.87 ? -0.3 : 0;
    return clampSignal(ramp + notch + 0.035 * field(x * 3 + t * 0.6));
  },
};

export const ENGINE_NOTES: Record<string, { freq: string; note: string }> = {
  product: { freq: "2.4 HZ", note: "SURFACE ASSEMBLY" },
  ai: { freq: "0.4 HZ", note: "PROBABILISTIC FIELD" },
  mobile: { freq: "1.1 HZ", note: "PULSE BURST" },
  backend: { freq: "3.0 HZ", note: "CLOCKED BUS" },
  "cloud-devops": { freq: "0.2 HZ", note: "DEPLOY RAMPS" },
};

export const easeInOut = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
export const signalFor = (id: string) => SIGNALS[id] ?? SIGNALS.product;

export type TraceGeom = { samples: number; w: number; h: number; amp: number };

/** Path for the blend of two signals across the given viewport geometry. */
export function tracePath(from: Signal, to: Signal, blend: number, t: number, { samples, w, h, amp }: TraceGeom) {
  const cy = h / 2;
  const e = easeInOut(blend);
  let d = "";
  for (let i = 0; i <= samples; i++) {
    const x = i / samples;
    const y = from(x, t) * (1 - e) + to(x, t) * e;
    d += `${i ? "L" : "M"}${(x * w).toFixed(1)} ${(cy - y * amp).toFixed(1)}`;
  }
  return d;
}
