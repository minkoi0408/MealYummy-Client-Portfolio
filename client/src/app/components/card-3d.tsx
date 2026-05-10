import { useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "motion/react";

export function use3DTilt(strength = 20) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), { stiffness: 350, damping: 35 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), { stiffness: 350, damping: 35 });
  const scale = useSpring(1, { stiffness: 350, damping: 28 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    x.set(nx - 0.5); y.set(ny - 0.5);
    mouseX.set(nx * 100); mouseY.set(ny * 100);
    scale.set(1.04);
  }, [x, y, mouseX, mouseY, scale]);

  const onMouseLeave = useCallback(() => {
    x.set(0); y.set(0); mouseX.set(50); mouseY.set(50); scale.set(1);
  }, [x, y, mouseX, mouseY, scale]);

  return { rotateX, rotateY, scale, mouseX, mouseY, onMouseMove, onMouseLeave };
}

function SpotlightOverlay({ mouseX, mouseY, color = "rgba(255,255,255,0.07)" }: { mouseX: MotionValue<number>; mouseY: MotionValue<number>; color?: string }) {
  const background = useTransform([mouseX, mouseY], ([mx, my]: number[]) =>
    `radial-gradient(circle at ${mx}% ${my}%, ${color} 0%, transparent 65%)`
  );
  return <motion.div className="absolute inset-0 pointer-events-none rounded-[inherit] z-10" style={{ background }} />;
}

export function Card3D({ children, className = "", strength = 20, spotlightColor = "rgba(255,255,255,0.09)", glowColor = "rgba(255,255,255,0.14)", style, onClick }: { children: React.ReactNode; className?: string; strength?: number; spotlightColor?: string; glowColor?: string; style?: React.CSSProperties; onClick?: () => void }) {
  const tilt = use3DTilt(strength);
  return (
    <div style={{ perspective: 1000, ...style }} className={`relative ${className}`} onClick={onClick}>
      <motion.div
        style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, scale: tilt.scale, transformStyle: "preserve-3d" }}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        whileHover={{ boxShadow: `0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px ${glowColor}` }}
        className="relative w-full h-full rounded-[inherit]"
      >
        <SpotlightOverlay mouseX={tilt.mouseX} mouseY={tilt.mouseY} color={spotlightColor} />
        <div className="relative z-20 w-full h-full">{children}</div>
      </motion.div>
    </div>
  );
}

export function Float3D({ children, z = 30, className = "", delay = 0, amplitude = 10 }: { children: React.ReactNode; z?: number; className?: string; delay?: number; amplitude?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration: 4 + delay * 0.5, repeat: Infinity, ease: "easeInOut", delay }}
      style={{ translateZ: z }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
