import { useState, useEffect } from "react";
import { TrendingUp, Sparkles, Check, ArrowLeft, ArrowRight, Save } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { useAuth } from "../../contexts/auth-context";

type UserMetrics = {
  weight: number;
  height: number;
  age: number;
  gender: "male" | "female";
  activity: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "cut" | "maintain" | "bulk";
  bodyFat: number;
  muscleMass: number;
  diseases: string[];
};

const DEFAULT_METRICS: UserMetrics = {
  weight: 70, height: 170, age: 25,
  gender: "male", activity: "moderate", goal: "maintain",
  bodyFat: 20, muscleMass: 30, diseases: [],
};

const ACTIVITY_MULTIPLIERS = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
const GOAL_ADJUSTMENTS = { cut: -500, maintain: 0, bulk: +300 };

const DISEASE_LIST = [
  { code: 'DIABETES', label: 'Tiểu đường', icon: '🩸' },
  { code: 'GOUT', label: 'Gout (Gút)', icon: '🦴' },
  { code: 'HYPERTENSION', label: 'Cao huyết áp', icon: '❤️‍🔥' },
  { code: 'DYSLIPIDEMIA', label: 'Mỡ máu cao', icon: '🫀' },
  { code: 'CHRONIC_KIDNEY', label: 'Thận mạn tính', icon: '🫘' },
  { code: 'FATTY_LIVER', label: 'Gan nhiễm mỡ', icon: '🍵' },
  { code: 'KIDNEY_STONE', label: 'Sỏi thận', icon: '💎' },
  { code: 'GERD', label: 'Trào ngược dạ dày', icon: '🔥' },
  { code: 'IBS', label: 'Ruột kích thích', icon: '😣' },
  { code: 'HEMORRHOID', label: 'Táo bón mãn', icon: '🩹' },
  { code: 'ARTHRITIS', label: 'Viêm khớp', icon: '🦵' },
  { code: 'THYROID', label: 'Tuyến giáp', icon: '🦋' },
  { code: 'GYM_BULK', label: 'Đang Tăng cơ', icon: '💪' },
  { code: 'GYM_CUT', label: 'Đang Giảm mỡ', icon: '🔥' },
  { code: 'LACTOSE_INTOLERANT', label: 'Dị ứng Lactose', icon: '🥛' },
  { code: 'FEVER_INFECTION', label: 'Đang sốt/ốm', icon: '🤒' }
];

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8082/api/v1";

function calcTDEE(m: UserMetrics) {
  const bmr = m.gender === "male"
    ? 10 * m.weight + 6.25 * m.height - 5 * m.age + 5
    : 10 * m.weight + 6.25 * m.height - 5 * m.age - 161;
  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[m.activity]);
  const target = tdee + GOAL_ADJUSTMENTS[m.goal];
  const protein = m.goal === "bulk" ? Math.round(m.weight * 2.2) : Math.round(m.weight * 1.8);
  const fat = Math.round((target * 0.25) / 9);
  const carbs = Math.round((target - protein * 4 - fat * 9) / 4);
  const fiber = Math.round((target / 1000) * 14);
  return { calories: target, protein, carbs, fat, fiber, bmr, tdee };
}

function loadMetrics(): UserMetrics {
  try {
    const s = localStorage.getItem("mealyummy-metrics");
    return s ? { ...DEFAULT_METRICS, ...JSON.parse(s) } : DEFAULT_METRICS;
  } catch { return DEFAULT_METRICS; }
}

function saveMetricsLocal(m: UserMetrics) {
  localStorage.setItem("mealyummy-metrics", JSON.stringify(m));
}

function getToken() {
  return localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken") || "";
}

export function NutritionTab({ onGoToJourney }: { onGoToJourney?: () => void }) {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<UserMetrics>(loadMetrics);
  const targets = calcTDEE(metrics);
  const [isSavingMetrics, setIsSavingMetrics] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [metricsHistory, setMetricsHistory] = useState<UserMetrics[]>([]);
  const [hasSaved, setHasSaved] = useState(false);
  
  // WIZARD STATE
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 4;

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    fetch(`${API_BASE}/users/metrics`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data?.data) setMetrics(prev => ({ ...prev, ...data.data })); })
      .catch(() => { });

    fetch(`${API_BASE}/users/metrics/history`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data?.data) {
          const sorted = data.data.sort((a: any, b: any) =>
            new Date(a.updatedAt || a.createdAt).getTime() - new Date(b.updatedAt || b.createdAt).getTime()
          );
          setMetricsHistory(sorted);
          if (sorted.length > 0) setHasSaved(true);
        }
      })
      .catch(() => { });
  }, []);

  const handleExportPDF = async () => {
    setIsExporting(true);
    const toastId = toast.loading("Đang tạo báo cáo PDF...");
    try {
      const doc = new jsPDF("p", "pt", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 50;
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 80, "F");
      doc.setFontSize(24); doc.setTextColor(163, 230, 53);
      doc.text("MEALYUMMY", margin, 45);
      doc.setFontSize(12); doc.setTextColor(255, 255, 255);
      doc.text("InBody Report", margin + 160, 43);
      doc.setFontSize(16); doc.setTextColor(15, 23, 42);
      doc.text("Chi So Co Ban (Basic Metrics)", margin, 130);
      doc.setFontSize(12); doc.setTextColor(71, 85, 105);
      doc.text(`Khach hang: ${user?.username || "Khach"}`, margin, 160);
      doc.text(`Can nang: ${metrics.weight} kg`, margin, 180);
      doc.text(`Chieu cao: ${metrics.height} cm`, margin, 200);
      doc.text(`Tuoi: ${metrics.age} tuoi`, margin, 220);
      doc.text(`BMR: ${targets.bmr} kcal`, margin, 240);
      doc.text(`TDEE: ${targets.tdee} kcal`, margin, 260);
      doc.save(`mealyummy-report-${Date.now()}.pdf`);
      toast.success("Đã xuất PDF thành công!", { id: toastId });
    } catch (err: any) {
      toast.error(`Lỗi tạo PDF: ${err?.message || "Không rõ"}`, { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveMetrics = async () => {
    const token = getToken();
    if (!token) { toast.error("Vui lòng đăng nhập lại"); return; }

    setIsSavingMetrics(true);
    const toastId = toast.loading("Đang lưu chỉ số...");
    try {
      const res = await fetch(`${API_BASE}/users/metrics`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(metrics),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Đã lưu chỉ số thành công", { id: toastId });
        saveMetricsLocal(metrics);
        setHasSaved(true);
        if (onGoToJourney) {
          toast.success("Bây giờ bạn có thể thiết kế Lộ Trình AI!");
        }

        fetch(`${API_BASE}/users/metrics/history`, { headers: { Authorization: `Bearer ${token}` } })
          .then(r => r.json())
          .then(d => {
            if (d?.data) {
              const sorted = d.data.sort((a: any, b: any) =>
                new Date(a.updatedAt || a.createdAt).getTime() - new Date(b.updatedAt || b.createdAt).getTime()
              );
              setMetricsHistory(sorted);
            }
          })
          .catch(() => { });
      } else {
        toast.error(data.message || "Lỗi khi lưu chỉ số", { id: toastId });
      }
    } catch {
      toast.error("Lỗi kết nối server", { id: toastId });
    } finally {
      setIsSavingMetrics(false);
    }
  };

  function updateMetrics(patch: Partial<UserMetrics>) {
    setMetrics(prev => {
      const next = { ...prev, ...patch };
      saveMetricsLocal(next);
      return next;
    });
  }

  const renderNumberInput = (key: keyof UserMetrics, label: string, unit: string, min: number, max: number) => (
    <div key={key}>
      <p className="text-xs font-semibold mb-1.5" style={{ color: "#94a3b8" }}>{label}</p>
      <div className="flex items-center rounded-xl overflow-hidden h-12" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <button onClick={() => updateMetrics({ [key]: Math.max(min, (metrics as any)[key] - 1) })}
          className="w-10 h-full flex items-center justify-center text-lg font-bold flex-shrink-0 transition-colors text-slate-500 hover:text-lime-400">−</button>
        <div className="flex-1 text-center flex flex-col justify-center">
          <input type="text" inputMode="numeric" pattern="[0-9]*"
            value={(metrics as any)[key]}
            onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, ""); updateMetrics({ [key]: val === "" ? "" : Number(val) }); }}
            onBlur={(e) => { let val = Number(e.target.value) || min; if (val < min) val = min; if (val > max) val = max; updateMetrics({ [key]: val }); }}
            className="w-full bg-transparent text-center text-base sm:text-lg font-black text-white outline-none" />
          <p className="text-[10px] -mt-1" style={{ color: "#475569" }}>{unit}</p>
        </div>
        <button onClick={() => updateMetrics({ [key]: Math.min(max, (metrics as any)[key] + 1) })}
          className="w-10 h-full flex items-center justify-center text-lg font-bold flex-shrink-0 transition-colors text-slate-500 hover:text-lime-400">+</button>
      </div>
    </div>
  );

  const STEPS = [
    { id: 1, title: "Chỉ số cơ thể" },
    { id: 2, title: "Mục tiêu" },
    { id: 3, title: "Sức khỏe" },
    { id: 4, title: "Hoàn tất" }
  ];

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto">
      
      {/* STEPPER WIZARD UI */}
      <div className="rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden" style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(163,230,53,0.25)" }}>
        {/* Glow background effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-lime-500/10 rounded-full blur-[50px] pointer-events-none" />
        
        {/* Progress Stepper Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center relative z-10">
            {STEPS.map((s, idx) => {
              const isCompleted = step > s.id;
              const isCurrent = step === s.id;
              return (
                <div key={s.id} className="flex flex-col items-center flex-1 relative cursor-pointer" onClick={() => setStep(s.id)}>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mb-2 transition-all duration-300 z-10 
                    ${isCompleted ? 'bg-lime-400 text-black shadow-[0_0_15px_rgba(163,230,53,0.6)] scale-100' : 
                      isCurrent ? 'bg-slate-800 text-lime-400 border-2 border-lime-400 scale-110 shadow-[0_0_10px_rgba(163,230,53,0.3)]' : 
                      'bg-slate-800 text-slate-500 border border-slate-700 scale-90 hover:scale-100'}`}>
                    {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : s.id}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-colors duration-300 ${isCurrent ? 'text-lime-400' : isCompleted ? 'text-white' : 'text-slate-500'}`}>{s.title}</span>
                </div>
              );
            })}
            
            {/* Progress line background */}
            <div className="absolute top-4 sm:top-5 left-[12.5%] right-[12.5%] h-1 bg-slate-800 -z-0 rounded-full" />
            {/* Progress line foreground */}
            <div className="absolute top-4 sm:top-5 left-[12.5%] h-1 bg-lime-400 -z-0 rounded-full transition-all duration-500 ease-out" style={{ width: \`\${((step - 1) / (TOTAL_STEPS - 1)) * 75}%\` }} />
          </div>
        </div>

        {/* STEP CONTENT */}
        <div className="min-h-[250px]">
          {/* STEP 1: CHỈ SỐ CƠ BẢN */}
          {step === 1 && (
            <div className="animate-in slide-in-from-right-4 fade-in duration-300">
              <h3 className="text-white font-black text-lg mb-6 flex items-center gap-2">
                <span className="text-xl">📏</span> Bạn hãy nhập thông tin cơ bản nhé
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {renderNumberInput("weight", "Cân nặng", "kg", 30, 200)}
                {renderNumberInput("height", "Chiều cao", "cm", 100, 250)}
                {renderNumberInput("age", "Tuổi", "tuổi", 10, 99)}
                
                <div>
                  <p className="text-xs font-semibold mb-1.5" style={{ color: "#94a3b8" }}>Giới tính</p>
                  <div className="flex gap-2 h-12">
                    {(["male", "female"] as const).map((g) => (
                      <button key={g} onClick={() => updateMetrics({ gender: g })}
                        className="flex-1 rounded-xl text-sm font-semibold transition-all"
                        style={metrics.gender === g
                          ? { background: "linear-gradient(135deg, #a3e635, #4ade80)", color: "#0f1117" }
                          : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b" }}>
                        {g === "male" ? "👨 Nam" : "👩 Nữ"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: MỤC TIÊU & VẬN ĐỘNG */}
          {step === 2 && (
            <div className="animate-in slide-in-from-right-4 fade-in duration-300">
              <h3 className="text-white font-black text-lg mb-6 flex items-center gap-2">
                <span className="text-xl">🎯</span> Mục tiêu sức khỏe của bạn là gì?
              </h3>

              <div className="mb-6">
                <p className="text-xs font-semibold mb-2" style={{ color: "#94a3b8" }}>Định hướng mục tiêu</p>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {([
                    { value: "cut", label: "Giảm mỡ", icon: "🔥", color: "#f87171" },
                    { value: "maintain", label: "Duy trì", icon: "⚖️", color: "#a3e635" },
                    { value: "bulk", label: "Tăng cơ", icon: "💪", color: "#fb923c" },
                  ] as const).map((opt) => (
                    <button key={opt.value} onClick={() => updateMetrics({ goal: opt.value })}
                      className="py-3 sm:py-4 rounded-xl text-xs sm:text-sm font-bold flex flex-col items-center gap-2 transition-all hover:-translate-y-1"
                      style={metrics.goal === opt.value
                        ? { background: \`\${opt.color}20\`, color: opt.color, border: \`2px solid \${opt.color}80\`, boxShadow: \`0 4px 15px \${opt.color}40\` }
                        : { background: "rgba(255,255,255,0.04)", color: "#64748b", border: "2px solid rgba(255,255,255,0.08)" }}>
                      <span className="text-xl sm:text-2xl">{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {(metrics.goal === "cut" || metrics.goal === "bulk") && (
                <div className="grid grid-cols-2 gap-4 mb-6 animate-in zoom-in fade-in duration-300">
                  {renderNumberInput("bodyFat", "% Lượng mỡ (BDF)", "%", 3, 100)}
                  {renderNumberInput("muscleMass", "Lượng cơ bắp", "kg", 10, 120)}
                </div>
              )}

              <div className="mb-2">
                <p className="text-xs font-semibold mb-2" style={{ color: "#94a3b8" }}>Mức độ vận động hàng ngày</p>
                <select value={metrics.activity} onChange={(e) => updateMetrics({ activity: e.target.value as any })}
                  className="w-full appearance-none rounded-xl px-4 py-3 sm:py-3.5 text-sm font-semibold outline-none transition-all cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}>
                  <option value="sedentary" style={{ background: "#0f1117" }}>Ít vận động (Văn phòng, không tập)</option>
                  <option value="light" style={{ background: "#0f1117" }}>Vận động nhẹ (Tập 1-3 ngày/tuần)</option>
                  <option value="moderate" style={{ background: "#0f1117" }}>Vận động vừa (Tập 3-5 ngày/tuần)</option>
                  <option value="active" style={{ background: "#0f1117" }}>Vận động nhiều (Tập 6-7 ngày/tuần)</option>
                  <option value="very_active" style={{ background: "#0f1117" }}>Rất nhiều (VĐV, lao động tay chân)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: BỆNH LÝ & SỨC KHỎE */}
          {step === 3 && (
            <div className="animate-in slide-in-from-right-4 fade-in duration-300">
              <h3 className="text-white font-black text-lg mb-2 flex items-center gap-2">
                <span className="text-xl">🏥</span> Tình trạng y tế đặc biệt
              </h3>
              <p className="text-xs text-slate-400 mb-5">AI sẽ tự động lọc bỏ các nguyên liệu gây hại và điều chỉnh thực đơn dựa trên tình trạng sức khỏe của bạn.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {DISEASE_LIST.map((disease) => {
                  const isSelected = metrics.diseases?.includes(disease.code);
                  return (
                    <button
                      key={disease.code}
                      onClick={() => {
                        const currentDiseases = metrics.diseases || [];
                        const newDiseases = isSelected
                          ? currentDiseases.filter(c => c !== disease.code)
                          : [...currentDiseases, disease.code];
                        updateMetrics({ diseases: newDiseases });
                      }}
                      className={\`flex items-center gap-2 p-2.5 rounded-xl border transition-all \${isSelected ? 'bg-lime-400/15 border-lime-400/50 shadow-[0_0_10px_rgba(163,230,53,0.15)]' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}\`}
                    >
                      <span className="text-lg">{disease.icon}</span>
                      <span className={\`text-[11px] font-semibold text-left leading-tight \${isSelected ? 'text-lime-400' : 'text-slate-300'}\`}>
                        {disease.label}
                      </span>
                      {isSelected && <div className="ml-auto w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,1)]" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 4: TỔNG KẾT & HOÀN TẤT */}
          {step === 4 && (
            <div className="animate-in slide-in-from-right-4 fade-in duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-lime-400/20 flex items-center justify-center border border-lime-400/30">
                  <Sparkles className="w-6 h-6 text-lime-400" />
                </div>
                <div>
                  <h3 className="text-white font-black text-lg">Hồ sơ đã sẵn sàng!</h3>
                  <p className="text-xs text-slate-400">Dưới đây là các chỉ số TDEE và BMR được tính toán theo khoa học.</p>
                </div>
              </div>
              
              <div className="rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6" style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.2)" }}>
                {[
                  { label: "BMR (Trao đổi chất)", value: targets.bmr, unit: "kcal", color: "#94a3b8" },
                  { label: "TDEE (Tổng tiêu thụ)", value: targets.tdee, unit: "kcal", color: "#fb923c" },
                  { label: "Calo Mục Tiêu AI", value: targets.calories, unit: "kcal", color: "#a3e635", isMain: true },
                  { label: "Nhu cầu Protein", value: targets.protein, unit: "g", color: "#4ade80" },
                ].map((s, i) => (
                  <div key={i} className={\`text-center p-3 rounded-xl \${s.isMain ? 'bg-lime-400/10 border border-lime-400/30' : 'bg-black/20'}\`}>
                    <p className="text-[10px] sm:text-xs mb-1 font-semibold" style={{ color: "#94a3b8" }}>{s.label}</p>
                    <p className={\`font-black \${s.isMain ? 'text-2xl text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]' : 'text-lg text-white'}\`}>
                      {s.value.toLocaleString()} <span className="text-xs font-normal opacity-70">{s.unit}</span>
                    </p>
                  </div>
                ))}
              </div>

              {(metrics.goal === "cut" || metrics.goal === "bulk") && (
                <div className="flex justify-center">
                  <button onClick={handleExportPDF} disabled={isExporting}
                    className="h-9 px-5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:bg-white/10"
                    style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#f8fafc" }}>
                    {isExporting ? "Đang xử lý..." : "📄 Tải xuống Báo Cáo InBody PDF"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* NAVIGATION CONTROLS */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex justify-between items-center">
          <button 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className={\`h-11 px-5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all \${step === 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-white/10 text-slate-300'}\`}
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
          
          {step < TOTAL_STEPS ? (
            <button 
              onClick={() => setStep(s => Math.min(TOTAL_STEPS, s + 1))}
              className="h-11 px-6 rounded-xl text-sm font-black flex items-center gap-2 transition-all hover:scale-105 shadow-[0_0_15px_rgba(163,230,53,0.15)]"
              style={{ background: "rgba(163,230,53,0.15)", color: "#a3e635", border: "1px solid rgba(163,230,53,0.4)" }}
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleSaveMetrics} 
              disabled={isSavingMetrics}
              className="h-11 px-8 rounded-xl text-sm font-black flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(163,230,53,0.4)]"
              style={{ background: "linear-gradient(135deg,#a3e635,#4ade80)", color: "#0f1117" }}
            >
              {isSavingMetrics ? (
                "Đang lưu..."
              ) : (
                <>
                  <Save className="w-4 h-4" /> Lưu Hồ Sơ & Tiếp Tục
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* CHART HISTORY */}
      {metricsHistory.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-lime-400" />
            <h3 className="text-sm font-black text-white">Tiến độ thay đổi vóc dáng của bạn</h3>
          </div>
          <div className="h-[300px] w-full bg-slate-900/50 p-4 rounded-2xl border border-white/5">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <LineChart data={metricsHistory} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="updatedAt" tickFormatter={(t) => t ? new Date(t).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : ''} stroke="#475569" fontSize={11} tickMargin={12} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" stroke="#a3e635" fontSize={10} tickFormatter={(v) => \`\${v}kg\`} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#f87171" fontSize={10} tickFormatter={(v) => \`\${v}%\`} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} labelFormatter={(l) => new Date(l).toLocaleDateString('vi-VN')} />
                <Line yAxisId="left" type="monotone" name="Trọng lượng (kg)" dataKey="weight" stroke="#a3e635" strokeWidth={3} dot={{ r: 4, fill: '#0f1117', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line yAxisId="left" type="monotone" name="Cơ bắp (kg)" dataKey="muscleMass" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: '#0f1117', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" name="Mỡ (%)" dataKey="bodyFat" stroke="#f87171" strokeWidth={3} dot={{ r: 4, fill: '#0f1117', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
