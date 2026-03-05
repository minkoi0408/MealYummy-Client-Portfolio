import { motion } from "motion/react";
import { useEffect, useState } from "react";

const BLOBS = [
  {
    id: 1,
    gradient: "radial-gradient(circle, rgba(251,191,36,0.35) 0%, rgba(251,191,36,0) 70%)",
    size: 520,
    duration: 18,
    x: ["8%", "18%", "12%", "5%", "8%"],
    y: ["8%", "20%", "35%", "18%", "8%"],
  },
  {
    id: 2,
    gradient: "radial-gradient(circle, rgba(249,115,22,0.25) 0%, rgba(249,115,22,0) 70%)",
    size: 480,
    duration: 22,
    x: ["72%", "60%", "75%", "80%", "72%"],
    y: ["10%", "30%", "15%", "5%", "10%"],
  },
  {
    id: 3,
    gradient: "radial-gradient(circle, rgba(253,230,138,0.4) 0%, rgba(253,230,138,0) 70%)",
    size: 400,
    duration: 15,
    x: ["35%", "50%", "40%", "25%", "35%"],
    y: ["60%", "45%", "70%", "55%", "60%"],
  },
  {
    id: 4,
    gradient: "radial-gradient(circle, rgba(251,146,60,0.2) 0%, rgba(251,146,60,0) 70%)",
    size: 350,
    duration: 25,
    x: ["80%", "68%", "82%", "75%", "80%"],
    y: ["65%", "78%", "60%", "72%", "65%"],
  },
  {
    id: 5,
    gradient: "radial-gradient(circle, rgba(254,243,199,0.5) 0%, rgba(254,243,199,0) 70%)",
    size: 300,
    duration: 20,
    x: ["20%", "30%", "15%", "28%", "20%"],
    y: ["75%", "65%", "80%", "70%", "75%"],
  },
  {
    id: 6,
    gradient: "radial-gradient(circle, rgba(251,191,36,0.2) 0%, rgba(251,191,36,0) 70%)",
    size: 450,
    duration: 28,
    x: ["50%", "42%", "55%", "48%", "50%"],
    y: ["30%", "20%", "40%", "25%", "30%"],
  },
];

const FOOD_PARTICLES = [
  { emoji: "🍜", id: "p1" },
  { emoji: "🍱", id: "p2" },
  { emoji: "🥗", id: "p3" },
  { emoji: "🍲", id: "p4" },
  { emoji: "🌮", id: "p5" },
  { emoji: "🍣", id: "p6" },
  { emoji: "🥘", id: "p7" },
  { emoji: "🍛", id: "p8" },
  { emoji: "🥙", id: "p9" },
  { emoji: "🍝", id: "p10" },
  { emoji: "🥕", id: "p11" },
  { emoji: "🧄", id: "p12" },
  { emoji: "🫙", id: "p13" },
  { emoji: "🍋", id: "p14" },
  { emoji: "🫐", id: "p15" },
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
  return FOOD_PARTICLES.map((p, i) => ({
    id: p.id,
    emoji: p.emoji,
    left: 5 + (i * 6.2) % 90,
    delay: (i * 1.3) % 10,
    duration: 12 + (i * 2.1) % 10,
    size: 16 + (i * 3) % 14,
    rotateDir: i % 2 === 0 ? 1 : -1,
  }));
}

// Shimmering grid lines
function GridOverlay() {
  return (
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(180,100,0,1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(180,100,0,1) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
      }}
    />
  );
}

// Spotlight light effect following mouse subtly
function SpotLight({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 transition-all duration-1000 ease-out"
      style={{
        background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(251,191,36,0.08) 0%, transparent 60%)`,
      }}
    />
  );
}

export function AnimatedBackground() {
  const [particles] = useState<Particle[]>(generateParticles);
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base warm background */}
      <div className="absolute inset-0 bg-[#fffef9]" />

      {/* Animated gradient blobs */}
      {BLOBS.map((blob) => (
        <motion.div
          key={blob.id}
          className="absolute rounded-full"
          style={{
            width: blob.size,
            height: blob.size,
            background: blob.gradient,
            filter: "blur(60px)",
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            left: blob.x,
            top: blob.y,
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Shimmer ring 1 */}
      <motion.div
        className="absolute rounded-full border border-amber-300/20"
        style={{ width: 600, height: 600, left: "50%", top: "50%", translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full border border-orange-300/15"
        style={{ width: 900, height: 900, left: "50%", top: "50%", translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute rounded-full border border-amber-200/10"
        style={{ width: 1200, height: 1200, left: "50%", top: "50%", translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* 3D floating food particles */}
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
            opacity: [0, 0.7, 0.7, 0],
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

      {/* Grid overlay */}
      <GridOverlay />

      {/* Mouse spotlight */}
      <SpotLight x={mouse.x} y={mouse.y} />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(255,250,235,0.4) 100%)",
        }}
      />
    </div>
  );
}
