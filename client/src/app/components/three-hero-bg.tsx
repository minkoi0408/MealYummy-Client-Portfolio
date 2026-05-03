/**
 * ThreeHeroBg — Food-themed Three.js background for hero section
 * Features:
 *  • Floating 3D ingredient spheres (tomato, lemon, avocado, blueberry …)
 *  • Spice / powder particle dust
 *  • Steam wisps rising from below
 *  • Gentle camera drift
 *
 * MOBILE: Replaced with pure CSS animated background (no WebGL)
 */

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, PerspectiveCamera, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "../../hooks/useIsMobile";

// ─── Ingredient catalogue ─────────────────────────────────────────────────────
const INGREDIENTS = [
  // tomatoes
  { color: "#ef4444", emissive: "#b91c1c", r: 0.28, pos: [-5.5,  1.2, -3.0] as [number,number,number], speed: 1.4, delay: 0   },
  { color: "#ef4444", emissive: "#b91c1c", r: 0.18, pos: [ 5.2, -1.8, -4.5] as [number,number,number], speed: 1.8, delay: 1.3 },
  // lemons
  { color: "#fbbf24", emissive: "#d97706", r: 0.24, pos: [ 4.5,  2.0, -2.5] as [number,number,number], speed: 1.2, delay: 0.5 },
  { color: "#fcd34d", emissive: "#f59e0b", r: 0.15, pos: [-4.0, -2.5, -3.8] as [number,number,number], speed: 2.0, delay: 0.9 },
  // avocados / broccoli
  { color: "#4ade80", emissive: "#16a34a", r: 0.30, pos: [-3.5,  2.8, -5.0] as [number,number,number], speed: 0.9, delay: 0.2 },
  { color: "#22c55e", emissive: "#15803d", r: 0.20, pos: [ 3.0,  3.0, -4.0] as [number,number,number], speed: 1.5, delay: 1.1 },
  // blueberries
  { color: "#818cf8", emissive: "#4338ca", r: 0.16, pos: [ 5.8,  0.5, -3.5] as [number,number,number], speed: 1.7, delay: 0.7 },
  { color: "#a78bfa", emissive: "#7c3aed", r: 0.12, pos: [-5.0,  0.0, -2.8] as [number,number,number], speed: 2.2, delay: 1.5 },
  // carrots / orange
  { color: "#fb923c", emissive: "#c2410c", r: 0.22, pos: [ 2.0, -2.8, -4.2] as [number,number,number], speed: 1.3, delay: 0.3 },
  { color: "#f97316", emissive: "#ea580c", r: 0.17, pos: [-2.5,  3.2, -6.0] as [number,number,number], speed: 1.6, delay: 1.0 },
  // strawberries
  { color: "#f43f5e", emissive: "#be123c", r: 0.14, pos: [ 1.0,  2.6, -3.0] as [number,number,number], speed: 2.0, delay: 0.6 },
  // garlic / onion – whites
  { color: "#e2e8f0", emissive: "#94a3b8", r: 0.19, pos: [-1.5, -3.0, -5.5] as [number,number,number], speed: 1.1, delay: 1.8 },
];

// ─── Single ingredient sphere ──────────────────────────────────────────────────
function Ingredient({ data }: { data: typeof INGREDIENTS[0] }) {
  return (
    <Float
      speed={data.speed}
      floatIntensity={0.7}
      rotationIntensity={0.5}
    >
      <Sphere args={[data.r, 12, 12]} position={data.pos}>
        <meshStandardMaterial
          color={data.color}
          emissive={data.emissive}
          emissiveIntensity={0.35}
          roughness={0.25}
          metalness={0.15}
        />
      </Sphere>
    </Float>
  );
}

// ─── Steam wisps (rising planes) ──────────────────────────────────────────────
function SteamWisp({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const x = (index - 2) * 1.4;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + index * 1.3;
    const cycle = (t * 0.28) % 1; // 0→1 loop
    ref.current.position.y = -3 + cycle * 5;
    ref.current.position.x = x + Math.sin(t * 0.9) * 0.4;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    // fade in then out
    mat.opacity = cycle < 0.2
      ? cycle / 0.2 * 0.18
      : cycle > 0.7
      ? (1 - (cycle - 0.7) / 0.3) * 0.18
      : 0.18;
    ref.current.scale.x = 0.3 + cycle * 1.0;
    ref.current.scale.y = 0.3 + cycle * 0.8;
  });

  return (
    <mesh ref={ref} position={[x, -3, -2]}>
      <sphereGeometry args={[0.4, 8, 8]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#a3e635"
        emissiveIntensity={0.05}
        transparent
        opacity={0.12}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

// ─── Spice dust particles ─────────────────────────────────────────────────────
function SpiceDust() {
  const count = 80;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 3;
    }
    return arr;
  }, []);

  const colors = useMemo(() => {
    const palette = [
      new THREE.Color("#ef4444"),
      new THREE.Color("#fbbf24"),
      new THREE.Color("#4ade80"),
      new THREE.Color("#fb923c"),
      new THREE.Color("#f43f5e"),
      new THREE.Color("#a3e635"),
    ];
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const c = palette[i % palette.length];
      arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.018;
      ref.current.rotation.x = state.clock.elapsedTime * 0.008;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.055}
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Gentle camera drift ───────────────────────────────────────────────────────
function CameraRig() {
  const camera = useRef<THREE.PerspectiveCamera>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (camera.current) {
      camera.current.position.x = Math.sin(t * 0.04) * 0.5;
      camera.current.position.y = Math.cos(t * 0.035) * 0.3;
      camera.current.lookAt(0, 0, 0);
    }
  });
  return <PerspectiveCamera ref={camera} makeDefault fov={62} position={[0, 0, 7]} />;
}

// ─── Mobile CSS Fallback (animated gradient blobs, zero WebGL) ─────────────────
function MobileHeroBg({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    >
      {/* Animated lime glow blob */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "30%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(163,230,53,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "floatBlob1 8s ease-in-out infinite",
        }}
      />
      {/* Animated emerald glow blob */}
      <div
        style={{
          position: "absolute",
          bottom: "25%",
          right: "25%",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)",
          filter: "blur(35px)",
          animation: "floatBlob2 10s ease-in-out infinite",
        }}
      />
      {/* Subtle golden accent */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "60%",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)",
          filter: "blur(30px)",
          animation: "floatBlob3 12s ease-in-out infinite",
        }}
      />
      {/* Dot pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: "radial-gradient(circle, #a3e635 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      <style>{`
        @keyframes floatBlob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
        }
        @keyframes floatBlob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25px, -30px) scale(1.15); }
        }
        @keyframes floatBlob3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 25px); }
        }
      `}</style>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────
export function ThreeHeroBg({ className = "" }: { className?: string }) {
  const isMobile = useIsMobile();

  // On mobile: render lightweight CSS blobs instead of WebGL
  if (isMobile) {
    return <MobileHeroBg className={className} />;
  }

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    >
      <Canvas
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <CameraRig />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[6, 4, 3]} intensity={1.2} color="#fbbf24" />
        <pointLight position={[-6, -2, 2]} intensity={0.8} color="#4ade80" />
        <pointLight position={[0, 6, 0]} intensity={0.6} color="#fb923c" />

        <Suspense fallback={null}>
          {/* Ingredient spheres */}
          {INGREDIENTS.map((d, i) => (
            <Ingredient key={i} data={d} />
          ))}

          {/* Steam wisps */}
          {[0, 1, 2].map((i) => (
            <SteamWisp key={i} index={i} />
          ))}

          {/* Spice particle dust */}
          <SpiceDust />

          {/* Tiny golden sparkles */}
          <Sparkles
            count={20}
            scale={10}
            size={1.4}
            speed={0.3}
            opacity={0.5}
            color="#fbbf24"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
