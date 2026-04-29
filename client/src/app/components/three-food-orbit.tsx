/**
 * ThreeFoodOrbit — Full Three.js food showcase replacing FoodScene3D
 * Features:
 *  • 3D geometric food proxies (icosahedra, dodecahedra, torus knots) orbiting
 *  • Central glowing hero orb with distort material
 *  • Holographic label chips as HTML overlays via @react-three/drei Html
 *  • Mouse-driven camera tilt
 *  • Particle dust field
 */

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Html,
  Sphere,
  TorusKnot,
  Octahedron,
  PerspectiveCamera,
  Trail,
} from "@react-three/drei";
import * as THREE from "three";

// ─── Orbiting food proxy meshes ───────────────────────────────────────────────
const FOOD_ITEMS = [
  { emoji: "🍜", label: "Phở bò",     orbitR: 3.2,  speed: 0.28, phase: 0,            color: "#fb923c", shape: "ico"   },
  { emoji: "🥗", label: "Salad",       orbitR: 2.6,  speed: -0.22, phase: Math.PI*0.4, color: "#4ade80", shape: "oct"   },
  { emoji: "🍱", label: "Bento",       orbitR: 3.8,  speed: 0.18, phase: Math.PI*0.8,  color: "#60a5fa", shape: "tk"    },
  { emoji: "🍛", label: "Cà ri",       orbitR: 3.0,  speed: -0.32, phase: Math.PI*1.2, color: "#fbbf24", shape: "ico"   },
  { emoji: "🥩", label: "Thịt nướng", orbitR: 3.5,  speed: 0.25, phase: Math.PI*1.6,  color: "#f472b6", shape: "oct"   },
  { emoji: "🫙", label: "Healthy",     orbitR: 2.8,  speed: -0.20, phase: Math.PI*0.6, color: "#a78bfa", shape: "tk"    },
];

// ─── Single Orbiting Object ───────────────────────────────────────────────────
function OrbitingFood({ item, index }: { item: typeof FOOD_ITEMS[0]; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const pivot = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const angle = item.phase + t * item.speed;
    // Elliptical orbit (x, y slightly)
    const x = Math.cos(angle) * item.orbitR;
    const z = Math.sin(angle) * item.orbitR * 0.55;
    const y = Math.sin(angle * 0.7 + index) * 0.6;

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
    }
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.4 + index;
      meshRef.current.rotation.y = t * 0.3;
    }
    void pivot;
  });

  const color = item.color;
  const emissiveIntensity = 0.5;

  return (
    <group ref={groupRef}>
      <Float speed={2} floatIntensity={0.2} rotationIntensity={0}>
        {/* 3D Mesh proxy */}
        {item.shape === "ico" && (
          <mesh ref={meshRef}>
            <icosahedronGeometry args={[0.28, 0]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={emissiveIntensity}
              roughness={0.15}
              metalness={0.5}
              transparent
              opacity={0.85}
            />
          </mesh>
        )}
        {item.shape === "oct" && (
          <Octahedron ref={meshRef} args={[0.3]}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={emissiveIntensity}
              roughness={0.1}
              metalness={0.6}
              transparent
              opacity={0.85}
            />
          </Octahedron>
        )}
        {item.shape === "tk" && (
          <TorusKnot ref={meshRef} args={[0.18, 0.07, 32, 8]}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={emissiveIntensity * 0.7}
              roughness={0.2}
              metalness={0.4}
              transparent
              opacity={0.82}
            />
          </TorusKnot>
        )}
      </Float>
    </group>
  );
}

// ─── Central Hero Orb ─────────────────────────────────────────────────────────
function HeroOrb() {
  const orbRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (orbRef.current) {
      orbRef.current.rotation.y = t * 0.2;
      orbRef.current.rotation.z = t * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.3;
      ringRef.current.rotation.z = t * 0.15;
    }
  });

  return (
    <group>
      {/* Outer glow sphere */}
      <Sphere args={[1.12, 16, 16]}>
        <meshStandardMaterial
          color="#fb923c"
          emissive="#fb923c"
          emissiveIntensity={0.15}
          transparent
          opacity={0.08}
          roughness={0}
          metalness={0}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Main orb - simplified from MeshDistortMaterial */}
      <Sphere ref={orbRef} args={[0.85, 24, 24]}>
        <meshStandardMaterial
          color="#fb923c"
          emissive="#f97316"
          emissiveIntensity={0.4}
          roughness={0.05}
          metalness={0.5}
          transparent
          opacity={0.75}
        />
      </Sphere>

      {/* Inner core - simplified from MeshWobbleMaterial */}
      <Sphere args={[0.55, 16, 16]}>
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.6}
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.3}
        />
      </Sphere>

      {/* Spinning ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.3, 0.025, 12, 48]} />
        <meshStandardMaterial
          color="#fb923c"
          emissive="#fb923c"
          emissiveIntensity={0.9}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* HTML center label */}
      <Html center distanceFactor={4} style={{ pointerEvents: "none" }}>
        <div
          style={{
            textAlign: "center",
            userSelect: "none",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 900,
              background: "linear-gradient(90deg, #fb923c, #fbbf24)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.05em",
              marginBottom: 2,
            }}
          >
            MealYummy AI
          </div>
          <div style={{ fontSize: 10, color: "rgba(251,146,60,0.65)", fontWeight: 600 }}>
            Món ngon mỗi ngày ✨
          </div>
        </div>
      </Html>
    </group>
  );
}

// ─── Orbit Trail paths ────────────────────────────────────────────────────────
function OrbitTrail({ radius, speed, phase, color }: { radius: number; speed: number; phase: number; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const angle = phase + t * speed;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius * 0.55;
    const y = Math.sin(angle * 0.7) * 0.6;
    if (meshRef.current) {
      meshRef.current.position.set(x, y, z);
    }
  });

  return (
    <Trail
      width={0.06}
      length={8}
      color={color}
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.01]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </Trail>
  );
}

// ─── Particle Dust ────────────────────────────────────────────────────────────
function ParticleDust() {
  const count = 60;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.025;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#fbbf24"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Camera mouse drift ───────────────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, Math.sin(t * 0.06) * 0.8, 0.012);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, Math.cos(t * 0.05) * 0.4, 0.012);
    camera.lookAt(0, 0, 0);
  });
  return null;
}



// ─── Main ThreeFoodOrbit Component ────────────────────────────────────────────
export function ThreeFoodOrbit({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ height: 460 }}>
      <Canvas
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <PerspectiveCamera makeDefault fov={55} position={[0, 1, 8]} />
        <CameraRig />

        {/* Lights */}
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#fb923c" />
        <pointLight position={[-5, -5, -3]} intensity={0.8} color="#f97316" />
        <pointLight position={[0, 8, 2]} intensity={0.5} color="#fbbf24" />

        <Suspense fallback={null}>
          <HeroOrb />
          {FOOD_ITEMS.map((item, i) => (
            <OrbitingFood key={i} item={item} index={i} />
          ))}
          {FOOD_ITEMS.map((item, i) => (
            <OrbitTrail
              key={i}
              radius={item.orbitR}
              speed={item.speed}
              phase={item.phase}
              color={item.color}
            />
          ))}
          <ParticleDust />
        </Suspense>
      </Canvas>
    </div>
  );
}
