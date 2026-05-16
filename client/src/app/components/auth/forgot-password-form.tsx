import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { authApi } from "../../../apis/auth.api";

export function ForgotPasswordForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "reset">("email");
  const [timer, setTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Vui lòng nhập email.");
      return;
    }
    setLoading(true);
    try {
      await authApi.forgotPassword(formData.email);
      toast.success("Mã OTP đã được gửi tới email của bạn!");
      setStep("reset");
      setTimer(59);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể gửi mã OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.otp || formData.otp.length < 6) {
      toast.error("Vui lòng nhập đầy đủ mã OTP 6 số.");
      return;
    }

    if (!formData.newPassword || formData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      toast.error("Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&)");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });
      toast.success("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.");
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đặt lại mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "email") {
    return (
      <form onSubmit={handleSendOtp} className="space-y-6" noValidate>
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest text-stitch-outline font-bold ml-1">Email khôi phục</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stitch-primary-container text-xl">mail</span>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-stitch-surface-bright/30 border border-stitch-outline-variant rounded-lg py-3.5 pl-12 pr-4 text-white focus:border-stitch-primary-container focus:ring-1 focus:ring-stitch-primary-container outline-none transition-all placeholder:text-white/10"
              placeholder="example@mealyummy.fit"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-stitch-primary-container to-stitch-secondary text-black rounded-lg font-bold shadow-[0_10px_30px_-10px_rgba(163,230,53,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? "Đang gửi..." : "Gửi mã OTP"}
          <span className="material-symbols-outlined text-xl">send</span>
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-5" noValidate>
      {/* OTP Input */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-stitch-outline font-bold ml-1">Mã xác thực OTP</label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stitch-primary-container text-xl">shield_lock</span>
          <input
            name="otp"
            type="text"
            maxLength={6}
            value={formData.otp}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setFormData(prev => ({ ...prev, otp: val }));
            }}
            className="w-full bg-stitch-surface-bright/30 border border-stitch-outline-variant rounded-lg py-3.5 pl-12 pr-4 text-white focus:border-stitch-primary-container focus:ring-1 focus:ring-stitch-primary-container outline-none transition-all placeholder:text-white/10 tracking-[0.5em] font-bold"
            placeholder="••••••"
          />
        </div>
      </div>

      {/* New Password */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-stitch-outline font-bold ml-1">Mật khẩu mới</label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stitch-primary-container text-xl">lock</span>
          <input
            name="newPassword"
            type={showPassword ? "text" : "password"}
            value={formData.newPassword}
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

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-stitch-outline font-bold ml-1">Xác nhận mật khẩu mới</label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stitch-primary-container text-xl">verified_user</span>
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
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

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-stitch-primary-container to-stitch-secondary text-black rounded-lg font-bold shadow-[0_10px_30px_-10px_rgba(163,230,53,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        <span className="material-symbols-outlined text-xl">check_circle</span>
      </button>

      <button
        type="button"
        onClick={() => setStep("email")}
        className="w-full text-center text-[10px] uppercase tracking-widest text-stitch-outline hover:text-white transition-colors py-2"
      >
        Nhập lại email
      </button>
    </form>
  );
}
