import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { 
  UtensilsCrossed, Mail, Lock, User, Eye, EyeOff,
  ArrowRight, Sparkles, CheckCircle2, Chrome
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AppHeader } from "../components/app-header";

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30">
      <AppHeader />
      
      {/* Main container */}
      <div className="flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-6xl">
          
          {/* Glass card container */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-amber-100/50 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] sm:min-h-[700px]">
              
              {/* ═══════════════════════ LEFT SIDE: Branding & Visual ═══════════════════════ */}
              <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 p-12 flex-col justify-center overflow-hidden">
                
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10" style={{ 
                  backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", 
                  backgroundSize: "30px 30px" 
                }} />

                {/* Floating decorative elements */}
                <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-3xl rotate-12 blur-xl" />
                <div className="absolute bottom-40 left-16 w-24 h-24 bg-white/10 rounded-2xl -rotate-12 blur-lg" />
                
                {/* Content wrapper - centered */}
                <div className="relative z-10 max-w-lg mx-auto space-y-10">
                  
                  {/* Logo */}
                  <Link to="/" className="inline-flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 group-hover:scale-105 transition-transform shadow-xl">
                      <UtensilsCrossed className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="font-bold text-2xl text-white">MealYummy</span>
                      <span className="text-xs text-white/70 tracking-wide italic">Ăn Ngon Mê Ly</span>
                    </div>
                  </Link>

                  {/* Hero text */}
                  <div className="space-y-6">
                    <h1 className="text-5xl font-black text-white leading-tight">
                      Khám phá món ngon mỗi ngày
                    </h1>
                    <p className="text-lg text-white/90 leading-relaxed">
                      Tham gia cộng đồng hàng nghìn người yêu ẩm thực. AI gợi ý món ăn phù hợp với bạn chỉ trong vài giây.
                    </p>

                    {/* Features list */}
                    <div className="space-y-3 pt-2">
                      {[
                        "Gợi ý món ăn bằng AI thông minh",
                        "1000+ công thức nấu ăn đa dạng",
                        "Lên thực đơn & danh sách đi chợ tự động",
                        "Hoàn toàn miễn phí, không giới hạn"
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-white/90">
                          <div className="flex-shrink-0 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Images showcase */}
                  <div className="grid grid-cols-3 gap-3 h-28">
                    <div className="rounded-2xl overflow-hidden shadow-2xl">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1680410778398-e99a769e1a3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjBhc2lhbiUyMGZvb2QlMjByZXN0YXVyYW50JTIwYWVzdGhldGljJTIwY29sb3JmdWx8ZW58MXx8fHwxNzcyNjAzNTA3fDA&ixlib=rb-4.1.0&q=80&w=400"
                        alt="Food 1"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-2xl translate-y-2">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1730806810569-4964fe2db162?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwZm9vZCUyMGluZ3JlZGllbnRzJTIwZnJlc2glMjBtYXJrZXQlMjB2aWJyYW50fGVufDF8fHx8MTc3MjYwMzUwOHww&ixlib=rb-4.1.0&q=80&w=400"
                        alt="Food 2"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-2xl -translate-y-2">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1757715377459-92ce5a081789?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwZm9vZCUyMHNwcmVhZCUyMGNvbG9yZnVsJTIwb3ZlcmhlYWR8ZW58MXx8fHwxNzcyNTUyMDg4fDA&ixlib=rb-4.1.0&q=80&w=400"
                        alt="Food 3"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Bottom text */}
                  <p className="text-white/60 text-xs text-center pt-4">
                    © 2026 MealYummy. Made with ❤️ in Vietnam
                  </p>
                </div>
              </div>

              {/* ═══════════════════════ RIGHT SIDE: Auth Form ═══════════════════════ */}
              <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
                <div className="w-full max-w-md">
                  
                  {/* Mobile logo (visible only on mobile) */}
                  <Link to="/" className="lg:hidden flex items-center justify-center gap-2.5 mb-8 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <UtensilsCrossed className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="font-bold text-xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">MealYummy</span>
                      <span className="text-[10px] text-amber-500/70 tracking-wide italic">Ăn Ngon Mê Ly</span>
                    </div>
                  </Link>

                  {/* Auth Card */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-amber-200/40">
                    
                    {/* Tab switcher */}
                    <div className="flex gap-2 mb-8 bg-amber-50/80 p-1.5 rounded-2xl border border-amber-200/40">
                      <button
                        onClick={() => setMode("login")}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                          mode === "login" 
                            ? "bg-white text-amber-600 shadow-md shadow-amber-500/10" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Đăng nhập
                      </button>
                      <button
                        onClick={() => setMode("register")}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                          mode === "register" 
                            ? "bg-white text-amber-600 shadow-md shadow-amber-500/10" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Đăng ký
                      </button>
                    </div>

                    {/* Form header */}
                    <div className="mb-6">
                      <h2 className="text-2xl font-black text-foreground mb-2">
                        {mode === "login" ? "Chào mừng trở lại! 👋" : "Tạo tài khoản mới 🎉"}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {mode === "login" 
                          ? "Đăng nhập để tiếp tục khám phá món ngon" 
                          : "Tham gia cộng đồng MealYummy ngay hôm nay"
                        }
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      
                      {/* Name field (register only) */}
                      {mode === "register" && (
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <User className="w-4 h-4 text-amber-500" />
                            Họ và tên
                          </Label>
                          <Input 
                            id="name" 
                            placeholder="Nguyễn Văn A"
                            className="h-12 border-amber-200/60 focus-visible:border-amber-400 focus-visible:ring-amber-400/20"
                            required
                          />
                        </div>
                      )}

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Mail className="w-4 h-4 text-amber-500" />
                          Email
                        </Label>
                        <Input 
                          id="email" 
                          type="email"
                          placeholder="example@email.com"
                          className="h-12 border-amber-200/60 focus-visible:border-amber-400 focus-visible:ring-amber-400/20"
                          required
                        />
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Lock className="w-4 h-4 text-amber-500" />
                          Mật khẩu
                        </Label>
                        <div className="relative">
                          <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="h-12 pr-12 border-amber-200/60 focus-visible:border-amber-400 focus-visible:ring-amber-400/20"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm password (register only) */}
                      {mode === "register" && (
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password" className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Lock className="w-4 h-4 text-amber-500" />
                            Xác nhận mật khẩu
                          </Label>
                          <div className="relative">
                            <Input 
                              id="confirm-password" 
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="h-12 pr-12 border-amber-200/60 focus-visible:border-amber-400 focus-visible:ring-amber-400/20"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Remember me / Forgot password (login only) */}
                      {mode === "login" && (
                        <div className="flex items-center justify-between text-sm">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500/20" />
                            <span className="text-muted-foreground">Ghi nhớ đăng nhập</span>
                          </label>
                          <button type="button" className="text-amber-600 hover:text-amber-700 font-semibold">
                            Quên mật khẩu?
                          </button>
                        </div>
                      )}

                      {/* Terms (register only) */}
                      {mode === "register" && (
                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                          <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500/20" required />
                          <span>
                            Tôi đồng ý với <a href="#" className="text-amber-600 hover:text-amber-700 font-semibold">Điều khoản dịch vụ</a> và <a href="#" className="text-amber-600 hover:text-amber-700 font-semibold">Chính sách bảo mật</a>
                          </span>
                        </div>
                      )}

                      {/* Submit button */}
                      <Button 
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-base shadow-lg shadow-amber-500/30 group"
                      >
                        <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                        {mode === "login" ? "Đăng nhập" : "Đăng ký ngay"}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-amber-200/60" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-3 text-muted-foreground">Hoặc tiếp tục với</span>
                      </div>
                    </div>

                    {/* Social login */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="h-11 border-amber-200/60 hover:bg-amber-50/50 hover:border-amber-300"
                      >
                        <Chrome className="w-5 h-5 mr-2" />
                        Google
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="h-11 border-amber-200/60 hover:bg-amber-50/50 hover:border-amber-300"
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.52-1.53-2.67 0-4.84 2.17-4.84 4.84 0 .38.04.75.13 1.1-4.02-.2-7.58-2.13-9.97-5.06-.42.72-.66 1.55-.66 2.44 0 1.68.86 3.16 2.15 4.03-.79-.02-1.54-.24-2.19-.6v.06c0 2.34 1.67 4.3 3.88 4.74-.4.11-.83.17-1.27.17-.31 0-.62-.03-.92-.08.62 1.94 2.42 3.35 4.55 3.39-1.67 1.31-3.77 2.09-6.05 2.09-.39 0-.78-.02-1.17-.07 2.18 1.4 4.77 2.21 7.55 2.21 9.05 0 14-7.5 14-14 0-.21 0-.42-.02-.63.96-.69 1.8-1.56 2.46-2.55z"/>
                        </svg>
                        Twitter
                      </Button>
                    </div>
                  </div>

                  {/* Back to home link */}
                  <div className="text-center mt-6">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                      <span className="group-hover:-translate-x-1 transition-transform">←</span>
                      Quay lại trang chủ
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}