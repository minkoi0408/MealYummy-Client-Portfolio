import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { authApi } from "../../../apis/auth.api";
import type { RegisterRequestDTO } from "../../../types/auth.types";

export function RegisterForm({ onSuccess }: { onSuccess: (email?: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    otp: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async (email: string) => {
    if (timer > 0) return;
    if (!email) {
      toast.error("Vui lòng điền email trước khi lấy mã OTP.");
      return;
    }
    try {
      await authApi.sendOtpRegister(email);
      toast.info("Mã OTP đã được gửi tới email của bạn!");
      setTimer(59);
    } catch (error: any) {
      const responseData = error.response?.data;
      if (responseData?.errors && typeof responseData.errors === 'object') {
        Object.values(responseData.errors).forEach((msg: any) => toast.error(msg));
      } else {
        const message = responseData?.message || "Không thể gửi mã OTP. Vui lòng thử lại sau.";
        toast.error(message);
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    setLoading(true);
    try {
      const request: RegisterRequestDTO = {
        username: formData.username || formData.email.split('@')[0],
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone || "0987654321",
        otp: formData.otp,
      };
      const response = await authApi.register(request);

      if (formData.otp) {
        toast.success(response.data?.message || "Đăng ký và xác thực thành công!");
        onSuccess(); // Đi tới màn đăng nhập
      } else {
        toast.success(response.data?.message || "Đăng ký thành công! Vui lòng kiểm tra email.");
        onSuccess(formData.email); // Đi tới màn nhập OTP
      }
    } catch (error: any) {
      const responseData = error.response?.data;
      if (responseData?.errors && typeof responseData.errors === 'object') {
        Object.values(responseData.errors).forEach((msg: any) => toast.error(msg));
      } else {
        const message = responseData?.message || error.message || "Đăng ký thất bại. Vui lòng thử lại.";
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-stitch-outline font-bold ml-1">Username</label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stitch-primary-container text-xl">person</span>
          <input
            name="username"
            required
            value={formData.username}
            onChange={handleInputChange}
            className="w-full bg-stitch-surface-bright/30 border border-stitch-outline-variant rounded-lg py-3.5 pl-12 pr-4 text-white focus:border-stitch-primary-container focus:ring-1 focus:ring-stitch-primary-container outline-none transition-all placeholder:text-white/10"
            placeholder="john_doe"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-stitch-outline font-bold ml-1">Email</label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stitch-primary-container text-xl">mail</span>
          <input
            name="email"
            type="email"
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

      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-stitch-outline font-bold ml-1">Xác nhận mật khẩu</label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stitch-primary-container text-xl">verified_user</span>
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full bg-stitch-surface-bright/30 border border-stitch-outline-variant rounded-lg py-3.5 pl-12 pr-12 text-white focus:border-stitch-primary-container focus:ring-1 focus:ring-stitch-primary-container outline-none transition-all placeholder:text-white/10"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-stitch-outline hover:text-white transition-colors"
          >
            {showConfirmPassword ? "visibility_off" : "visibility"}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-stitch-outline font-bold ml-1">Số điện thoại</label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stitch-primary-container text-xl">phone</span>
          <input
            name="phone"
            required
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full bg-stitch-surface-bright/30 border border-stitch-outline-variant rounded-lg py-3.5 pl-12 pr-4 text-white focus:border-stitch-primary-container focus:ring-1 focus:ring-stitch-primary-container outline-none transition-all placeholder:text-white/10"
            placeholder="0987654321"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-end px-1">
          <label className="text-[10px] uppercase tracking-widest text-stitch-outline font-bold">Mã xác thực OTP</label>
          <button
            type="button"
            onClick={() => handleResendOtp(formData.email)}
            disabled={timer > 0}
            className={`text-stitch-primary-container font-bold uppercase tracking-widest text-[10px] py-1 px-2 rounded border border-stitch-primary-container/30 hover:bg-stitch-primary-container hover:text-black transition-all ${timer > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
          >
            {timer > 0 ? `Gửi lại (${timer}s)` : 'Lấy mã OTP'}
          </button>
        </div>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stitch-primary-container text-xl">shield_lock</span>
          <input
            name="otp"
            maxLength={6}
            value={formData.otp}
            onChange={handleInputChange}
            className="w-full bg-stitch-surface-bright/30 border border-stitch-outline-variant rounded-lg py-3.5 pl-12 pr-4 text-white focus:border-stitch-primary-container focus:ring-1 focus:ring-stitch-primary-container outline-none transition-all placeholder:text-white/10 tracking-[0.5em] font-bold"
            placeholder="••••••"
          />
        </div>
        <p className="text-[10px] text-stitch-outline uppercase tracking-widest mt-1 ml-1">Nhập mã 6 số được gửi qua email</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-stitch-primary-container to-stitch-secondary text-black rounded-lg font-bold shadow-[0_10px_30px_-10px_rgba(163,230,53,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
      >
        {loading ? "Đang xử lý..." : "Đăng ký ngay"}
        <span className="material-symbols-outlined text-xl">arrow_forward</span>
      </button>
    </form>
  );
}
