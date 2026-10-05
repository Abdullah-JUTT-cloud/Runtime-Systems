import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import { AdditiveBlending, MathUtils } from "three";
import { RuntimeFallback } from "./RuntimeFallback";

const points: [number, number, number][] = [
  [-2.1, 0.9, 0.1], [-1.55, -1.3, -0.2], [-0.6, 1.7, -0.8], [0.9, 1.55, 0.2],
  [1.95, 0.45, -0.5], [1.45, -1.35, 0.25], [0.2, -1.8, -0.9], [-2.25, -0.35, -0.6],
];

/** Selective node-to-node links — a quiet constellation around the core. */
const links: [number, number][] = [[0, 2], [1, 5], [2, 3], [4, 7], [5, 6], [3, 4]];

function circlePoints(radius: number, segments = 128): [number, number, number][] {
  return Array.from({ length: segments + 1 }, (_, i) => {
    const angle = (i / segments) * Math.PI * 2;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius, 0];
  });
}

/** The heart of the core: a signal-red glowing nucleus inside the glass shell. */
function Nucleus() {
  const mesh = useRef<Mesh>(null);
  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * 0.7;
    mesh.current.rotation.x += delta * 0.3;
    mesh.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.09);
  });
  return (
    <group>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.19, 1]} />
        <meshStandardMaterial color="#ff4b2b" emissive="#ff4b2b" emissiveIntensity={2.4} roughness={0.3} metalness={0.05} />
      </mesh>
      <mesh scale={1.9}>
        <sphereGeometry args={[0.19, 16, 16]} />
        <meshBasicMaterial color="#ff4b2b" transparent opacity={0.12} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh scale={2.9}>
        <sphereGeometry args={[0.19, 16, 16]} />
        <meshBasicMaterial color="#ff4b2b" transparent opacity={0.04} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Layered instrument shells: geodesic + meridian wireframes and an armillary band. */
function Shells() {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y -= delta * 0.05;
  });
  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[0.87, 1]} />
        <meshBasicMaterial color="#1d1d1b" wireframe transparent opacity={0.15} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.97, 28, 18]} />
        <meshBasicMaterial color="#1d1d1b" wireframe transparent opacity={0.06} />
      </mesh>
      <mesh rotation={[1.15, 0.25, 0.1]}>
        <torusGeometry args={[0.93, 0.006, 8, 128]} />
        <meshBasicMaterial color="#ff4b2b" transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[0.35, 0.9, 0.65]}>
        <torusGeometry args={[1.0, 0.004, 8, 128]} />
        <meshBasicMaterial color="#1d1d1b" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[1.9, -0.4, 0.2]}>
        <torusGeometry args={[1.0, 0.004, 8, 128]} />
        <meshBasicMaterial color="#1d1d1b" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function CoreAssembly() {
  const group = useRef<Group>(null);
  const innerRing = useRef<Group>(null);
  const dashedRing = useRef<Group>(null);
  const outerArcs = useRef<Group>(null);
  // Cursor follow: window-level pointermove (the canvas sits behind hero
  // content, so R3F's state.pointer is unreliable), eased in useFrame.
  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerCurrent = useRef({ x: 0, y: 0 });
  const baseSpin = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const onMove = (event: PointerEvent) => {
      pointerTarget.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const current = pointerCurrent.current;
    current.x = MathUtils.damp(current.x, pointerTarget.current.x, 4, delta);
    current.y = MathUtils.damp(current.y, pointerTarget.current.y, 4, delta);
    baseSpin.current += delta * 0.09;
    if (group.current) {
      group.current.rotation.y = baseSpin.current + current.x * 0.5;
      group.current.rotation.x = current.y * 0.3;
      group.current.rotation.z = -current.x * 0.08;
    }
    if (innerRing.current) innerRing.current.rotation.z += delta * 0.14;
    if (dashedRing.current) dashedRing.current.rotation.z -= delta * 0.1;
    if (outerArcs.current) outerArcs.current.rotation.z -= delta * 0.08;
  });
  return (
    <group ref={group}>
      <Float speed={1.15} rotationIntensity={0.16} floatIntensity={0.28}>
        {/* glassy shell — alpha-blended so the nucleus reads through it */}
        <mesh renderOrder={2}>
          <sphereGeometry args={[0.68, 64, 64]} />
          <meshPhysicalMaterial color="#faf7f0" transparent opacity={0.52} metalness={0.02} roughness={0.18} clearcoat={1} clearcoatRoughness={0.25} />
        </mesh>
        <Nucleus />
        <Shells />
      </Float>

      {/* full inner orbit */}
      <group ref={innerRing}>
        <mesh rotation={[0.5, 0.4, 0.2]}>
          <torusGeometry args={[1.1, 0.014, 8, 128]} />
          <meshBasicMaterial color="#171717" />
        </mesh>
      </group>

      {/* dashed data orbit, tilted against the rest */}
      <group ref={dashedRing} rotation={[0.6, 0.2, 0]}>
        <Line points={circlePoints(1.27)} color="#1d1d1b" lineWidth={0.8} dashed dashSize={0.07} gapSize={0.05} transparent opacity={0.5} />
      </group>

      {/* full outer orbits — signal + steel + ink */}
      <group ref={outerArcs}>
        <mesh rotation={[-0.3, -0.2, 1.1]}>
          <torusGeometry args={[1.38, 0.014, 8, 128]} />
          <meshBasicMaterial color="#ff4b2b" />
        </mesh>
        <mesh rotation={[1.2, 0.6, -0.4]}>
          <torusGeometry args={[1.68, 0.009, 8, 128]} />
          <meshBasicMaterial color="#b7b5ae" />
        </mesh>
        <mesh rotation={[0.4, 1.3, 0.5]}>
          <torusGeometry args={[1.52, 0.008, 8, 128]} />
          <meshBasicMaterial color="#1d1d1b" transparent opacity={0.4} />
        </mesh>
      </group>

      {points.map((position, index) => <RuntimeNode key={index} position={position} index={index} />)}
      {points.map((position, index) => <Line key={`spoke-${index}`} points={[[0, 0, 0], position]} color={index % 3 === 0 ? "#ff4b2b" : "#c9c7bf"} lineWidth={index % 3 === 0 ? 1.2 : 0.6} transparent opacity={0.55} />)}
      {links.map(([a, b], index) => <Line key={`link-${index}`} points={[points[a], points[b]]} color="#1d1d1b" lineWidth={0.5} transparent opacity={0.2} />)}
      <DataPacket radius={1.38} speed={0.5} />
      <DataPacket radius={2.1} speed={-0.25} color="#1d1d1b" />
      <Sparkles count={30} scale={[4.6, 3.4, 3]} size={2.2} speed={0.32} color="#ff4b2b" opacity={0.45} />
      <Sparkles count={18} scale={[5.2, 3.8, 3.4]} size={1.6} speed={0.2} color="#1d1d1b" opacity={0.25} />
    </group>
  );
}

function RuntimeNode({ position, index }: { position: [number, number, number]; index: number }) {
  const group = useRef<Group>(null);
  const halo = useRef<Mesh>(null);
  const signal = index === 4;
  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.55;
    if (halo.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + index * 1.3) * 0.14;
      halo.current.scale.setScalar((signal ? 2.7 : 2.2) * pulse);
    }
  });
  return (
    <group ref={group} position={position}>
      <mesh>
        <octahedronGeometry args={index % 2 === 0 ? [0.14, 0] : [0.1, 0]} />
        <meshStandardMaterial color={signal ? "#ff4b2b" : "#1d1d1b"} roughness={0.3} metalness={0.15} emissive={signal ? "#ff4b2b" : "#000000"} emissiveIntensity={signal ? 0.35 : 0} />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshBasicMaterial color="#ff4b2b" transparent opacity={signal ? 0.18 : 0.04} />
      </mesh>
    </group>
  );
}

function DataPacket({ radius, speed, color = "#ff4b2b" }: { radius: number; speed: number; color?: string }) {
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime * speed;
    mesh.current.position.set(Math.cos(t) * radius, Math.sin(t * 1.2) * radius * 0.55, Math.sin(t) * radius * 0.4);
  });
  return <mesh ref={mesh}><sphereGeometry args={[0.045, 12, 12]} /><meshBasicMaterial color={color} /></mesh>;
}

export function RuntimeCore() {
  const supportsWebGL = useMemo(() => {
    try {
      const canvas = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch { return false; }
  }, []);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const constrained = window.innerWidth < 720 || window.matchMedia("(pointer: coarse)").matches;
  if (!supportsWebGL || reduced) return <RuntimeFallback />;
  return (
    <div className="runtime-core" aria-label="Interactive Runtime Core visualization">
      {/* DOM reticle framing the canvas — precision-instrument styling */}
      <span className="runtime-reticle" aria-hidden="true">
        <i className="runtime-reticle__sweep" />
        <i className="runtime-reticle__ring" />
        <i className="runtime-reticle__ticks" />
        <b /><b /><b /><b />
      </span>
      {/* On small/touch screens the same scene renders into the smaller hero
          box; the camera pulls back so the full assembly stays in frame. */}
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, constrained ? 7.4 : 6.1], fov: 42 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={2.4} />
        <directionalLight position={[4, 4, 6]} intensity={4.5} color="#ffffff" />
        <directionalLight position={[-4, -2, 3]} intensity={2.5} color="#ff8065" />
        <directionalLight position={[-2, 3, -5]} intensity={1.6} color="#9fb8c8" />
        <pointLight position={[1.8, 1.2, 2.4]} intensity={14} distance={9} decay={2} color="#ff4b2b" />
        <CoreAssembly />
      </Canvas>
    </div>
  );
}
