/**
 * ThreeRobotScene — Burger with Robot Chef as patty
 * - Proper dome buns (not flying saucer)
 * - Tomato + Lettuce layers
 * - XY drag = true 360° viewing
 * - Auto-rotate Y
 */
import { useRef, useMemo, Suspense, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, PerspectiveCamera, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { AnimatePresence, motion } from "motion/react";


// ─── Top Bun ──────────────────────────────────────────────────────────────────
// Key: no side cylinder. Just a sphere half + sealing disc. Tall enough to look like a dome.
function TopBun({ open }: { open: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame(s => {
    if (!g.current) return;
    g.current.position.y = THREE.MathUtils.lerp(g.current.position.y, open ? 3.0 : 1.65, 0.1);
    g.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.4) * 0.01;
  });

  // sesame seeds: (theta=polar from top, phi=azimuth)
  const seeds = useMemo(() => [
    [0.18, 0], [0.32, 1.1], [0.30, 2.4], [0.33, 3.7], [0.31, 5.0],
    [0.48, 0.5], [0.46, 1.9], [0.47, 3.2], [0.45, 4.5], [0.49, 5.8],
    [0.60, 1.0], [0.58, 2.6], [0.61, 4.2],
  ] as [number, number][], []);

  const R = 1.15, W = 1.75, H = 1.05; // H>1 keeps dome tall

  return (
    <group ref={g} position={[0, 1.65, 0]}>
      {/* Dome */}
      <mesh scale={[W, H, W]}>
        <sphereGeometry args={[R, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e8a020" roughness={0.62} metalness={0} />
      </mesh>
      {/* Flat underside */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R * W, 64]} />
        <meshStandardMaterial color="#c07818" roughness={0.72} />
      </mesh>
      {/* Sesame seeds */}
      {seeds.map(([th, ph], i) => {
        const x = R * W * Math.sin(th) * Math.cos(ph);
        const y = R * H * Math.cos(th);
        const z = R * W * Math.sin(th) * Math.sin(ph);
        const n = new THREE.Vector3(x / W, y / H, z / W).normalize();
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
        return (
          <mesh key={i} position={[x, y, z]} quaternion={q}>
            <capsuleGeometry args={[0.025, 0.068, 4, 8]} />
            <meshStandardMaterial color="#f0dfa8" roughness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Bottom Bun ───────────────────────────────────────────────────────────────
// Flat heel — shorter dome, slightly wider, no skirt
function BottomBun({ open }: { open: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame(s => {
    if (!g.current) return;
    g.current.position.y = THREE.MathUtils.lerp(g.current.position.y, open ? -3.0 : -1.72, 0.1);
    g.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.4 + 1.2) * 0.01;
  });
  const R = 1.15, W = 1.88, H = 0.42;
  return (
    <group ref={g} position={[0, -1.72, 0]}>
      {/* Flat top face */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R * W, 64]} />
        <meshStandardMaterial color="#d98018" roughness={0.6} />
      </mesh>
      {/* Short dome bottom */}
      <mesh scale={[W, H, W]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[R, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#b87010" roughness={0.72} />
      </mesh>
    </group>
  );
}

// ─── Tomato Slice ─────────────────────────────────────────────────────────────
function TomatoSlice({ open }: { open: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!g.current) return;
    g.current.position.y = THREE.MathUtils.lerp(g.current.position.y, open ? 2.5 : 1.55, 0.1);
  });
  return (
    <group ref={g} position={[0, 0.9, 0]}>
      {/* Red body */}
      <mesh>
        <cylinderGeometry args={[1.52, 1.52, 0.28, 64]} />
        <meshStandardMaterial color="#dc2626" roughness={0.42} emissive="#7f1d1d" emissiveIntensity={0.12} />
      </mesh>
      {/* Flesh tone top face */}
      <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, 1.5, 64]} />
        <meshStandardMaterial color="#fca5a5" roughness={0.5} transparent opacity={0.6} />
      </mesh>
      {/* Centre core */}
      <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.28, 32]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.5} />
      </mesh>
    </group>
  );
}

// ─── Lettuce ──────────────────────────────────────────────────────────────────
// Flat wavy disc sticking out beyond bun edge
function Lettuce({ open }: { open: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame(s => {
    if (!g.current) return;
    g.current.position.y = THREE.MathUtils.lerp(g.current.position.y, open ? -2.1 : -1.22, 0.1);
    g.current.rotation.y = s.clock.elapsedTime * 0.07;
  });

  // Custom wavy disc geometry
  const geo = useMemo(() => {
    const g2 = new THREE.BufferGeometry();
    const segs = 72, innerR = 0.55, outerR = 2.05;
    const verts: number[] = [], uvs: number[] = [], idx: number[] = [];
    // center + inner ring + outer wavy ring
    verts.push(0, 0, 0); uvs.push(0.5, 0.5);
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      const wave = Math.sin(a * 7) * 0.12;
      // inner
      verts.push(Math.cos(a) * innerR, 0, Math.sin(a) * innerR);
      uvs.push(0.5 + Math.cos(a) * 0.25, 0.5 + Math.sin(a) * 0.25);
      // outer wavy
      verts.push(Math.cos(a) * (outerR + wave), wave * 0.5, Math.sin(a) * (outerR + wave));
      uvs.push(0.5 + Math.cos(a) * 0.5, 0.5 + Math.sin(a) * 0.5);
    }
    for (let i = 0; i < segs; i++) {
      const b = 1 + i * 2, n = 1 + (i + 1) * 2;
      idx.push(0, b, n);          // center fan
      idx.push(b, b + 1, n);        // inner→outer quad A
      idx.push(n, b + 1, n + 1);      // inner→outer quad B
    }
    g2.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    g2.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    g2.setIndex(idx);
    g2.computeVertexNormals();
    return g2;
  }, []);

  return (
    <group ref={g} position={[0, -0.92, 0]}>
      <mesh geometry={geo}>
        <meshStandardMaterial color="#22c55e" roughness={0.78} side={THREE.DoubleSide}
          emissive="#14532d" emissiveIntensity={0.1} />
      </mesh>
      {/* Second layer slightly offset */}
      <mesh geometry={geo} position={[0, -0.06, 0]} rotation={[0, 1.1, 0]}>
        <meshStandardMaterial color="#16a34a" roughness={0.82} side={THREE.DoubleSide}
          emissive="#052e16" emissiveIntensity={0.08} />
      </mesh>
    </group>
  );
}

// ─── Glow ring around robot ───────────────────────────────────────────────────
function GlowRing({ hovered }: { hovered: boolean }) {
  const r = useRef<THREE.Mesh>(null);
  useFrame(s => {
    if (!r.current) return;
    (r.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      hovered ? 0.9 + Math.sin(s.clock.elapsedTime * 3) * 0.25
        : 0.4 + Math.sin(s.clock.elapsedTime * 1.5) * 0.08;
  });
  return (
    <mesh ref={r} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.32, 1.44, 64]} />
      <meshStandardMaterial color="#a3e635" emissive="#a3e635" emissiveIntensity={0.45}
        transparent opacity={0.75} />
    </mesh>
  );
}

// ─── Continuous X-axis spin wrapper ──────────────────────────────────────────
function BurgerSpinX({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) {
      // Smooth, frame-rate-independent full 360° loop on X
      groupRef.current.rotation.x += delta * 0.35;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

// ─── Star burst ───────────────────────────────────────────────────────────────
function StarBurst({ trigger }: { trigger: number }) {
  return (
    <AnimatePresence>
      {trigger > 0 && [0, 40, 80, 120, 160, 200, 240, 280, 320].map((a, i) => {
        const rad = a * Math.PI / 180, d = 90 + (i % 3) * 24;
        return (
          <motion.div key={`${trigger}-${i}`} className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{ zIndex: 30 }}
            initial={{ x: -5, y: -5, scale: 0, opacity: 1 }}
            animate={{ x: Math.cos(rad) * d - 5, y: Math.sin(rad) * d - 5, scale: [0, 1.5, 0], opacity: [1, 1, 0] }}
            transition={{ duration: 0.7, delay: i * 0.04, ease: "easeOut" }}>
            <svg width="14" height="14" viewBox="0 0 16 16">
              <path d="M8 0 L9.4 6.6 L16 8 L9.4 9.4 L8 16 L6.6 9.4 L0 8 L6.6 6.6 Z"
                fill={["#a3e635", "#fbbf24", "#fb923c", "#4ade80", "#fde68a", "#22d3ee"][i % 6]} />
            </svg>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}

// ─── Robot (patty center) — real 3D textured mesh ──────────────────────────────
const TOTAL = 98, FPS = 18;

function RobotCenter({ frame, hovered, onHover, onLeave, onClick }: {
  frame: number; hovered: boolean; onHover: () => void; onLeave: () => void;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Offscreen canvas + texture (created once)
  const canvasEl = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512; c.height = 512;
    return c;
  }, []);
  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvasEl);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [canvasEl]);

  // Draw current robot frame onto canvas (circular clip)
  useEffect(() => {
    const src = `/robot-frames/ezgif-frame-${String((frame % TOTAL) + 1).padStart(3, "0")}.jpg`;
    const img = new Image();
    img.onload = () => {
      const ctx = canvasEl.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, 512, 512);
      ctx.save();
      ctx.beginPath();
      ctx.arc(256, 256, 256, 0, Math.PI * 2);
      ctx.clip();
      // objectPosition "50% 35%" equivalent: shift source up
      const sh = img.height, sw = img.width;
      const scale = Math.max(512 / sw, 512 / sh);
      const dw = sw * scale, dh = sh * scale;
      const dx = (512 - dw) / 2;
      const dy = (512 - dh) * 0.35;
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
      texture.needsUpdate = true;
    };
    img.src = src;
  }, [frame, canvasEl, texture]);

  // Gentle bobbing
  useFrame(s => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(
        s.clock.elapsedTime * (hovered ? 1.6 : 0.7)
      ) * (hovered ? 0.07 : 0.03);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Robot image as a real 3D circle — additive blend mimics mix-blend-mode:screen */}
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); onHover(); }}
        onPointerOut={(e) => { e.stopPropagation(); onLeave(); }}
        onClick={(e) => { e.stopPropagation(); if (!orbit.moved) onClick(); }}
      >
        <circleGeometry args={[1.4, 64]} />
        <meshBasicMaterial
          map={texture}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Glow ring around the robot */}
      <mesh position={[0, 0, 0.02]}>
        <ringGeometry args={[1.35, 1.48, 64]} />
        <meshBasicMaterial
          color="#a3e635"
          transparent
          opacity={hovered ? 0.85 : 0.4}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Outer glow (softer, bigger) */}
      {hovered && (
        <mesh position={[0, 0, 0.01]}>
          <ringGeometry args={[1.4, 1.8, 64]} />
          <meshBasicMaterial
            color="#a3e635"
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function ThreeRobotScene({ className = "" }: { className?: string }) {
  const [frame, setFrame] = useState(0);
  const frameRef = useRef(0); const rafRef = useRef(0); const lastRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [burst, setBurst] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    Array.from({ length: TOTAL }, (_, i) => `/robot-frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`)
      .forEach(s => { const i = new Image(); i.src = s; });
  }, []);

  useEffect(() => {
    const loop = (ts: number) => {
      if (ts - lastRef.current >= 1000 / FPS) {
        frameRef.current = (frameRef.current + 1) % TOTAL;
        setFrame(frameRef.current);
        lastRef.current = ts;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleClick = useCallback(() => {
    setBurst(b => b + 1); setShowText(true);
    setTimeout(() => setShowText(false), 2400);
  }, []);

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}
      style={{ width: "100%", height: 480, cursor: "grab" }}>

      <Canvas gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0, background: "transparent" }} dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault fov={46} position={[0, 0.55, 9]} />

        {/* OrbitControls: full 360° drag rotation + auto-rotate */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.8}
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={0.3}
          maxPolarAngle={Math.PI - 0.3}
          target={[0, 0.1, 0]}
        />

        <ambientLight intensity={0.6} color="#fff4e0" />
        <directionalLight position={[0, 10, 5]} intensity={3.2} color="#fff8e7" />
        <pointLight position={[-3, 4, 5]} intensity={1.2} color="#fde68a" />
        <pointLight position={[3, 3, 5]} intensity={0.9} color="#fbbf24" />
        <pointLight position={[0, -2, 4]} intensity={0.5} color="#fed7aa" />

        <Suspense fallback={null}>
          <Float speed={0.7} floatIntensity={0.18} rotationIntensity={0}>
            <BurgerSpinX>
              <TopBun open={hovered} />
              <TomatoSlice open={hovered} />
              <GlowRing hovered={hovered} />
              <Lettuce open={hovered} />
              <BottomBun open={hovered} />

              {/* Robot as real 3D mesh patty — rotates with burger naturally */}
              <RobotCenter frame={frame} hovered={hovered}
                onHover={() => setHovered(true)} onLeave={() => setHovered(false)}
                onClick={handleClick} />
            </BurgerSpinX>
          </Float>

          <Sparkles count={20} scale={[3, 4.5, 3]} size={1} speed={0.3} opacity={0.45} color="#fbbf24" />
        </Suspense>
      </Canvas>

      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <StarBurst trigger={burst} />
        <AnimatePresence>
          {showText && (
            <motion.div key="lbl" initial={{ opacity: 0, y: 30, scale: 0.5 }}
              animate={{ opacity: 1, y: -185, scale: 1 }} exit={{ opacity: 0, y: -220, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 480, damping: 20 }}
              className="absolute pointer-events-none">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl" style={{
                background: "rgba(8,14,8,0.92)", border: "1.5px solid rgba(163,230,53,0.65)",
                backdropFilter: "blur(14px)",
                boxShadow: "0 8px 36px rgba(0,0,0,0.55),0 0 20px rgba(163,230,53,0.2)",
              }}>
                <span className="text-xl">🍔</span>
                <span className="text-xl font-black" style={{
                  background: "linear-gradient(90deg,#a3e635,#4ade80)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>MealYummy!</span>
                <span className="text-xl">✨</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {!hovered && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.65 }} exit={{ opacity: 0 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-slate-500 whitespace-nowrap">
              🔄 Kéo để xoay 360° · Hover mở · Click nảy
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
