import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "../../../apis/auth.api";
import type { LoginRequestDTO, GoogleTokenRequestDTO } from "../../../types/auth.types";
import { useAuth } from "../../contexts/auth-context";

export function LoginForm({ onSuccess, onForgotPassword }: { onSuccess?: (email: string, rememberMe: boolean, message?: string, hasTotp?: boolean) => void, onForgotPassword?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const googleBtnRef = React.useRef<HTMLDivElement>(null);

  // Load remembered email on mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Global loading cursor state
  React.useEffect(() => {
    if (loading) {
      document.body.classList.add('cursor-wait');
    } else {
      document.body.classList.remove('cursor-wait');
    }
    return () => document.body.classList.remove('cursor-wait');
  }, [loading]);

  // Google Login Initialization
  React.useEffect(() => {
    let timer: any;

    const initGoogle = () => {
      const btnElement = googleBtnRef.current;
      if (window.google && btnElement) {
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

    timer = setInterval(() => {
      if (initGoogle()) {
        clearInterval(timer);
      }
    }, 200);

    return () => clearInterval(timer);
  }, []);

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

      login(
        payload.accessToken,
        payload.refreshToken,
        {
          username: payload.username,
          email: payload.email,
          avatarUrl: payload.avatarUrl
        },
        true // Google login default to remember
      );

      toast.success("Đăng nhập bằng Google thành công!");
      navigate(location.state?.from?.pathname || "/home", { replace: true });
    } catch (error: any) {
      toast.error("Đăng nhập bằng Google thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const request: LoginRequestDTO = {
        username: formData.email, // backend maps this properly
        password: formData.password,
      };
      const response = await authApi.sendOtpLogin(request);

      // Xử lý Ghi nhớ tôi
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      let message = response.data.message || "Vui lòng nhập mã xác thực.";
      let hasTotp = false;
      if (message.includes("|TOTP_ENABLED")) {
        hasTotp = true;
        message = message.split("|")[0];
      }

      toast.success(message);
      if (onSuccess) {
        onSuccess(formData.email, rememberMe, message, hasTotp);
      } else {
        navigate("/home");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-gray-200 font-bold ml-1">Email / Username</label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stitch-primary-container text-xl">mail</span>
          <input
            name="email"
            type="text"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full bg-stitch-surface-bright/30 border border-stitch-outline-variant rounded-lg py-3.5 pl-12 pr-4 text-white focus:border-stitch-primary-container focus:ring-1 focus:ring-stitch-primary-container outline-none transition-all placeholder:text-gray-500"
            placeholder="example@mealyummy.fit"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-gray-200 font-bold ml-1">Mật khẩu</label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stitch-primary-container text-xl">lock</span>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={handleInputChange}
            className="w-full bg-stitch-surface-bright/30 border border-stitch-outline-variant rounded-lg py-3.5 pl-12 pr-12 text-white focus:border-stitch-primary-container focus:ring-1 focus:ring-stitch-primary-container outline-none transition-all placeholder:text-gray-500"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? "visibility_off" : "visibility"}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-transparent checked:bg-stitch-primary-container transition-all"
          />
          <span className="text-xs text-stitch-outline group-hover:text-white transition-colors">Ghi nhớ tôi</span>
        </label>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs text-stitch-primary-container hover:underline decoration-stitch-primary-container/30 underline-offset-4"
        >
          Quên mật khẩu?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-stitch-primary-container to-stitch-secondary text-black rounded-lg font-bold shadow-[0_10px_30px_-10px_rgba(163,230,53,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
      >
        {loading ? "Đang xử lý..." : "Đăng nhập ngay"}
        <span className="material-symbols-outlined text-xl">login</span>
      </button>

      <div className="space-y-6 pt-4 border-t border-white/5">
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-white/5" />
          <span className="flex-shrink mx-4 text-[10px] uppercase tracking-widest text-stitch-outline font-bold">Hoặc đăng nhập với</span>
          <div className="flex-grow border-t border-white/5" />
        </div>

        {/* Khóa cứng chiều rộng và chiều cao khớp 100% với config Javascript */}
        <div className="flex justify-center w-full">
          <div className="w-[280px] h-[40px] flex justify-center items-center overflow-hidden rounded-[4px]">
            <div ref={googleBtnRef}></div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-[10px] text-stitch-outline">
          <Link to="#" className="text-stitch-primary-container hover:underline">Terms and Conditions</Link>
          {" "}và{" "}
          <Link to="#" className="text-stitch-primary-container hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </form>
  );
}
