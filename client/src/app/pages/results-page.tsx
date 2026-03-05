import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Trophy,
  TrendingUp,
  MapPin,
  Leaf,
  Flame,
  Clock,
  Star,
  Crown,
  Medal,
  ChevronRight,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AppHeader } from "../components/app-header";

// ─── Data ───────────────────────────────────────────────────────────────────

const CURRENT_MONTH = 3; // March
const CURRENT_SEASON = "Xuân"; // Spring

interface RankedDish {
  id: string;
  rank: number;
  name: string;
  image: string;
  region?: string;
  season?: string;
  calories: number;
  cookTime: number;
  score: number; // rating / popularity score
  trend?: "up" | "down" | "stable";
  trendValue?: number;
  tags: string[];
  description: string;
  recipeId?: string;
}

const SEASONAL_DISHES: RankedDish[] = [
  {
    id: "s1", rank: 1,
    name: "Phở bò Hà Nội",
    image: "https://images.unsplash.com/photo-1701480253822-1842236c9a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwYm93bCUyMGZvb2R8ZW58MXx8fHwxNzcyNDQxOTExfDA&ixlib=rb-4.1.0&q=80&w=400",
    season: "Xuân", calories: 450, cookTime: 120, score: 9.8,
    trend: "up", trendValue: 12,
    tags: ["Canh", "Nước dùng", "Buổi sáng"],
    description: "Tiết trời xuân se lạnh — bát phở nóng hổi là lựa chọn hàng đầu. Nước dùng đậm đà từ xương bò hầm 8 tiếng.",
    recipeId: "1",
  },
  {
    id: "s2", rank: 2,
    name: "Bún chả Hà Nội",
    image: "https://images.unsplash.com/photo-1763703544688-2ac7839b0659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwY2hhJTIwZ3JpbGxlZCUyMHBvcmt8ZW58MXx8fHwxNzcyNDEyODMwfDA&ixlib=rb-4.1.0&q=80&w=400",
    season: "Xuân", calories: 520, cookTime: 30, score: 9.4,
    trend: "stable",
    tags: ["Bún", "Nướng", "Truyền thống"],
    description: "Thịt nướng than hồng thơm lừng, ăn kèm bún tươi và rau sống đầu mùa xuân — chuẩn vị Hà Nội.",
  },
  {
    id: "s3", rank: 3,
    name: "Bánh xèo miền Trung",
    image: "https://images.unsplash.com/photo-1606998619435-355790568f5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYmFuaCUyMHhlbyUyMHNpenpsaW5nJTIwY3JlcGUlMjBzdHJlZXQlMjBmb29kfGVufDF8fHx8MTc3MjU0NDgzMnww&ixlib=rb-4.1.0&q=80&w=400",
    season: "Xuân", calories: 380, cookTime: 25, score: 9.1,
    trend: "up", trendValue: 8,
    tags: ["Chiên", "Giòn", "Ăn vặt"],
    description: "Tiếng xèo vàng giòn rụm, tôm thịt đầy ắp — lý tưởng cho bữa ăn gia đình ngày xuân.",
  },
  {
    id: "s4", rank: 4,
    name: "Cơm gà Hải Nam",
    image: "https://images.unsplash.com/photo-1588127332622-81dad8da25bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWluYW5lc2UlMjBjaGlja2VuJTIwcmljZSUyMGFzaWFufGVufDF8fHx8MTc3MjQ0MTkxMXww&ixlib=rb-4.1.0&q=80&w=400",
    season: "Xuân", calories: 580, cookTime: 45, score: 8.9,
    trend: "down", trendValue: 3,
    tags: ["Cơm", "Gà", "Lành mạnh"],
    description: "Cơm nấu nước gà thơm bùi, gà luộc mềm ngọt — dinh dưỡng cân bằng cho ngày xuân năng động.",
    recipeId: "2",
  },
  {
    id: "s5", rank: 5,
    name: "Mì Quảng",
    image: "https://images.unsplash.com/photo-1648912500365-e0930ea34924?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwbWklMjBxdWFuZyUyMG5vb2RsZXN8ZW58MXx8fHwxNzcyNDQxOTEzfDA&ixlib=rb-4.1.0&q=80&w=400",
    season: "Xuân", calories: 490, cookTime: 50, score: 8.7,
    trend: "up", trendValue: 5,
    tags: ["Mì", "Tôm", "Đậu phộng"],
    description: "Mì vàng đặc trưng, nước lèo sánh đậm, tôm tươi và đậu phộng rang — đặc sản đầy màu sắc.",
  },
];

const BESTSELLER_DISHES: RankedDish[] = [
  {
    id: "b1", rank: 1,
    name: "Cơm tấm sườn bì",
    image: "https://images.unsplash.com/photo-1677128344719-0ee46369e112?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY29tJTIwdGFtJTIwYnJva2VuJTIwcmljZSUyMHBvcmt8ZW58MXx8fHwxNzcyNTQ0ODMzfDA&ixlib=rb-4.1.0&q=80&w=400",
    calories: 620, cookTime: 35, score: 9.9,
    trend: "up", trendValue: 24,
    tags: ["Cơm", "Sườn", "Nam bộ"],
    description: "Bán chạy nhất tháng 3! Sườn nướng chảy mỡ, bì trộn dai sần sật, nước mắm chua ngọt pha chuẩn.",
  },
  {
    id: "b2", rank: 2,
    name: "Bánh mì thịt nguội",
    image: "https://images.unsplash.com/photo-1610080099909-159e0c0b08d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYmFuaCUyMG1pJTIwc2FuZHdpY2glMjBiYWd1ZXR0ZXxlbnwxfHx8fDE3NzI1NDQ4MzR8MA&ixlib=rb-4.1.0&q=80&w=400",
    calories: 320, cookTime: 10, score: 9.6,
    trend: "up", trendValue: 18,
    tags: ["Nhanh", "Sáng", "Đường phố"],
    description: "Biểu tượng ẩm thực Việt — bánh mì giòn, pate béo, thịt nguội thơm, rau thơm tươi. Bán hàng triệu ổ mỗi tháng.",
  },
  {
    id: "b3", rank: 3,
    name: "Bún bò Huế",
    image: "https://images.unsplash.com/photo-1597345637412-9fd611e758f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwYm8lMjBodWUlMjBzcGljeSUyMG5vb2RsZSUyMHNvdXB8ZW58MXx8fHwxNzcyNTQ0ODMzfDA&ixlib=rb-4.1.0&q=80&w=400",
    calories: 510, cookTime: 90, score: 9.3,
    trend: "stable",
    tags: ["Cay", "Sả", "Mắm ruốc"],
    description: "Nước dùng sả cay nồng, bún lớn dai, giò heo mềm béo — top 3 bán chạy tháng 3 không thể thiếu.",
  },
  {
    id: "b4", rank: 4,
    name: "Phở bò Hà Nội",
    image: "https://images.unsplash.com/photo-1701480253822-1842236c9a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwYm93bCUyMGZvb2R8ZW58MXx8fHwxNzcyNDQxOTExfDA&ixlib=rb-4.1.0&q=80&w=400",
    calories: 450, cookTime: 120, score: 9.1,
    trend: "up", trendValue: 6,
    tags: ["Bò", "Nước dùng", "Sáng"],
    description: "Món quốc dân dẫn đầu bảng xếp hạng tháng qua — không có tháng nào phở ra khỏi top 5.",
    recipeId: "1",
  },
  {
    id: "b5", rank: 5,
    name: "Mì Quảng",
    image: "https://images.unsplash.com/photo-1648912500365-e0930ea34924?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwbWklMjBxdWFuZyUyMG5vb2RsZXN8ZW58MXx8fHwxNzcyNDQxOTEzfDA&ixlib=rb-4.1.0&q=80&w=400",
    calories: 490, cookTime: 50, score: 8.8,
    trend: "down", trendValue: 2,
    tags: ["Mì", "Đậm đà", "Miền Trung"],
    description: "Hương vị miền Trung đặc trưng leo top bán chạy toàn quốc tháng này.",
  },
];

const REGIONAL_DISHES: RankedDish[] = [
  {
    id: "r1", rank: 1,
    name: "Phở bò Hà Nội",
    image: "https://images.unsplash.com/photo-1701480253822-1842236c9a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwYm93bCUyMGZvb2R8ZW58MXx8fHwxNzcyNDQxOTExfDA&ixlib=rb-4.1.0&q=80&w=400",
    region: "Hà Nội · Miền Bắc",
    calories: 450, cookTime: 120, score: 9.9,
    trend: "up", trendValue: 5,
    tags: ["Quốc dân", "Sáng", "Truyền thống"],
    description: "Đặc sản biểu tượng Hà Nội được UNESCO vinh danh — nước dùng trong, thanh, không quá ngọt.",
    recipeId: "1",
  },
  {
    id: "r2", rank: 2,
    name: "Bún bò Huế",
    image: "https://images.unsplash.com/photo-1597345637412-9fd611e758f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwYm8lMjBodWUlMjBzcGljeSUyMG5vb2RsZSUyMHNvdXB8ZW58MXx8fHwxNzcyNTQ0ODMzfDA&ixlib=rb-4.1.0&q=80&w=400",
    region: "Huế · Miền Trung",
    calories: 510, cookTime: 90, score: 9.7,
    trend: "up", trendValue: 11,
    tags: ["Cay", "Sả", "Cố đô"],
    description: "Hương vị cung đình — sợi bún lớn, nước sả cay nồng mắm ruốc, thịt bò chả cua đặc trưng xứ Huế.",
  },
  {
    id: "r3", rank: 3,
    name: "Cao lầu Hội An",
    image: "https://images.unsplash.com/photo-1679279726940-be5ce80c632c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW8lMjBsYXUlMjBob2klMjBhbiUyMG5vb2RsZSUyMGJvd2x8ZW58MXx8fHwxNzcyNTQ0ODM3fDA&ixlib=rb-4.1.0&q=80&w=400",
    region: "Hội An · Miền Trung",
    calories: 460, cookTime: 40, score: 9.5,
    trend: "stable",
    tags: ["Độc đáo", "Phố cổ", "Du lịch"],
    description: "Mì cao lầu chỉ ngon đúng điệu khi làm từ nước giếng Bá Lễ — đặc sản bí ẩn chỉ có ở Hội An.",
  },
  {
    id: "r4", rank: 4,
    name: "Bánh xèo miền Trung",
    image: "https://images.unsplash.com/photo-1606998619435-355790568f5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYmFuaCUyMHhlbyUyMHNpenpsaW5nJTIwY3JlcGUlMjBzdHJlZXQlMjBmb29kfGVufDF8fHx8MTc3MjU0NDgzMnww&ixlib=rb-4.1.0&q=80&w=400",
    region: "Đà Nẵng · Miền Trung",
    calories: 380, cookTime: 25, score: 9.2,
    trend: "up", trendValue: 7,
    tags: ["Giòn", "Tôm", "Nướng"],
    description: "Bánh nhỏ hơn, nhân nhiều tôm tươi, ăn kèm lá mít và rau sống — khác hoàn toàn phiên bản miền Nam.",
  },
  {
    id: "r5", rank: 5,
    name: "Cơm tấm sườn bì",
    image: "https://images.unsplash.com/photo-1677128344719-0ee46369e112?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY29tJTIwdGFtJTIwYnJva2VuJTIwcmljZSUyMHBvcmt8ZW58MXx8fHwxNzcyNTQ0ODMzfDA&ixlib=rb-4.1.0&q=80&w=400",
    region: "TP.HCM · Miền Nam",
    calories: 620, cookTime: 35, score: 9.0,
    trend: "stable",
    tags: ["Ngọt", "Nam bộ", "Sáng sớm"],
    description: "Hạt cơm tấm lấm tấm trắng ngần, sườn nướng chảy mỡ — tinh hoa ẩm thực Sài Gòn mỗi buổi sáng.",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const RANK_STYLES: Record<number, { bg: string; text: string; icon: React.ReactNode }> = {
  1: {
    bg: "bg-gradient-to-br from-yellow-400 to-amber-500",
    text: "text-white",
    icon: <Crown className="w-3.5 h-3.5" />,
  },
  2: {
    bg: "bg-gradient-to-br from-slate-300 to-slate-400",
    text: "text-white",
    icon: <Medal className="w-3.5 h-3.5" />,
  },
  3: {
    bg: "bg-gradient-to-br from-orange-400 to-amber-600",
    text: "text-white",
    icon: <Medal className="w-3.5 h-3.5" />,
  },
};

function RankBadge({ rank }: { rank: number }) {
  const style = RANK_STYLES[rank] ?? {
    bg: "bg-gray-100",
    text: "text-gray-600",
    icon: null,
  };
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${style.bg} ${style.text} shadow-sm`}
    >
      {rank <= 3 ? style.icon : <span className="text-xs font-bold">{rank}</span>}
    </div>
  );
}

function TrendBadge({ trend, value }: { trend?: "up" | "down" | "stable"; value?: number }) {
  if (!trend || trend === "stable") return null;
  return (
    <span
      className={`text-xs font-semibold flex items-center gap-0.5 ${
        trend === "up" ? "text-green-600" : "text-red-400"
      }`}
    >
      {trend === "up" ? "▲" : "▼"}
      {value}%
    </span>
  );
}

function DishCard({ dish, showRegion = false }: { dish: RankedDish; showRegion?: boolean }) {
  return (
    <Card
      className={`overflow-hidden border bg-white/70 backdrop-blur-sm transition-all hover:shadow-lg hover:-translate-y-0.5 ${
        dish.rank === 1
          ? "border-amber-300/80 shadow-amber-100/60 shadow-md"
          : "border-amber-100/60"
      }`}
    >
      <CardContent className="p-0">
        <div className="flex gap-0">
          {/* Image */}
          <div className="relative w-32 flex-shrink-0">
            <ImageWithFallback
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover min-h-[130px]"
            />
            {dish.rank <= 3 && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            )}
          </div>

          {/* Body */}
          <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
            <div>
              {/* Title row */}
              <div className="flex items-start gap-2 mb-1.5">
                <RankBadge rank={dish.rank} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base leading-tight truncate">{dish.name}</h3>
                  {showRegion && dish.region && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {dish.region}
                    </p>
                  )}
                </div>
                {/* Score */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-amber-600">{dish.score}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2 ml-10">
                {dish.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 ml-10">
                {dish.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/40">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  {dish.calories} kcal
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {dish.cookTime} phút
                </span>
                <TrendBadge trend={dish.trend} value={dish.trendValue} />
              </div>
              {dish.recipeId ? (
                <Link to={`/recipe/${dish.recipeId}`}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs text-amber-600 hover:bg-amber-50 gap-1"
                  >
                    Xem công thức
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </Link>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-amber-600 hover:bg-amber-50 gap-1"
                >
                  Xem công thức
                  <ChevronRight className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Tabs ────────────────────────────────────────────────────────────────────

type TabId = "season" | "bestseller" | "regional";

const TABS: { id: TabId; label: string; icon: React.ReactNode; color: string }[] = [
  {
    id: "season",
    label: "Theo mùa",
    icon: <Leaf className="w-4 h-4" />,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "bestseller",
    label: "Bán chạy tháng",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "regional",
    label: "Đặc sản vùng miền",
    icon: <MapPin className="w-4 h-4" />,
    color: "from-blue-500 to-indigo-500",
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export function ResultsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("season");

  const dishes =
    activeTab === "season"
      ? SEASONAL_DISHES
      : activeTab === "bestseller"
      ? BESTSELLER_DISHES
      : REGIONAL_DISHES;

  const activeTabConfig = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-transparent">
      <AppHeader />

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Page title */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground leading-tight">Xếp hạng</h1>
            <p className="text-xs text-muted-foreground">
              Cập nhật tháng {CURRENT_MONTH}/2026
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-6 p-1 bg-white/60 backdrop-blur-sm rounded-2xl border border-amber-100/60 shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                  : "text-muted-foreground hover:text-foreground hover:bg-white/60"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg bg-gradient-to-br ${activeTabConfig.color} text-white`}>
              {activeTabConfig.icon}
            </span>
            <div>
              <h2 className="font-bold text-base">{activeTabConfig.label}</h2>
              <p className="text-xs text-muted-foreground">
                {activeTab === "season" && `Mùa ${CURRENT_SEASON} · ${dishes.length} món nổi bật`}
                {activeTab === "bestseller" && `Tháng ${CURRENT_MONTH}/2026 · Top bán chạy toàn quốc`}
                {activeTab === "regional" && `${dishes.length} đặc sản 3 miền Bắc - Trung - Nam`}
              </p>
            </div>
          </div>
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 border text-xs">
            TOP {dishes.length}
          </Badge>
        </div>

        {/* Dish list */}
        <div className="space-y-4">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} showRegion={activeTab === "regional"} />
          ))}
        </div>
      </main>
    </div>
  );
}