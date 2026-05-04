import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { authApi } from "../../apis/auth.api";
import type {
  LoginRequestDTO,
  RegisterRequestDTO,
  OtpVerifyDTO,
  GoogleTokenRequestDTO
} from "../../types/auth.types";

import { LoginForm } from "../components/auth/login-form";
import { RegisterForm } from "../components/auth/register-form";
import { OtpForm } from "../components/auth/otp-form";
import { ForgotPasswordForm } from "../components/auth/forgot-password-form";

declare global {
  interface Window {
    google: any;
  }
}

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register" | "otp" | "loading" | "forgot">("login");
  const [emailForOtp, setEmailForOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Cảm biến tự động đăng nhập: Thấy Token là nhảy thẳng vào Home
  useEffect(() => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  // Google Login Initialization
  useEffect(() => {
    let timer: any;

    const initGoogle = () => {
      const btnElement = googleBtnRef.current;
      if (window.google && btnElement && (mode === "login" || mode === "register" || mode === "forgot")) {
        // Luôn dọn dẹp để vẽ mới hoàn toàn cho chắc chắn
        btnElement.innerHTML = "";

        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          btnElement,
          { theme: "outline", size: "large", width: "100%", shape: "circle" }
        );
        return true;
      }
      return false;
    };

    // Thử vẽ ngay sau 200ms để đợi DOM ổn định
    timer = setInterval(() => {
      if (initGoogle()) {
        clearInterval(timer);
      }
    }, 200);

    return () => clearInterval(timer);
  }, [mode]);

  const handleGoogleResponse = async (response: any) => {
    if (!response.credential) {
      toast.error("Quá trình đăng nhập Google bị hủy hoặc gặp lỗi.");
      return;
    }
    setLoading(true);
    try {
      const request: GoogleTokenRequestDTO = {
        token: response.credential,
      };
      const result = await authApi.loginWithGoogle(request);
      const payload = result.data.data;

      localStorage.setItem("accessToken", payload.accessToken);
      localStorage.setItem("refreshToken", payload.refreshToken);
      localStorage.setItem("user", JSON.stringify({
        username: payload.username,
        email: payload.email
      }));

      toast.success("Đăng nhập bằng Google thành công!");
      setMode("loading");
      setTimeout(() => navigate("/home"), 2500);
    } catch (error: any) {
      toast.error("Đăng nhập bằng Google thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stitch-background text-stitch-on-background font-lexend selection:bg-stitch-primary selection:text-black overflow-x-hidden">

      {/* ── TOP NAV (Stitch Style) ────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-stitch-background/80 backdrop-blur-2xl border-b border-white/5">
        <Link to="/" className="flex items-center gap-2 group hover:scale-105 transition-transform">
          <img src="/logo.svg" alt="MealYummy" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(163,230,53,0.5)]" />
          <span className="text-2xl font-black italic text-stitch-primary-container tracking-tighter">MealYummy</span>
        </Link>
        <div className="flex items-center gap-6">
          <a href="#" className="font-space-grotesk text-xs uppercase tracking-widest text-stitch-outline hover:text-stitch-primary transition-colors">Trợ giúp</a>
          {mode !== "login" && (
            <button onClick={() => setMode("login")} className="px-6 py-2 bg-stitch-primary-container text-black font-semibold rounded-lg hover:shadow-[0_0_15px_rgba(163,230,53,0.4)] transition-all active:scale-95">
              Đăng nhập
            </button>
          )}
        </div>
      </header>

      <main className="min-h-screen pt-16 flex flex-col md:flex-row">

        {/* ── LEFT SIDE: Branding & Visuals (Stitch Style) ────────────── */}
        <section className="hidden md:flex w-1/2 flex-col justify-center px-16 relative overflow-hidden bg-gradient-to-br from-[#0f1a0a] via-[#1a2e0f] to-stitch-background">
          {/* Decorative Glows */}
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-stitch-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-stitch-secondary/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 space-y-10">
            <div className="max-w-xl">
              <h1 className="text-5xl font-black text-white leading-tight">
                {mode === "otp" ? "Bảo vệ tài khoản" : "Chào mừng tới"} <br />
                <span className="text-stitch-primary-container drop-shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                  {mode === "otp" ? "Của bạn" : "MealYummy!"}
                </span>
              </h1>
              <p className="text-lg text-stitch-outline max-w-md mt-6 leading-relaxed">
                {mode === "otp"
                  ? "Xác thực danh tính để đảm bảo hành trình dinh dưỡng của bạn luôn an toàn và chuyên nghiệp."
                  : "MealYummy: Giải pháp dinh dưỡng AI tối ưu chỉ số sinh học và hiệu suất cơ thể thông qua cá nhân hóa thực đơn."}
              </p>
            </div>

            {/* Featured Image */}
            <div className="relative w-full max-w-md aspect-square group">
              <img
                src={mode === "otp"
                  ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCct3bTNVcK30g255NdsNdufsF_mTsGpry7ELkwBrk-XCyG4a6PTf_3v3LQOtsO5zMiH9s0iIwjWqt9KhoSr4FJN3Zk1sWa7U-Vc5SpxnF8RBF69cO7jUX6zaJlnPxfx6iEL22SQjPQhvCKqANPjeqD5Jio-gtonRS9oAZ-hcTnjrdAMi4KKOAIn4-g46oQ5Z3FzX5nAn7ykaCgznLCxXcopoUlQrkenOCoWnQU34FLF0tQAqsgFs1-PzG9TBNdpDG1gcPIuTPLCpyV"
                  : "https://lh3.googleusercontent.com/aida-public/AB6AXuBPEuzw-2nMmSPRgRvGbz5ETP61QXdrG3youIUJ0ECbUuLZ3kEg5sH_0wKvHnQnutcxcTzLqyOVQgWeXUTTm3IjICBlxg3IQehcX2xfrqIy56yiZS20xo5t-74yog01TzAgiU_3RKoBmhw0R5LaPwAoGnRXAUJ04Uizb2SGPmfSyKyDRTcarT6Hov4uWcN2WX8GlGq0yK52fuCr8DWjG9MkIPxPkZZdnYL6nYzEXw7McZfD2GR6GaYuGMOpXYFYmoNGqmF0mwfnFsSq"
                }
                alt="MealYummy Visual"
                className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(163,230,53,0.3)] group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-lg">
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-stitch-primary to-stitch-secondary bg-clip-text text-transparent">10K+</div>
                <div className="text-[10px] uppercase tracking-widest text-stitch-outline font-space-grotesk mt-1">USER ACTIVE</div>
              </div>
              <div className="border-x border-white/10 px-8">
                <div className="text-2xl font-bold bg-gradient-to-r from-stitch-primary to-stitch-secondary bg-clip-text text-transparent">500+</div>
                <div className="text-[10px] uppercase tracking-widest text-stitch-outline font-space-grotesk mt-1">RECEPTIONS</div>
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-stitch-primary to-stitch-secondary bg-clip-text text-transparent">4.9★</div>
                <div className="text-[10px] uppercase tracking-widest text-stitch-outline font-space-grotesk mt-1">RATINGS</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── RIGHT SIDE: Form Interface ───────────────────────────── */}
        <section className="flex-1 flex items-center justify-center p-8 bg-stitch-background relative">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-stitch-primary/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="w-full max-w-md">
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
                <p className="text-stitch-outline text-sm">
                  {mode === "login" ? "Nhập thông tin để tiếp tục hành trình." : mode === "register" ? "Cung cấp thông tin để bắt đầu hành trình của bạn." : mode === "forgot" ? "Chúng tôi sẽ gửi mã xác thực tới email của bạn." : "Nhập mã 6 số được gửi qua email của bạn."}
                </p>
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
                  {mode === "otp" && <OtpForm email={emailForOtp} onSuccess={() => setMode("login")} />}
                  {mode === "forgot" && <ForgotPasswordForm onSuccess={() => setMode("login")} />}
                  {mode === "login" && (
                    <LoginForm
                      onSuccess={() => {
                        setMode("loading");
                        setTimeout(() => navigate("/home"), 2500);
                      }}
                      onForgotPassword={() => setMode("forgot")}
                    />
                  )}
                  {mode === "register" && (
                    <RegisterForm
                      onSuccess={(email) => {
                        if (email) {
                          setEmailForOtp(email);
                          setMode("otp");
                        } else {
                          setMode("login");
                        }
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Social Login (Outside Animation for Stability) */}
              {(mode === "login" || mode === "register" || mode === "forgot") && (
                <div className="space-y-6 pt-4 border-t border-white/5">
                  <div className="relative flex items-center">
                    <div className="flex-grow border-t border-white/5" />
                    <span className="flex-shrink mx-4 text-[10px] uppercase tracking-widest text-stitch-outline font-bold">Hoặc đăng nhập với</span>
                    <div className="flex-grow border-t border-white/5" />
                  </div>
                  <div className="flex justify-center">
                    <div ref={googleBtnRef} className="w-full min-h-[44px]"></div>
                  </div>
                </div>
              )}

              {/* Back Link */}
              <div className="text-center pt-4">
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

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="w-full flex flex-col md:flex-row justify-between items-center px-12 py-10 bg-stitch-background border-t border-white/5 gap-6">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="MealYummy" className="w-6 h-6 object-contain opacity-80" />
          <span className="text-stitch-primary-container font-black italic tracking-tighter opacity-80">MealYummy</span>
        </div>
        <div className="text-[10px] text-stitch-outline uppercase tracking-widest font-space-grotesk text-center">
          © 2026 MealYummy Bio-Hacking Nutrition. All rights reserved.
        </div>
        <div className="flex gap-8">
          <a href="#" className="text-[10px] uppercase tracking-widest text-stitch-outline hover:text-white transition-colors">Privacy</a>
          <a href="#" className="text-[10px] uppercase tracking-widest text-stitch-outline hover:text-white transition-colors">Terms</a>
          <a href="#" className="text-[10px] uppercase tracking-widest text-stitch-outline hover:text-white transition-colors">Support</a>
        </div>
      </footer>

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