import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { authApi } from "../../../apis/auth.api";
import type { OtpVerifyDTO } from "../../../types/auth.types";

export function OtpForm({ email, onSuccess, context = "register", rememberMe = false, initialMessage = "", hasTotp = false }: { email: string; onSuccess: () => void, context?: "register" | "login", rememberMe?: boolean, initialMessage?: string, hasTotp?: boolean }) {
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [useTotp, setUseTotp] = useState(false);
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
      if (context === "login") {
        const response = await authApi.verifyMfaLogin({ username: email, otp });
        const payload = response.data.data;
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("accessToken", payload.accessToken);
        storage.setItem("refreshToken", payload.refreshToken);
        localStorage.setItem("user", JSON.stringify({
          username: payload.username,
          email: payload.email,
          avatarUrl: payload.avatarUrl
        }));
        toast.success("Đăng nhập thành công! Chào mừng quay trở lại.");
      } else {
        const request: OtpVerifyDTO = { email, otp };
        await authApi.verifyOtp(request);
        toast.success("Xác thực thành công! Bạn có thể đăng nhập ngay.");
      }
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

      {context === "login" && hasTotp && (
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => {
              setUseTotp(!useTotp);
              setOtpCode(["", "", "", "", "", ""]);
            }}
            className="text-xs px-4 py-2 rounded-full border border-stitch-primary/30 text-stitch-primary hover:bg-stitch-primary/10 transition-colors"
          >
            {useTotp ? "Chuyển sang Email OTP" : "Chuyển sang Google Authenticator"}
          </button>
        </div>
      )}
      
      <div className="flex flex-col items-center gap-4">
        {(!useTotp || context !== "login") && timer > 0 ? (
          <span className="text-[10px] uppercase tracking-[0.2em] text-stitch-primary font-bold">
            Gửi lại mã sau {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </span>
        ) : (
          <span className="text-[10px] uppercase tracking-[0.2em] text-transparent font-bold">
            &nbsp;
          </span>
        )}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-stitch-primary-container to-stitch-secondary text-black rounded-lg font-bold shadow-[0_10px_30px_-10px_rgba(163,230,53,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Xác nhận & Hoàn tất"}
          <span className="material-symbols-outlined">verified</span>
        </button>
        {(!useTotp || context !== "login") && (
          <button 
            type="button" 
            onClick={context === "login" ? async () => {
              if (timer > 0) return;
              try {
                await authApi.sendLoginOtp(email);
                toast.info("Mã OTP đã được gửi vào Email!");
                setTimer(59);
              } catch (error: any) {
                toast.error("Không thể gửi lại mã. Vui lòng thử lại sau.");
              }
            } : handleResendOtp}
            disabled={timer > 0}
            className="text-sm text-stitch-outline hover:text-stitch-primary transition-colors disabled:opacity-30"
          >
            Không nhận được mã? Gửi lại ngay
          </button>
        )}
      </div>
    </form>
  );
}
