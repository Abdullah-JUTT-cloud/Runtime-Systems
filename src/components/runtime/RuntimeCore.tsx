import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import { RuntimeFallback } from "./RuntimeFallback";

const points: [number, number, number][] = [
  [-2.1, 0.9, 0.1], [-1.55, -1.3, -0.2], [-0.6, 1.7, -0.8], [0.9, 1.55, 0.2],
  [1.95, 0.45, -0.5], [1.45, -1.35, 0.25], [0.2, -1.8, -0.9], [-2.25, -0.35, -0.6],
];

function CoreAssembly() {
  const group = useRef<Group>(null);
  const innerRing = useRef<Group>(null);
  const outerArcs = useRef<Group>(null);
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.09;
      group.current.rotation.x += (state.pointer.y * 0.12 - group.current.rotation.x) * 0.035;
      group.current.rotation.z += (-state.pointer.x * 0.08 - group.current.rotation.z) * 0.035;
    }
    if (innerRing.current) innerRing.current.rotation.z += delta * 0.14;
    if (outerArcs.current) outerArcs.current.rotation.z -= delta * 0.08;
  });
  return (
    <group ref={group}>
      <Float speed={1.15} rotationIntensity={0.16} floatIntensity={0.28}>
        {/* porcelain core */}
        <mesh>
          <sphereGeometry args={[0.74, 64, 64]} />
          <meshPhysicalMaterial color="#f8f5ee" metalness={0.05} roughness={0.22} clearcoat={1} clearcoatRoughness={0.3} transmission={0.06} thickness={1.4} emissive="#ff4b2b" emissiveIntensity={0.03} />
        </mesh>
        {/* system wireframe shell */}
        <mesh>
          <sphereGeometry args={[0.88, 18, 14]} />
          <meshBasicMaterial color="#1d1d1b" wireframe transparent opacity={0.13} />
        </mesh>
      </Float>

      {/* full inner orbit */}
      <group ref={innerRing}>
        <mesh rotation={[0.5, 0.4, 0.2]}>
          <torusGeometry args={[1.06, 0.016, 8, 96]} />
          <meshBasicMaterial color="#171717" />
        </mesh>
      </group>

      {/* partial outer arcs — signal + steel */}
      <group ref={outerArcs}>
        <mesh rotation={[-0.3, -0.2, 1.1]}>
          <torusGeometry args={[1.36, 0.015, 8, 110, Math.PI * 1.45]} />
          <meshBasicMaterial color="#ff4b2b" />
        </mesh>
        <mesh rotation={[1.2, 0.6, -0.4]}>
          <torusGeometry args={[1.66, 0.01, 8, 120, Math.PI * 1.1]} />
          <meshBasicMaterial color="#b7b5ae" />
        </mesh>
      </group>

      {points.map((position, index) => <RuntimeNode key={index} position={position} index={index} />)}
      {points.map((position, index) => <Line key={`line-${index}`} points={[[0, 0, 0], position]} color={index % 3 === 0 ? "#ff4b2b" : "#c9c7bf"} lineWidth={index % 3 === 0 ? 1.4 : 0.7} transparent opacity={0.75} />)}
      <DataPacket radius={1.36} speed={0.5} />
      <DataPacket radius={2.1} speed={-0.25} />
      <Sparkles count={34} scale={[4.6, 3.4, 3]} size={2.4} speed={0.35} color="#ff4b2b" opacity={0.5} />
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

function DataPacket({ radius, speed }: { radius: number; speed: number }) {
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime * speed;
    mesh.current.position.set(Math.cos(t) * radius, Math.sin(t * 1.2) * radius * 0.55, Math.sin(t) * radius * 0.4);
  });
  return <mesh ref={mesh}><sphereGeometry args={[0.045, 12, 12]} /><meshBasicMaterial color="#ff4b2b" /></mesh>;
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
  if (!supportsWebGL || reduced || constrained) return <RuntimeFallback />;
  return (
    <div className="runtime-core" aria-label="Interactive Runtime Core visualization">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6.1], fov: 42 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={2.4} />
        <directionalLight position={[4, 4, 6]} intensity={4.5} color="#ffffff" />
        <directionalLight position={[-4, -2, 3]} intensity={2.5} color="#ff8065" />
        <pointLight position={[1.8, 1.2, 2.4]} intensity={14} distance={9} decay={2} color="#ff4b2b" />
        <CoreAssembly />
      </Canvas>
      <div className="core-readout core-readout--a"><span>CORE / 01</span><b>PROCESSING</b></div>
      <div className="core-readout core-readout--b"><span>NODE / 08</span><b>SYNCHRONIZED</b></div>
    </div>
  );
}
