import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { authApi } from "../../../apis/auth.api";
import { useAuth } from "../../contexts/auth-context";
import type { VerifyLoginDTO } from "../../../types/auth.types";

export function OtpForm({ email, onSuccess, context = "register", rememberMe = false, initialMessage = "", hasTotp = false }: { email: string; onSuccess: () => void, context?: "register" | "login", rememberMe?: boolean, initialMessage?: string, hasTotp?: boolean }) {
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [useTotp, setUseTotp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const { login } = useAuth();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const code = text.replace(/[^0-9]/g, '').slice(0, 6);
      if (code.length === 6) {
        setOtpCode(code.split(''));
        document.getElementById('otp-5')?.focus();
        toast.success("Đã dán mã OTP!");
      } else {
        toast.error("Mã OTP trong bộ nhớ tạm không hợp lệ (cần 6 số).");
      }
    } catch (err) {
      toast.error("Trình duyệt từ chối quyền truy cập bộ nhớ tạm.");
    }
  };

  const handleInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const code = pastedData.replace(/[^0-9]/g, '').slice(0, 6);
    if (code.length === 6) {
      setOtpCode(code.split(''));
      document.getElementById('otp-5')?.focus();
    }
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

  // Global loading cursor state
  useEffect(() => {
    if (loading || isSendingOtp) {
      document.body.classList.add('cursor-wait');
    } else {
      document.body.classList.remove('cursor-wait');
    }
    return () => document.body.classList.remove('cursor-wait');
  }, [loading, isSendingOtp]);

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
        const request: VerifyLoginDTO = { username: email, otp };
        const response = await authApi.login(request);
        const payload = response.data.data;
        
        login(
          payload.accessToken,
          payload.refreshToken,
          {
            username: payload.username,
            email: payload.email,
            avatarUrl: payload.avatarUrl,
            createdAt: payload.createdAt
          },
          rememberMe
        );

        toast.success("Đăng nhập thành công! Chào mừng quay trở lại.");
      } else {
        // authApi.verifyOtp is DEPRECATED and REMOVED. 
        // Registration verification should now be handled via authApi.register with an OTP included in the payload.
        toast.warning("Tính năng xác thực đăng ký riêng lẻ đã bị gỡ bỏ. Vui lòng hoàn tất đăng ký tại form đăng ký.");
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
    if (timer > 0 || isSendingOtp) return;
    if (!email) {
      toast.error("Vui lòng nhập email trước.");
      return;
    }
    setIsSendingOtp(true);
    try {
      await authApi.sendOtpRegistration({ email });
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
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <form onSubmit={handleVerifyOtp} className="space-y-8">
      <div>
        <div className="flex justify-between items-end mb-3 px-1">
          <span className="text-[10px] uppercase tracking-widest text-gray-200 font-bold">Mã xác thực</span>
          <button
            type="button"
            onClick={handlePaste}
            className="text-[10px] flex items-center gap-1 text-stitch-primary hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[12px]">content_paste</span> Dán nhanh
          </button>
        </div>
        <div className="flex justify-between gap-2">
          {otpCode.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onPaste={handleInputPaste}
              className="w-12 h-16 text-center text-2xl font-bold bg-stitch-surface-bright/40 border border-stitch-outline-variant rounded-lg text-white focus:border-stitch-primary focus:ring-2 focus:ring-stitch-primary/20 outline-none transition-all placeholder:text-gray-500"
            />
          ))}
        </div>
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
              if (timer > 0 || isSendingOtp) return;
              try {
                // Note: sendOtpLogin requires a full LoginRequestDTO (username & password). 
                // Since we only have email here, this resend might need to be handled differently or redirected.
                toast.error("Vui lòng quay lại màn hình đăng nhập để gửi lại mã.");
                toast.info("Mã OTP đã được gửi vào Email!");
                setTimer(59);
              } catch (error: any) {
                toast.error("Không thể gửi lại mã. Vui lòng thử lại sau.");
              }
            } : handleResendOtp}
            disabled={timer > 0 || isSendingOtp}
            className="text-sm text-gray-400 hover:text-stitch-primary transition-colors disabled:opacity-30 disabled:hover:text-gray-400"
          >
            {isSendingOtp ? "Đang gửi..." : "Không nhận được mã? Gửi lại ngay"}
          </button>
        )}
      </div>
    </form>
  );
}
