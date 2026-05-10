/**
 * FoodScene3D — Animated 3D food showcase
 * Features:
 *  • Central glowing "hero" food card
 *  • Orbiting food emoji satellites at varying Z depths
 *  • Floating sparkle particles
 *  • Mouse-driven perspective tilt of entire scene
 *  • Smooth spring physics
 */

import { useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

// ─── Food items with their orbit params ──────────────────────────────────────
const FOOD_ITEMS = [
  { emoji: "🍜", label: "Phở bò",       size: 56, orbitR: 145, angle:   0, z:  60, delay: 0,    speed: 22 },
  { emoji: "🥗", label: "Salad",        size: 44, orbitR: 170, angle:  72, z: -30, delay: 0.4,  speed: 28 },
  { emoji: "🍱", label: "Bento",        size: 50, orbitR: 130, angle: 144, z:  40, delay: 0.8,  speed: 19 },
  { emoji: "🍛", label: "Cơm cà ri",   size: 48, orbitR: 160, angle: 216, z: -20, delay: 1.2,  speed: 25 },
  { emoji: "🥩", label: "Thịt nướng",  size: 42, orbitR: 140, angle: 288, z:  50, delay: 0.6,  speed: 30 },
  { emoji: "🍱", label: "Cơm hộp",     size: 36, orbitR: 195, angle:  36, z: -50, delay: 1.6,  speed: 35 },
  { emoji: "🫙", label: "Healthy",      size: 34, orbitR: 185, angle: 108, z:  80, delay: 1.0,  speed: 32 },
  { emoji: "🥘", label: "Lẩu",         size: 40, orbitR: 175, angle: 180, z: -40, delay: 1.8,  speed: 20 },
];

const SPARKLES = [
  { x: "15%", y: "20%", delay: 0,   dur: 2.4, size: 6  },
  { x: "80%", y: "15%", delay: 0.5, dur: 3.0, size: 4  },
  { x: "70%", y: "75%", delay: 1.0, dur: 2.0, size: 8  },
  { x: "20%", y: "70%", delay: 0.3, dur: 2.8, size: 5  },
  { x: "50%", y: "88%", delay: 0.8, dur: 3.5, size: 4  },
  { x: "88%", y: "50%", delay: 1.5, dur: 2.2, size: 6  },
  { x: "10%", y: "45%", delay: 0.7, dur: 2.6, size: 5  },
];

// ─── Orbiting food satellite ──────────────────────────────────────────────────
function FoodSatellite({ item, index }: { item: typeof FOOD_ITEMS[0]; index: number }) {
  // Convert orbit to CSS animation via transform
  const animAngle = item.angle;
  return (
    <motion.div
      className="absolute"
      style={{
        top: "50%",
        left: "50%",
        width: item.size,
        height: item.size,
        marginLeft: -item.size / 2,
        marginTop: -item.size / 2,
        transform: `translateZ(${item.z}px)`,
      }}
      animate={{
        rotate: [animAngle, animAngle + 360],
        x: [
          Math.cos((animAngle * Math.PI) / 180) * item.orbitR,
          Math.cos(((animAngle + 360) * Math.PI) / 180) * item.orbitR,
        ],
        y: [
          Math.sin((animAngle * Math.PI) / 180) * item.orbitR * 0.38,
          Math.sin(((animAngle + 360) * Math.PI) / 180) * item.orbitR * 0.38,
        ],
      }}
      transition={{
        duration: item.speed,
        repeat: Infinity,
        ease: "linear",
        delay: item.delay,
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, 15, -15, 0] }}
        transition={{ duration: 3 + index * 0.4, repeat: Infinity, ease: "easeInOut", delay: item.delay * 0.5 }}
        className="w-full h-full flex items-center justify-center rounded-2xl cursor-default select-none"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`,
          fontSize: item.size * 0.52,
          filter: `drop-shadow(0 4px 12px rgba(0,0,0,0.5))`,
        }}
        whileHover={{
          scale: 1.3,
          background: "rgba(255,255,255,0.12)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
        }}
      >
        {item.emoji}
      </motion.div>
    </motion.div>
  );
}

// ─── Main FoodScene3D component ───────────────────────────────────────────────
export function FoodScene3D({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [18, -18]), { stiffness: 200, damping: 32 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-22, 22]), { stiffness: 200, damping: 32 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [mx, my]);

  const onMouseLeave = useCallback(() => {
    mx.set(0); my.set(0);
  }, [mx, my]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ perspective: 900 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full"
      >
        {/* ── Ambient background glow ─────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(251,146,60,0.12) 0%, rgba(239,68,68,0.06) 40%, transparent 70%)",
            transform: "translateZ(-60px)",
          }}
        />

        {/* ── Orbit ring (ellipse) ─────────────────────────────── */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ translateZ: 0 }}
        >
          <div
            style={{
              width: 340,
              height: 130,
              border: "1px dashed rgba(251,146,60,0.18)",
              borderRadius: "50%",
            }}
          />
        </motion.div>
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ translateZ: 20 }}
        >
          <div
            style={{
              width: 390,
              height: 150,
              border: "1px dashed rgba(251,191,36,0.1)",
              borderRadius: "50%",
            }}
          />
        </motion.div>

        {/* ── Orbiting food satellites ─────────────────────────── */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {FOOD_ITEMS.map((item, i) => (
            <FoodSatellite key={i} item={item} index={i} />
          ))}
        </div>

        {/* ── Hero center card ─────────────────────────────────── */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: "translateZ(80px)" }}
        >
          <motion.div
            animate={{ y: [0, -10, 0], scale: [1, 1.02, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex flex-col items-center justify-center rounded-3xl text-center"
            style={{
              width: 160,
              height: 160,
              background: "linear-gradient(135deg, rgba(251,146,60,0.25) 0%, rgba(239,68,68,0.2) 60%, rgba(234,88,12,0.15) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(251,146,60,0.35)",
              boxShadow: `
                0 0 0 1px rgba(251,146,60,0.15),
                0 24px 80px rgba(251,100,30,0.4),
                0 0 60px rgba(239,68,68,0.2),
                inset 0 1px 0 rgba(255,255,255,0.15)
              `,
            }}
            whileHover={{ scale: 1.08 }}
          >
            {/* Spinning glow ring */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: "conic-gradient(from 0deg, transparent 70%, rgba(251,146,60,0.4) 85%, transparent 100%)",
                mask: "radial-gradient(circle, transparent 68%, black 69%)",
              }}
            />

            <span
              style={{
                fontSize: 62,
                filter: "drop-shadow(0 8px 24px rgba(251,100,30,0.7)) drop-shadow(0 0 20px rgba(255,150,50,0.5))",
                lineHeight: 1,
              }}
            >
              🍲
            </span>
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-2"
            >
              <p className="text-xs font-bold text-amber-200 tracking-wide">MealYummy AI</p>
              <p className="text-[10px] text-amber-300/60 mt-0.5">Món ngon mỗi ngày ✨</p>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Sparkle particles ────────────────────────────────── */}
        {SPARKLES.map((s, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{ left: s.x, top: s.y, translateZ: 40 + i * 8 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180],
            }}
            transition={{
              duration: s.dur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: s.delay,
            }}
          >
            <svg width={s.size} height={s.size} viewBox="0 0 16 16">
              <path
                d="M8 0 L9 7 L16 8 L9 9 L8 16 L7 9 L0 8 L7 7 Z"
                fill="rgba(251,191,36,0.8)"
              />
            </svg>
          </motion.div>
        ))}

        {/* ── Floating label chips ─────────────────────────────── */}
        {[
          { label: "🔥 Phổ biến nhất", x: "-18%", y: "8%",  z: 100, delay: 0   },
          { label: "⭐ 4.9 / 5",        x: "95%",  y: "35%", z: 80,  delay: 0.6 },
          { label: "✅ AI gợi ý",       x: "-12%", y: "72%", z: 90,  delay: 1.2 },
        ].map((chip, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: chip.delay }}
            className="absolute whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              left: chip.x,
              top: chip.y,
              translateZ: chip.z,
              background: "rgba(15,10,5,0.75)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(251,146,60,0.3)",
              color: "rgba(255,220,160,0.95)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(251,146,60,0.1)",
            }}
          >
            {chip.label}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
