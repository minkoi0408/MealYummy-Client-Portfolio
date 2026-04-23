/**
 * RobotChef3D — Frame animation cropped into circle
 * + mix-blend-mode: screen (removes dark BG)
 * + 3D mouse tilt
 * + Click: jump + MealYummy pop + stars
 */

import { useState, useCallback, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

const TOTAL_FRAMES = 98;
const FPS = 18;
const FRAMES = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
  `/robot-frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`
);

// ─── Star particle ─────────────────────────────────────────────────────────────
function StarBurst({ trigger }: { trigger: number }) {
  const angles = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];
  return (
    <AnimatePresence>
      {trigger > 0 &&
        angles.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const dist = 90 + (i % 3) * 20;
          return (
            <motion.div
              key={`${trigger}-${i}`}
              className="absolute left-1/2 top-1/2 pointer-events-none"
              initial={{ x: -6, y: -6, scale: 0, opacity: 1 }}
              animate={{
                x: Math.cos(rad) * dist - 6,
                y: Math.sin(rad) * dist - 6,
                scale: [0, 1.6, 0],
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 0.6, delay: i * 0.03, ease: "easeOut" }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16">
                <path
                  d="M8 0 L9.4 6.6 L16 8 L9.4 9.4 L8 16 L6.6 9.4 L0 8 L6.6 6.6 Z"
                  fill={["#a3e635","#4ade80","#fbbf24","#60a5fa","#f472b6","#34d399"][i % 6]}
                />
              </svg>
            </motion.div>
          );
        })}
    </AnimatePresence>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export function RobotChef3D({ className = "" }: { className?: string }) {
  const [frame, setFrame] = useState(0);
  const frameRef = useRef(0);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [burst, setBurst] = useState(0);
  const [showText, setShowText] = useState(false);
  const [jumping, setJumping] = useState(false);

  // Eye tracking springs
  const eyeRawX = useMotionValue(0);
  const eyeRawY = useMotionValue(0);
  const eyeX = useSpring(eyeRawX, { stiffness: 140, damping: 20 });
  const eyeY = useSpring(eyeRawY, { stiffness: 140, damping: 20 });

  // Preload & animation loop
  useEffect(() => {
    FRAMES.forEach((src) => { const i = new Image(); i.src = src; });
  }, []);

  useEffect(() => {
    const loop = (ts: number) => {
      if (ts - lastRef.current >= 1000 / FPS) {
        frameRef.current = (frameRef.current + 1) % TOTAL_FRAMES;
        setFrame(frameRef.current);
        lastRef.current = ts;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Global eye-tracking: follows cursor anywhere on page
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (window.innerWidth / 2);   // -1 to 1
      const dy = (e.clientY - cy) / (window.innerHeight / 2);  // -1 to 1
      eyeRawX.set(Math.max(-9, Math.min(9, dx * 12)));
      eyeRawY.set(Math.max(-7, Math.min(7, dy * 9)));
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [eyeRawX, eyeRawY]);

  // 3D tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [22, -22]), { stiffness: 200, damping: 22 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-26, 26]), { stiffness: 200, damping: 22 });
  const scale = useSpring(1, { stiffness: 260, damping: 24 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my]);

  const onMouseLeave = useCallback(() => {
    mx.set(0); my.set(0); scale.set(1);
    setHovered(false);
  }, [mx, my, scale]);

  const handleClick = useCallback(() => {
    setJumping(true);
    setBurst((b) => b + 1);
    setShowText(true);
    scale.set(1.08);
    setTimeout(() => { setJumping(false); scale.set(1); }, 700);
    setTimeout(() => setShowText(false), 2400);
  }, [scale]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className}`}
      style={{ perspective: 900, cursor: "pointer" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={() => setHovered(true)}
      onClick={handleClick}
    >
      <motion.div
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* MealYummy popup */}
        <AnimatePresence>
          {showText && (
            <motion.div
              key="label"
              initial={{ opacity: 0, y: 30, scale: 0.5 }}
              animate={{ opacity: 1, y: -16, scale: 1 }}
              exit={{ opacity: 0, y: -70, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 480, damping: 20 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none whitespace-nowrap"
              style={{ translateZ: 80 }}
            >
              <div
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl"
                style={{
                  background: "rgba(8,14,8,0.9)",
                  border: "1.5px solid rgba(163,230,53,0.65)",
                  backdropFilter: "blur(14px)",
                  boxShadow: "0 8px 36px rgba(0,0,0,0.55), 0 0 20px rgba(163,230,53,0.2)",
                }}
              >
                <span className="text-xl">🍲</span>
                <span
                  className="text-xl font-black"
                  style={{
                    background: "linear-gradient(90deg,#a3e635,#4ade80)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  MealYummy!
                </span>
                <span className="text-xl">✨</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Star burst */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ translateZ: 70 }}
        >
          <StarBurst trigger={burst} />
        </div>

        {/* ── Robot circle ─────────────────────────────────────── */}
        <motion.div
          animate={
            jumping
              ? { y: [-4, -70, -45, -60, 0], rotate: [0, -4, 4, -2, 0] }
              : hovered
              ? { y: [0, -12, 0] }
              : { y: [0, -7, 0] }
          }
          transition={
            jumping
              ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
              : hovered
              ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
              : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
          style={{ translateZ: 20 }}
          className="relative"
        >
          {/* Outer glow ring */}
          <motion.div
            animate={{
              boxShadow: hovered || jumping
                ? "0 0 0 3px rgba(163,230,53,0.6), 0 0 40px rgba(163,230,53,0.35), 0 0 80px rgba(163,230,53,0.15)"
                : "0 0 0 2px rgba(163,230,53,0.25), 0 0 20px rgba(163,230,53,0.1)",
            }}
            transition={{ duration: 0.35 }}
            className="rounded-full overflow-hidden"
            style={{ width: 320, height: 320 }}
          >
            <img
              src={FRAMES[frame]}
              alt="Robot Chef AI"
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "50% 35%",
                display: "block",
                mixBlendMode: "screen",
                filter: "brightness(1.1) contrast(1.15) saturate(1.05)",
              }}
            />

            {/* ── Eye-tracking overlay ─────────────────────────── */}
            {/* Left pupil glow */}
            <motion.div
              style={{
                position: "absolute",
                left: "34%", top: "39%",
                x: eyeX, y: eyeY,
                width: 22, height: 22,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0,220,255,0.85) 0%, rgba(0,180,255,0.4) 50%, transparent 75%)",
                filter: "blur(3px)",
                pointerEvents: "none",
                mixBlendMode: "screen",
              }}
            />
            {/* Right pupil glow */}
            <motion.div
              style={{
                position: "absolute",
                left: "57%", top: "39%",
                x: eyeX, y: eyeY,
                width: 22, height: 22,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0,220,255,0.85) 0%, rgba(0,180,255,0.4) 50%, transparent 75%)",
                filter: "blur(3px)",
                pointerEvents: "none",
                mixBlendMode: "screen",
              }}
            />
          </motion.div>

          {/* Ground shadow */}
          <div
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: hovered ? 260 : 220,
              height: 18,
              background: "radial-gradient(ellipse, rgba(163,230,53,0.3) 0%, transparent 70%)",
              filter: "blur(8px)",
              transition: "width 0.35s",
            }}
          />
        </motion.div>

        {/* Click hint */}
        <AnimatePresence>
          {!hovered && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-slate-500 pointer-events-none whitespace-nowrap"
              style={{ translateZ: 20 }}
            >
              👆 Click vào AI
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
