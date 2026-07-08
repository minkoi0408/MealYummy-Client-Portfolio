import { useState } from "react";
import { Sparkles, Trash2, ChevronDown, ChevronUp, Lock, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../../apis/axios.client";
import { toast } from "sonner";

export type DurationLabel = "1_MONTH" | "3_MONTHS" | "6_MONTHS" | "12_MONTHS";

export type PhaseStatus = "LOCKED" | "ACTIVE" | "PENDING_REVIEW" | "COMPLETED";

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
  // Phase-lock fields
  startDate?: string;
  endDate?: string;
  phaseStatus?: PhaseStatus;
  targetWeight?: number;
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysRemaining(endDate?: string): number | null {
  if (!endDate) return null;
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function getTotalDays(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) return 14;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

function getPhaseStatusFromDates(phase: RoadmapPhase): PhaseStatus {
  // Nếu đã có phaseStatus từ backend thì dùng luôn, trừ ACTIVE cần kiểm tra lại ngày
  const status = phase.phaseStatus;
  if (status === "LOCKED" || status === "COMPLETED") return status;

  if (status === "ACTIVE" && phase.endDate) {
    const daysRemaining = getDaysRemaining(phase.endDate);
    if (daysRemaining !== null && daysRemaining <= 0) {
      return "PENDING_REVIEW"; // Đã hết hạn hoặc đúng hôm nay → cần review
    }
  }
  return status || "LOCKED";
}

// ─── Phase Unlock Modal ────────────────────────────────────────────────────────

export function PhaseUnlockModal({
  open,
  roadmapId,
  phase,
  onClose,
  onSuccess,
  onGoToNutrition,
}: {
  open: boolean;
  roadmapId: string;
  phase: RoadmapPhase;
  onClose: () => void;
  onSuccess: (updatedRoadmap: DietRoadmapDTO) => void;
  onGoToNutrition?: () => void;
}) {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8082/api/v1";
  const [step, setStep] = useState<"update_profile" | "confirm">("update_profile");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<"achieved" | "not_achieved" | null>(null);
  const [error, setError] = useState("");
  const [isCheckingMetrics, setIsCheckingMetrics] = useState(false);

  // Reset về bước đầu mỗi khi modal mở
  function handleOpen() {
    setStep("update_profile");
    setResult(null);
    setError("");
  }

  function getToken() {
    return localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken") || "";
  }

  async function handleUnlock() {
    const token = getToken();
    if (!token) { setError("Vui lòng đăng nhập lại"); return; }

    setIsLoading(true);
    setError("");
    try {
      const res = await axiosInstance.post(
        `/diet-roadmap/${roadmapId}/phases/${phase.phaseNumber}/unlock`
      );
      const data = res.data;
      if ((res.status === 200 || res.status === 201) && data?.data) {
        const updatedPhases: RoadmapPhase[] = data.data.phases || [];
        const nextPhase = updatedPhases.find((p: RoadmapPhase) => p.phaseNumber === phase.phaseNumber + 1);
        const isRecalculated = nextPhase?.aiAdvice !== phase.aiAdvice;
        setResult(isRecalculated ? "not_achieved" : "achieved");
        setTimeout(() => {
          onSuccess(data.data);
          onClose();
          setResult(null);
        }, 2500);
      } else {
        setError(data.message || "Không thể mở khóa phase. Thử lại sau.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi kết nối server. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConfirmAlreadyUpdated() {
    // Kiểm tra xem người dùng có thực sự cập nhật chỉ số sau ngày phase bắt đầu không
    setIsCheckingMetrics(true);
    try {
      const res = await axiosInstance.get('/users/metrics/history');
      const history: any[] = res.data?.data || [];
      const phaseStartDate = phase.startDate ? new Date(phase.startDate).getTime() : 0;
      const hasRecentUpdate = history.some(entry => {
        const entryDate = new Date(entry.updatedAt || entry.createdAt).getTime();
        return entryDate > phaseStartDate;
      });

      if (!hasRecentUpdate) {
        toast.error("⚠️ Chưa tìm thấy chỉ số mới nào. Vui lòng thực sự cập nhật hồ sơ trước!", { duration: 4000 });
        return;
      }
      // Có dữ liệu mới -> cho phép tiếp tục
      setStep("confirm");
    } catch {
      // Nếu lỗi API, vẫn cho vào confirm (tợt hơn là chặn hoàn toàn)
      setStep("confirm");
    } finally {
      setIsCheckingMetrics(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationStart={handleOpen}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => !isLoading && onClose()} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md rounded-2xl p-6 z-10"
            style={{ background: "rgba(15,17,23,0.98)", border: "1px solid rgba(163,230,53,0.3)", boxShadow: "0 0 60px rgba(163,230,53,0.12)" }}
          >
            {/* Loading state */}
            {isLoading && (
              <div className="flex flex-col items-center py-8 gap-4">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="w-10 h-10 text-lime-400" />
                </motion.div>
                <div className="text-center">
                  <p className="text-white font-black text-lg mb-1">AI đang đánh giá tiến độ...</p>
                  <p className="text-slate-400 text-sm">Đang so sánh chỉ số của bạn với mục tiêu</p>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #a3e635, #4ade80)" }}
                    animate={{ width: ["0%", "95%"] }}
                    transition={{ duration: 8, ease: "easeInOut" }}
                  />
                </div>
              </div>
            )}

            {/* Result: Achieved */}
            {!isLoading && result === "achieved" && (
              <div className="flex flex-col items-center py-8 gap-4 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                  <CheckCircle2 className="w-16 h-16 text-lime-400" />
                </motion.div>
                <p className="text-white font-black text-xl">🎉 Xuất sắc!</p>
                <p className="text-slate-300 text-sm">Bạn đã đạt mục tiêu Phase {phase.phaseNumber}.<br />Phase tiếp theo đã được mở!</p>
              </div>
            )}

            {/* Result: Not achieved */}
            {!isLoading && result === "not_achieved" && (
              <div className="flex flex-col items-center py-8 gap-4 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Sparkles className="w-16 h-16 text-amber-400" />
                </motion.div>
                <p className="text-amber-300 font-black text-xl">💪 AI đã điều chỉnh!</p>
                <p className="text-slate-300 text-sm">
                  Không sao! AI đã tính toán lại Phase tiếp theo<br />phù hợp hơn với chỉ số hiện tại của bạn.
                </p>
              </div>
            )}

            {/* ── BƯỚC 1: Yêu cầu cập nhật hồ sơ trước ── */}
            {!isLoading && !result && step === "update_profile" && (
              <>
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)" }}>
                      <span className="text-base">📋</span>
                    </div>
                    <h3 className="text-white font-black text-lg">Cập nhật hồ sơ trước</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Trước khi mở khóa, AI cần <span className="text-amber-400 font-bold">chỉ số cơ thể mới nhất</span> của bạn để đánh giá tiến độ và quyết định phase tiếp theo.
                  </p>
                </div>

                {/* Steps */}
                <div className="rounded-xl p-4 mb-5 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5" style={{ background: "rgba(251,191,36,0.2)", color: "#fbbf24" }}>1</div>
                    <div>
                      <p className="text-xs font-bold text-white">Cập nhật cân nặng & chỉ số mới</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Vào trang Hồ sơ dinh dưỡng và nhập số liệu hiện tại của bạn</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5" style={{ background: "rgba(163,230,53,0.15)", color: "#a3e635" }}>2</div>
                    <div>
                      <p className="text-xs font-bold text-white">Quay lại và bấm tiếp tục</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">AI sẽ so sánh chỉ số mới với mục tiêu Phase {phase.phaseNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 h-11 rounded-xl text-sm font-semibold transition-all hover:bg-white/10"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
                  >
                    Để sau
                  </button>
                  <button
                    onClick={() => {
                      if (onGoToNutrition) {
                        onClose();
                        onGoToNutrition();
                      } else {
                        window.location.href = "/profile";
                      }
                    }}
                    className="flex-1 h-11 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#0f1117", boxShadow: "0 4px 16px rgba(251,191,36,0.3)" }}
                  >
                    📋 Cập nhật hồ sơ
                  </button>
                </div>

                <button
                  onClick={handleConfirmAlreadyUpdated}
                  disabled={isCheckingMetrics}
                  className="w-full mt-3 text-[11px] text-slate-500 hover:text-slate-400 transition-colors underline underline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingMetrics ? "Đang kiểm tra..." : "Tôi đã cập nhật rồi, tiếp tục mở khóa →"}
                </button>
              </>
            )}

            {/* ── BƯỚC 2: Xác nhận mở khóa ── */}
            {!isLoading && !result && step === "confirm" && (
              <>
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(163,230,53,0.12)", border: "1px solid rgba(163,230,53,0.3)" }}>
                      <Lock className="w-4 h-4 text-lime-400" />
                    </div>
                    <h3 className="text-white font-black text-lg">Mở khóa Phase tiếp theo</h3>
                  </div>
                  <p className="text-slate-400 text-sm">
                    AI sẽ so sánh chỉ số cơ thể <span className="text-lime-400 font-bold">mới nhất bạn đã cập nhật</span> với mục tiêu của Phase {phase.phaseNumber}.
                  </p>
                </div>

                {/* Phase summary */}
                <div className="rounded-xl p-4 mb-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wide">Phase {phase.phaseNumber} — {phase.phaseName}</p>
                  <p className="text-sm text-slate-300 font-semibold">🎯 {phase.targetGoal}</p>
                  {phase.targetWeight && (
                    <p className="text-xs text-slate-500 mt-1">
                      Cân nặng mục tiêu: <span className="text-lime-400 font-bold">{phase.targetWeight} kg</span>
                    </p>
                  )}
                </div>

                {error && (
                  <div className="mb-4 rounded-xl p-3" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)" }}>
                    <p className="text-amber-300 text-xs font-bold mb-1">⚠️ Cần cập nhật hồ sơ</p>
                    <p className="text-amber-400/80 text-[11px] leading-relaxed">{error}</p>
                    <button
                      onClick={() => {
                        if (onGoToNutrition) {
                          onClose();
                          onGoToNutrition();
                        } else {
                          window.location.href = "/profile";
                        }
                      }}
                      className="inline-flex items-center gap-1 mt-2 text-[11px] font-black px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                      style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#0f1117" }}
                    >
                      📋 Cập nhật hồ sơ dinh dưỡng →
                    </button>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("update_profile")}
                    className="flex-1 h-11 rounded-xl text-sm font-semibold transition-all hover:bg-white/10"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
                  >
                    ← Quay lại
                  </button>
                  <button
                    onClick={handleUnlock}
                    className="flex-1 h-11 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)", color: "#0f1117", boxShadow: "0 4px 16px rgba(163,230,53,0.3)" }}
                  >
                    <Lock className="w-4 h-4" />
                    Mở khóa ngay
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

// ─── Phase Card ────────────────────────────────────────────────────────────────

export function PhaseCard({
  phase,
  index,
  roadmapId,
  onRoadmapUpdate,
  onGoToNutrition,
}: {
  phase: RoadmapPhase;
  index: number;
  roadmapId: string;
  onRoadmapUpdate: (updatedRoadmap: DietRoadmapDTO) => void;
  onGoToNutrition?: () => void;
}) {
  const effectiveStatus = getPhaseStatusFromDates(phase);
  const isLocked = effectiveStatus === "LOCKED";
  const isCompleted = effectiveStatus === "COMPLETED";
  const isPendingReview = effectiveStatus === "PENDING_REVIEW";
  const isActive = effectiveStatus === "ACTIVE";

  const [expanded, setExpanded] = useState(isActive && index === 0);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const gradient = PHASE_GRADIENTS[index % PHASE_GRADIENTS.length];

  const daysRemaining = getDaysRemaining(phase.endDate);
  const totalDays = getTotalDays(phase.startDate, phase.endDate);
  const elapsedDays = totalDays - (daysRemaining ?? 0);
  const progressPct = Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)));

  // ── Status badge ──
  const statusBadge = (() => {
    if (isLocked)        return { icon: <Lock className="w-3 h-3" />, text: "Khóa", color: "#64748b", bg: "rgba(100,116,139,0.12)", border: "rgba(100,116,139,0.2)" };
    if (isCompleted)     return { icon: <CheckCircle2 className="w-3 h-3" />, text: "Hoàn thành", color: "#4ade80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.25)" };
    if (isPendingReview) return { icon: <AlertTriangle className="w-3 h-3" />, text: "Cần cập nhật", color: "#fbbf24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.3)" };
    return { icon: <Clock className="w-3 h-3" />, text: "Đang diễn ra", color: "#a3e635", bg: "rgba(163,230,53,0.1)", border: "rgba(163,230,53,0.25)" };
  })();

  return (
    <>
      <div
        className="rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          border: isPendingReview ? "1px solid rgba(251,191,36,0.4)" : "1px solid rgba(255,255,255,0.08)",
          opacity: isLocked ? 0.55 : 1,
          filter: isLocked ? "saturate(0.3)" : "none",
        }}
      >
        {/* ── PENDING_REVIEW Banner ── */}
        {isPendingReview && (
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: "rgba(251,191,36,0.08)", borderBottom: "1px solid rgba(251,191,36,0.2)" }}>
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-amber-300">Phase đã kết thúc!</p>
              <p className="text-[10px] text-amber-400/70">Cập nhật chỉ số cơ thể để mở khóa phase tiếp theo</p>
            </div>
            <button
              onClick={() => setUnlockModalOpen(true)}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-all hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#0f1117", boxShadow: "0 2px 8px rgba(251,191,36,0.3)" }}
            >
              🔓 Mở khóa
            </button>
          </div>
        )}

        {/* ── Card Header ── */}
        <button
          onClick={() => !isLocked && setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4 text-left"
          style={{ background: isCompleted ? "linear-gradient(135deg, #1a2a1a, #0d1f0d)" : gradient, cursor: isLocked ? "not-allowed" : "pointer" }}
          disabled={isLocked}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
            >
              {isLocked ? <Lock className="w-3.5 h-3.5" /> : isCompleted ? <CheckCircle2 className="w-4 h-4 text-lime-400" /> : phase.phaseNumber}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white font-black text-sm">{phase.phaseName}</p>
                <span
                  className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: statusBadge.bg, color: statusBadge.color, border: `1px solid ${statusBadge.border}` }}
                >
                  {statusBadge.icon}
                  {statusBadge.text}
                </span>
              </div>
              <p className="text-white/50 text-xs mt-0.5">
                {phase.startDate ? (
                  <>{new Date(phase.startDate).toLocaleDateString("vi-VN")} → {new Date(phase.endDate!).toLocaleDateString("vi-VN")} · {phase.durationWeeks}</>
                ) : (
                  <>{phase.startWeek} → {phase.endWeek} · {phase.durationWeeks}</>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
              {phase.targetCaloriesPerDay.toLocaleString()} kcal/ngày
            </span>
            {!isLocked && (
              expanded
                ? <ChevronUp className="w-4 h-4 text-white/60 flex-shrink-0" />
                : <ChevronDown className="w-4 h-4 text-white/60 flex-shrink-0" />
            )}
          </div>
        </button>

        {/* ── Progress Bar (ACTIVE only) ── */}
        {isActive && phase.startDate && phase.endDate && (
          <div className="px-4 pb-3 pt-1" style={{ background: "rgba(15,17,23,0.6)" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-500 font-semibold">Tiến độ phase</span>
              <span className="text-[10px] font-bold" style={{ color: daysRemaining !== null && daysRemaining >= 0 ? "#a3e635" : "#f87171" }}>
                {daysRemaining !== null && daysRemaining >= 0
                  ? `Còn ${daysRemaining} ngày`
                  : "Đã hết hạn"}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #a3e635, #4ade80)" }}
              />
            </div>
          </div>
        )}

        {/* ── Locked Placeholder ── */}
        {isLocked && (
          <div className="flex items-center justify-center gap-2 py-4" style={{ background: "rgba(15,17,23,0.8)" }}>
            <Lock className="w-4 h-4 text-slate-600" />
            <p className="text-slate-600 text-xs font-semibold">Hoàn thành phase trước để mở khóa</p>
          </div>
        )}

        {/* ── Expanded Content ── */}
        <AnimatePresence>
          {expanded && !isLocked && (
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

                {phase.targetWeight && (
                  <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: "rgba(163,230,53,0.06)", border: "1px solid rgba(163,230,53,0.15)" }}>
                    <span className="text-xl">⚖️</span>
                    <div>
                      <p className="text-xs font-bold text-lime-400">Cân nặng mục tiêu cuối phase</p>
                      <p className="text-white font-black">{phase.targetWeight} kg</p>
                    </div>
                  </div>
                )}

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

                {/* Unlock button ở cuối expanded content (PENDING_REVIEW) */}
                {isPendingReview && (
                  <button
                    onClick={() => setUnlockModalOpen(true)}
                    className="w-full h-11 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                    style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#0f1117", boxShadow: "0 4px 12px rgba(251,191,36,0.3)" }}
                  >
                    🔓 Mở khóa Phase tiếp theo
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Unlock Modal */}
      <PhaseUnlockModal
        open={unlockModalOpen}
        roadmapId={roadmapId}
        phase={phase}
        onClose={() => setUnlockModalOpen(false)}
        onSuccess={onRoadmapUpdate}
        onGoToNutrition={onGoToNutrition}
      />
    </>
  );
}

// ─── Duration Dialog ───────────────────────────────────────────────────────────

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

// ─── Roadmap Display ───────────────────────────────────────────────────────────

export function RoadmapDisplay({
  roadmap,
  onDelete,
  onSync,
  isSyncing,
  onRoadmapUpdate,
  onGoToNutrition,
}: {
  roadmap: DietRoadmapDTO;
  onDelete: () => void;
  onSync?: () => void;
  isSyncing?: boolean;
  onRoadmapUpdate: (updatedRoadmap: DietRoadmapDTO) => void;
  onGoToNutrition?: () => void;
}) {
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
          <PhaseCard
            key={phase.phaseNumber}
            phase={phase}
            index={i}
            roadmapId={roadmap.id}
            onRoadmapUpdate={onRoadmapUpdate}
            onGoToNutrition={onGoToNutrition}
          />
        ))}
      </div>
    </div>
  );
}
