import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Mail, Lock, User, Eye, EyeOff,
  ArrowRight, Sparkles, CheckCircle2, Chrome, Dumbbell
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/app");
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#f1f5f9",
  };

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT SIDE: Branding ──────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f1a0a, #1a2e0f, #0f1117)" }}>

        {/* Background glow blobs */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #a3e635, transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #4ade80, transparent)" }} />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, #a3e635 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        {/* Content */}
        <div className="relative z-10 max-w-lg space-y-10">

          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center border group-hover:scale-105 transition-transform shadow-xl"
              style={{ background: "rgba(163,230,53,0.15)", borderColor: "rgba(163,230,53,0.3)" }}>
              <Dumbbell className="w-6 h-6 text-lime-400" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-2xl text-white">MealYummy</span>
              <span className="text-xs tracking-widest uppercase" style={{ color: "#a3e635" }}>EAT RIGHT. TRAIN HARD.</span>
            </div>
          </Link>

          {/* Hero text */}
          <div className="space-y-5">
            <h1 className="text-5xl font-black text-white leading-tight">
              Ăn đúng.<br />
              <span style={{ color: "#a3e635" }}>Tập hiệu quả.</span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "rgba(241,245,249,0.7)" }}>
              AI gợi ý món ăn phù hợp mục tiêu fitness. Protein, calo, dinh dưỡng — tất cả được cân đối cho bạn.
            </p>

            {/* Features */}
            <div className="space-y-3 pt-2">
              {[
                "Gợi ý món ăn bằng AI thông minh",
                "1000+ công thức cho người tập gym",
                "Lên thực đơn & danh sách đi chợ tự động",
                "Hoàn toàn miễn phí, không giới hạn",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(163,230,53,0.15)", border: "1px solid rgba(163,230,53,0.25)" }}>
                    <CheckCircle2 className="w-4 h-4 text-lime-400" />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "rgba(241,245,249,0.85)" }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Food images */}
          <div className="grid grid-cols-3 gap-3 h-28">
            {[
              "https://images.unsplash.com/photo-1680410778398-e99a769e1a3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
              "https://images.unsplash.com/photo-1730806810569-4964fe2db162?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
              "https://images.unsplash.com/photo-1757715377459-92ce5a081789?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
            ].map((src, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden shadow-2xl ${i === 1 ? "translate-y-2" : i === 2 ? "-translate-y-2" : ""}`}
                style={{ border: "1px solid rgba(163,230,53,0.1)" }}>
                <ImageWithFallback src={src} alt={`Food ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>

          <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.25)" }}>© 2026 MealYummy. Made with ❤️ in Vietnam</p>
        </div>
      </div>

      {/* ── RIGHT SIDE: Auth Form ─────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center justify-center gap-2.5 mb-8 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform"
              style={{ background: "rgba(163,230,53,0.15)", border: "1px solid rgba(163,230,53,0.3)" }}>
              <Dumbbell className="w-5 h-5 text-lime-400" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-xl text-white">MealYummy</span>
              <span className="text-[10px] tracking-widest uppercase" style={{ color: "#a3e635" }}>EAT RIGHT. TRAIN HARD.</span>
            </div>
          </Link>

          {/* Auth Card */}
          <div className="rounded-3xl p-8 shadow-2xl"
            style={{ background: "rgba(26,31,46,0.95)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>

            {/* Tab switcher */}
            <div className="flex gap-2 mb-8 p-1.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }}>
              {["login", "register"].map((m) => (
                <button key={m} onClick={() => setMode(m as "login" | "register")}
                  className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all"
                  style={mode === m
                    ? { background: "rgba(163,230,53,0.12)", color: "#a3e635", border: "1px solid rgba(163,230,53,0.25)" }
                    : { color: "#64748b" }
                  }
                >
                  {m === "login" ? "Đăng nhập" : "Đăng ký"}
                </button>
              ))}
            </div>

            {/* Form header */}
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white mb-2">
                {mode === "login" ? "Chào mừng trở lại! 👋" : "Tạo tài khoản mới 🎉"}
              </h2>
              <p className="text-sm" style={{ color: "#64748b" }}>
                {mode === "login" ? "Đăng nhập để tiếp tục khám phá món ngon" : "Tham gia cộng đồng MealYummy ngay hôm nay"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name (register only) */}
              {mode === "register" && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-lime-400" /> Họ và tên
                  </label>
                  <div className="relative">
                    <input id="name" placeholder="Nguyễn Văn A" required
                      className="w-full h-12 px-4 rounded-xl text-sm outline-none"
                      style={inputStyle}
                      onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(163,230,53,0.5)"; }}
                      onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-lime-400" /> Email
                </label>
                <input id="email" type="email" placeholder="example@email.com" required
                  className="w-full h-12 px-4 rounded-xl text-sm outline-none"
                  style={inputStyle}
                  onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(163,230,53,0.5)"; }}
                  onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-lime-400" /> Mật khẩu
                </label>
                <div className="relative">
                  <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required
                    className="w-full h-12 px-4 pr-12 rounded-xl text-sm outline-none"
                    style={inputStyle}
                    onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(163,230,53,0.5)"; }}
                    onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#64748b" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#64748b"; }}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm password (register only) */}
              {mode === "register" && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-lime-400" /> Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <input id="confirm-password" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" required
                      className="w-full h-12 px-4 pr-12 rounded-xl text-sm outline-none"
                      style={inputStyle}
                      onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(163,230,53,0.5)"; }}
                      onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: "#64748b" }}>
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Remember / Forgot (login) */}
              {mode === "login" && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded accent-lime-400" />
                    <span style={{ color: "#64748b" }}>Ghi nhớ đăng nhập</span>
                  </label>
                  <button type="button" className="font-semibold transition-colors" style={{ color: "#a3e635" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#bef264"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#a3e635"; }}
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              )}

              {/* Terms (register) */}
              {mode === "register" && (
                <div className="flex items-start gap-2 text-xs" style={{ color: "#64748b" }}>
                  <input type="checkbox" className="mt-0.5 w-4 h-4 rounded accent-lime-400" required />
                  <span>Tôi đồng ý với <a href="#" className="font-semibold" style={{ color: "#a3e635" }}>Điều khoản dịch vụ</a> và <a href="#" className="font-semibold" style={{ color: "#a3e635" }}>Chính sách bảo mật</a></span>
                </div>
              )}

              {/* Submit */}
              <button type="submit"
                className="w-full h-12 rounded-2xl font-bold text-base flex items-center justify-center gap-2 text-gray-900 transition-all hover:scale-[1.02] group"
                style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)", boxShadow: "0 0 30px rgba(163,230,53,0.3)" }}>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                {mode === "login" ? "Đăng nhập" : "Đăng ký ngay"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} /></div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 text-sm" style={{ background: "rgba(26,31,46,0.95)", color: "#64748b" }}>Hoặc tiếp tục với</span>
              </div>
            </div>

            {/* Social login */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Google", icon: <Chrome className="w-5 h-5 mr-2" /> },
                { label: "Facebook", icon: <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.52-1.53-2.67 0-4.84 2.17-4.84 4.84 0 .38.04.75.13 1.1-4.02-.2-7.58-2.13-9.97-5.06-.42.72-.66 1.55-.66 2.44 0 1.68.86 3.16 2.15 4.03-.79-.02-1.54-.24-2.19-.6v.06c0 2.34 1.67 4.3 3.88 4.74-.4.11-.83.17-1.27.17-.31 0-.62-.03-.92-.08.62 1.94 2.42 3.35 4.55 3.39-1.67 1.31-3.77 2.09-6.05 2.09-.39 0-.78-.02-1.17-.07 2.18 1.4 4.77 2.21 7.55 2.21 9.05 0 14-7.5 14-14 0-.21 0-.42-.02-.63.96-.69 1.8-1.56 2.46-2.55z" /></svg> },
              ].map((social) => (
                <button key={social.label} type="button"
                  className="h-11 flex items-center justify-center text-sm font-medium rounded-xl transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#f1f5f9";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
                  }}
                >
                  {social.icon} {social.label}
                </button>
              ))}
            </div>
          </div>

          {/* Back to home */}
          <div className="text-center mt-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm transition-colors group"
              style={{ color: "#64748b" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#94a3b8"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#64748b"; }}
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}