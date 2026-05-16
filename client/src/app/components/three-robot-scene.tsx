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

// Mobile 3D Configuration
const getMobile3DConfig = (isMobile: boolean) => ({
  pixelRatio: isMobile ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio,
  antialias: !isMobile,
  shadows: !isMobile,
  sparkleCount: isMobile ? 50 : 200,
  maxFPS: isMobile ? 30 : 60,
  renderDistance: isMobile ? 50 : 100,
  envMapIntensity: isMobile ? 1.5 : 3,
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

// Object Pool for Three.js performance
class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (obj: T) => void;

  constructor(createFn: () => T, resetFn: (obj: T) => void, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    
    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }

  get(): T {
    return this.pool.pop() || this.createFn();
  }

  release(obj: T): void {
    this.resetFn(obj);
    this.pool.push(obj);
  }

  clear(): void {
    this.pool.length = 0;
  }
}

// ─── GLB Hamburger ────────────────────────────────────────────────────────────
function HamburgerModel({ open, onModelInfo }: {
  open: boolean;
  onModelInfo?: (info: { pattyY: number; pattyRadius: number; center: THREE.Vector3 }) => void;
}) {
  const { scene } = useGLTF("/models/hamburger.glb");
  const isMobile = useIsMobile();
  const config = getMobile3DConfig(isMobile);

  const { topMeshes, bottomMeshes, pattyY, pattyRadius, center } = useMemo(() => {
    const top: THREE.Object3D[] = [];
    const bottom: THREE.Object3D[] = [];
    let pY = 0, pR = 1.5;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        // Use mobile-optimized env map intensity
        child.material.envMapIntensity = config.envMapIntensity;
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

  // Memory cleanup
  useEffect(() => {
    return () => {
      // Cleanup cloned scene objects
      topMeshes.forEach(mesh => disposeObject(mesh));
      bottomMeshes.forEach(mesh => disposeObject(mesh));
    };
  }, [topMeshes, bottomMeshes]);

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

function RobotScreen({ frame, hovered, onHover, onLeave, onPressDown, onPressUp, onClick, worldPattyY, screenW }: {
  frame: number; hovered: boolean;
  onHover: () => void; onLeave: () => void; onPressDown: () => void; onPressUp: () => void; onClick: () => void;
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
    <group ref={groupRef} position={[0, worldPattyY, 0]}
      onPointerOver={e => { e.stopPropagation(); onHover(); }}
      onPointerOut={e => { e.stopPropagation(); onLeave(); }}
      onPointerDown={e => { e.stopPropagation(); onPressDown(); }}
      onPointerUp={e => { e.stopPropagation(); onPressUp(); }}
      onPointerCancel={e => { e.stopPropagation(); onPressUp(); }}
      onClick={e => { e.stopPropagation(); onClick(); }}>
      {/* Frame body */}
      <mesh>
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
  const [pressed, setPressed] = useState(false);
  const [modelInfo, setModelInfo] = useState<{ pattyY: number; pattyRadius: number; center: THREE.Vector3 } | null>(null);
  const handleModelInfo = useCallback((info: { pattyY: number; pattyRadius: number; center: THREE.Vector3 }) => {
    setModelInfo(prev => {
      if (prev && prev.pattyY === info.pattyY && prev.pattyRadius === info.pattyRadius
        && prev.center?.equals(info.center)) return prev;
      return info;
    });
  }, []);

  const groupRef = useRef<THREE.Group>(null);

  const isOpen = hovered || pressed;

  // X-axis rotation: spin when idle, lerp to front-facing when hovered/pressed
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (isOpen) {
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
        <HamburgerModel open={isOpen} onModelInfo={handleModelInfo} />
      </group>

      {/* Robot screen — world coords, at patty height */}
      <RobotScreen
        frame={frame} hovered={hovered}
        onHover={() => setHovered(true)}
        onLeave={() => setHovered(false)}
        onPressDown={() => setPressed(true)}
        onPressUp={() => setPressed(false)}
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

// ─── Main ─────────────────────────────────────────────────────────────────────
export function ThreeRobotScene({ className = "" }: { className?: string }) {
  const isMobile = useIsMobile();
  const config = getMobile3DConfig(isMobile);

  // Mobile optimization: fewer frames, higher FPS for desktop
  const mobileFrames = 20;
  const desktopFrames = TOTAL;
  const mobileFps = 30;
  const desktopFps = 60; // 60fps cho desktop
  const frameCount = isMobile ? mobileFrames : desktopFrames;
  const fps = isMobile ? mobileFps : desktopFps;

  // ALL hooks must be called unconditionally (React Rules of Hooks)
  const [frame, setFrame] = useState(0);
  const frameRef = useRef(0); const rafRef = useRef(0); const lastRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [burst, setBurst] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // On mobile: only preload first N frames; on desktop: preload all
    const total = isMobile ? mobileFrames : TOTAL;
    const urls = Array.from({ length: total }, (_, i) => `/robot-frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`);
    const firstBatch = isMobile ? urls : urls.slice(0, 10);
    firstBatch.forEach(s => { const img = new Image(); img.src = s; });
    if (!isMobile) {
      const timer = setTimeout(() => {
        urls.slice(10).forEach(s => { const img = new Image(); img.src = s; });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  // Animation loop with mobile FPS optimization
  useEffect(() => {
    const loop = (ts: number) => {
      if (ts - lastRef.current >= 1000 / fps) {
        frameRef.current = (frameRef.current + 1) % frameCount;
        setFrame(frameRef.current);
        lastRef.current = ts;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [fps, frameCount]);

  // Memory cleanup
  useEffect(() => {
    return () => {
      // Cancel any pending animation frames
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleClick = useCallback(() => {
    setBurst(b => b + 1); setShowText(true);
    setTimeout(() => setShowText(false), 2400);
  }, []);

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}
      style={{ width: "100%", height: isMobile ? 340 : 480, cursor: "grab" }}>

      <Canvas
        gl={{ 
          antialias: config.antialias, 
          alpha: true, 
          toneMapping: THREE.ACESFilmicToneMapping, 
          toneMappingExposure: isMobile ? 2.0 : 2.5, 
          powerPreference: "high-performance",
          // Desktop optimizations
          precision: isMobile ? "mediump" : "highp",
          logarithmicDepthBuffer: !isMobile,
        }}
        style={{ position: "absolute", inset: 0, background: "transparent" }}
        dpr={[1, config.pixelRatio]}
        frameloop="always"
        performance={{ min: 0.8, max: 1.0, debounce: 200 }}
      >
        <PerspectiveCamera makeDefault fov={isMobile ? 45 : 40} position={[5, 2, 5]} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={isMobile ? 0.12 : 0.08}
          minPolarAngle={0.8}
          maxPolarAngle={Math.PI - 0.8}
          target={[0, 0, 0]}
        />

        <ambientLight intensity={isMobile ? 0.6 : 0.8} color="#fff4e0" />
        <directionalLight position={[3, 8, 5]} intensity={isMobile ? 2.0 : 2.5} color="#fff8e7" />
        {!isMobile && <pointLight position={[-3, 4, 5]} intensity={1.2} color="#fde68a" />}

        <Suspense fallback={null}>
          <BurgerSceneWrapper
            frame={frame}
            hovered={hovered}
            setHovered={setHovered}
            handleClick={handleClick}
          />
          <Sparkles 
            count={config.sparkleCount} 
            scale={[3, 4.5, 3]} 
            size={isMobile ? 0.8 : 1} 
            speed={isMobile ? 0.2 : 0.3} 
            opacity={isMobile ? 0.3 : 0.45} 
            color="#fbbf24" 
          />
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

      </div>
    </div>
  );
}
