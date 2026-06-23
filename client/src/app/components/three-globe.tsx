/**
 * ThreeGlobe — Realistic 3D Earth for GPS location overlay
 * Based on: https://github.com/SaraRasoulian/3D-Earth
 * Ported to React Three Fiber with phase-based animations
 *
 * Features:
 *  • Textured Earth sphere (earthmap.jpg)
 *  • Night lights layer (earth_lights.png, additive blending)
 *  • Cloud layer (cloud_combined.jpg, additive blending)
 *  • Fresnel atmosphere glow (custom ShaderMaterial)
 *  • Star field particles
 *  • Location pin on Vietnam
 *  • Phase animations: scanning → zooming → done
 */

import { useRef, useMemo, Suspense, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { PerspectiveCamera, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "../../hooks/useIsMobile";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Phase = "scanning" | "zooming" | "done";

// ─── Fresnel Material (atmosphere glow) ────────────────────────────────────────
function createFresnelMat({
  rimHex = 0x3abef9,
  facingHex = 0x000000,
} = {}) {
  const uniforms = {
    color1: { value: new THREE.Color(rimHex) },
    color2: { value: new THREE.Color(facingHex) },
    fresnelBias: { value: 0.2 },
    fresnelScale: { value: 1.0 },
    fresnelPower: { value: 8.0 },
  };

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      uniform float fresnelBias;
      uniform float fresnelScale;
      uniform float fresnelPower;
      varying float vReflectionFactor;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
        vec3 I = worldPosition.xyz - cameraPosition;
        vReflectionFactor = fresnelBias + fresnelScale * pow(1.0 + dot(normalize(I), worldNormal), fresnelPower);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      varying float vReflectionFactor;
      void main() {
        float f = clamp(vReflectionFactor, 0.0, 1.0);
        gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
}

// ─── Helper: lat/lon to 3D position ────────────────────────────────────────────
function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// ─── Earth Group (sphere + lights + clouds + glow) ─────────────────────────────
function EarthGroup({ phase }: { phase: Phase }) {
  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const lightsRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Load textures with cache-busting for reliability
  const earthMap = useLoader(THREE.TextureLoader, "/textures/earth/earthmap.jpg");
  const lightsMap = useLoader(THREE.TextureLoader, "/textures/earth/earth_lights.png");
  const cloudsMap = useLoader(THREE.TextureLoader, "/textures/earth/cloud_combined.jpg");

  // Geometry — lower detail on mobile
  const isMobile = useIsMobile();
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, isMobile ? 5 : 8), [isMobile]);

  // Materials
  const earthMat = useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        map: earthMap,
      }),
    [earthMap]
  );

  const lightsMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: lightsMap,
        blending: THREE.AdditiveBlending,
      }),
    [lightsMap]
  );

  const cloudsMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: cloudsMap,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      }),
    [cloudsMap]
  );

  const fresnelMat = useMemo(() => createFresnelMat(), []);

  // Scale animation
  const targetScale = useRef(1);
  const currentScale = useRef(1);

  useEffect(() => {
    if (phase === "scanning") targetScale.current = 1;
    else if (phase === "zooming") targetScale.current = 2.2;
    else targetScale.current = 3.5;
  }, [phase]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Quay nhẹ nhàng và luôn giữ Việt Nam (Châu Á) ở mặt trước
    const targetRotY = (-196.7 * Math.PI) / 180; // Góc xoay để Việt Nam hướng về Camera
    if (earthRef.current) {
      if (phase === "scanning") {
         earthRef.current.rotation.y = targetRotY + Math.sin(Date.now() * 0.001) * 0.2;
      } else {
         earthRef.current.rotation.y = THREE.MathUtils.lerp(earthRef.current.rotation.y, targetRotY, delta * 3);
      }
    }
    if (lightsRef.current) lightsRef.current.rotation.y = earthRef.current ? earthRef.current.rotation.y : 0;
    if (cloudsRef.current) cloudsRef.current.rotation.y = earthRef.current ? earthRef.current.rotation.y + 0.05 : 0;
    if (glowRef.current) glowRef.current.rotation.y = earthRef.current ? earthRef.current.rotation.y : 0;

    // Smooth scale transition
    currentScale.current = THREE.MathUtils.lerp(
      currentScale.current,
      targetScale.current,
      delta * 1.2
    );
    groupRef.current.scale.setScalar(currentScale.current);

    // Float during scanning
    if (phase === "scanning") {
      groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.08;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, 0, (-23.4 * Math.PI) / 180]}>
      {/* Earth surface */}
      <mesh ref={earthRef} geometry={geometry} material={earthMat}>
         <LocationPin3D phase={phase} />
      </mesh>

      {/* Night lights */}
      <mesh ref={lightsRef} geometry={geometry} material={lightsMat} />

      {/* Clouds */}
      <mesh ref={cloudsRef} geometry={geometry} material={cloudsMat} scale={1.003} />

      {/* Atmosphere glow (Fresnel) */}
      <mesh ref={glowRef} geometry={geometry} material={fresnelMat} scale={1.01} />
    </group>
  );
}

function LocationPin3D({ phase }: { phase: Phase }) {
  const pinRef = useRef<THREE.Group>(null);
  // Thủ Đức, Quận 9: lat 10.8382, lon 106.7799
  const pinPos = useMemo(() => latLonToVec3(10.8382, 106.7799, 1.03), []);
  const pinNormal = useMemo(() => pinPos.clone().normalize(), [pinPos]);

  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pinNormal);
    return q;
  }, [pinNormal]);

  useFrame(() => {
    if (!pinRef.current || phase === "done") return;
    if (phase === "scanning") {
      const bounce = Math.abs(Math.sin(Date.now() * 0.003)) * 0.08;
      pinRef.current.position.copy(
        pinPos.clone().add(pinNormal.clone().multiplyScalar(bounce))
      );
    }
  });

  if (phase === "done") return null;

  return (
    <group ref={pinRef} position={pinPos} quaternion={quaternion}>
      {/* Pin shaft */}
      <mesh position={[0, 0.06, 0]}>
        <coneGeometry args={[0.035, 0.12, 8]} />
        <meshPhongMaterial
          color="#ef4444"
          emissive="#b91c1c"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Pin head */}
      <mesh position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshPhongMaterial
          color="#ef4444"
          emissive="#dc2626"
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* Pin glow */}
      <pointLight
        position={[0, 0.18, 0]}
        color="#ef4444"
        intensity={2}
        distance={0.8}
        decay={2}
      />
    </group>
  );
}

// ─── Scan Rings ────────────────────────────────────────────────────────────────
function ScanRings({ phase }: { phase: Phase }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  const ringGeo = useMemo(
    () => new THREE.RingGeometry(1.3, 1.33, 64),
    []
  );

  useFrame(() => {
    if (phase !== "scanning") return;
    const t = Date.now() * 0.001;

    [ring1Ref, ring2Ref, ring3Ref].forEach((ref, i) => {
      if (!ref.current) return;
      const offset = i * 0.85;
      const cycle = ((t + offset) * 0.4) % 1;
      const scale = 1 + cycle * 1.5;
      ref.current.scale.setScalar(scale);
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - cycle) * 0.3;
    });
  });

  if (phase !== "scanning") return null;

  return (
    <>
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]} geometry={ringGeo}>
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]} geometry={ringGeo}>
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ring3Ref} rotation={[Math.PI / 2, 0, 0]} geometry={ringGeo}>
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

// ─── Orbit Ring ────────────────────────────────────────────────────────────────
function OrbitRing({ phase }: { phase: Phase }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z += delta * 0.5;
    ringRef.current.rotation.x += delta * 0.15;
  });

  if (phase === "done") return null;

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
      <torusGeometry args={[1.6, 0.008, 8, 100]} />
      <meshBasicMaterial
        color="#38bdf8"
        transparent
        opacity={phase === "scanning" ? 0.25 : 0.1}
      />
    </mesh>
  );
}

// ─── Satellite Dot ─────────────────────────────────────────────────────────────
function SatelliteDot({ phase }: { phase: Phase }) {
  const dotRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!dotRef.current || phase !== "scanning") return;
    const t = Date.now() * 0.0008;
    const r = 1.6;
    dotRef.current.position.set(
      Math.cos(t) * r,
      Math.sin(t * 0.6) * r * 0.5,
      Math.sin(t) * r
    );
  });

  if (phase !== "scanning") return null;

  return (
    <mesh ref={dotRef}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#fbbf24" />
      <pointLight color="#fbbf24" intensity={0.8} distance={0.5} decay={2} />
    </mesh>
  );
}

// ─── Star Field (matching the original repo pattern) ───────────────────────────
function StarField({ phase }: { phase: Phase }) {
  const starsRef = useRef<THREE.Points>(null);
  const isMobile = useIsMobile();
  const numStars = isMobile ? 300 : 800;

  const { positions, colors } = useMemo(() => {
    const verts: number[] = [];
    const cols: number[] = [];
    for (let i = 0; i < numStars; i++) {
      const radius = Math.random() * 25 + 25;
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      verts.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      const col = new THREE.Color().setHSL(0.6, 0.4, Math.random());
      cols.push(col.r, col.g, col.b);
    }
    return {
      positions: new Float32Array(verts),
      colors: new Float32Array(cols),
    };
  }, []);

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y -= delta * 0.01;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.15}
        transparent
        opacity={phase === "done" ? 0 : phase === "zooming" ? 0.4 : 0.8}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Camera Controller ─────────────────────────────────────────────────────────
function GlobeCamera({ phase }: { phase: Phase }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const targetZ = useRef(5);

  useEffect(() => {
    if (phase === "scanning") targetZ.current = 5;
    else if (phase === "zooming") targetZ.current = 3;
    else targetZ.current = 1.8;
  }, [phase]);

  useFrame((_, delta) => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = THREE.MathUtils.lerp(
      cameraRef.current.position.z,
      targetZ.current,
      delta * 1.5
    );
    if (phase === "scanning") {
      const t = Date.now() * 0.0003;
      cameraRef.current.position.x = Math.sin(t) * 0.2;
      cameraRef.current.position.y = Math.cos(t * 0.7) * 0.15;
    }
    cameraRef.current.lookAt(0, 0, 0);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={45}
      position={[0, 0, 5]}
      near={0.1}
      far={1000}
    />
  );
}

// ─── Loading Fallback ──────────────────────────────────────────────────────────
function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 4]} />
      <meshBasicMaterial
        color="#1e88e5"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

// ─── Error Boundary for Three.js ──────────────────────────────────────────────
import { Component, type ReactNode, type ErrorInfo } from "react";

class GlobeErrorBoundary extends Component<
  { children: ReactNode; onRetry?: () => void },
  { hasError: boolean; errorCount: number }
> {
  constructor(props: { children: ReactNode; onRetry?: () => void }) {
    super(props);
    this.state = { hasError: false, errorCount: 0 };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Globe loading error:", error.message, errorInfo);
  }

  handleRetry = () => {
    this.setState((prev) => ({ hasError: false, errorCount: prev.errorCount + 1 }));
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🌍</div>
            <p className="text-sm text-slate-400 mb-3">Không thể tải địa cầu 3D</p>
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}
            >
              Thử lại
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Main Export ───────────────────────────────────────────────────────────────
export function ThreeGlobe({
  phase = "scanning",
  className = "",
}: {
  phase: Phase;
  className?: string;
}) {
  const [retryKey, setRetryKey] = useState(0);
  const handleRetry = useCallback(() => setRetryKey((k) => k + 1), []);
  const isMobile = useIsMobile();

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        inset: 0,
      }}
    >
      <GlobeErrorBoundary onRetry={handleRetry}>
        <Canvas
          key={retryKey}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.LinearSRGBColorSpace,
          }}
          style={{ background: "transparent" }}
          dpr={isMobile ? [1, 1] : [1, 1.5]}
          onCreated={({ gl }) => {
            // Ensure the context is not lost silently
            const canvas = gl.domElement;
            canvas.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              console.warn("WebGL context lost — globe will retry");
            });
            canvas.addEventListener("webglcontextrestored", () => {
              console.info("WebGL context restored");
            });
          }}
        >
          <GlobeCamera phase={phase} />

          {/* Sunlight — matching original position */}
          <directionalLight
            position={[-2.2, 0.7, 1.6]}
            intensity={2.0}
            color="#ffffff"
          />

          <Suspense fallback={<LoadingFallback />}>
            <EarthGroup phase={phase} />
            <ScanRings phase={phase} />
            <OrbitRing phase={phase} />
            <SatelliteDot phase={phase} />
            <StarField phase={phase} />

            {phase === "scanning" && (
              <Sparkles
                count={isMobile ? 8 : 20}
                scale={5}
                size={1}
                speed={0.3}
                opacity={0.3}
                color="#38bdf8"
              />
            )}
          </Suspense>
        </Canvas>
      </GlobeErrorBoundary>
    </div>
  );
}
