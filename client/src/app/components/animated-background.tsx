import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { useBrightness } from "../contexts/brightness-context";

const BLOBS_DARK = [
  {
    id: 1,
    gradient: "radial-gradient(circle, rgba(163,230,53,0.18) 0%, rgba(163,230,53,0) 70%)",
    size: 520, duration: 18,
    x: ["8%", "18%", "12%", "5%", "8%"],
    y: ["8%", "20%", "35%", "18%", "8%"],
  },
  {
    id: 2,
    gradient: "radial-gradient(circle, rgba(52,211,153,0.12) 0%, rgba(52,211,153,0) 70%)",
    size: 480, duration: 22,
    x: ["72%", "60%", "75%", "80%", "72%"],
    y: ["10%", "30%", "15%", "5%", "10%"],
  },
  {
    id: 3,
    gradient: "radial-gradient(circle, rgba(163,230,53,0.10) 0%, rgba(163,230,53,0) 70%)",
    size: 400, duration: 15,
    x: ["35%", "50%", "40%", "25%", "35%"],
    y: ["60%", "45%", "70%", "55%", "60%"],
  },
  {
    id: 4,
    gradient: "radial-gradient(circle, rgba(34,197,94,0.10) 0%, rgba(34,197,94,0) 70%)",
    size: 350, duration: 25,
    x: ["80%", "68%", "82%", "75%", "80%"],
    y: ["65%", "78%", "60%", "72%", "65%"],
  },
  {
    id: 5,
    gradient: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0) 70%)",
    size: 300, duration: 20,
    x: ["20%", "30%", "15%", "28%", "20%"],
    y: ["75%", "65%", "80%", "70%", "75%"],
  },
  {
    id: 6,
    gradient: "radial-gradient(circle, rgba(163,230,53,0.07) 0%, rgba(163,230,53,0) 70%)",
    size: 450, duration: 28,
    x: ["50%", "42%", "55%", "48%", "50%"],
    y: ["30%", "20%", "40%", "25%", "30%"],
  },
];

// Bright-mode blobs: vivid, large, saturated
const BLOBS_BRIGHT = [
  {
    id: 1,
    gradient: "radial-gradient(circle, rgba(132,204,22,0.55) 0%, rgba(132,204,22,0) 70%)",
    size: 650, duration: 16,
    x: ["5%", "20%", "10%", "3%", "5%"],
    y: ["5%", "22%", "38%", "15%", "5%"],
  },
  {
    id: 2,
    gradient: "radial-gradient(circle, rgba(34,197,94,0.45) 0%, rgba(34,197,94,0) 70%)",
    size: 580, duration: 20,
    x: ["70%", "58%", "74%", "82%", "70%"],
    y: ["8%", "28%", "12%", "4%", "8%"],
  },
  {
    id: 3,
    gradient: "radial-gradient(circle, rgba(163,230,53,0.5) 0%, rgba(163,230,53,0) 70%)",
    size: 500, duration: 13,
    x: ["33%", "50%", "42%", "23%", "33%"],
    y: ["58%", "43%", "68%", "52%", "58%"],
  },
  {
    id: 4,
    gradient: "radial-gradient(circle, rgba(74,222,128,0.4) 0%, rgba(74,222,128,0) 70%)",
    size: 450, duration: 23,
    x: ["78%", "66%", "80%", "73%", "78%"],
    y: ["63%", "76%", "58%", "70%", "63%"],
  },
  {
    id: 5,
    gradient: "radial-gradient(circle, rgba(250,204,21,0.3) 0%, rgba(250,204,21,0) 70%)",
    size: 380, duration: 18,
    x: ["18%", "28%", "12%", "25%", "18%"],
    y: ["73%", "62%", "78%", "68%", "73%"],
  },
  {
    id: 6,
    gradient: "radial-gradient(circle, rgba(16,185,129,0.45) 0%, rgba(16,185,129,0) 70%)",
    size: 560, duration: 26,
    x: ["48%", "40%", "54%", "46%", "48%"],
    y: ["28%", "18%", "38%", "23%", "28%"],
  },
];

const FITNESS_PARTICLES = [
  { emoji: "💪", id: "p1" },
  { emoji: "🥦", id: "p2" },
  { emoji: "🥩", id: "p3" },
  { emoji: "🥗", id: "p4" },
  { emoji: "🏋️", id: "p5" },
  { emoji: "🥑", id: "p6" },
  { emoji: "🫀", id: "p7" },
  { emoji: "🥚", id: "p8" },
  { emoji: "🤸", id: "p9" },
  { emoji: "🍗", id: "p10" },
  { emoji: "🫐", id: "p11" },
  { emoji: "🥜", id: "p12" },
  { emoji: "🧃", id: "p13" },
  { emoji: "🏃", id: "p14" },
  { emoji: "🥛", id: "p15" },
];

interface Particle {
  id: string;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotateDir: number;
}

function generateParticles(): Particle[] {
  return FITNESS_PARTICLES.map((p, i) => ({
    id: p.id,
    emoji: p.emoji,
    left: 5 + (i * 6.2) % 90,
    delay: (i * 1.3) % 10,
    duration: 12 + (i * 2.1) % 10,
    size: 16 + (i * 3) % 14,
    rotateDir: i % 2 === 0 ? 1 : -1,
  }));
}

function GridOverlay({ isBright }: { isBright: boolean }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: isBright ? 0.07 : 0.04,
        backgroundImage: `
          linear-gradient(rgba(163,230,53,1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(163,230,53,1) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
        transition: "opacity 0.8s ease",
      }}
    />
  );
}

function SpotLight({ x, y, isBright }: { x: number; y: number; isBright: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 transition-all duration-1000 ease-out"
      style={{
        background: isBright
          ? `radial-gradient(800px circle at ${x}px ${y}px, rgba(163,230,53,0.18) 0%, transparent 55%)`
          : `radial-gradient(600px circle at ${x}px ${y}px, rgba(163,230,53,0.06) 0%, transparent 60%)`,
      }}
    />
  );
}

export function AnimatedBackground() {
  const [particles] = useState<Particle[]>(generateParticles);
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 });
  const { isBright } = useBrightness();

  const BLOBS = isBright ? BLOBS_BRIGHT : BLOBS_DARK;

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{
        transition: "background 0.8s ease",
        // Hardware acceleration for mobile
        transform: "translateZ(0)",
        willChange: isMobile ? "auto" : "transform"
      }}
    >
      {/* ── Base background ── */}
      <div
        className="absolute inset-0"
        style={{
          background: isBright
            ? "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 40%, #fefce8 100%)"
            : "#0f1117",
          transition: "background 0.8s ease",
        }}
      />

      {/* ── Sunburst overlay (bright only) ── */}
      {isBright && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(163,230,53,0.35) 0%, rgba(74,222,128,0.18) 35%, transparent 65%)",
          }}
        />
      )}

      {/* ── Animated gradient blobs ── */}
      {BLOBS.map((blob) => (
        <motion.div
          key={blob.id}
          className="absolute rounded-full"
          style={{
            width: blob.size,
            height: blob.size,
            background: blob.gradient,
            filter: `blur(${isBright ? 45 : 70}px)`,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{ left: blob.x, top: blob.y }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ── Shimmer rings ── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600,
          left: "50%", top: "50%",
          translateX: "-50%", translateY: "-50%",
          border: isBright
            ? "1.5px solid rgba(132,204,22,0.35)"
            : "1px solid rgba(163,230,53,0.12)",
          transition: "border 0.8s ease",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: isBright ? [0.6, 1, 0.6] : [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 900, height: 900,
          left: "50%", top: "50%",
          translateX: "-50%", translateY: "-50%",
          border: isBright
            ? "1.5px solid rgba(52,211,153,0.25)"
            : "1px solid rgba(52,211,153,0.08)",
          transition: "border 0.8s ease",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: isBright ? [0.5, 0.8, 0.5] : [0.2, 0.4, 0.2] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 1200, height: 1200,
          left: "50%", top: "50%",
          translateX: "-50%", translateY: "-50%",
          border: isBright
            ? "1px solid rgba(163,230,53,0.18)"
            : "1px solid rgba(163,230,53,0.05)",
          transition: "border 0.8s ease",
        }}
        animate={{ scale: [1, 1.05, 1], opacity: isBright ? [0.3, 0.6, 0.3] : [0.1, 0.25, 0.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* ── Floating fitness particles ── */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none"
          style={{
            left: `${p.left}%`,
            bottom: "-60px",
            fontSize: p.size,
            opacity: 0,
          }}
          animate={{
            y: [0, -(window.innerHeight + 120)],
            rotate: [0, p.rotateDir * 180, p.rotateDir * 360],
            opacity: isBright ? [0, 0.85, 0.85, 0] : [0, 0.5, 0.5, 0],
            scale: [0.8, 1.1, 0.9, 0.8],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
            times: [0, 0.1, 0.85, 1],
          }}
        >
          {p.emoji}
        </motion.div>
      ))}

      {/* ── Grid overlay ── */}
      <GridOverlay isBright={isBright} />

      {/* ── Mouse spotlight ── */}
      <SpotLight x={mouse.x} y={mouse.y} isBright={isBright} />

      {/* ── Vignette (disabled in bright mode) ── */}
      <div
        className="absolute inset-0"
        style={{
          background: isBright
            ? "transparent"
            : "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
          transition: "background 0.8s ease",
        }}
      />
    </div>
  );
}
