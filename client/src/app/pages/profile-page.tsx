

import {
  Check,
  Settings,
  Lock,
  Bell,
  Shield,
  LogOut,
  Edit2,
  Mail,
  Calendar,
  Trophy,
  Rocket,
  User,
  Crown,
  Star,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
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

type UserMetrics = {
  weight: number;
  height: number;
  age: number;
  gender: "male" | "female";
  activity: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "cut" | "maintain" | "bulk";
};

const DEFAULT_METRICS: UserMetrics = {
  weight: 70,
  height: 170,
  age: 25,
  gender: "male",
  activity: "moderate",
  goal: "maintain",
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
};

const DEFAULT_PROFILE: UserProfile = {
  name: "Nguyễn Văn A",
  email: "user@mealyummy.com",
};

function loadProfile(): UserProfile {
  try {
    const s = localStorage.getItem("mealyummy-profile");
    return s ? { ...DEFAULT_PROFILE, ...JSON.parse(s) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

function saveProfile(p: UserProfile) {
  localStorage.setItem("mealyummy-profile", JSON.stringify(p));
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
const MEM_PERKS  = ["Tính chỉ số BMI & sức khoẻ", "Thực đơn cá nhân hoá từng ngày", "Dinh dưỡng tự động", "Danh sách nguyên liệu AI", "Mua sắm thực phẩm online"];

function PricingCards() {
  const [tier, setTier] = useState("monthly");
  const active = PROFILE_TIERS.find((t) => t.id === tier)!;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Free card */}
      <div className="rounded-2xl p-5 flex flex-col"
        style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(100,116,139,0.25)" }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">🥉</span>
          <div>
            <div className="font-black text-white text-lg">Free</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: "#64748b" }}>Người trải nghiệm</div>
          </div>
          <div className="ml-auto text-sm font-black" style={{ color: "#94a3b8" }}>0đ</div>
        </div>
        <ul className="space-y-2 flex-1 mb-4">
          {FREE_PERKS.map((p) => (
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
            <div className="font-black text-white text-lg">Membership</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: "#a3e635" }}>Gymer Pro</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-base font-black" style={{ color: "#a3e635" }}>{active.price}</div>
            <div className="text-[10px]" style={{ color: "#64748b" }}>{active.label.toLowerCase()}</div>
          </div>
        </div>
        {/* Tier pills */}
        <div className="flex gap-1.5 mb-3">
          {PROFILE_TIERS.map((t) => (
            <button key={t.id} onClick={() => setTier(t.id)}
              className="flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all"
              style={{
                background: tier === t.id ? "rgba(163,230,53,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${tier === t.id ? "rgba(163,230,53,0.4)" : "rgba(255,255,255,0.07)"}`,
                color: tier === t.id ? "#a3e635" : "#64748b",
              }}>
              {t.label}
              {t.saving && <div className="text-[8px]" style={{ color: "#a3e635" }}>{t.saving}</div>}
            </button>
          ))}
        </div>
        <ul className="space-y-2 flex-1 mb-4">
          {MEM_PERKS.map((p) => (
            <li key={p} className="flex items-center gap-2 text-xs" style={{ color: "#cbd5e1" }}>
              <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(163,230,53,0.2)" }}>
                <Check className="w-2 h-2" style={{ color: "#a3e635" }} />
              </div>{p}
            </li>
          ))}
        </ul>
        <button className="w-full h-9 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#a3e635,#4ade80)", color: "#0f1117", boxShadow: "0 4px 16px rgba(163,230,53,0.3)" }}>
          <Sparkles className="w-3.5 h-3.5" /> Đăng ký ngay <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}


const SETTINGS_MENU = [
  { id: "edit-profile" as const, icon: <User className="w-4 h-4 text-lime-400" />, label: "Chỉnh sửa hồ sơ" },
  { id: "change-password" as const, icon: <Lock className="w-4 h-4 text-blue-400" />, label: "Thay đổi mật khẩu" },
  { id: "notifications" as const, icon: <Bell className="w-4 h-4 text-purple-400" />, label: "Thông báo" },
  { id: "security" as const, icon: <Shield className="w-4 h-4 text-amber-400" />, label: "Bảo mật" },
];

export function ProfilePage() {
  const [metrics, setMetrics] = useState<UserMetrics>(loadMetrics);
  const targets = calcTDEE(metrics);
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [notifications, setNotifications] = useState<NotificationSettings>(loadNotifications);
  const [activeDialog, setActiveDialog] = useState<null | "edit-profile" | "notifications">(null);
  const [draftProfile, setDraftProfile] = useState<UserProfile>(profile);

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
                    <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-xl"
                      style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)", borderColor: "#0f1117" }}>
                      <User className="w-10 h-10 text-gray-900" />
                    </div>
                    <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center border-2 shadow-md transition-all hover:scale-110"
                      style={{ background: "#1a1f2e", borderColor: "rgba(163,230,53,0.4)" }}>
                      <Edit2 className="w-3.5 h-3.5 text-lime-400" />
                    </button>
                  </div>
                </div>

                {/* User info */}
                <div className="text-center mb-5">
                  <h2 className="text-lg font-black text-white mb-1">{profile.name}</h2>
                  <p className="text-sm mb-3" style={{ color: "#64748b" }}>{profile.email}</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: "rgba(163,230,53,0.1)", border: "1px solid rgba(163,230,53,0.25)", color: "#a3e635" }}>
                    <Crown className="w-3 h-3" /> Gói Free
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

                {/* Contact info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2" style={{ color: "#64748b" }}>
                    <Mail className="w-3.5 h-3.5 text-lime-400 flex-shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2" style={{ color: "#64748b" }}>
                    <Calendar className="w-3.5 h-3.5 text-lime-400 flex-shrink-0" />
                    <span>Tham gia: 15/02/2026</span>
                  </div>
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
                    onClick={() => toast.message("Đăng xuất đang phát triển")}
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
                        <p className="text-base font-black text-white">
                          {(metrics as any)[key]}
                        </p>
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

            {/* Guarantee */}
            <div className="rounded-2xl p-5" style={{ background: "rgba(163,230,53,0.04)", border: "1px solid rgba(163,230,53,0.15)" }}>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)" }}>
                  <Trophy className="w-5 h-5 text-gray-900" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Đảm bảo hoàn tiền trong 7 ngày</h3>
                  <p className="text-sm mb-3" style={{ color: "#64748b" }}>Không hài lòng? Chúng tôi hoàn lại 100% chi phí, không cần lý do.</p>
                  <div className="flex flex-wrap gap-2">
                    {["Thanh toán an toàn", "Hủy bất kỳ lúc nào", "Không ràng buộc"].map((b) => (
                      <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.15)", color: "#a3e635" }}>
                        <Check className="w-3 h-3" /> {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
    </div>
  );
}