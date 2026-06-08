import { useState, useEffect } from "react";
import { TrendingUp, Sparkles } from "lucide-react";
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
          // If we have the navigation prop, we might want to guide them.
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

  return (
    <div className="animate-in fade-in duration-500">
      <div className="rounded-2xl p-5 mb-5" style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(163,230,53,0.25)" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-2 text-xs font-bold uppercase tracking-widest"
              style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.2)", color: "#a3e635" }}>
              <Sparkles className="w-3.5 h-3.5" /> Hồ sơ dinh dưỡng
            </div>
            <h2 className="text-base sm:text-lg font-black text-white">Mục tiêu ăn uống của bạn</h2>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {([
            { key: "weight" as const, label: "Cân nặng", unit: "kg", min: 30, max: 200 },
            { key: "height" as const, label: "Chiều cao", unit: "cm", min: 100, max: 250 },
            { key: "age" as const, label: "Tuổi", unit: "tuổi", min: 10, max: 99 },
          ]).map(({ key, label, unit, min, max }) => (
            <div key={key}>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#94a3b8" }}>{label}</p>
              <div className="flex items-center rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <button onClick={() => updateMetrics({ [key]: Math.max(min, (metrics as any)[key] - 1) })}
                  className="w-8 h-9 flex items-center justify-center text-lg font-bold flex-shrink-0 transition-colors text-slate-500 hover:text-lime-400">−</button>
                <div className="flex-1 text-center">
                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                    value={(metrics as any)[key]}
                    onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, ""); updateMetrics({ [key]: val === "" ? "" : Number(val) }); }}
                    onBlur={(e) => { let val = Number(e.target.value) || min; if (val < min) val = min; if (val > max) val = max; updateMetrics({ [key]: val }); }}
                    className="w-full bg-transparent text-center text-base font-black text-white outline-none" />
                  <p className="text-[10px]" style={{ color: "#475569" }}>{unit}</p>
                </div>
                <button onClick={() => updateMetrics({ [key]: Math.min(max, (metrics as any)[key] + 1) })}
                  className="w-8 h-9 flex items-center justify-center text-lg font-bold flex-shrink-0 transition-colors text-slate-500 hover:text-lime-400">+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "#94a3b8" }}>Giới tính</p>
            <div className="flex gap-2">
              {(["male", "female"] as const).map((g) => (
                <button key={g} onClick={() => updateMetrics({ gender: g })}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={metrics.gender === g
                    ? { background: "linear-gradient(135deg, #a3e635, #4ade80)", color: "#0f1117" }
                    : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b" }}>
                  {g === "male" ? "👨 Nam" : "👩 Nữ"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "#94a3b8" }}>Mục tiêu</p>
            <div className="grid grid-cols-3 gap-1.5">
              {([
                { value: "cut", label: "Giảm mỡ", color: "#f87171" },
                { value: "maintain", label: "Duy trì", color: "#a3e635" },
                { value: "bulk", label: "Tăng cơ", color: "#fb923c" },
              ] as const).map((opt) => (
                <button key={opt.value} onClick={() => updateMetrics({ goal: opt.value })}
                  className="py-2 rounded-xl text-[11px] font-semibold transition-all"
                  style={metrics.goal === opt.value
                    ? { background: `${opt.color}20`, color: opt.color, border: `1px solid ${opt.color}50` }
                    : { background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold mb-2" style={{ color: "#94a3b8" }}>Mức độ vận động</p>
          <select value={metrics.activity} onChange={(e) => updateMetrics({ activity: e.target.value as any })}
            className="w-full appearance-none rounded-xl px-4 py-2.5 text-[13px] font-semibold outline-none transition-all cursor-pointer"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}>
            <option value="sedentary" style={{ background: "#0f1117" }}>Ít vận động (Văn phòng, ít tập luyện)</option>
            <option value="light" style={{ background: "#0f1117" }}>Vận động nhẹ (Tập thể dục 1-3 ngày/tuần)</option>
            <option value="moderate" style={{ background: "#0f1117" }}>Vận động vừa (Tập thể dục 3-5 ngày/tuần)</option>
            <option value="active" style={{ background: "#0f1117" }}>Vận động nhiều (Tập thể dục 6-7 ngày/tuần)</option>
            <option value="very_active" style={{ background: "#0f1117" }}>Rất nhiều (VĐV, lao động tay chân)</option>
          </select>
        </div>

        {(metrics.goal === "cut" || metrics.goal === "bulk") && (
          <div className="grid grid-cols-2 gap-3 mb-4 animate-in fade-in zoom-in duration-300">
            {([
              { key: "bodyFat" as const, label: "% Lượng mỡ (BDF)", unit: "%", min: 3, max: 100 },
              { key: "muscleMass" as const, label: "Lượng cơ bắp", unit: "kg", min: 10, max: 120 },
            ]).map(({ key, label, unit, min, max }) => (
              <div key={key}>
                <p className="text-xs font-semibold mb-1.5" style={{ color: "#94a3b8" }}>{label}</p>
                <div className="flex items-center rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <button onClick={() => updateMetrics({ [key]: Math.max(min, (metrics as any)[key] - 1) })}
                    className="w-8 h-9 flex items-center justify-center text-lg font-bold flex-shrink-0 transition-colors text-slate-500 hover:text-lime-400">−</button>
                  <div className="flex-1 text-center">
                    <input type="text" inputMode="numeric" value={(metrics as any)[key]}
                      onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, ""); updateMetrics({ [key]: val === "" ? "" : Number(val) }); }}
                      className="w-full bg-transparent text-center text-base font-black text-white outline-none" />
                    <p className="text-[10px]" style={{ color: "#475569" }}>{unit}</p>
                  </div>
                  <button onClick={() => updateMetrics({ [key]: Math.min(max, (metrics as any)[key] + 1) })}
                    className="w-8 h-9 flex items-center justify-center text-lg font-bold flex-shrink-0 transition-colors text-slate-500 hover:text-lime-400">+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mb-5 animate-in fade-in duration-300">
          <p className="text-xs font-semibold mb-2" style={{ color: "#94a3b8" }}>Bệnh lý / Tình trạng đặc biệt</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                  className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${isSelected ? 'bg-lime-400/10 border-lime-400/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                >
                  <span className="text-sm">{disease.icon}</span>
                  <span className={`text-[10px] font-semibold text-left leading-tight ${isSelected ? 'text-lime-400' : 'text-slate-400'}`}>
                    {disease.label}
                  </span>
                  {isSelected && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]" />}
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ background: "rgba(163,230,53,0.06)", border: "1px solid rgba(163,230,53,0.15)" }}>
          {[
            { label: "BMR", value: targets.bmr, unit: "kcal", color: "#94a3b8" },
            { label: "TDEE", value: targets.tdee, unit: "kcal", color: "#fb923c" },
            { label: "Mục tiêu", value: targets.calories, unit: "kcal", color: "#a3e635" },
            { label: "Protein", value: targets.protein, unit: "g", color: "#4ade80" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-xs mb-0.5" style={{ color: "#475569" }}>{s.label}</p>
              <p className="text-lg font-black" style={{ color: s.color }}>
                {s.value.toLocaleString()} <span className="text-xs font-normal ml-0.5" style={{ color: "#475569" }}>{s.unit}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end gap-3">
          {(metrics.goal === "cut" || metrics.goal === "bulk") && (
            <button onClick={handleExportPDF} disabled={isExporting}
              className="h-10 px-5 rounded-xl text-xs font-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f8fafc" }}>
              {isExporting ? "Đang xuất..." : "📄 Xuất InBody (PDF)"}
            </button>
          )}

          {onGoToJourney && (
            <button
              onClick={onGoToJourney}
              disabled={!hasSaved}
              title={!hasSaved ? "Hãy lưu chỉ số trước" : "Thiết kế Lộ Trình AI"}
              className="h-10 px-5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all"
              style={hasSaved
                ? { background: "rgba(163,230,53,0.12)", border: "1px solid rgba(163,230,53,0.4)", color: "#a3e635", cursor: "pointer" }
                : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#475569", cursor: "not-allowed" }
              }
              onMouseEnter={(e) => { if (hasSaved) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Thiết kế Lộ Trình
            </button>
          )}

          <button onClick={handleSaveMetrics} disabled={isSavingMetrics}
            className="h-10 px-6 rounded-xl text-xs font-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            style={{ background: "linear-gradient(135deg,#a3e635,#4ade80)", color: "#0f1117", boxShadow: "0 4px 16px rgba(163,230,53,0.3)" }}>
            {isSavingMetrics ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      {metricsHistory.length > 0 && (
        <div className="mt-8 pt-6" style={{ borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-lime-400" />
            <h3 className="text-sm font-black text-white">Lịch sử thành phần cấu tạo cơ thể</h3>
          </div>
          <div className="h-[280px] w-full bg-[#0f1117] p-2 rounded-xl">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <LineChart data={metricsHistory} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="updatedAt" tickFormatter={(t) => t ? new Date(t).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : ''} stroke="#475569" fontSize={11} tickMargin={12} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" stroke="#a3e635" fontSize={10} tickFormatter={(v) => `${v}kg`} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#f87171" fontSize={10} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
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
