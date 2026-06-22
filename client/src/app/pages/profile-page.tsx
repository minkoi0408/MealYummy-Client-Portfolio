

import { Check, Settings, Lock, Bell, Shield, LogOut, Edit2, Mail, Calendar, Trophy, Rocket, User, Crown, Star, Sparkles, ArrowRight, TrendingUp, Flame, Clock } from "lucide-react";
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
import { useFavorites } from '../contexts/favorites-context';
import { subscriptionApi } from '../../apis/subscription.api';
import type { UserSubscription } from '../../apis/subscription.api';

function parseDateLabel(dateStr: string) {
  const today = new Date().toISOString().split("T")[0];
  if (dateStr === today) return "Hôm nay";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "numeric" });
}

function parseCalories(cal: string): number {
  const m = cal?.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

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
          const dataPayload = res.data.data as any;
          const bundleList = Array.isArray(dataPayload) ? dataPayload : (dataPayload.content || []);
          
          if (Array.isArray(bundleList)) {
            setBundles(bundleList);
            const premium = bundleList.find((b: any) => b.name.toLowerCase().includes("membership") || (b.durations && b.durations.length > 0 && b.durations[0].price > 0));
            if (premium && premium.durations && premium.durations.length > 0) {
              setTier(premium.durations[0].durationCode);
            }
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
  { id: "change-password" as const, icon: <Lock className="w-4 h-4 text-blue-400" />, label: "Chỉnh sửa mật khẩu" },
];

export function ProfilePage() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<UserMetrics>(loadMetrics);
  const targets = calcTDEE(metrics);
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [activeDialog, setActiveDialog] = useState<null | "edit-profile" | "change-password">(null);
  const [draftProfile, setDraftProfile] = useState<UserProfile>(profile);
  
  // Password state
  const [hasPassword, setHasPassword] = useState(true); // Ideally from backend: profile.hasPassword
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isSavingMetrics, setIsSavingMetrics] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [metricsHistory, setMetricsHistory] = useState<UserMetrics[]>([]);
  const { logout, role, user } = useAuth();

  const getAccountAge = () => {
    if (!user || !(user as any).createdAt) return "0";
    const createdDate = new Date((user as any).createdAt);
    const diffTime = Math.abs(new Date().getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays.toString();
  };
  const { favoriteIds } = useFavorites();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);

  useEffect(() => {
    if (role !== "ROLE_FREE") {
      subscriptionApi.getCurrentSubscription()
        .then(res => {
          if (res.data && res.data.data) {
            setSubscription(res.data.data);
          }
        })
        .catch(err => console.error("Failed to load subscription", err));
    }
  }, [role]);

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

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8082/api/v1";
    fetch(`${API_URL}/users/metrics`, {
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
    fetch(`${API_URL}/users/metrics/history`, {
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
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8082/api/v1";
      const res = await fetch(`${API_URL}/users/metrics`, {
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
        fetch(`${API_URL}/users/metrics/history`, {
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
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8082/api/v1";
      const res = await fetch(`${API_URL}/users/avatar`, {
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
    if (id === "change-password") {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setActiveDialog("change-password");
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
                    { val: (favoriteIds?.length || 0).toString(), label: "Món đã lưu", color: "#a3e635" },
                    { val: "47", label: "Lượt AI", color: "#4ade80" },
                    { val: getAccountAge(), label: "Ngày dùng", color: "#22d3ee" },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="text-xl font-black mb-0.5" style={{ color: s.color }}>{s.val}</div>
                      <div className="text-[10px]" style={{ color: "#64748b" }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {subscription && (
                  <div className="mb-5 p-3 rounded-xl" style={{ background: "rgba(163,230,53,0.1)", border: "1px solid rgba(163,230,53,0.25)" }}>
                    <div className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: "#a3e635" }}>
                      <Crown className="w-3.5 h-3.5" /> Thông tin gói đăng ký
                    </div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span style={{ color: "#94a3b8" }}>Bắt đầu:</span>
                      <span className="font-semibold text-white">{new Date(subscription.startDate).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span style={{ color: "#94a3b8" }}>Kết thúc:</span>
                      <span className="font-semibold text-white">{new Date(subscription.endDate).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>
                )}
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

      {/* Change Password Dialog */}
      <Dialog open={activeDialog === "change-password"} onOpenChange={(open) => setActiveDialog(open ? "change-password" : null)}>
        <DialogContent
          className="p-0 overflow-hidden"
          style={{ background: "#1a1f2e", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <DialogHeader className="px-6 pt-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <DialogTitle className="text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" /> {hasPassword ? "Thay đổi mật khẩu" : "Thêm mật khẩu mới"}
            </DialogTitle>
            <DialogDescription style={{ color: "#64748b" }}>
              {hasPassword ? "Bạn nên sử dụng mật khẩu mạnh để bảo vệ tài khoản tốt hơn." : "Bạn đang đăng nhập bằng Google và chưa có mật khẩu, hãy thiết lập để đăng nhập dễ dàng hơn lần sau."}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            {hasPassword && (
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: "#94a3b8" }}>Mật khẩu hiện tại</p>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl outline-none text-sm"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9" }}
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>
            )}
            
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "#94a3b8" }}>Mật khẩu mới</p>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-10 px-3 rounded-xl outline-none text-sm"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9" }}
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "#94a3b8" }}>Xác nhận mật khẩu mới</p>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-10 px-3 rounded-xl outline-none text-sm"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9" }}
                placeholder="Nhập lại mật khẩu mới"
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
                if (newPassword !== confirmPassword) {
                  toast.error("Mật khẩu xác nhận không khớp!");
                  return;
                }
                if (newPassword.length < 6) {
                  toast.error("Mật khẩu phải dài ít nhất 6 ký tự!");
                  return;
                }
                // Call API here...
                toast.success(hasPassword ? "Đã thay đổi mật khẩu!" : "Đã thiết lập mật khẩu thành công!");
                setHasPassword(true);
                setActiveDialog(null);
              }}
            >
              Xác nhận
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}