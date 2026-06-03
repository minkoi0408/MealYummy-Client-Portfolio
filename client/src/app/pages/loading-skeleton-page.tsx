import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const LOADING_MESSAGES = [
  "Đang tải dữ liệu dinh dưỡng...",
  "Phân tích chỉ số cơ thể...",
  "Cá nhân hóa thực đơn của bạn...",
  "Tối ưu macro pathway...",
  "Sẵn sàng rồi!",
];

export function LoadingSkeletonPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const destination = (location.state as any)?.destination || "/home";
  const [msgIndex, setMsgIndex] = useState(0);

  // Cycle through loading messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  // Navigate after 2.3s
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(destination, { replace: true });
    }, 2300);
    return () => clearTimeout(timer);
  }, [navigate, destination]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0f1117]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(163,230,53,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Logo card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-28 h-28 mb-7 rounded-2xl flex items-center justify-center overflow-hidden"
        style={{
          background: "#0f1117",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 0 60px rgba(163,230,53,0.25), 0 0 120px rgba(163,230,53,0.1)",
        }}
      >
        {/* Inner gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(163,230,53,0.08) 0%, transparent 60%)",
          }}
        />
        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            boxShadow: "inset 0 0 20px rgba(163,230,53,0.15)",
          }}
        />
        <img
          src="/logo.svg"
          alt="MealYummy"
          className="w-20 h-20 object-contain relative z-10"
          style={{
            filter: "drop-shadow(0 0 18px rgba(163,230,53,0.8))",
          }}
        />
      </motion.div>

      {/* Brand name */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="text-4xl font-black italic tracking-tighter mb-1"
        style={{
          background: "linear-gradient(135deg, #a3e635, #4ade80)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 18px rgba(163,230,53,0.4))",
        }}
      >
        MealYummy
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="text-[11px] uppercase tracking-[0.25em] text-slate-500 mb-10"
      >
        Eat Smarter, Train Harder
      </motion.p>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="w-full max-w-[260px] space-y-3"
      >
        <div
          className="h-1.5 w-full rounded-full overflow-hidden relative"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.1, ease: "easeInOut" }}
            style={{
              background: "linear-gradient(90deg, #a3e635, #4ade80)",
              boxShadow: "0 0 12px rgba(163,230,53,0.6)",
            }}
          />
        </div>

        {/* Loading message */}
        <div className="text-center h-5 overflow-hidden">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
          >
            {LOADING_MESSAGES[msgIndex]}
          </motion.p>
        </div>
      </motion.div>

      {/* Bottom badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.55 }}
        className="absolute bottom-8 flex items-center gap-3 px-5 py-2.5 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span className="material-symbols-outlined text-sm" style={{ color: "#a3e635" }}>
          bolt
        </span>
        <div className="text-left">
          <p
            className="text-[9px] font-black uppercase tracking-widest"
            style={{ color: "#a3e635" }}
          >
            Precision Mode
          </p>
          <p className="text-[8px] text-slate-500 mt-0.5">
            Optimizing macro pathways for your profile.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
