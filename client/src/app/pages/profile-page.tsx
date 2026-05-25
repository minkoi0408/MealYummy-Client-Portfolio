

import { Check, Settings, Lock, Bell, Shield, LogOut, Edit2, Mail, Calendar, Trophy, Rocket, User, Crown, Star, Sparkles, ArrowRight, TrendingUp, } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { jsPDF } from "jspdf";
import * as htmlToImage from "html-to-image";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppHeader } from "../components/app-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Switch } from "../components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "../contexts/auth-context";

type UserMetrics = {
  weight: number;
  height: number;
  age: number;
  gender: "male" | "female";
  activity: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "cut" | "maintain" | "bulk";
  bodyFat: number;
  muscleMass: number;
};

const DEFAULT_METRICS: UserMetrics = {
  weight: 70,
  height: 170,
  age: 25,
  gender: "male",
  activity: "moderate",
  goal: "maintain",
  bodyFat: 20,
  muscleMass: 30,
};

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_ADJUSTMENTS = { cut: -500, maintain: 0, bulk: +300 };

function calcTDEE(m: UserMetrics) {
  const bmr =
    m.gender === "male"
      ? 10 * m.weight + 6.25 * m.height - 5 * m.age + 5
      : 10 * m.weight + 6.25 * m.height - 5 * m.age - 161;
  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[m.activity]);
  const target = tdee + GOAL_ADJUSTMENTS[m.goal];
  const protein =
    m.goal === "bulk" ? Math.round(m.weight * 2.2) : Math.round(m.weight * 1.8);
  const fat = Math.round((target * 0.25) / 9);
  const carbs = Math.round((target - protein * 4 - fat * 9) / 4);
  const fiber = Math.round((target / 1000) * 14);
  return { calories: target, protein, carbs, fat, fiber, bmr, tdee };
}

function loadMetrics(): UserMetrics {
  try {
    const s = localStorage.getItem("mealyummy-metrics");
    return s ? { ...DEFAULT_METRICS, ...JSON.parse(s) } : DEFAULT_METRICS;
  } catch {
    return DEFAULT_METRICS;
  }
}

function saveMetrics(m: UserMetrics) {
  localStorage.setItem("mealyummy-metrics", JSON.stringify(m));
}

type UserProfile = {
  name: string;
  email: string;
  avatarUrl?: string;
};

const DEFAULT_PROFILE: UserProfile = {
  name: "Nguyễn Văn A",
  email: "user@mealyummy.com",
};

function loadProfile(): UserProfile {
  try {
    const s = localStorage.getItem("user");
    if (s) {
      const u = JSON.parse(s);
      return { name: u.username || u.name || "Người dùng", email: u.email || "", avatarUrl: u.avatarUrl };
    }
    return DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

function saveProfile(p: UserProfile) {
  localStorage.setItem("user", JSON.stringify({ username: p.name, email: p.email, avatarUrl: p.avatarUrl }));
}

type NotificationSettings = {
  productUpdates: boolean;
  mealPlanReminders: boolean;
  promoOffers: boolean;
  emailNotifications: boolean;
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  productUpdates: true,
  mealPlanReminders: true,
  promoOffers: false,
  emailNotifications: true,
};

function loadNotifications(): NotificationSettings {
  try {
    const s = localStorage.getItem("mealyummy-notifications");
    return s ? { ...DEFAULT_NOTIFICATIONS, ...JSON.parse(s) } : DEFAULT_NOTIFICATIONS;
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

function saveNotifications(n: NotificationSettings) {
  localStorage.setItem("mealyummy-notifications", JSON.stringify(n));
}

const PROFILE_TIERS = [
  { id: "monthly", label: "1 Tháng", price: "89.000đ", saving: null as null | string },
  { id: "quarterly", label: "3 Tháng", price: "249.000đ", saving: "Tiết kiệm 18k" },
  { id: "yearly", label: "1 Năm", price: "999.000đ", saving: "Siêu ưu đãi" },
];

const FREE_PERKS = ["AI gợi ý món ăn theo khẩu vị", "Thư viện 500+ món Fitness", "Xếp hạng & yêu thích"];
const MEM_PERKS = ["Tính chỉ số BMI & sức khoẻ", "Thực đơn cá nhân hoá từng ngày", "Dinh dưỡng tự động", "Danh sách nguyên liệu AI", "Mua sắm thực phẩm online"];

import { bundleApi } from "../../apis/bundle.api";
import type { Bundle } from "../../types/bundle.types";

function PricingCards() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [tier, setTier] = useState<string>("");

  useEffect(() => {
    bundleApi.getAllActiveBundles()
      .then(res => {
        if (res.data?.data) {
          setBundles(res.data.data);
          const premium = res.data.data.find(b => b.name.toLowerCase().includes("membership") || (b.durations && b.durations.length > 0 && b.durations[0].price > 0));
          if (premium && premium.durations && premium.durations.length > 0) {
            setTier(premium.durations[0].durationCode);
          }
        }
      })
      .catch(console.error);
  }, []);

  const freeBundle = bundles.find(b => b.name.toLowerCase().includes("free") || (b.durations && b.durations.length > 0 && b.durations[0].price === 0));
  const premiumBundle = bundles.find(b => b.name.toLowerCase().includes("membership") || (b.durations && b.durations.length > 0 && b.durations[0].price > 0));
  const activeDuration = premiumBundle?.durations?.find(d => d.durationCode === tier) || premiumBundle?.durations?.[0];

  const formatPrice = (n: number) => n.toLocaleString("vi-VN") + "đ";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Free card */}
      <div className="rounded-2xl p-5 flex flex-col"
        style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(100,116,139,0.25)" }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">🥉</span>
          <div>
            <div className="font-black text-white text-lg">{freeBundle?.name || "Free"}</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: "#64748b" }}>Người trải nghiệm</div>
          </div>
          <div className="ml-auto text-sm font-black" style={{ color: "#94a3b8" }}>0đ</div>
        </div>
        <ul className="space-y-2 flex-1 mb-4">
          {freeBundle?.features?.length ? freeBundle.features.map((p) => (
            <li key={p} className="flex items-center gap-2 text-xs" style={{ color: "#94a3b8" }}>
              <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#64748b" }} />{p}
            </li>
          )) : FREE_PERKS.map((p) => (
            <li key={p} className="flex items-center gap-2 text-xs" style={{ color: "#94a3b8" }}>
              <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#64748b" }} />{p}
            </li>
          ))}
        </ul>
        <button disabled className="w-full h-9 rounded-xl text-xs font-bold cursor-default"
          style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>
          <Check className="w-3.5 h-3.5 inline mr-1" />Gói hiện tại
        </button>
      </div>

      {/* Membership card */}
      {premiumBundle ? (
        <div className="relative rounded-2xl p-5 flex flex-col"
          style={{ background: "rgba(163,230,53,0.05)", border: "2px solid rgba(163,230,53,0.3)", boxShadow: "0 0 28px rgba(163,230,53,0.1)" }}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div className="px-3 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 text-gray-900"
              style={{ background: "linear-gradient(135deg,#a3e635,#4ade80)" }}>
              <Star className="w-2.5 h-2.5 fill-current" /> Phổ biến
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3 mt-1">
            <span className="text-3xl">🥇</span>
            <div>
              <div className="font-black text-white text-lg">{premiumBundle.name}</div>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: "#a3e635" }}>Gymer Pro</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-base font-black" style={{ color: "#a3e635" }}>{activeDuration ? formatPrice(activeDuration.price) : "Liên hệ"}</div>
              <div className="text-[10px]" style={{ color: "#64748b" }}>{activeDuration?.durationCode?.toLowerCase().replace("_", " ")}</div>
            </div>
          </div>
          {/* Tier pills */}
          <div className="flex gap-1.5 mb-3">
            {premiumBundle.durations?.map((t) => (
              <button key={t.durationCode} onClick={() => setTier(t.durationCode)}
                className="flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                style={{
                  background: tier === t.durationCode ? "rgba(163,230,53,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${tier === t.durationCode ? "rgba(163,230,53,0.4)" : "rgba(255,255,255,0.07)"}`,
                  color: tier === t.durationCode ? "#a3e635" : "#64748b",
                }}>
                {t.durationCode.replace("_", " ")}
                {t.originalPrice && <div className="text-[8px]" style={{ color: "#a3e635" }}>Tiết kiệm {formatPrice(t.originalPrice - t.price)}</div>}
              </button>
            ))}
          </div>
          <ul className="space-y-2 flex-1 mb-4">
            {premiumBundle.features?.length ? premiumBundle.features.map((p) => (
              <li key={p} className="flex items-center gap-2 text-xs" style={{ color: "#cbd5e1" }}>
                <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(163,230,53,0.2)" }}>
                  <Check className="w-2 h-2" style={{ color: "#a3e635" }} />
                </div>{p}
              </li>
            )) : MEM_PERKS.map((p) => (
              <li key={p} className="flex items-center gap-2 text-xs" style={{ color: "#cbd5e1" }}>
                <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(163,230,53,0.2)" }}>
                  <Check className="w-2 h-2" style={{ color: "#a3e635" }} />
                </div>{p}
              </li>
            ))}
          </ul>
          <Link to="/membership" className="w-full h-9 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#a3e635,#4ade80)", color: "#0f1117", boxShadow: "0 4px 16px rgba(163,230,53,0.3)" }}>
            Đăng ký ngay <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : null}
    </div>
  );

}


const SETTINGS_MENU = [
  { id: "edit-profile" as const, icon: <User className="w-4 h-4 text-lime-400" />, label: "Chỉnh sửa hồ sơ" },
  { id: "change-password" as const, icon: <Lock className="w-4 h-4 text-blue-400" />, label: "Thay đổi mật khẩu" },
  { id: "security" as const, icon: <Shield className="w-4 h-4 text-amber-400" />, label: "Bảo mật 2 Lớp (MFA)" },
  { id: "notifications" as const, icon: <Bell className="w-4 h-4 text-purple-400" />, label: "Thông báo" },
];

export function ProfilePage() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<UserMetrics>(loadMetrics);
  const targets = calcTDEE(metrics);
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [notifications, setNotifications] = useState<NotificationSettings>(loadNotifications);
  const [activeDialog, setActiveDialog] = useState<null | "edit-profile" | "notifications" | "security">(null);
  const [draftProfile, setDraftProfile] = useState<UserProfile>(profile);
  const [totpQrCode, setTotpQrCode] = useState("");
  const [totpCodeInput, setTotpCodeInput] = useState("");
  const [isSavingMetrics, setIsSavingMetrics] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [metricsHistory, setMetricsHistory] = useState<UserMetrics[]>([]);
  const { logout, role, user } = useAuth();

  const handleExportPDF = async () => {
    setIsExporting(true);
    const toastId = toast.loading("Đang tạo báo cáo PDF...");
    try {
      const doc = new jsPDF("p", "pt", "a4");

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 50;

      // Header
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 80, "F");
      doc.setFontSize(24);
      doc.setTextColor(163, 230, 53);
      doc.text("MEALYUMMY", margin, 45);

      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text("InBody Report", margin + 160, 43);

      // Basic info
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text("Chi So Co Ban (Basic Metrics)", margin, 130);

      doc.setFontSize(12);
      doc.setTextColor(71, 85, 105);
      doc.text(`Khach hang: ${profile.name || "Khach"}`, margin, 160);
      doc.text(`Can nang: ${metrics.weight} kg`, margin, 180);
      doc.text(`Chieu cao: ${metrics.height} cm`, margin, 200);
      doc.text(`Tuoi: ${metrics.age} tuoi`, margin, 220);
      doc.text(`BMR: ${targets.bmr} kcal`, margin, 240);
      doc.text(`TDEE: ${targets.tdee} kcal`, margin, 260);

      if (metrics.goal === "cut" || metrics.goal === "bulk") {
        doc.setFontSize(16);
        doc.setTextColor(15, 23, 42);
        doc.text("Thanh Phan Co The (Body Composition)", margin, 310);

        const drawProgressBar = (label: string, value: number, max: number, y: number, color: number[]) => {
          doc.setFontSize(11);
          doc.setTextColor(71, 85, 105);
          doc.text(label, margin, y);
          doc.setFontSize(12);
          doc.setTextColor(15, 23, 42);
          doc.text(`${value}`, margin + 80, y);

          const barWidth = 250;
          const barHeight = 12;
          const startX = margin + 120;
          const fillWidth = Math.min((value / max) * barWidth, barWidth);

          // Background bar
          doc.setFillColor(241, 245, 249);
          doc.rect(startX, y - 10, barWidth, barHeight, "F");

          // Fill bar
          doc.setFillColor(color[0], color[1], color[2]);
          doc.rect(startX, y - 10, fillWidth, barHeight, "F");

          // Max label
          doc.setFontSize(9);
          doc.setTextColor(148, 163, 184);
          doc.text(`${max}`, startX + barWidth + 10, y);
        };

        drawProgressBar("Co bap (kg)", metrics.muscleMass || 0, 100, 350, [163, 230, 53]);
        drawProgressBar("Mo (%)", metrics.bodyFat || 0, 60, 390, [248, 113, 113]);
      }

      if (metricsHistory.length > 0) {
        doc.setFontSize(16);
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.text("Lich su thanh phan cau tao co the", margin, 430);

        const startY = 440;
        const startX = margin;
        const tableWidth = pageWidth - margin * 2;
        const rowHeight = 45;
        const col1Width = 100;

        // Background and Borders
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1.5);
        doc.line(startX, startY, startX + tableWidth, startY); // Top heavy line
        doc.line(startX, startY + rowHeight * 3, startX + tableWidth, startY + rowHeight * 3); // Bottom heavy line

        doc.setLineWidth(0.5);
        doc.line(startX, startY + rowHeight, startX + tableWidth, startY + rowHeight);
        doc.line(startX, startY + rowHeight * 2, startX + tableWidth, startY + rowHeight * 2);

        doc.line(startX + col1Width, startY, startX + col1Width, startY + rowHeight * 3); // Divider col 1

        // Row Labels
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.text("Trong luong", startX + 5, startY + 20);
        doc.text("Khoi luong", startX + 5, startY + rowHeight + 18);
        doc.text("co xuong", startX + 5, startY + rowHeight + 30);
        doc.text("PBF", startX + 5, startY + rowHeight * 2 + 20);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("(kg)", startX + 70, startY + 20);
        doc.text("(kg)", startX + 70, startY + rowHeight + 25);
        doc.text("(%)", startX + 70, startY + rowHeight * 2 + 20);

        // Calculate dynamic columns
        const dataCols = Math.max(8, metricsHistory.length);
        const colWidth = (tableWidth - col1Width) / dataCols;

        // Draw vertical dividers for data cols
        doc.setDrawColor(150, 150, 150);
        for (let i = 1; i < dataCols; i++) {
          doc.setLineDashPattern([2, 2], 0);
          doc.line(startX + col1Width + i * colWidth, startY, startX + col1Width + i * colWidth, startY + rowHeight * 3);
        }
        doc.setLineDashPattern([], 0);

        // Draw the line charts inside the rows
        const drawMetricRow = (rowIndex: number, key: string) => {
          const yOffset = startY + rowIndex * rowHeight;
          const values = metricsHistory.map((m: any) => Number(m[key]) || 0);
          const maxVal = Math.max(...values) + 2;
          const minVal = Math.max(0, Math.min(...values) - 2);
          let range = maxVal - minVal;
          if (range === 0) range = 1;

          const pts: { x: number, y: number, val: number }[] = [];
          metricsHistory.forEach((m: any, i: number) => {
            const cx = startX + col1Width + i * colWidth + (colWidth / 2);
            const graphH = 20;
            const cy = yOffset + 40 - (((Number(m[key]) || 0) - minVal) / range) * graphH;
            pts.push({ x: cx, y: cy, val: Number(m[key]) || 0 });
          });

          // Draw line
          doc.setDrawColor(50, 50, 50);
          doc.setLineWidth(1);
          for (let i = 0; i < pts.length - 1; i++) {
            doc.line(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y);
          }
          // Draw dots and text
          pts.forEach(p => {
            doc.setFillColor(50, 50, 50);
            doc.circle(p.x, p.y, 2, "F");

            doc.setFontSize(10);
            doc.setTextColor(15, 23, 42);
            const valStr = p.val.toLocaleString('en-US', { maximumFractionDigits: 1 });
            const textW = doc.getTextWidth(valStr);
            doc.text(valStr, p.x - textW / 2, p.y - 5);
          });
        };

        drawMetricRow(0, "weight");
        drawMetricRow(1, "muscleMass");
        drawMetricRow(2, "bodyFat");

        // Draw Dates at bottom
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        metricsHistory.forEach((m: any, i: number) => {
          const cx = startX + col1Width + i * colWidth + (colWidth / 2);
          const d = new Date(m.updatedAt || m.createdAt);

          const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: '2-digit' });
          const timeStr = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

          const dateW = doc.getTextWidth(dateStr);
          const timeW = doc.getTextWidth(timeStr);

          doc.text(dateStr, cx - dateW / 2, startY + rowHeight * 3 + 12);
          doc.text(timeStr, cx - timeW / 2, startY + rowHeight * 3 + 22);
        });
      }

      doc.save(`mealyummy-report-${new Date().getTime()}.pdf`);
      toast.success("Đã xuất PDF thành công!", { id: toastId });
    } catch (err: any) {
      toast.error(`Lỗi tạo PDF: ${err?.message || "Không rõ"}`, { id: toastId });
      console.error("PDF Export Error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (!token) return;

    fetch("http://localhost:8082/api/v1/users/metrics", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          const m = data.data;
          setMetrics(prev => ({ ...prev, ...m }));
        }
      })
      .catch(() => { });

    // Fetch history
    fetch("http://localhost:8082/api/v1/users/metrics/history", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          const sorted = data.data.sort((a: any, b: any) => new Date(a.updatedAt || a.createdAt).getTime() - new Date(b.updatedAt || b.createdAt).getTime());
          setMetricsHistory(sorted);
        }
      })
      .catch(() => { });
  }, []);

  const handleSaveMetrics = async () => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập lại");
      return;
    }

    setIsSavingMetrics(true);
    const toastId = toast.loading("Đang lưu chỉ số...");
    try {
      const res = await fetch("http://localhost:8082/api/v1/users/metrics", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(metrics)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Đã lưu chỉ số thành công", { id: toastId });
        saveMetrics(metrics);
        // Re-fetch history to update chart
        fetch("http://localhost:8082/api/v1/users/metrics/history", {
          headers: { "Authorization": `Bearer ${token}` }
        })
          .then(r => r.json())
          .then(d => {
            if (d && d.data) {
              const sorted = d.data.sort((a: any, b: any) => new Date(a.updatedAt || a.createdAt).getTime() - new Date(b.updatedAt || b.createdAt).getTime());
              setMetricsHistory(sorted);
            }
          })
          .catch(() => { });
      } else {
        toast.error(data.message || "Lỗi khi lưu chỉ số", { id: toastId });
      }
    } catch (error) {
      toast.error("Lỗi kết nối server", { id: toastId });
    } finally {
      setIsSavingMetrics(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    if (token) {
      try {
        const { authApi } = await import("../../apis/auth.api");
        await authApi.logout(token);
      } catch (error) {
        console.error("Logout API error:", error);
      }
    }

    // Dọn sạch mọi dấu vết ở cả 2 kho lưu trữ
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");

    toast.success("Đăng xuất thành công. Hẹn gặp lại bạn!");
    navigate("/");
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập lại");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("Đang tải ảnh lên...");
    try {
      const res = await fetch("http://localhost:8082/api/v1/users/avatar", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Cập nhật avatar thành công", { id: toastId });
        setProfile(prev => {
          const next = { ...prev, avatarUrl: data.data };
          saveProfile(next);
          return next;
        });
      } else {
        toast.error(data.message || "Có lỗi xảy ra", { id: toastId });
      }
    } catch (err) {
      toast.error("Lỗi kết nối server", { id: toastId });
    }
  };

  function updateMetrics(patch: Partial<UserMetrics>) {
    setMetrics((prev) => {
      const next = { ...prev, ...patch };
      saveMetrics(next);
      return next;
    });
  }

  function openDialog(id: (typeof SETTINGS_MENU)[number]["id"]) {
    if (id === "edit-profile") {
      setDraftProfile(profile);
      setActiveDialog("edit-profile");
      return;
    }
    if (id === "notifications") {
      setActiveDialog("notifications");
      return;
    }
    if (id === "security") {
      setActiveDialog("security");
      return;
    }
    toast.message("Tính năng đang phát triển");
  }

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Profile + Settings ─────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">

            {/* Profile Card */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {/* Header gradient */}
              <div className="h-20 relative" style={{ background: "linear-gradient(135deg, #a3e635, #4ade80, #22d3ee)" }}>
                <div className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              </div>

              <div className="px-5 pb-5 relative">
                {/* Avatar */}
                <div className="flex justify-center -mt-10 mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-xl overflow-hidden"
                      style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)", borderColor: "#0f1117" }}>
                      {profile.avatarUrl ? (
                        <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-gray-900" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center border-2 shadow-md transition-all hover:scale-110 cursor-pointer"
                      style={{ background: "#1a1f2e", borderColor: "rgba(163,230,53,0.4)" }}>
                      <Edit2 className="w-3.5 h-3.5 text-lime-400" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                  </div>
                </div>

                {/* User info */}
                <div className="text-center mb-5">
                  <h2 className="text-lg font-black text-white mb-1">{profile.name}</h2>
                  <p className="text-sm mb-3" style={{ color: "#64748b" }}>{profile.email}</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: "rgba(163,230,53,0.1)", border: "1px solid rgba(163,230,53,0.25)", color: "#a3e635" }}>
                    <Crown className="w-3 h-3" /> {role === "ROLE_FREE" ? "Gói Free" : "Gói Membership"}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { val: "12", label: "Món đã lưu", color: "#a3e635" },
                    { val: "47", label: "Lượt AI", color: "#4ade80" },
                    { val: "8", label: "Ngày dùng", color: "#22d3ee" },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="text-xl font-black mb-0.5" style={{ color: s.color }}>{s.val}</div>
                      <div className="text-[10px]" style={{ color: "#64748b" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Settings Card */}
            <div className="rounded-2xl p-5" style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4 text-lime-400" /> Cài đặt tài khoản
              </h3>
              <div className="space-y-1">
                {SETTINGS_MENU.map((item) => (
                  <button key={item.label}
                    className="w-full flex items-center gap-3 text-sm px-3 py-2.5 rounded-xl transition-all text-left"
                    style={{ color: "#94a3b8" }}
                    onClick={() => openDialog(item.id)}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                      (e.currentTarget as HTMLButtonElement).style.color = "#f1f5f9";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
                    }}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
                <div className="pt-2 mt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <button className="w-full flex items-center gap-3 text-sm px-3 py-2.5 rounded-xl transition-all"
                    style={{ color: "#f87171" }}
                    onClick={handleLogout}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(248,113,113,0.08)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                  >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Nutrition Profile + Pricing Plans ─────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Nutrition profile */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(26,31,46,0.9)",
                border: "1px solid rgba(163,230,53,0.25)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-2 text-xs font-bold uppercase tracking-widest"
                    style={{
                      background: "rgba(163,230,53,0.08)",
                      border: "1px solid rgba(163,230,53,0.2)",
                      color: "#a3e635",
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Hồ sơ dinh dưỡng
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-white">
                    Mục tiêu ăn uống của bạn
                  </h2>
                </div>
              </div>

              {/* Weight / height / age */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {([
                  { key: "weight" as const, label: "Cân nặng", unit: "kg", min: 30, max: 200 },
                  { key: "height" as const, label: "Chiều cao", unit: "cm", min: 100, max: 250 },
                  { key: "age" as const, label: "Tuổi", unit: "tuổi", min: 10, max: 99 },
                ]).map(({ key, label, unit, min, max }) => (
                  <div key={key}>
                    <p
                      className="text-xs font-semibold mb-1.5"
                      style={{ color: "#94a3b8" }}
                    >
                      {label}
                    </p>
                    <div
                      className="flex items-center rounded-xl overflow-hidden"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <button
                        onClick={() =>
                          updateMetrics({ [key]: Math.max(min, (metrics as any)[key] - 1) })
                        }
                        className="w-8 h-9 flex items-center justify-center text-lg font-bold flex-shrink-0 transition-colors"
                        style={{ color: "#64748b" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = "#a3e635";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
                        }}
                      >
                        −
                      </button>
                      <div className="flex-1 text-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={(metrics as any)[key]}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            updateMetrics({ [key]: val === "" ? "" : Number(val) });
                          }}
                          onBlur={(e) => {
                            let val = Number(e.target.value) || min;
                            if (val < min) val = min;
                            if (val > max) val = max;
                            updateMetrics({ [key]: val });
                          }}
                          className="w-full bg-transparent text-center text-base font-black text-white outline-none"
                        />
                        <p className="text-[10px]" style={{ color: "#475569" }}>
                          {unit}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          updateMetrics({ [key]: Math.min(max, (metrics as any)[key] + 1) })
                        }
                        className="w-8 h-9 flex items-center justify-center text-lg font-bold flex-shrink-0 transition-colors"
                        style={{ color: "#64748b" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = "#a3e635";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gender + goal row */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p
                    className="text-xs font-semibold mb-2"
                    style={{ color: "#94a3b8" }}
                  >
                    Giới tính
                  </p>
                  <div className="flex gap-2">
                    {(["male", "female"] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => updateMetrics({ gender: g })}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                        style={
                          metrics.gender === g
                            ? {
                              background:
                                "linear-gradient(135deg, #a3e635, #4ade80)",
                              color: "#0f1117",
                            }
                            : {
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "#64748b",
                            }
                        }
                      >
                        {g === "male" ? "👨 Nam" : "👩 Nữ"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p
                    className="text-xs font-semibold mb-2"
                    style={{ color: "#94a3b8" }}
                  >
                    Mục tiêu
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {([
                      { value: "cut", label: "Giảm mỡ", color: "#f87171" },
                      { value: "maintain", label: "Duy trì", color: "#a3e635" },
                      { value: "bulk", label: "Tăng cơ", color: "#fb923c" },
                    ] as const).map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateMetrics({ goal: opt.value })}
                        className="py-2 rounded-xl text-[11px] font-semibold transition-all"
                        style={
                          metrics.goal === opt.value
                            ? {
                              background: `${opt.color}20`,
                              color: opt.color,
                              border: `1px solid ${opt.color}50`,
                            }
                            : {
                              background: "rgba(255,255,255,0.04)",
                              color: "#64748b",
                              border: "1px solid rgba(255,255,255,0.08)",
                            }
                        }
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activity Level row */}
              <div className="mb-4">
                <p className="text-xs font-semibold mb-2" style={{ color: "#94a3b8" }}>
                  Mức độ vận động
                </p>
                <div className="relative">
                  <select
                    value={metrics.activity}
                    onChange={(e) => updateMetrics({ activity: e.target.value as any })}
                    className="w-full appearance-none rounded-xl px-4 py-2.5 text-[13px] font-semibold outline-none transition-all cursor-pointer"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#e2e8f0",
                    }}
                  >
                    <option value="sedentary" style={{ background: "#0f1117" }}>Ít vận động (Văn phòng, ít tập luyện)</option>
                    <option value="light" style={{ background: "#0f1117" }}>Vận động nhẹ (Tập thể dục 1-3 ngày/tuần)</option>
                    <option value="moderate" style={{ background: "#0f1117" }}>Vận động vừa (Tập thể dục 3-5 ngày/tuần)</option>
                    <option value="active" style={{ background: "#0f1117" }}>Vận động nhiều (Tập thể dục 6-7 ngày/tuần)</option>
                    <option value="very_active" style={{ background: "#0f1117" }}>Rất nhiều (VĐV, lao động tay chân)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                  </div>
                </div>
              </div>

              {/* Advanced metrics for cut/bulk */}
              {(metrics.goal === "cut" || metrics.goal === "bulk") && (
                <div className="grid grid-cols-2 gap-3 mb-4 animate-in fade-in zoom-in duration-300">
                  {([
                    { key: "bodyFat" as const, label: "% Lượng mỡ (BDF-Ước tính)", unit: "%", min: 3, max: 100 },
                    { key: "muscleMass" as const, label: "Lượng cơ bắp (Ước tính)", unit: "kg", min: 10, max: 120 },
                  ]).map(({ key, label, unit, min, max }) => (
                    <div key={key}>
                      <p
                        className="text-xs font-semibold mb-1.5"
                        style={{ color: "#94a3b8" }}
                      >
                        {label}
                      </p>
                      <div
                        className="flex items-center rounded-xl overflow-hidden"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <button
                          onClick={() =>
                            updateMetrics({ [key]: Math.max(min, (metrics as any)[key] - 1) })
                          }
                          className="w-8 h-9 flex items-center justify-center text-lg font-bold flex-shrink-0 transition-colors"
                          style={{ color: "#64748b" }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color = "#a3e635";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
                          }}
                        >
                          −
                        </button>
                        <div className="flex-1 text-center">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={(metrics as any)[key]}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, "");
                              updateMetrics({ [key]: val === "" ? "" : Number(val) });
                            }}
                            onBlur={(e) => {
                              let val = Number(e.target.value) || min;
                              if (val < min) val = min;
                              if (val > max) val = max;
                              updateMetrics({ [key]: val });
                            }}
                            className="w-full bg-transparent text-center text-base font-black text-white outline-none"
                          />
                          <p className="text-[10px]" style={{ color: "#475569" }}>
                            {unit}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            updateMetrics({ [key]: Math.min(max, (metrics as any)[key] + 1) })
                          }
                          className="w-8 h-9 flex items-center justify-center text-lg font-bold flex-shrink-0 transition-colors"
                          style={{ color: "#64748b" }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color = "#a3e635";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Summary */}
              <div
                className="rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3"
                style={{
                  background: "rgba(163,230,53,0.06)",
                  border: "1px solid rgba(163,230,53,0.15)",
                }}
              >
                {[
                  { label: "BMR", value: targets.bmr, unit: "kcal", color: "#94a3b8" },
                  { label: "TDEE", value: targets.tdee, unit: "kcal", color: "#fb923c" },
                  {
                    label: "Mục tiêu",
                    value: targets.calories,
                    unit: "kcal",
                    color: "#a3e635",
                  },
                  {
                    label: "Protein",
                    value: targets.protein,
                    unit: "g",
                    color: "#4ade80",
                  },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p
                      className="text-xs mb-0.5"
                      style={{ color: "#475569" }}
                    >
                      {s.label}
                    </p>
                    <p
                      className="text-lg font-black"
                      style={{ color: s.color }}
                    >
                      {s.value.toLocaleString()}
                      <span
                        className="text-xs font-normal ml-0.5"
                        style={{ color: "#475569" }}
                      >
                        {s.unit}
                      </span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="mt-5 flex justify-end gap-3">
                {(metrics.goal === "cut" || metrics.goal === "bulk") && (
                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="h-10 px-5 rounded-xl text-xs font-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f8fafc" }}
                  >
                    {isExporting ? "Đang xuất..." : "📄 Xuất InBody (PDF)"}
                  </button>
                )}
                <button
                  onClick={handleSaveMetrics}
                  disabled={isSavingMetrics}
                  className="h-10 px-6 rounded-xl text-xs font-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                  style={{ background: "linear-gradient(135deg,#a3e635,#4ade80)", color: "#0f1117", boxShadow: "0 4px 16px rgba(163,230,53,0.3)" }}
                >
                  {isSavingMetrics ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>

              {/* Metrics History Chart */}
              {metricsHistory.length > 0 && (
                <div className="mt-8 pt-6" style={{ borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-4 h-4 text-lime-400" />
                    <h3 className="text-sm font-black text-white">Lịch sử thành phần cấu tạo cơ thể</h3>
                  </div>
                  <div id="history-chart" className="h-[280px] w-full bg-[#0f1117] p-2 rounded-xl">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metricsHistory} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                          dataKey="updatedAt"
                          tickFormatter={(timeStr) => timeStr ? new Date(timeStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : ''}
                          stroke="#475569"
                          fontSize={11}
                          tickMargin={12}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis yAxisId="left" stroke="#a3e635" fontSize={10} tickFormatter={(v) => `${v}kg`} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="right" orientation="right" stroke="#f87171" fontSize={10} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                          labelFormatter={(l) => new Date(l).toLocaleDateString('vi-VN')}
                        />
                        <Line yAxisId="left" type="monotone" name="Trọng lượng (kg)" dataKey="weight" stroke="#a3e635" strokeWidth={3} dot={{ r: 4, fill: '#0f1117', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        <Line yAxisId="left" type="monotone" name="Cơ bắp (kg)" dataKey="muscleMass" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: '#0f1117', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        <Line yAxisId="right" type="monotone" name="Mỡ (%)" dataKey="bodyFat" stroke="#f87171" strokeWidth={3} dot={{ r: 4, fill: '#0f1117', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>


            {/* Section header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 text-xs font-bold uppercase tracking-widest"
                style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.2)", color: "#a3e635" }}>
                <Rocket className="w-3.5 h-3.5" /> Đăng ký thành viên
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">Nâng cấp tài khoản</h2>
              <p className="text-sm" style={{ color: "#64748b" }}>Mở khoá đầy đủ tính năng AI — ăn đúng, tập đúng</p>
            </div>

            {/* Free vs Membership cards */}
            <PricingCards />

          </div>
        </div>
      </main>

      {/* Edit profile dialog */}
      <Dialog open={activeDialog === "edit-profile"} onOpenChange={(open) => setActiveDialog(open ? "edit-profile" : null)}>
        <DialogContent
          className="p-0 overflow-hidden"
          style={{ background: "#1a1f2e", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <DialogHeader className="px-6 pt-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <DialogTitle className="text-white flex items-center gap-2">
              <User className="w-4 h-4 text-lime-400" /> Chỉnh sửa hồ sơ
            </DialogTitle>
            <DialogDescription style={{ color: "#64748b" }}>
              Cập nhật thông tin cơ bản hiển thị trong app.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "#94a3b8" }}>
                Họ tên
              </p>
              <input
                value={draftProfile.name}
                onChange={(e) => setDraftProfile((p) => ({ ...p, name: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl outline-none text-sm"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9" }}
              />
            </div>
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "#94a3b8" }}>
                Email
              </p>
              <input
                value={draftProfile.email}
                onChange={(e) => setDraftProfile((p) => ({ ...p, email: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl outline-none text-sm"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9" }}
              />
            </div>
          </div>

          <DialogFooter className="px-6 pb-6">
            <button
              className="h-10 px-4 rounded-xl text-xs font-semibold"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#cbd5e1" }}
              onClick={() => setActiveDialog(null)}
            >
              Hủy
            </button>
            <button
              className="h-10 px-5 rounded-xl text-xs font-black"
              style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)", color: "#0f1117" }}
              onClick={() => {
                setProfile(draftProfile);
                saveProfile(draftProfile);
                toast.success("Đã cập nhật hồ sơ");
                setActiveDialog(null);
              }}
            >
              Lưu thay đổi
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notifications dialog */}
      <Dialog open={activeDialog === "notifications"} onOpenChange={(open) => setActiveDialog(open ? "notifications" : null)}>
        <DialogContent
          className="p-0 overflow-hidden"
          style={{ background: "#1a1f2e", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <DialogHeader className="px-6 pt-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <DialogTitle className="text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-400" /> Thông báo
            </DialogTitle>
            <DialogDescription style={{ color: "#64748b" }}>
              Bật / tắt các loại thông báo.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-3">
            {([
              { key: "mealPlanReminders" as const, title: "Nhắc thực đơn", desc: "Nhắc giờ ăn và theo dõi mục tiêu." },
              { key: "productUpdates" as const, title: "Cập nhật sản phẩm", desc: "Thông báo tính năng mới và cải tiến." },
              { key: "promoOffers" as const, title: "Ưu đãi", desc: "Khuyến mãi và gợi ý membership." },
              { key: "emailNotifications" as const, title: "Nhận qua email", desc: "Gửi tổng kết & nhắc nhở qua email." },
            ]).map((item) => (
              <div
                key={item.key}
                className="rounded-2xl p-4 flex items-center gap-4"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">{item.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                    {item.desc}
                  </p>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  onCheckedChange={(checked) => {
                    setNotifications((prev) => {
                      const next = { ...prev, [item.key]: checked };
                      saveNotifications(next);
                      return next;
                    });
                  }}
                />
              </div>
            ))}
          </div>

          <DialogFooter className="px-6 pb-6">
            <button
              className="h-10 px-4 rounded-xl text-xs font-semibold"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#cbd5e1" }}
              onClick={() => setActiveDialog(null)}
            >
              Đóng
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Security dialog */}
      <Dialog open={activeDialog === "security"} onOpenChange={(open) => setActiveDialog(open ? "security" : null)}>
        <DialogContent
          className="p-0 overflow-hidden"
          style={{ background: "#1a1f2e", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <DialogHeader className="px-6 pt-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <DialogTitle className="text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" /> Bảo mật 2 Lớp (MFA)
            </DialogTitle>
            <DialogDescription style={{ color: "#64748b" }}>
              Bảo vệ tài khoản bằng Google Authenticator.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            {!totpQrCode ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-sm text-white mb-6">
                  Bật xác thực 2 bước (2FA) giúp tài khoản của bạn an toàn hơn trước các rủi ro bảo mật.
                </p>
                <button
                  onClick={async () => {
                    try {
                      const { authApi } = await import("../../apis/auth.api");
                      const res = await authApi.setupTotp(profile.email);
                      setTotpQrCode(res.data.data);
                    } catch (e: any) {
                      toast.error("Không thể thiết lập TOTP.");
                    }
                  }}
                  className="px-6 py-3 rounded-xl text-sm font-bold shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all hover:scale-105 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#0f1117" }}
                >
                  Cài đặt Google Authenticator
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="bg-white p-2 rounded-xl shadow-lg">
                  <img src={totpQrCode} alt="QR Code" className="w-48 h-48" />
                </div>
                <p className="text-xs text-center px-4" style={{ color: "#94a3b8", lineHeight: 1.6 }}>
                  Mở ứng dụng <strong>Google Authenticator</strong> và quét mã QR này, sau đó nhập mã 6 số hiện ra để hoàn tất.
                </p>
                <input
                  type="text"
                  maxLength={6}
                  value={totpCodeInput}
                  onChange={(e) => setTotpCodeInput(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Nhập mã 6 số..."
                  className="w-full text-center h-12 text-xl font-bold tracking-[0.5em] rounded-xl outline-none placeholder:tracking-normal placeholder:font-normal placeholder:text-sm"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9" }}
                />
              </div>
            )}
          </div>

          <DialogFooter className="px-6 pb-6">
            <button
              className="h-10 px-4 rounded-xl text-xs font-semibold hover:bg-white/5 transition-colors"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#cbd5e1" }}
              onClick={() => {
                setActiveDialog(null);
                setTotpQrCode("");
                setTotpCodeInput("");
              }}
            >
              Hủy
            </button>
            {totpQrCode && (
              <button
                disabled={totpCodeInput.length !== 6}
                className="h-10 px-5 rounded-xl text-xs font-black transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)", color: "#0f1117" }}
                onClick={async () => {
                  try {
                    const { authApi } = await import("../../apis/auth.api");
                    await authApi.verifyTotpSetup(profile.email, totpCodeInput);
                    toast.success("Cài đặt Google Authenticator thành công!");
                    setActiveDialog(null);
                    setTotpQrCode("");
                    setTotpCodeInput("");
                  } catch (e: any) {
                    toast.error("Mã không chính xác. Vui lòng thử lại.");
                  }
                }}
              >
                Xác nhận mã
              </button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}