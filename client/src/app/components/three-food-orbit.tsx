/**
 * ThreeFoodOrbit — Full Three.js food showcase replacing FoodScene3D
 * Features:
 *  • 3D geometric food proxies (icosahedra, dodecahedra, torus knots) orbiting
 *  • Central glowing hero orb with distort material
 *  • Holographic label chips as HTML overlays via @react-three/drei Html
 *  • Mouse-driven camera tilt
 *  • Particle dust field
 *  • Click to open/close with rotation reset
 *
 * MOBILE: Shows animated CSS food cards instead of WebGL
 */

import { useRef, useMemo, Suspense, useEffect, useState } from "react";
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
import { useIsMobile } from "../../hooks/useIsMobile";

// Mobile 3D Configuration
const getMobile3DConfig = (isMobile: boolean) => ({
  pixelRatio: isMobile ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio,
  antialias: !isMobile,
  shadows: !isMobile,
  particleCount: isMobile ? 30 : 100,
  trailLength: isMobile ? 10 : 20,
  orbitSpeed: isMobile ? 0.7 : 1,
});

// Memory cleanup utility
const disposeObject = (obj: THREE.Object3D) => {
  if (obj instanceof THREE.Mesh) {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach(mat => mat.dispose());
      } else {
        obj.material.dispose();
      }
    }
  }
  obj.children.forEach(child => disposeObject(child));
};

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
function OrbitingFood({ 
  item, 
  index, 
  isOpen, 
  onClick 
}: { 
  item: typeof FOOD_ITEMS[0]; 
  index: number;
  isOpen: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const isMobile = useIsMobile();
  const config = getMobile3DConfig(isMobile);
  const pivot = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (isOpen) {
      // Khi mở: dừng xoay, về vị trí ban đầu
      const targetX = Math.cos(item.phase) * item.orbitR;
      const targetZ = Math.sin(item.phase) * item.orbitR * 0.55;
      const targetY = Math.sin(item.phase * 0.7 + index) * 0.6;
      
      if (groupRef.current) {
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.1);
      }
      if (meshRef.current) {
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.1);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1);
      }
    } else {
      // Khi đóng: tiếp tục xoay
      const angle = item.phase + t * item.speed * config.orbitSpeed;
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
    }
    void pivot;
  });

  const color = item.color;
  const emissiveIntensity = 0.5;

  return (
    <group ref={groupRef} onClick={onClick}>
      <Float speed={isOpen ? 0.5 : 2} floatIntensity={isOpen ? 0.05 : 0.2} rotationIntensity={0}>
        {/* 3D Mesh proxy */}
        {item.shape === "ico" && (
          <mesh ref={meshRef}>
            <icosahedronGeometry args={[isOpen ? 0.35 : 0.28, 0]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isOpen ? emissiveIntensity * 1.5 : emissiveIntensity}
              roughness={0.15}
              metalness={0.5}
              transparent
              opacity={isOpen ? 1 : 0.85}
            />
          </mesh>
        )}
        {item.shape === "oct" && (
          <Octahedron ref={meshRef} args={[isOpen ? 0.38 : 0.3]}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isOpen ? emissiveIntensity * 1.5 : emissiveIntensity}
              roughness={0.1}
              metalness={0.6}
              transparent
              opacity={isOpen ? 1 : 0.85}
            />
          </Octahedron>
        )}
        {item.shape === "tk" && (
          <TorusKnot ref={meshRef} args={[isOpen ? 0.22 : 0.18, 0.07, 32, 8]}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isOpen ? emissiveIntensity * 1.2 : emissiveIntensity * 0.7}
              roughness={0.2}
              metalness={0.4}
              transparent
              opacity={isOpen ? 1 : 0.82}
            />
          </TorusKnot>
        )}
        
        {/* Hiển thị label khi mở */}
        {isOpen && (
          <Html center distanceFactor={3} style={{ pointerEvents: "none" }}>
            <div
              style={{
                background: "rgba(0,0,0,0.85)",
                backdropFilter: "blur(12px)",
                border: `2px solid ${color}`,
                borderRadius: 12,
                padding: "8px 16px",
                color: "white",
                fontSize: 13,
                fontWeight: 700,
                whiteSpace: "nowrap",
                boxShadow: `0 8px 32px ${color}40`,
              }}
            >
              {item.emoji} {item.label}
            </div>
          </Html>
        )}
      </Float>
    </group>
  );
}

// ─── Central Hero Orb ─────────────────────────────────────────────────────────
function HeroOrb({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  const orbRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (orbRef.current) {
      if (isOpen) {
        orbRef.current.rotation.y = THREE.MathUtils.lerp(orbRef.current.rotation.y, 0, 0.1);
        orbRef.current.rotation.z = THREE.MathUtils.lerp(orbRef.current.rotation.z, 0, 0.1);
      } else {
        orbRef.current.rotation.y = t * 0.2;
        orbRef.current.rotation.z = t * 0.1;
      }
    }
    if (ringRef.current) {
      if (isOpen) {
        ringRef.current.rotation.x = THREE.MathUtils.lerp(ringRef.current.rotation.x, 0, 0.1);
        ringRef.current.rotation.z = THREE.MathUtils.lerp(ringRef.current.rotation.z, 0, 0.1);
      } else {
        ringRef.current.rotation.x = t * 0.3;
        ringRef.current.rotation.z = t * 0.15;
      }
    }
  });

  return (
    <group onClick={onClick}>
      {/* Outer glow sphere */}
      <Sphere args={[isOpen ? 1.3 : 1.12, 16, 16]}>
        <meshStandardMaterial
          color="#fb923c"
          emissive="#fb923c"
          emissiveIntensity={isOpen ? 0.25 : 0.15}
          transparent
          opacity={isOpen ? 0.12 : 0.08}
          roughness={0}
          metalness={0}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Main orb - simplified from MeshDistortMaterial */}
      <Sphere ref={orbRef} args={[isOpen ? 1.0 : 0.85, 24, 24]}>
        <meshStandardMaterial
          color="#fb923c"
          emissive="#f97316"
          emissiveIntensity={isOpen ? 0.6 : 0.4}
          roughness={0.05}
          metalness={0.5}
          transparent
          opacity={isOpen ? 0.9 : 0.75}
        />
      </Sphere>

      {/* Inner core - simplified from MeshWobbleMaterial */}
      <Sphere args={[isOpen ? 0.65 : 0.55, 16, 16]}>
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={isOpen ? 0.8 : 0.6}
          transparent
          opacity={isOpen ? 0.75 : 0.6}
          roughness={0.1}
          metalness={0.3}
        />
      </Sphere>

      {/* Spinning ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[isOpen ? 1.5 : 1.3, 0.025, 12, 48]} />
        <meshStandardMaterial
          color="#fb923c"
          emissive="#fb923c"
          emissiveIntensity={isOpen ? 1.2 : 0.9}
          transparent
          opacity={isOpen ? 0.7 : 0.5}
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
              fontSize: isOpen ? 16 : 13,
              fontWeight: 900,
              background: "linear-gradient(90deg, #fb923c, #fbbf24)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.05em",
              marginBottom: 2,
              transition: "font-size 0.3s ease",
            }}
          >
            MealYummy AI
          </div>
          <div style={{ 
            fontSize: isOpen ? 12 : 10, 
            color: "rgba(251,146,60,0.65)", 
            fontWeight: 600,
            transition: "font-size 0.3s ease",
          }}>
            {isOpen ? "🍲 Click để đóng" : "Món ngon mỗi ngày ✨"}
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
  const isMobile = useIsMobile();
  const config = getMobile3DConfig(isMobile);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // On mobile: keep 3D but reduce elements
  const activeFoods = isMobile ? FOOD_ITEMS.slice(0, 4) : FOOD_ITEMS;

  const handleToggle = (index?: number) => {
    if (index !== undefined) {
      // Click vào món ăn
      if (selectedIndex === index && isOpen) {
        // Đang mở món này -> đóng lại
        setIsOpen(false);
        setSelectedIndex(null);
      } else {
        // Mở món mới
        setIsOpen(true);
        setSelectedIndex(index);
      }
    } else {
      // Click vào hero orb
      setIsOpen(!isOpen);
      setSelectedIndex(null);
    }
  };

  // Memory cleanup
  useEffect(() => {
    return () => {
      // Cleanup will be handled by individual components
    };
  }, []);

  return (
    <div className={`relative ${className}`} style={{ height: isMobile ? 340 : 460 }}>
      <Canvas
        gl={{ 
          antialias: config.antialias, 
          alpha: true, 
          powerPreference: "high-performance" 
        }}
        style={{ background: "transparent", cursor: "pointer" }}
        dpr={[1, config.pixelRatio]}
      >
        <PerspectiveCamera makeDefault fov={isMobile ? 60 : 55} position={[0, 1, 8]} />
        <CameraRig />

        {/* Lights — fewer on mobile */}
        <ambientLight intensity={isMobile ? 0.3 : 0.4} />
        <pointLight position={[5, 5, 5]} intensity={isMobile ? 1.2 : 1.5} color="#fb923c" />
        {!isMobile && <pointLight position={[-5, -5, -3]} intensity={0.8} color="#f97316" />}
        {!isMobile && <pointLight position={[0, 8, 2]} intensity={0.5} color="#fbbf24" />}

        <Suspense fallback={null}>
          <HeroOrb isOpen={isOpen && selectedIndex === null} onClick={() => handleToggle()} />
          {activeFoods.map((item, i) => (
            <OrbitingFood 
              key={i} 
              item={item} 
              index={i} 
              isOpen={isOpen && selectedIndex === i}
              onClick={() => handleToggle(i)}
            />
          ))}
          {/* Orbit trails — skip on mobile or when open */}
          {!isMobile && !isOpen && activeFoods.map((item, i) => (
            <OrbitTrail
              key={i}
              radius={item.orbitR}
              speed={item.speed}
              phase={item.phase}
              color={item.color}
            />
          ))}
          {/* Particle dust — skip on mobile or when open */}
          {!isMobile && !isOpen && <ParticleDust />}
        </Suspense>
      </Canvas>
      
      {/* Instruction text */}
      <div 
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)",
          padding: "8px 16px",
          borderRadius: 8,
          fontSize: 12,
          color: "rgba(251,146,60,0.9)",
          fontWeight: 600,
          pointerEvents: "none",
          border: "1px solid rgba(251,146,60,0.3)",
        }}
      >
        {isOpen ? "🍲 Click để đóng và xoay tiếp" : "✨ Click vào món ăn để xem chi tiết"}
      </div>
    </div>
  );
}
