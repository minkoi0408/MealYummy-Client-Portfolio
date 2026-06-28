import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Check,
  X,
  Star,
  Sparkles,
  ArrowRight,
  Trophy,
  Shield,
  Zap,
  Crown,
  Rocket,
  HeartHandshake,
  ChevronDown,
  Dumbbell,
  ShoppingCart,
  Calculator,
  Utensils,
  UtensilsCrossed,
  CreditCard,
  Wallet,
} from "lucide-react";
import { AppHeader } from "../components/app-header";
import { bundleApi } from "../../apis/bundle.api";
import { paymentApi } from "../../apis/payment.api";
import { subscriptionApi, type UserSubscription } from "../../apis/subscription.api";
import { authApi } from "../../apis/auth.api";
import type { Bundle } from "../../types/bundle.types";
import { useAuth } from "../contexts/auth-context";
import { toast } from "sonner";
import type { PaymentMethod } from "../../types/payment.types";
import { useSearchParams, useNavigate } from "react-router-dom";

/* ── Plan feature lists ─────────────────────────────────────────────────── */
const FREE_FEATURES = [
  { icon: <Sparkles className="w-4 h-4" />, text: "AI gợi ý món ăn theo khẩu vị" },
  { icon: <Utensils className="w-4 h-4" />, text: "Thư viện 500+ món ăn Fitness cơ bản" },
  { icon: <Trophy className="w-4 h-4" />, text: "Truy cập trang xếp hạng món ăn" },
  { icon: <Star className="w-4 h-4" />, text: "Thêm món vào danh sách yêu thích" },
];

const MEMBER_FEATURES = [
  { icon: <Check className="w-4 h-4" />, text: "Toàn bộ tính năng Free" },
  { icon: <Calculator className="w-4 h-4" />, text: "Tính toán chỉ số BMI & sức khoẻ cá nhân" },
  { icon: <UtensilsCrossed className="w-4 h-4" />, text: "Lên thực đơn cá nhân hoá từng ngày" },
  { icon: <Dumbbell className="w-4 h-4" />, text: "Tự động tính chỉ số dinh dưỡng theo thực đơn" },
  { icon: <ShoppingCart className="w-4 h-4" />, text: "AI tự lên danh sách nguyên liệu cần mua" },
  { icon: <Check className="w-4 h-4" />, text: "Check list nguyên liệu thông minh" },
  { icon: <Rocket className="w-4 h-4" />, text: "Liên kết cửa hàng thực phẩm mua online" },
];

/* ── FAQ ─────────────────────────────────────────────────────────────────── */
const FAQS = [
  { q: "Tôi có thể hủy gói bất kỳ lúc nào không?", a: "Có, bạn có thể hủy gói thành viên bất kỳ lúc nào. Gói hiện tại vẫn hoạt động đến hết chu kỳ thanh toán đã mua." },
  { q: "Gói Membership có khác nhau tính năng theo mức giá không?", a: "Không — 3 mức giá (1 tháng / 3 tháng / 1 năm) có tính năng hoàn toàn giống nhau. Bạn chỉ tiết kiệm hơn khi chọn gói dài hạn hơn." },
  { q: "Thanh toán có an toàn không?", a: "Hoàn toàn an toàn. Chúng tôi sử dụng cổng thanh toán được mã hóa SSL, không lưu trữ thông tin thẻ ngân hàng của bạn." },
  { q: "Có bảo lưu tiền nếu không hài lòng không?", a: "Chúng tôi cam kết hoàn tiền 100% trong vòng 7 ngày đầu nếu bạn không hài lòng, không cần giải thích lý do." },
];

/* ── Highlight features ─────────────────────────────────────────────────── */
const HIGHLIGHTS = [
  { icon: <Zap className="w-5 h-5" style={{ color: "#a3e635" }} />, title: "AI Gợi Ý Thông Minh", desc: "Phân tích khẩu vị & mục tiêu để đề xuất bữa ăn tối ưu cho từng người." },
  { icon: <Shield className="w-5 h-5" style={{ color: "#22d3ee" }} />, title: "Bảo Mật Tuyệt Đối", desc: "Dữ liệu sức khoẻ của bạn được mã hóa và bảo vệ theo chuẩn quốc tế." },
  { icon: <HeartHandshake className="w-5 h-5" style={{ color: "#f472b6" }} />, title: "Hỗ Trợ Tận Tâm", desc: "Đội ngũ luôn sẵn sàng giúp bạn đạt mục tiêu sức khoẻ mỗi ngày." },
];

/* ── Format VND ──────────────────────────────────────────────────────────── */
function vnd(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

/* ── FAQ Item ────────────────────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden transition-all"
      style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 group"
      >
        <span className="text-sm font-semibold text-white group-hover:text-lime-300 transition-colors">{q}</span>
        <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform"
          style={{ color: "#a3e635", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm" style={{ color: "#94a3b8", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export function MembershipPage() {
  const [selectedTier, setSelectedTier] = useState("1_MONTH");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const { user, login } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Kiểm tra thanh toán từ URL
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      toast.success("🎉 Thanh toán thành công! Đã nâng cấp Membership.");

      // Xóa params trước để tránh lặp khi render lại
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("payment");
      setSearchParams(newParams, { replace: true });

      // Auto-refresh token để cập nhật quyền ROLE_MEMBERSHIP mới
      const isLocalStorage = !!localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
      if (refreshToken) {
        authApi.refresh({ refreshToken }).then(res => {
          const data = res.data?.data;
          if (data?.accessToken) {
            // Lưu token mới vào đúng storage
            const storage = isLocalStorage ? localStorage : sessionStorage;
            storage.setItem("accessToken", data.accessToken);
            if (data.refreshToken) storage.setItem("refreshToken", data.refreshToken);

            // Cập nhật user trong storage với role mới được decode từ token mới
            const storedUser = JSON.parse(storage.getItem("user") || "{}");
            try {
              const decoded: any = jwtDecode(data.accessToken);
              const newRole = decoded.role || decoded.Role || storedUser.role;
              const updatedUser = { ...storedUser, role: newRole };
              storage.setItem("user", JSON.stringify(updatedUser));
              login(data.accessToken, data.refreshToken, updatedUser, isLocalStorage);
            } catch {
              login(data.accessToken, data.refreshToken, storedUser, isLocalStorage);
            }

            // Sau khi cập nhật token, lấy thông tin subscription mới
            setTimeout(() => {
              subscriptionApi.getCurrentSubscription()
                .then(r => { if (r.data?.data) setSubscription(r.data.data); })
                .catch(() => { });
            }, 500);
          }
        }).catch(err => console.error("Auto refresh token thất bại:", err));
      }
    } else if (paymentStatus === "failed") {
      toast.error("Thanh toán thất bại hoặc đã bị hủy.");
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("payment");
      setSearchParams(newParams, { replace: true });
    }

    // 2. Fetch gói hiện tại (an toàn - không throw nếu 403)
    if (user) {
      subscriptionApi.getCurrentSubscription()
        .then(res => {
          if (res.data?.data) {
            setSubscription(res.data.data);
          }
        })
        .catch(() => {
          // Im lặng - user có thể chưa có subscription hoặc chưa đăng nhập
        });
    }

    // 3. Fetch danh sách các gói cước
    bundleApi.getAllActiveBundles()
      .then(res => {
        if (res.data?.data) {
          const dataPayload = res.data.data as any;
          const bundleList = Array.isArray(dataPayload) ? dataPayload : (dataPayload.content || []);
          
          if (Array.isArray(bundleList)) {
            setBundles(bundleList);
            const premium = bundleList.find((b: any) => b.name.toLowerCase().includes("membership") || (b.durations && b.durations.length > 0 && b.durations[0].price > 0));
            if (premium && premium.durations && premium.durations.length > 0) {
              setSelectedTier(premium.durations[0].durationCode);
            }
          }
        }
      })
      .catch(console.error);
  }, []);

  const handlePayment = async (method: PaymentMethod) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để tiếp tục");
      return;
    }
    const premiumBundle = bundles.find(b => b.name.toLowerCase().includes("membership") || (b.durations && b.durations.length > 0 && b.durations[0].price > 0));
    if (!premiumBundle) return;

    setIsProcessing(true);
    const toastId = toast.loading(`Đang khởi tạo thanh toán qua ${method}...`);
    try {
      const res = await paymentApi.createPayment({
        // Extract id properly in case user object structure varies
        userId: (user as any).id || (user as any)._id || (user as any).sub || "",
        bundleId: premiumBundle.id,
        durationCode: selectedTier,
        paymentMethod: method
      });

      if (res.data?.data?.paymentUrl) {
        toast.success("Chuyển hướng...", { id: toastId });
        window.location.href = res.data.data.paymentUrl;
      } else {
        toast.error("Không nhận được URL thanh toán", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khởi tạo thanh toán", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const freeBundle = bundles.find(b => b.name.toLowerCase().includes("free") || (b.durations && b.durations.length > 0 && b.durations[0].price === 0));
  const premiumBundle = bundles.find(b => b.name.toLowerCase().includes("membership") || (b.durations && b.durations.length > 0 && b.durations[0].price > 0));
  const activeDuration = premiumBundle?.durations?.find(d => d.durationCode === selectedTier) || premiumBundle?.durations?.[0];

  const remainingDays = subscription ? Math.max(0, Math.ceil((new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : 0;
  const isPremiumActive = subscription && subscription.status === 'ACTIVE' && remainingDays > 0;


  return (
    <div className="min-h-screen" style={{ background: "#0f1117" }}>
      <AppHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.2)", color: "#a3e635" }}>
            <Crown className="w-3.5 h-3.5" /> Đăng ký thành viên
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Ăn uống thông minh hơn{" "}
            <span style={{
              background: "linear-gradient(90deg,#a3e635,#4ade80)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>cùng AI</span>
          </h1>
          <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: "#64748b" }}>
            Giải quyết sự nhàm chán trong ăn uống — AI cá nhân hóa thực đơn, tính dinh dưỡng và hỗ trợ mua sắm cho Gymer bận rộn.
          </p>
        </section>

        {/* ── Plans ────────────────────────────────────────────────────── */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* ── Card FREE ────────────────────────── */}
            <div className="rounded-2xl p-6 flex flex-col h-full"
              style={{
                background: "rgba(26,31,46,0.9)",
                border: "1px solid rgba(100,116,139,0.25)",
              }}>
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="text-4xl">🥉</div>
                <div>
                  <h2 className="text-2xl font-black text-white">{freeBundle?.name || "Free"}</h2>
                  <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "#64748b" }}>Người trải nghiệm</p>
                </div>
                <div className="ml-auto px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(100,116,139,0.15)", color: "#94a3b8", border: "1px solid rgba(100,116,139,0.25)" }}>
                  Miễn phí
                </div>
              </div>

              {/* Price */}
              <div className="text-4xl font-black mb-1" style={{ color: "#94a3b8" }}>0đ</div>
              <p className="text-xs mb-6" style={{ color: "#475569" }}>Không cần thẻ tín dụng</p>

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-6">
                {freeBundle?.features?.length ? freeBundle.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(100,116,139,0.15)", color: "#94a3b8" }}>
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-sm" style={{ color: "#cbd5e1" }}>{f}</span>
                  </li>
                )) : FREE_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(100,116,139,0.15)", color: "#94a3b8" }}>
                      {f.icon}
                    </div>
                    <span className="text-sm" style={{ color: "#cbd5e1" }}>{f.text}</span>
                  </li>
                ))}
              </ul>

              {/* Limited note */}
              <div className="rounded-xl p-3 mb-5 text-xs" style={{ background: "rgba(100,116,139,0.08)", border: "1px solid rgba(100,116,139,0.15)", color: "#64748b" }}>
                <span className="font-semibold text-slate-400">Không bao gồm:</span> Thực đơn cá nhân hoá, tính toán dinh dưỡng, danh sách nguyên liệu & mua sắm online.
              </div>

              <button disabled
                className="w-full h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-default"
                style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>
                <Check className="w-4 h-4" /> Gói cơ bản — miễn phí mãi
              </button>
            </div>

            {/* ── Card MEMBERSHIP ──────────────────── */}
            {isPremiumActive ? (
              // HIỂN THỊ KHI ĐÃ MUA GÓI
              <div className="relative rounded-2xl p-6 flex flex-col h-full items-center justify-center text-center overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, rgba(26,31,46,0.95), rgba(16,21,36,0.95))",
                  border: "1px solid rgba(163,230,53,0.3)",
                  boxShadow: "0 10px 40px rgba(163,230,53,0.15)",
                }}>
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: "linear-gradient(90deg,#a3e635,#4ade80)" }}></div>

                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-2xl"
                  style={{ background: "rgba(163,230,53,0.1)", border: "2px solid rgba(163,230,53,0.4)" }}>
                  <Crown className="w-10 h-10" style={{ color: "#a3e635" }} />
                </div>

                <h2 className="text-3xl font-black text-white mb-2">Thành Viên VIP</h2>
                <p className="text-sm mb-8" style={{ color: "#94a3b8" }}>Bạn đang tận hưởng toàn bộ đặc quyền cao cấp của MealYummy.</p>

                <div className="w-full rounded-2xl p-5 mb-8" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold" style={{ color: "#cbd5e1" }}>Thời hạn còn lại</span>
                    <span className="text-2xl font-black" style={{ color: "#a3e635" }}>{remainingDays} ngày</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <div className="h-full rounded-full" style={{ width: "100%", background: "linear-gradient(90deg,#a3e635,#4ade80)" }}></div>
                  </div>
                  <div className="text-xs text-right mt-2" style={{ color: "#64748b" }}>
                    Hết hạn vào: {new Date(subscription.endDate).toLocaleDateString("vi-VN")}
                  </div>
                </div>

                <button onClick={() => navigate('/')}
                  className="w-full h-12 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg,#a3e635,#4ade80)", color: "#0f1117" }}>
                  <Sparkles className="w-4 h-4" /> Bắt đầu sử dụng ngay
                </button>
              </div>
            ) : premiumBundle && (
              // HIỂN THỊ KHI CHƯA MUA GÓI
              <div className="relative rounded-2xl p-6 flex flex-col h-full"
                style={{
                  background: "#161b22",
                  border: "1px solid rgba(163,230,53,0.3)",
                  boxShadow: "0 0 40px rgba(163,230,53,0.12)",
                }}>
                {/* Popular badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 text-gray-900 shadow-lg whitespace-nowrap"
                    style={{ background: "#a3e635" }}>
                    <Star className="w-3.5 h-3.5 fill-current" /> Được chọn nhiều nhất
                  </div>
                </div>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6 mt-3">
                  <div className="w-10 h-10 flex items-center justify-center text-2xl relative">
                    🥉
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white leading-none mb-1">Membership</h2>
                    <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "#a3e635" }}>Gymer Pro</p>
                  </div>
                </div>

                {/* Tier selector */}
                <div className="flex gap-3 mb-6">
                  {premiumBundle.durations?.map((t, idx) => {
                    const isSelected = selectedTier === t.durationCode;
                    let topBadge = null;
                    if (idx === 1) topBadge = "Tiết kiệm nhất";
                    if (idx === 2) topBadge = "Siêu ưu đãi";

                    let displayName = t.durationCode;
                    if (t.durationCode === "1_MONTH") displayName = "1 Tháng";
                    else if (t.durationCode === "3_MONTHS") displayName = "3 Tháng";
                    else if (t.durationCode === "6_MONTHS") displayName = "6 Tháng";
                    else if (t.durationCode === "1_YEAR") displayName = "1 Năm";

                    return (
                      <button
                        key={t.durationCode}
                        onClick={() => setSelectedTier(t.durationCode)}
                        className="flex-1 relative rounded-xl p-3 text-center transition-all border"
                        style={{
                          background: isSelected ? "rgba(163,230,53,0.05)" : "transparent",
                          borderColor: isSelected ? "#a3e635" : "rgba(255,255,255,0.1)",
                        }}
                      >
                        {topBadge && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap text-gray-900"
                            style={{ background: "#a3e635" }}>
                            {topBadge}
                          </div>
                        )}
                        <div className={`text-xs font-bold mb-1 ${isSelected ? "text-lime-300" : "text-white"}`}>{displayName}</div>
                        <div className="text-[13px] font-black text-white mb-1">{vnd(t.price)}</div>

                        {t.originalPrice && (
                          <div className="text-[9px]" style={{ color: isSelected ? "#a3e635" : "#94a3b8" }}>
                            Tiết kiệm {vnd(t.originalPrice - t.price)}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Active price display */}
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-black text-lime-300">{activeDuration ? vnd(activeDuration.price) : "Liên hệ"}</span>
                  <span className="text-sm font-medium mb-1.5" style={{ color: "#64748b" }}>
                    / {activeDuration?.durationCode === '1_MONTH' ? '1 tháng' :
                      activeDuration?.durationCode === '3_MONTHS' ? '3 tháng' :
                        activeDuration?.durationCode === '6_MONTHS' ? '6 tháng' :
                          activeDuration?.durationCode === '1_YEAR' ? '1 năm' :
                            activeDuration?.durationCode}
                  </span>
                </div>
                <p className="text-xs mb-6" style={{ color: "#64748b" }}>Gia hạn hàng tháng</p>

                {/* Features */}
                <ul className="space-y-4 flex-1 mb-8">
                  {premiumBundle.features?.length ? premiumBundle.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(163,230,53,0.15)", color: "#a3e635" }}>
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <span className="text-[13px] text-slate-300">{f}</span>
                    </li>
                  )) : MEMBER_FEATURES.map((f, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(163,230,53,0.15)", color: "#a3e635" }}>
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <span className="text-[13px] text-slate-300">{f.text}</span>
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="mt-auto pt-2">
                  <button
                    disabled={isProcessing}
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full h-12 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all hover:opacity-90 text-gray-900"
                    style={{
                      background: "linear-gradient(90deg, #bef264, #a3e635, #4ade80)",
                    }}>
                    <Sparkles className="w-4 h-4" /> Đăng ký Membership →
                  </button>
                  <p className="text-[11px] text-center mt-4" style={{ color: "#475569" }}>
                    Hoàn tiền 100% trong 7 ngày nếu không hài lòng
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Why MealYummy ────────────────────────────────────────────── */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Tại sao chọn MealYummy?</h2>
            <p className="text-sm" style={{ color: "#64748b" }}>Được thiết kế dành riêng cho Gymer bận rộn</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} className="rounded-2xl p-5 text-center space-y-3 transition-all hover:scale-[1.02]"
                style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  {h.icon}
                </div>
                <h3 className="font-bold text-white text-sm">{h.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Câu hỏi thường gặp</h2>
            <p className="text-sm" style={{ color: "#64748b" }}>Mọi thắc mắc đều có câu trả lời tại đây</p>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </section>

      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl" style={{ background: "#1a1f2e", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white">Chọn thanh toán</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                disabled={isProcessing}
                onClick={() => {
                  setShowPaymentModal(false);
                  handlePayment("PAYOS");
                }}
                className="w-full h-12 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] text-white"
                style={{
                  background: "linear-gradient(135deg, #f97316, #ef4444)", // PayOS Orange-Red theme
                  boxShadow: "0 4px 16px rgba(249, 115, 22, 0.3)",
                }}>
                <CreditCard className="w-5 h-5" /> Thanh toán qua PayOS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
