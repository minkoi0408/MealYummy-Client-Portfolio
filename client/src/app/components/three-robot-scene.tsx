/**
 * ThreeRobotScene — GLB Hamburger with Robot Chef AI as the patty
 * Click → burger opens + rotation stops (watch video)
 * Release → burger closes + auto-rotate 360° resumes
 *
 * MOBILE: Shows a static robot image with CSS animations instead of full 3D
 */
import { useRef, useMemo, Suspense, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Sparkles, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { AnimatePresence, motion } from "motion/react";
import { useIsMobile } from "../../hooks/useIsMobile";

// ─── GLB Hamburger ────────────────────────────────────────────────────────────
function HamburgerModel({ open, onModelInfo }: {
  open: boolean;
  onModelInfo?: (info: { pattyY: number; pattyRadius: number; center: THREE.Vector3 }) => void;
}) {
  const { scene } = useGLTF("/models/hamburger.glb");

  const { topMeshes, bottomMeshes, pattyY, pattyRadius, center } = useMemo(() => {
    const top: THREE.Object3D[] = [];
    const bottom: THREE.Object3D[] = [];
    let pY = 0, pR = 1.5;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.envMapIntensity = 3;
        child.material.needsUpdate = true;
      }
    });

    const cloned = scene.clone(true);
    const allMeshes: { mesh: THREE.Mesh; centerY: number; name: string }[] = [];
    cloned.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const box = new THREE.Box3().setFromObject(child);
      allMeshes.push({ mesh: child, centerY: (box.min.y + box.max.y) / 2, name: child.name.toLowerCase() });
    });
    allMeshes.sort((a, b) => a.centerY - b.centerY);

    // Find the model's vertical center for auto-centering
    const fullBox = new THREE.Box3();
    allMeshes.forEach(m => fullBox.expandByObject(m.mesh));
    const modelCenter = new THREE.Vector3();
    fullBox.getCenter(modelCenter);

    const midY = modelCenter.y;
    let pattyMesh: THREE.Mesh | null = null;

    // Name-based detection
    for (const m of allMeshes) {
      if (m.name.includes("meat") || m.name.includes("patty") || m.name.includes("beef")) {
        pattyMesh = m.mesh; pY = m.centerY; break;
      }
    }
    // Fallback: closest to center
    if (!pattyMesh && allMeshes.length >= 3) {
      let minDist = Infinity;
      for (const m of allMeshes) {
        const d = Math.abs(m.centerY - midY);
        if (d < minDist) { minDist = d; pattyMesh = m.mesh; pY = m.centerY; }
      }
    }

    if (pattyMesh) {
      const pb = new THREE.Box3().setFromObject(pattyMesh);
      pR = Math.max(pb.max.x - pb.min.x, pb.max.z - pb.min.z) / 2;
      pattyMesh.visible = false;
    }

    for (const m of allMeshes) {
      if (m.mesh === pattyMesh) continue;
      (m.centerY > pY + 0.1 ? top : bottom).push(m.mesh);
    }

    return { topMeshes: top, bottomMeshes: bottom, pattyY: pY, pattyRadius: pR, center: modelCenter };
  }, [scene]);

  useEffect(() => {
    if (onModelInfo) onModelInfo({ pattyY, pattyRadius, center });
  }, [pattyY, pattyRadius, center, onModelInfo]);

  const topRef = useRef<THREE.Group>(null);
  const bottomRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (topRef.current) {
      topRef.current.position.y = THREE.MathUtils.lerp(topRef.current.position.y, open ? 3.0 : 0, 0.08);
    }
    if (bottomRef.current) {
      bottomRef.current.position.y = THREE.MathUtils.lerp(bottomRef.current.position.y, open ? -2.5 : 0, 0.08);
    }
  });

  // offsetY centers the model vertically (computed from bounding box)
  return (
    <group position={[-center.x, -center.y, -center.z]}>
      <group ref={topRef}>
        {topMeshes.map((mesh, i) => <primitive key={`t${i}`} object={mesh} />)}
      </group>
      <group ref={bottomRef}>
        {bottomMeshes.map((mesh, i) => <primitive key={`b${i}`} object={mesh} />)}
      </group>
    </group>
  );
}

useGLTF.preload("/models/hamburger.glb");

// ─── Robot Screen ─────────────────────────────────────────────────────────────
const TOTAL = 98, FPS = 18;

function RobotScreen({ frame, hovered, onHover, onLeave, onClick, worldPattyY, screenW }: {
  frame: number; hovered: boolean;
  onHover: () => void; onLeave: () => void; onClick: () => void;
  worldPattyY: number; screenW: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const screenH = screenW * 1.5;
  const depth = 0.06;

  // Canvas for robot animation
  const canvasEl = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256; c.height = 384;
    return c;
  }, []);
  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvasEl);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [canvasEl]);

  useEffect(() => {
    const src = `/robot-frames/ezgif-frame-${String((frame % TOTAL) + 1).padStart(3, "0")}.jpg`;
    const img = new Image();
    img.onload = () => {
      const ctx = canvasEl.getContext("2d");
      if (!ctx) return;
      const W = canvasEl.width, H = canvasEl.height;
      ctx.clearRect(0, 0, W, H);
      // Dark gradient bg
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#0a0a1a"); g.addColorStop(0.5, "#0f1423"); g.addColorStop(1, "#0a0a1a");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // Robot image
      const sc = Math.max(W / img.width, H / img.height);
      const dw = img.width * sc, dh = img.height * sc;
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      // Vignette
      const v = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.7);
      v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,0.4)");
      ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
      // Branding
      ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(0, H - 60, W, 60);
      ctx.font = "bold 22px 'Inter', sans-serif"; ctx.fillStyle = "#a3e635";
      ctx.textAlign = "center"; ctx.fillText("🍔 MealYummy AI", W / 2, H - 25);
      texture.needsUpdate = true;
    };
    img.src = src;
  }, [frame, canvasEl, texture]);

  useFrame(s => {
    if (groupRef.current) {
      groupRef.current.position.y = worldPattyY + Math.sin(s.clock.elapsedTime * (hovered ? 1.6 : 0.7)) * (hovered ? 0.04 : 0.02);
    }
  });

  return (
    <group ref={groupRef} position={[0, worldPattyY, 0]}>
      {/* Frame body */}
      <mesh onPointerOver={e => { e.stopPropagation(); onHover(); }}
        onPointerOut={e => { e.stopPropagation(); onLeave(); }}
        onClick={e => { e.stopPropagation(); onClick(); }}>
        <boxGeometry args={[screenW + 0.06, screenH + 0.06, depth]} />
        <meshStandardMaterial color="#111827" metalness={0.85} roughness={0.15}
          emissive="#0a0a1a" emissiveIntensity={0.2} />
      </mesh>
      {/* Front */}
      <mesh position={[0, 0, depth / 2 + 0.001]}>
        <planeGeometry args={[screenW, screenH]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0, -(depth / 2 + 0.001)]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[screenW, screenH]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* Glow edges */}
      {([
        { p: [0, (screenH + 0.06) / 2, 0], s: [screenW + 0.08, 0.02, depth + 0.02] },
        { p: [0, -(screenH + 0.06) / 2, 0], s: [screenW + 0.08, 0.02, depth + 0.02] },
        { p: [-(screenW + 0.06) / 2, 0, 0], s: [0.02, screenH + 0.06, depth + 0.02] },
        { p: [(screenW + 0.06) / 2, 0, 0], s: [0.02, screenH + 0.06, depth + 0.02] },
      ] as { p: [number, number, number]; s: [number, number, number] }[]).map((e, i) => (
        <mesh key={i} position={e.p}>
          <boxGeometry args={e.s} />
          <meshStandardMaterial color="#a3e635" emissive="#a3e635"
            emissiveIntensity={hovered ? 1.5 : 0.5} metalness={0.7} roughness={0.2} />
        </mesh>
      ))}
      <pointLight position={[0, 0, 0.4]} color="#a3e635" intensity={hovered ? 1.5 : 0.4} distance={2.5} decay={2} />
      <pointLight position={[0, 0, -0.4]} color="#a3e635" intensity={hovered ? 1.0 : 0.3} distance={2.5} decay={2} />
    </group>
  );
}


// Separate wrapper that loads model info first
function BurgerSceneWrapper({ frame, hovered, setHovered, handleClick }: {
  frame: number; hovered: boolean; setHovered: (v: boolean) => void; handleClick: () => void;
}) {
  const [modelInfo, setModelInfo] = useState<{ pattyY: number; pattyRadius: number; center: THREE.Vector3 } | null>(null);
  const handleModelInfo = useCallback((info: { pattyY: number; pattyRadius: number; center: THREE.Vector3 }) => {
    setModelInfo(prev => {
      if (prev && prev.pattyY === info.pattyY && prev.pattyRadius === info.pattyRadius
        && prev.center?.equals(info.center)) return prev;
      return info;
    });
  }, []);

  const groupRef = useRef<THREE.Group>(null);

  // X-axis rotation: spin when idle, lerp to front-facing when hovered
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (hovered) {
      // Smoothly reset rotation so robot screen faces camera
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.08);
    } else {
      // Continuous 360° vertical flip
      groupRef.current.rotation.x += delta * 0.8;
    }
  });

  const SCALE = 0.4;
  const cy = modelInfo?.center?.y ?? 0;
  const worldPattyY = modelInfo ? (modelInfo.pattyY - cy) * SCALE : 0;
  const screenW = modelInfo ? modelInfo.pattyRadius * SCALE * 0.85 : 0.5;

  return (
    // Outer group: handles rotation — pivot is at origin (= geometric center of model)
    <group ref={groupRef}>
      {/* Inner group: scales and contains the centered model */}
      <group scale={SCALE}>
        <HamburgerModel open={hovered} onModelInfo={handleModelInfo} />
      </group>

      {/* Robot screen — world coords, at patty height */}
      <RobotScreen
        frame={frame} hovered={hovered}
        onHover={() => setHovered(true)}
        onLeave={() => setHovered(false)}
        onClick={handleClick}
        worldPattyY={worldPattyY}
        screenW={screenW}
      />
    </group>
  );
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

// ─── Mobile Fallback: Static robot image with CSS animations ──────────────────
function MobileRobotScene({ className = "" }: { className?: string }) {
  const [burst, setBurst] = useState(0);
  const [showText, setShowText] = useState(false);

  const handleTap = useCallback(() => {
    setBurst(b => b + 1);
    setShowText(true);
    setTimeout(() => setShowText(false), 2400);
  }, []);

  return (
    <div className={`relative select-none ${className}`}
      style={{ width: "100%", height: 340, cursor: "pointer" }}
      onClick={handleTap}
    >
      {/* Glow background */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(163,230,53,0.15) 0%, transparent 70%)",
          animation: "pulseGlow 3s ease-in-out infinite",
        }} />
      </div>

      {/* Robot frame image — use first frame */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          width: 160,
          height: 240,
          borderRadius: 20,
          overflow: "hidden",
          border: "2px solid rgba(163,230,53,0.4)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(163,230,53,0.15)",
          animation: "mobileFloat 4s ease-in-out infinite",
        }}>
          <img
            src="/robot-frames/ezgif-frame-001.jpg"
            alt="Robot Chef AI"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            loading="lazy"
          />
          {/* Branding overlay */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "8px",
            background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
            textAlign: "center",
          }}>
            <span style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#a3e635",
            }}>🍔 MealYummy AI</span>
          </div>
        </div>
      </div>

      {/* Star burst & text overlays */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <StarBurst trigger={burst} />
        <AnimatePresence>
          {showText && (
            <motion.div key="lbl" initial={{ opacity: 0, y: 30, scale: 0.5 }}
              animate={{ opacity: 1, y: -120, scale: 1 }} exit={{ opacity: 0, y: -150, scale: 0.8 }}
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
      </div>

      {/* Tap hint */}
      <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-slate-500 whitespace-nowrap">
        👆 Nhấn để tương tác
      </p>

      <style>{`
        @keyframes mobileFloat {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function ThreeRobotScene({ className = "" }: { className?: string }) {
  const isMobile = useIsMobile();

  // On mobile: render lightweight CSS-only fallback
  if (isMobile) {
    return <MobileRobotScene className={className} />;
  }

  // Desktop: full 3D experience
  const [frame, setFrame] = useState(0);
  const frameRef = useRef(0); const rafRef = useRef(0); const lastRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [burst, setBurst] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Lazy load: preload first 10 frames immediately, rest after idle
    const urls = Array.from({ length: TOTAL }, (_, i) => `/robot-frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`);
    urls.slice(0, 10).forEach(s => { const img = new Image(); img.src = s; });
    // Load remaining frames after a delay
    const timer = setTimeout(() => {
      urls.slice(10).forEach(s => { const img = new Image(); img.src = s; });
    }, 2000);
    return () => clearTimeout(timer);
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

      <Canvas
        gl={{ antialias: false, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 2.5, powerPreference: "high-performance" }}
        style={{ position: "absolute", inset: 0, background: "transparent" }}
        dpr={[1, 1.25]}
      >
        <PerspectiveCamera makeDefault fov={40} position={[5, 2, 5]} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={0.8}
          maxPolarAngle={Math.PI - 0.8}
          target={[0, 0, 0]}
        />

        <ambientLight intensity={0.8} color="#fff4e0" />
        <directionalLight position={[3, 8, 5]} intensity={2.5} color="#fff8e7" />
        <pointLight position={[-3, 4, 5]} intensity={1.2} color="#fde68a" />

        <Suspense fallback={null}>
          <BurgerSceneWrapper
            frame={frame}
            hovered={hovered}
            setHovered={setHovered}
            handleClick={handleClick}
          />
          <Sparkles count={12} scale={[3, 4.5, 3]} size={1} speed={0.3} opacity={0.45} color="#fbbf24" />
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
              🔄 Kéo để xoay 360° · Click mở · Thả đóng
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
