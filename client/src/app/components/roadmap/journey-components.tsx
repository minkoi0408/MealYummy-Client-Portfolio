import { useState } from "react";
import { Sparkles, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type DurationLabel = "1_MONTH" | "3_MONTHS" | "6_MONTHS" | "12_MONTHS";

export interface RoadmapPhase {
  phaseNumber: number;
  phaseName: string;
  durationWeeks: string;
  startWeek: string;
  endWeek: string;
  targetGoal: string;
  targetCaloriesPerDay: number;
  targetProteinGram: number;
  targetCarbsGram: number;
  targetFatGram: number;
  allowedFoods: string[];
  avoidedFoods: string[];
  recommendedMealNames: string[];
  aiAdvice: string;
  breakfastTemplate: string;
  lunchTemplate: string;
  dinnerTemplate: string;
  snackTemplate: string;
}

export interface DietRoadmapDTO {
  id: string;
  durationLabel: DurationLabel;
  bmi: number;
  bmiCategory: string;
  bmiLabel: string;
  diseases: string[];
  overallGoal: string;
  summary: string;
  phases: RoadmapPhase[];
  status: string;
  generatedAt: string;
}

const DURATION_OPTIONS: { value: DurationLabel; label: string; desc: string }[] = [
  { value: "1_MONTH",   label: "1 Tháng",  desc: "Khởi động nhanh" },
  { value: "3_MONTHS",  label: "3 Tháng",  desc: "Phù hợp hầu hết" },
  { value: "6_MONTHS",  label: "6 Tháng",  desc: "Biến đổi bền vững" },
  { value: "12_MONTHS", label: "1 Năm",    desc: "Thay đổi toàn diện" },
];

const BMI_COLORS: Record<string, string> = {
  UNDERWEIGHT: "#60a5fa",
  NORMAL:      "#a3e635",
  OVERWEIGHT:  "#facc15",
  OBESE_1:     "#fb923c",
  OBESE_2:     "#f87171",
};

const PHASE_GRADIENTS = [
  "linear-gradient(135deg, #134e4a, #065f46)",
  "linear-gradient(135deg, #1e3a5f, #1e40af)",
  "linear-gradient(135deg, #3b0764, #6b21a8)",
  "linear-gradient(135deg, #78350f, #b45309)",
  "linear-gradient(135deg, #0c4a6e, #0369a1)",
  "linear-gradient(135deg, #164e63, #155e75)",
];

export function PhaseCard({ phase, index }: { phase: RoadmapPhase; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const gradient = PHASE_GRADIENTS[index % PHASE_GRADIENTS.length];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left"
        style={{ background: gradient }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
          >
            {phase.phaseNumber}
          </div>
          <div>
            <p className="text-white font-black text-sm">{phase.phaseName}</p>
            <p className="text-white/60 text-xs">{phase.startWeek} → {phase.endWeek} · {phase.durationWeeks}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
            {phase.targetCaloriesPerDay.toLocaleString()} kcal/ngày
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-white/60" /> : <ChevronDown className="w-4 h-4 text-white/60" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4" style={{ background: "rgba(15,17,23,0.95)" }}>
              <p className="text-sm text-slate-300 font-semibold">🎯 {phase.targetGoal}</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Calo", value: phase.targetCaloriesPerDay, unit: "kcal", color: "#fb923c" },
                  { label: "Protein", value: phase.targetProteinGram, unit: "g", color: "#a3e635" },
                  { label: "Carbs", value: phase.targetCarbsGram, unit: "g", color: "#60a5fa" },
                  { label: "Fat", value: phase.targetFatGram, unit: "g", color: "#f472b6" },
                ].map((m) => (
                  <div key={m.label} className="text-center rounded-xl p-2" style={{ background: `${m.color}10`, border: `1px solid ${m.color}25` }}>
                    <p className="text-lg font-black" style={{ color: m.color }}>{m.value}</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wide">{m.unit}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{m.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {phase.allowedFoods?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-lime-400 mb-1.5">✅ Nên ăn</p>
                    <div className="flex flex-wrap gap-1">
                      {phase.allowedFoods.map((f, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(163,230,53,0.1)", color: "#86efac", border: "1px solid rgba(163,230,53,0.2)" }}>{f}</span>
                      ))}
                    </div>
                  </div>
                )}
                {phase.avoidedFoods?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-red-400 mb-1.5">❌ Tránh</p>
                    <div className="flex flex-wrap gap-1">
                      {phase.avoidedFoods.map((f, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(248,113,113,0.1)", color: "#fca5a5", border: "1px solid rgba(248,113,113,0.2)" }}>{f}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="rounded-xl p-3 space-y-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-xs font-black text-white mb-2">📋 Thực đơn ngày điển hình</p>
                {[
                  { icon: "🌅", label: "Sáng", value: phase.breakfastTemplate },
                  { icon: "☀️", label: "Trưa", value: phase.lunchTemplate },
                  { icon: "🌙", label: "Tối", value: phase.dinnerTemplate },
                  { icon: "🍎", label: "Phụ", value: phase.snackTemplate },
                ].map((t) => t.value && (
                  <div key={t.label} className="flex gap-2 text-xs">
                    <span className="flex-shrink-0 w-12 text-slate-500 font-semibold">{t.icon} {t.label}:</span>
                    <span className="text-slate-300">{t.value}</span>
                  </div>
                ))}
              </div>
              {phase.aiAdvice && (
                <div className="rounded-xl p-3" style={{ background: "rgba(163,230,53,0.06)", border: "1px solid rgba(163,230,53,0.15)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full flex-shrink-0 overflow-hidden" style={{ background: "#222b38", border: "1px solid rgba(163,230,53,0.3)" }}>
                      <img src="/logo.svg" alt="MealYummy" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs font-black text-lime-400">Lời khuyên của bác sĩ MealYummy</p>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{phase.aiAdvice}</p>
                </div>
              )}
              {phase.recommendedMealNames?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1.5">🍽️ Gợi ý từ menu MealYummy</p>
                  <div className="flex flex-wrap gap-1.5">
                    {phase.recommendedMealNames.map((name, i) => (
                      <span key={i} className="text-[10px] px-2.5 py-1 rounded-full font-semibold" style={{ background: "rgba(96,165,250,0.1)", color: "#93c5fd", border: "1px solid rgba(96,165,250,0.2)" }}>{name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DurationDialog({
  open,
  onClose,
  onGenerate,
  isGenerating,
}: {
  open: boolean;
  onClose: () => void;
  onGenerate: (duration: DurationLabel) => void;
  isGenerating: boolean;
}) {
  const [selected, setSelected] = useState<DurationLabel>("3_MONTHS");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !isGenerating && onClose()} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md rounded-2xl p-6 z-10"
            style={{ background: "rgba(15,17,23,0.98)", border: "1px solid rgba(163,230,53,0.25)", boxShadow: "0 0 60px rgba(163,230,53,0.1)" }}
          >
            {isGenerating ? (
              <div className="flex flex-col items-center py-6 gap-4">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="w-10 h-10 text-lime-400" />
                </motion.div>
                <div className="text-center">
                  <p className="text-white font-black text-lg mb-1">Đang thiết kế lộ trình...</p>
                  <p className="text-slate-400 text-sm">Quá trình này mất khoảng 10-20 giây</p>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #a3e635, #4ade80)" }}
                    animate={{ width: ["0%", "90%"] }}
                    transition={{ duration: 18, ease: "easeInOut" }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Phân tích chỉ số cá nhân & Kiến thức y khoa...</p>
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-5 h-5 text-lime-400" />
                    <h3 className="text-white font-black text-lg">Tạo Lộ Trình Cá Nhân Hóa</h3>
                  </div>
                  <p className="text-slate-400 text-sm">Chọn thời hạn lộ trình dinh dưỡng của bạn</p>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {DURATION_OPTIONS.map((opt) => {
                    const isActive = selected === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setSelected(opt.value)}
                        className="rounded-xl p-4 text-left transition-all hover:scale-[1.02]"
                        style={{
                          background: isActive ? "rgba(163,230,53,0.12)" : "rgba(255,255,255,0.04)",
                          border: isActive ? "1px solid rgba(163,230,53,0.5)" : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <p className="font-black text-lg mb-0.5" style={{ color: isActive ? "#a3e635" : "#e2e8f0" }}>{opt.label}</p>
                        <p className="text-xs" style={{ color: isActive ? "#86efac" : "#64748b" }}>{opt.desc}</p>
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 h-11 rounded-xl text-sm font-semibold transition-all hover:bg-white/10"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => onGenerate(selected)}
                    className="flex-1 h-11 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)", color: "#0f1117", boxShadow: "0 4px 16px rgba(163,230,53,0.3)" }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Tạo ngay
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function RoadmapDisplay({ roadmap, onDelete, onSync, isSyncing }: { roadmap: DietRoadmapDTO; onDelete: () => void; onSync?: () => void; isSyncing?: boolean }) {
  const bmiColor = BMI_COLORS[roadmap.bmiCategory] || "#a3e635";
  const durationLabel = DURATION_OPTIONS.find(d => d.value === roadmap.durationLabel)?.label || roadmap.durationLabel;

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="rounded-2xl p-4" style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(163,230,53,0.2)" }}>
        <div className="flex items-start justify-between mb-3 gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap" style={{ background: "rgba(163,230,53,0.1)", color: "#a3e635", border: "1px solid rgba(163,230,53,0.25)" }}>
                ✨ Lộ Trình Cá Nhân Hóa · {durationLabel}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap"
                style={{ background: `${bmiColor}15`, color: bmiColor, border: `1px solid ${bmiColor}30` }}>
                BMI {roadmap.bmi} · {roadmap.bmiLabel}
              </span>
            </div>
            <h3 className="text-white font-black text-base leading-snug">{roadmap.overallGoal}</h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 mt-1">
            {onSync && (
              <button
                onClick={onSync}
                disabled={isSyncing}
                className="flex flex-shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)", color: "#0f1117", boxShadow: "0 4px 12px rgba(163,230,53,0.3)" }}
                title="Đồng bộ vào thực đơn"
              >
                {isSyncing ? "Đang đồng bộ..." : "⚡ Đồng bộ toàn bộ Lộ trình"}
              </button>
            )}
            <button
              onClick={onDelete}
              className="p-2 rounded-xl transition-all hover:bg-red-500/10 text-slate-500 hover:text-red-400"
              title="Xóa lộ trình"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed">{roadmap.summary}</p>
        <p className="text-slate-600 text-[10px] mt-2">
          Tạo lúc: {new Date(roadmap.generatedAt).toLocaleString("vi-VN")}
        </p>
      </div>

      <div className="space-y-2">
        {roadmap.phases?.map((phase, i) => (
          <PhaseCard key={phase.phaseNumber} phase={phase} index={i} />
        ))}
      </div>
    </div>
  );
}
