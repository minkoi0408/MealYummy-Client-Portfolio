import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Sparkles, BookOpen, Heart, Calendar, ShoppingCart, ChefHat } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AppHeader } from "../components/app-header";

const features = [
  {
    id: 1,
    icon: Sparkles,
    title: "Gợi ý món ăn bằng AI",
    description: "Nhập sở thích, ngân sách và chế độ ăn. AI sẽ gợi ý món phù hợp với bạn trong vài giây!",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    link: "/app",
    image: "https://images.unsplash.com/photo-1756361629888-90596c86fd79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjBmb29kJTIwcGxhdGUlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzI0NDE5MTJ8MA&ixlib=rb-4.1.0&q=80&w=400",
    badge: "Chức năng chính",
  },
  {
    id: 2,
    icon: BookOpen,
    title: "Xem chi tiết món ăn",
    description: "Khám phá thành phần, hướng dẫn nấu, thông tin dinh dưỡng và chi phí của mỗi món ăn.",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    link: "/results",
    image: "https://images.unsplash.com/photo-1590587754541-a3a4f2e0d06f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNpcGUlMjBjb29rYm9vayUyMGNvb2tpbmd8ZW58MXx8fHwxNzcyNDIxNTU1fDA&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    id: 3,
    icon: Heart,
    title: "Lưu món yêu thích",
    description: "Lưu lại những món ăn bạn thích để xem lại sau. Quản lý danh sách món ăn yêu thích của bạn.",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50",
    link: "/dashboard",
    image: "https://images.unsplash.com/photo-1638720772346-b745bcd72f5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZnJlc2glMjBtZWFsfGVufDF8fHx8MTc3MjQ0MTkxM3ww&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    id: 4,
    icon: Calendar,
    title: "Lập thực đơn theo tuần",
    description: "Tạo thực đơn tự động cho cả tuần. AI tính tổng calo và chi phí cho bạn.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    link: "/app",
    image: "https://images.unsplash.com/photo-1540921002383-b2a7ff6a716d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWFsJTIwcGxhbm5pbmclMjBjYWxlbmRhciUyMGZvb2R8ZW58MXx8fHwxNzcyNDA4Mjg0fDA&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    id: 5,
    icon: ShoppingCart,
    title: "Tạo danh sách đi chợ",
    description: "Tự động tổng hợp nguyên liệu từ thực đơn. Biết chính xác cần mua gì và hết bao nhiêu tiền.",
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-50",
    link: "/app",
    image: "https://images.unsplash.com/photo-1701914446310-8b63a547ab37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMGxpc3QlMjBncm9jZXJpZXMlMjBiYXNrZXR8ZW58MXx8fHwxNzcyNDQyNjIyfDA&ixlib=rb-4.1.0&q=80&w=400",
  },
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-transparent">
      <AppHeader />
      {/* Welcome Hero */}
      <section className="py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="w-8 h-8" />
                <span className="text-lg font-medium">Xin chào!</span>
              </div>
              <h1 className="text-5xl font-bold mb-4">
                Hôm nay bạn muốn ăn gì?
              </h1>
              <p className="text-xl text-white/90 mb-8">
                MealYummy sẵn sàng giúp bạn lên kế hoạch bữa ăn hoàn hảo. Khám phá 5 tính năng tuyệt vời bên dưới!
              </p>
              <Link to="/app">
                <Button size="lg" className="bg-white text-amber-600 hover:bg-white/90 shadow-xl h-14 px-8 text-lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Bắt đầu ngay
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">5 Chức năng chính</h2>
            <p className="text-xl text-muted-foreground">
              Khám phá những tính năng giúp bạn lên kế hoạch bữa ăn thông minh
            </p>
          </div>

          {/* Feature Icons Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.id} to={feature.link}>
                  <Card className="hover:shadow-2xl transition-all group cursor-pointer border-2 hover:border-primary/50 h-full">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base mb-2 leading-tight">{feature.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{feature.description}</p>
                      </div>
                      {feature.badge && (
                        <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-full">
                          ⭐ {feature.badge}
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 px-8 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
                1000+
              </div>
              <p className="text-muted-foreground">Công thức nấu ăn</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
                50K+
              </div>
              <p className="text-muted-foreground">Gợi ý mỗi ngày</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <p className="text-muted-foreground">Người dùng hài lòng</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
                4.9★
              </div>
              <p className="text-muted-foreground">Đánh giá trung bình</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 px-8">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>© 2026 MealYummy. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}