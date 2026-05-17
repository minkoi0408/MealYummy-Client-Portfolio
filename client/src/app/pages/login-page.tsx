import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { authApi } from "../../apis/auth.api";
import type {
  LoginRequestDTO,
  RegisterRequestDTO,
  VerifyLoginDTO,
  AuthResponseDTO
} from "../../types/auth.types";

import { LoginForm } from "../components/auth/login-form";
import { RegisterForm } from "../components/auth/register-form";
import { OtpForm } from "../components/auth/otp-form";
import { ForgotPasswordForm } from "../components/auth/forgot-password-form";

const LOGIN_HERO_BG = "var(--login-hero-bg, url('https://images.unsplash.com/photo-1490818387583-1b5f2222cb45?auto=format&fit=crop&q=80'))";
const LOGIN_LEFT_INSET = "https://lh3.googleusercontent.com/aida-public/AB6AXuDh6bxL75TjIZrCqE3fMpu5GLLmqV0RlAn7xWHNhJKKR_OaMGKqgPJIm3M4_UX5j2entfFEoFxsQzV0Us4c2Uzm78be6qF1D05eCSaCBU0d0szJ1I6nHsXR7zEdVPH0z59h2Vy3_-N0DXwYDjOfQ-WX0xFWXbYdmhv5VErQTtxsdjvqzoJkcJFSnggj9v5Q5if0ti5OSrF-4GHKW2XGmpRoBTybGr0Q5VQv8jU2axwQRhRipDwVS2Ha8ZGjqQmLNGNaA2OyzYtae2w_";
const LOGIN_OTP_SIDE_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuCct3bTNVcK30g255NdsNdufsF_mTsGpry7ELkwBrk-XCyG4a6PTf_3v3LQOtsO5zMiH9s0iIwjWqt9KhoSr4FJN3Zk1sWa7U-Vc5SpxnF8RBF69cO7jUX6zaJlnPxfx6iEL22SQjPQhvCKqANPjeqD5Jio-gtonRS9oAZ-hcTnjrdAMi4KKOAIn4-g46oQ5Z3FzX5nAn7ykaCgznLCxXcopoUlQrkenOCoWnQU34FLF0tQAqsgFs1-PzG9TBNdpDG1gcPIuTPLCpyV";

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register" | "otp" | "loading" | "forgot">("login");
  const [emailForOtp, setEmailForOtp] = useState("");
  const [otpContext, setOtpContext] = useState<"register" | "login">("register");
  const [rememberMeContext, setRememberMeContext] = useState(false);
  const [mfaMessage, setMfaMessage] = useState("");
  const [hasTotpContext, setHasTotpContext] = useState(false);


  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  // Cảm biến tự động đăng nhập: Thấy Token là nhảy thẳng vào Home hoặc trang trước đó
  useEffect(() => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (token) {
      let role = "";
      try {
        const decoded: any = jwtDecode(token);
        role = decoded.role || decoded.Role || "";
      } catch (e) {}

      if (role === "ROLE_ADMIN" || role === "ROLE_MANAGER") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate(from === "/login" ? "/home" : from, { replace: true });
      }
    }
  }, [navigate, from]);

  return (
    <div
      className="h-screen w-full text-stitch-on-background font-lexend selection:bg-stitch-primary selection:text-black overflow-hidden relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('${LOGIN_HERO_BG.replace("var(--login-hero-bg, url('", "").replace("'))", "")}')`,
      }}
    >
      {/* Dark Overlay for Hero Background */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <main className="h-full w-full flex flex-col lg:flex-row relative z-10">

        {/* ── LEFT SIDE: Branding & Visuals (Stitch Style) ────────────── */}
        {/* Đã thêm ml-[10%] và xóa overflow-hidden để glow không bị cắt xén tạo viền */}
        <section className="hidden lg:flex w-[45%] flex-col justify-center px-16 relative bg-transparent border-none shadow-none ml-[10%]">

          {/* Decorative Glows (Đã kéo dịch vào trong một chút để tỏa sáng tự nhiên hơn) */}
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-stitch-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 -left-10 w-80 h-80 bg-stitch-secondary/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Main Content Wrapper - Căn trái toàn bộ */}
          <div className="relative z-10 flex flex-col items-start space-y-10 w-full text-left">

            <div className="max-w-xl">
              <Link to="/" className="flex items-center gap-3 group hover:scale-105 transition-transform w-fit mb-4">
                <img src="/logo.svg" alt="MealYummy" className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(163,230,53,0.5)]" />
                <span className="text-5xl font-black italic text-stitch-primary-container tracking-tighter">MealYummy</span>
              </Link>
              <p className="text-lg text-stitch-outline max-w-md mt-6 leading-relaxed">
                {mode === "otp"
                  ? "Xác thực danh tính để đảm bảo hành trình dinh dưỡng của bạn luôn an toàn và chuyên nghiệp."
                  : "MealYummy: Giải pháp dinh dưỡng AI tối ưu chỉ số sinh học và hiệu suất cơ thể thông qua cá nhân hóa thực đơn."}
              </p>
            </div>

            {/* Featured Image */}
            <div className="relative w-full max-w-md group">
              {/* Lớp Glow phát sáng phía sau bức ảnh (hiệu ứng ánh sáng tỏa ra xung quanh) */}
              <div className="absolute -inset-1 bg-gradient-to-r from-stitch-primary/30 to-stitch-secondary/30 rounded-[2rem] blur-lg opacity-40 transition duration-500 group-hover:opacity-60"></div>

              {/* Vùng chứa ảnh chính */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src={LOGIN_LEFT_INSET}
                  alt="Featured"
                  className="w-full h-64 object-cover transform transition-transform duration-700 group-hover:scale-105"
                />

                {/* Lớp phủ (Overlay) nhẹ trên mặt ảnh: 
                    Làm tối nhẹ ở viền dưới (để nếu có text chèn lên sẽ dễ đọc) 
                    và phủ một lớp sáng mờ mờ màng kính (glass effect) */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-[#0a1005]/80 pointer-events-none"></div>
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none"></div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 max-w-lg w-full items-center">
              <div className="text-left">
                <div className="text-2xl font-bold bg-gradient-to-r from-stitch-primary to-stitch-secondary bg-clip-text text-transparent">10K+</div>
                <div className="text-[10px] uppercase tracking-widest text-stitch-outline font-space-grotesk mt-1">USER ACTIVE</div>
              </div>

              <div className="border-l border-white/10 pl-8 text-left">
                <div className="text-2xl font-bold bg-gradient-to-r from-stitch-primary to-stitch-secondary bg-clip-text text-transparent">500+</div>
                <div className="text-[10px] uppercase tracking-widest text-stitch-outline font-space-grotesk mt-1">RECEPTIONS</div>
              </div>

              <div className="border-l border-white/10 pl-8 text-left">
                <div className="text-2xl font-bold bg-gradient-to-r from-stitch-primary to-stitch-secondary bg-clip-text text-transparent">4.9★</div>
                <div className="text-[10px] uppercase tracking-widest text-stitch-outline font-space-grotesk mt-1">RATINGS</div>
              </div>
            </div>

          </div>
        </section>

        {/* ── RIGHT SIDE: Form Interface ───────────────────────────── */}
        <section className="flex-1 flex items-center justify-center p-8 bg-transparent relative h-full overflow-y-auto no-scrollbar">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-stitch-primary/5 blur-[120px] rounded-full pointer-events-none" />

          <div className={`w-full transition-all duration-500 ease-in-out ${mode === "register" ? "max-w-3xl" : "max-w-md"}`}>
            <GlassCard className="p-10 space-y-8 rim-light">
              {/* Mode Switcher (Tab Style) */}
              {(mode === "login" || mode === "register") && (
                <div className="flex bg-stitch-background/60 p-1 rounded-full border border-white/5">
                  <button
                    onClick={() => setMode("register")}
                    className={`flex-1 py-2 px-4 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${mode === "register" ? "bg-stitch-primary-container text-black shadow-lg" : "text-stitch-outline hover:text-white"}`}
                  >
                    Đăng ký
                  </button>
                  <button
                    onClick={() => setMode("login")}
                    className={`flex-1 py-2 px-4 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${mode === "login" ? "bg-stitch-primary-container text-black shadow-lg" : "text-stitch-outline hover:text-white"}`}
                  >
                    Đăng nhập
                  </button>
                </div>
              )}

              {/* Header Content */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  {mode === "login" ? "Đăng nhập " : mode === "register" ? "Tạo tài khoản " : mode === "forgot" ? "Khôi phục mật khẩu 🔑" : "Xác thực OTP 🛡️"}
                </h2>
              </div>

              {/* Form Content (Animated) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {mode === "otp" && <OtpForm email={emailForOtp} context={otpContext} rememberMe={rememberMeContext} initialMessage={mfaMessage} hasTotp={hasTotpContext} onSuccess={() => {
                    if (otpContext === "login") {
                      setMode("loading");
                      const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
                      let role = "";
                      if (token) {
                        try {
                          const decoded: any = jwtDecode(token);
                          role = decoded.role || decoded.Role || "";
                        } catch (e) {}
                      }
                      if (role === "ROLE_ADMIN" || role === "ROLE_MANAGER") {
                        navigate("/dashboard", { replace: true });
                      } else {
                        setTimeout(() => {
                          navigate(from === "/login" ? "/home" : from, { replace: true });
                        }, 2500);
                      }
                    } else {
                      setMode("login");
                    }
                  }} />}
                  {mode === "forgot" && <ForgotPasswordForm onSuccess={() => setMode("login")} />}
                  {mode === "login" && (
                    <LoginForm
                      onSuccess={(email, rememberMe, message, hasTotp) => {
                        if (email) {
                          setEmailForOtp(email);
                          setOtpContext("login");
                          setRememberMeContext(rememberMe);
                          setMfaMessage(message || "");
                          setHasTotpContext(hasTotp || false);
                          setMode("otp");
                        }
                      }}
                      onForgotPassword={() => setMode("forgot")}
                    />
                  )}
                  {mode === "register" && (
                    <RegisterForm
                      onSuccess={(email) => {
                        if (email) {
                          setEmailForOtp(email);
                          setOtpContext("register");
                          setMode("otp");
                        } else {
                          setMode("login");
                        }
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Back Link */}
              <div className="">
                {mode === "login" ? (
                  <button
                    onClick={() => setMode("register")}
                    className="text-sm text-stitch-outline hover:text-white transition-colors flex items-center justify-center gap-2 group mx-auto"
                  >
                    Chưa có tài khoản? <span className="text-stitch-primary-container font-bold hover:underline">Đăng ký ngay</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setMode("login")}
                    className="text-sm text-stitch-outline hover:text-white transition-colors flex items-center justify-center gap-2 group mx-auto"
                  >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    {mode === "forgot" ? "Quay lại đăng nhập" : mode === "otp" ? "Quay lại đăng nhập" : "Quay lại đăng nhập"}
                  </button>
                )}
              </div>
            </GlassCard>
          </div>

        </section>
      </main>

      {/* ── FULL SCREEN LOADING OVERLAY ──────────────────────────── */}
      {mode === "loading" && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-stitch-background animate-in fade-in duration-500">
          <div className="relative w-24 h-24 mb-6 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(163,230,53,0.3)] bg-[#0f1117] border border-white/5 overflow-hidden animate-in zoom-in duration-500 delay-150">
            <div className="absolute inset-0 bg-gradient-to-t from-stitch-primary-container/20 to-transparent"></div>
            <img src="/logo.svg" alt="MealYummy" className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(163,230,53,0.8)] z-10" />
          </div>

          <h2 className="text-3xl font-black italic tracking-tighter bg-gradient-to-r from-stitch-primary to-stitch-secondary bg-clip-text text-transparent mb-8 drop-shadow-[0_0_15px_rgba(163,230,53,0.4)]">
            MealYummy
          </h2>

          <div className="w-full max-w-[240px] space-y-3">
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-stitch-primary-container to-stitch-secondary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-stitch-outline">Đang tải dữ liệu dinh dưỡng...</p>
              <p className="text-[8px] text-stitch-outline/60 mt-1 uppercase tracking-[0.2em]">100% Chính xác</p>
            </div>
          </div>

          <div className="absolute bottom-8 flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/5 bg-white/5">
            <span className="material-symbols-outlined text-stitch-primary-container text-sm">bolt</span>
            <div className="text-left">
              <p className="text-[9px] font-black uppercase text-stitch-primary-container">Precision Mode</p>
              <p className="text-[7px] text-stitch-outline">Optimizing macro pathways<br />for your performance profile.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// UI Helper Components (Định nghĩa ngoài component chính để tránh mất focus khi re-render)
const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-stitch-surface/60 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl overflow-hidden ${className}`}
    style={{ boxShadow: '0 0 30px rgba(163, 230, 53, 0.1)' }}>
    {children}
  </div>
);