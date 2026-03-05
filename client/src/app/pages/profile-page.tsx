import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { 
  User, Crown, Star, Zap, Check, X, Settings, Lock, 
  Bell, Shield, LogOut, Edit2, Mail, Phone, Calendar,
  Sparkles, ArrowRight, Trophy, Rocket
} from "lucide-react";
import { AppHeader } from "../components/app-header";

const plans = [
  {
    id: "free",
    name: "Free",
    icon: "🥉",
    price: "0đ",
    priceDetail: "/tháng",
    subtitle: "Gói miễn phí",
    description: "Phù hợp để trải nghiệm",
    features: [
      { text: "Thực đơn 1 ngày", available: true },
      { text: "3 lượt AI/ngày", available: true },
      { text: "Lưu 5 món", available: true },
      { text: "AI không giới hạn", available: false },
      { text: "Danh sách đi chợ", available: false },
    ],
    gradient: "from-gray-400 to-gray-500",
    bgGradient: "from-gray-50 to-gray-100",
    popular: false,
  },
  {
    id: "plus",
    name: "Plus",
    icon: "🥈",
    price: "99.000đ",
    priceDetail: "/tháng",
    subtitle: "Gói phổ biến",
    description: "Cho người dùng thường xuyên",
    features: [
      { text: "Thực đơn 7 ngày", available: true },
      { text: "AI không giới hạn", available: true },
      { text: "Danh sách đi chợ", available: true },
      { text: "Thống kê tuần", available: true },
      { text: "Phân tích dinh dưỡng", available: false },
    ],
    gradient: "from-amber-400 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50",
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    icon: "🥇",
    price: "199.000đ",
    priceDetail: "/tháng",
    subtitle: "Gói chuyên nghiệp",
    description: "Tối ưu sức khỏe toàn diện",
    features: [
      { text: "Thực đơn 30 ngày", available: true },
      { text: "Phân tích dinh dưỡng", available: true },
      { text: "Giới hạn ngân sách", available: true },
      { text: "Xuất PDF", available: true },
      { text: "Hỗ trợ ưu tiên", available: true },
    ],
    gradient: "from-yellow-400 to-amber-600",
    bgGradient: "from-yellow-50 to-amber-50",
    popular: false,
  },
];

export function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-orange-50/20">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* ═══════════════ LEFT SIDEBAR: Profile & Settings ═══════════════ */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            
            {/* Profile Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200/40 shadow-xl overflow-hidden">
              {/* Header gradient */}
              <div className="h-20 sm:h-24 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 relative">
                <div className="absolute inset-0 opacity-20" style={{ 
                  backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", 
                  backgroundSize: "20px 20px" 
                }} />
              </div>
              
              <CardContent className="pt-0 pb-4 sm:pb-6 px-4 sm:px-6 relative">
                {/* Avatar */}
                <div className="flex justify-center -mt-10 sm:-mt-12 mb-3 sm:mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                      <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                    </div>
                    <button className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full border-2 border-amber-200 shadow-md flex items-center justify-center hover:bg-amber-50 transition-colors">
                      <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
                    </button>
                  </div>
                </div>

                {/* User info */}
                <div className="text-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-foreground mb-1">Nguyễn Văn A</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">user@mealyummy.com</p>
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    Gói Free
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="text-center p-2 sm:p-3 bg-amber-50/50 rounded-xl border border-amber-200/30">
                    <div className="text-lg sm:text-xl font-bold text-amber-600">12</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">Món đã lưu</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-orange-50/50 rounded-xl border border-orange-200/30">
                    <div className="text-lg sm:text-xl font-bold text-orange-600">47</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">Lượt AI</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-amber-50/50 rounded-xl border border-amber-200/30">
                    <div className="text-lg sm:text-xl font-bold text-amber-600">8</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">Ngày dùng</div>
                  </div>
                </div>

                {/* Quick info */}
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 flex-shrink-0" />
                    <span className="truncate">user@mealyummy.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 flex-shrink-0" />
                    <span>Tham gia: 15/02/2026</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200/40 shadow-lg">
              <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                  Cài đặt tài khoản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 sm:space-y-2 px-4 sm:px-6">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-sm sm:text-base text-foreground hover:bg-amber-50/50 hover:text-amber-600 h-9 sm:h-10"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5 sm:mr-3 text-amber-500" />
                  Chỉnh sửa hồ sơ
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-sm sm:text-base text-foreground hover:bg-amber-50/50 hover:text-amber-600 h-9 sm:h-10"
                >
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5 sm:mr-3 text-amber-500" />
                  Thay đổi mật khẩu
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-sm sm:text-base text-foreground hover:bg-amber-50/50 hover:text-amber-600 h-9 sm:h-10"
                >
                  <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5 sm:mr-3 text-amber-500" />
                  Thông báo
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-sm sm:text-base text-foreground hover:bg-amber-50/50 hover:text-amber-600 h-9 sm:h-10"
                >
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5 sm:mr-3 text-amber-500" />
                  Bảo mật
                </Button>
                <div className="pt-2 sm:pt-3 border-t border-amber-200/30">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm sm:text-base text-destructive hover:bg-red-50 hover:text-destructive h-9 sm:h-10"
                  >
                    <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5 sm:mr-3" />
                    Đăng xuất
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ═══════════════ RIGHT CONTENT: Pricing Plans ═══════════════ */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            
            {/* Section header */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full border border-amber-200/50 mb-3 sm:mb-4">
                <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
                <span className="text-[10px] sm:text-xs font-semibold text-amber-700 tracking-wide uppercase">Nâng cấp tài khoản</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-1.5 sm:mb-2">
                Chọn gói phù hợp với bạn
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Nâng cấp để mở khóa toàn bộ tính năng và trải nghiệm tốt nhất
              </p>
            </div>

            {/* Pricing cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative group ${plan.popular ? "sm:col-span-2 md:col-span-1 md:-translate-y-3" : ""}`}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-white" />
                        Phổ biến nhất
                      </div>
                    </div>
                  )}

                  {/* Card */}
                  <Card 
                    className={`relative overflow-hidden border-2 transition-all duration-300 h-full flex flex-col ${
                      plan.popular 
                        ? "border-amber-400 shadow-2xl shadow-amber-500/20 bg-white" 
                        : "border-amber-200/40 hover:border-amber-300/60 hover:shadow-xl bg-white/80 backdrop-blur-sm"
                    }`}
                  >
                    {/* Gradient header */}
                    <div className={`h-2 bg-gradient-to-r ${plan.gradient}`} />
                    
                    {/* Top accent pattern */}
                    <div className={`absolute top-2 inset-x-0 h-32 bg-gradient-to-b ${plan.bgGradient} opacity-40 rounded-t-3xl`} />

                    <CardHeader className="text-center pb-3 relative z-10">
                      {/* Icon */}
                      <div className="text-4xl mb-2">{plan.icon}</div>
                      
                      {/* Plan name */}
                      <CardTitle className="text-xl font-black mb-0.5">{plan.name}</CardTitle>
                      <CardDescription className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                        {plan.subtitle}
                      </CardDescription>
                      
                      {/* Price */}
                      <div className="mt-3">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className={`text-3xl font-black bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                            {plan.price.replace("đ", "")}
                          </span>
                          <span className="text-lg font-bold text-muted-foreground">đ</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{plan.priceDetail}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-2 flex-1 py-4">
                      {/* Features list */}
                      <div className="space-y-1.5">
                        {plan.features.map((feature, index) => (
                          <div
                            key={index}
                            className={`flex items-start gap-2 ${
                              !feature.available ? "opacity-40" : ""
                            }`}
                          >
                            {feature.available ? (
                              <div className={`flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center mt-0.5`}>
                                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                              </div>
                            ) : (
                              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center mt-0.5">
                                <X className="w-2.5 h-2.5 text-gray-400" strokeWidth={2.5} />
                              </div>
                            )}
                            <span className="text-xs leading-tight">{feature.text}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-2 pt-4 pb-5">
                      <Button
                        className={`w-full group/btn font-bold ${
                          plan.id === "free"
                            ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            : `bg-gradient-to-r ${plan.gradient} text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all`
                        }`}
                        size="lg"
                        disabled={plan.id === "free"}
                      >
                        {plan.id === "free" ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Gói hiện tại
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                            Nâng cấp ngay
                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground leading-relaxed">
                        {plan.description}
                      </p>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>

            {/* Bottom info */}
            <Card className="bg-gradient-to-r from-amber-50/80 to-orange-50/60 border-amber-200/40">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-1 text-base">Đảm bảo hoàn tiền trong 7 ngày</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      Không hài lòng? Chúng tôi hoàn lại 100% chi phí, không cần lý do. Hỗ trợ 24/7 cho tất cả gói trả phí.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        Thanh toán an toàn
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        Hủy bất kỳ lúc nào
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        Không ràng buộc dài hạn
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}