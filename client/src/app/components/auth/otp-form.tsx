import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { authApi } from "../../../apis/auth.api";
import type { OtpVerifyDTO } from "../../../types/auth.types";

export function OtpForm({ email, onSuccess }: { email: string; onSuccess: () => void }) {
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpCode.join("");
    if (otp.length < 6) {
      toast.error("Vui lòng nhập đầy đủ mã OTP 6 chữ số.");
      return;
    }
    setLoading(true);
    try {
      const request: OtpVerifyDTO = { email, otp };
      await authApi.verifyOtp(request);
      toast.success("Xác thực thành công! Bạn có thể đăng nhập ngay.");
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.message || "Mã OTP không chính xác hoặc đã hết hạn.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    if (!email) {
      toast.error("Vui lòng nhập email trước.");
      return;
    }
    try {
      await authApi.sendOtpRegister(email);
      toast.info("Mã OTP mới đã được gửi!");
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

  return (
    <form onSubmit={handleVerifyOtp} className="space-y-8">
      <div className="flex justify-between gap-2">
        {otpCode.map((digit, idx) => (
          <input
            key={idx}
            id={`otp-${idx}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(idx, e.target.value)}
            className="w-12 h-16 text-center text-2xl font-bold bg-stitch-surface-bright/40 border border-stitch-outline-variant rounded-lg text-stitch-primary focus:border-stitch-primary focus:ring-2 focus:ring-stitch-primary/20 outline-none transition-all"
          />
        ))}
      </div>
      
      <div className="flex flex-col items-center gap-4">
        <span className="text-[10px] uppercase tracking-[0.2em] text-stitch-primary font-bold">
          Gửi lại mã sau {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
        </span>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-stitch-primary-container to-stitch-secondary text-black rounded-lg font-bold shadow-[0_10px_30px_-10px_rgba(163,230,53,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Xác nhận & Hoàn tất"}
          <span className="material-symbols-outlined">verified</span>
        </button>
        <button 
          type="button" 
          onClick={handleResendOtp}
          disabled={timer > 0}
          className="text-sm text-stitch-outline hover:text-stitch-primary transition-colors disabled:opacity-30"
        >
          Không nhận được mã? Gửi lại ngay
        </button>
      </div>
    </form>
  );
}
