import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "../../../apis/auth.api";
import type { LoginRequestDTO } from "../../../types/auth.types";

export function LoginForm({ onSuccess, onForgotPassword }: { onSuccess?: () => void, onForgotPassword?: () => void }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const request: LoginRequestDTO = {
        username: formData.email, // backend maps this properly
        password: formData.password,
      };
      const response = await authApi.login(request);
      const payload = response.data.data;

      const storage = rememberMe ? localStorage : sessionStorage;
      
      storage.setItem("accessToken", payload.accessToken);
      storage.setItem("refreshToken", payload.refreshToken);
      localStorage.setItem("user", JSON.stringify({
        username: payload.username,
        email: payload.email
      }));

      // Xử lý Ghi nhớ tôi
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      toast.success("Đăng nhập thành công! Chào mừng quay trở lại.");
      if (onSuccess) {
        onSuccess();
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
        <label className="text-[10px] uppercase tracking-widest text-stitch-outline font-bold ml-1">Email / Username</label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stitch-primary-container text-xl">mail</span>
          <input
            name="email"
            type="text"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full bg-stitch-surface-bright/30 border border-stitch-outline-variant rounded-lg py-3.5 pl-12 pr-4 text-white focus:border-stitch-primary-container focus:ring-1 focus:ring-stitch-primary-container outline-none transition-all placeholder:text-white/10"
            placeholder="example@mealyummy.fit"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-stitch-outline font-bold ml-1">Mật khẩu</label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stitch-primary-container text-xl">lock</span>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={handleInputChange}
            className="w-full bg-stitch-surface-bright/30 border border-stitch-outline-variant rounded-lg py-3.5 pl-12 pr-12 text-white focus:border-stitch-primary-container focus:ring-1 focus:ring-stitch-primary-container outline-none transition-all placeholder:text-white/10"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-stitch-outline hover:text-white transition-colors"
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
    </form>
  );
}
