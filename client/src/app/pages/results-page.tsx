import { useState } from "react";
import { Link } from "react-router";
import {
  Trophy, TrendingUp, MapPin, Leaf, Flame, Clock,
  Star, Crown, Medal, ChevronRight,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AppHeader } from "../components/app-header";

// ─── Data ────────────────────────────────────────────────────────────────────

const CURRENT_MONTH = 3;
const CURRENT_SEASON = "Xuân";

interface RankedDish {
  id: string; rank: number; name: string; image: string;
  region?: string; season?: string; calories: number;
  cookTime: number; score: number;
  trend?: "up" | "down" | "stable"; trendValue?: number;
  tags: string[]; description: string; recipeId?: string;
}

const SEASONAL_DISHES: RankedDish[] = [
  { id: "s1", rank: 1, name: "Phở bò Hà Nội", image: "https://images.unsplash.com/photo-1701480253822-1842236c9a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", season: "Xuân", calories: 450, cookTime: 120, score: 9.8, trend: "up", trendValue: 12, tags: ["Canh", "Nước dùng", "Buổi sáng"], description: "Tiết trời xuân se lạnh — bát phở nóng hổi là lựa chọn hàng đầu. Nước dùng đậm đà từ xương bò hầm 8 tiếng.", recipeId: "1" },
  { id: "s2", rank: 2, name: "Bún chả Hà Nội", image: "https://images.unsplash.com/photo-1763703544688-2ac7839b0659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", season: "Xuân", calories: 520, cookTime: 30, score: 9.4, trend: "stable", tags: ["Bún", "Nướng", "Truyền thống"], description: "Thịt nướng than hồng thơm lừng, ăn kèm bún tươi và rau sống đầu mùa xuân — chuẩn vị Hà Nội." },
  { id: "s3", rank: 3, name: "Bánh xèo miền Trung", image: "https://images.unsplash.com/photo-1606998619435-355790568f5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", season: "Xuân", calories: 380, cookTime: 25, score: 9.1, trend: "up", trendValue: 8, tags: ["Chiên", "Giòn", "Ăn vặt"], description: "Tiếng xèo vàng giòn rụm, tôm thịt đầy ắp — lý tưởng cho bữa ăn gia đình ngày xuân." },
  { id: "s4", rank: 4, name: "Cơm gà Hải Nam", image: "https://images.unsplash.com/photo-1588127332622-81dad8da25bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", season: "Xuân", calories: 580, cookTime: 45, score: 8.9, trend: "down", trendValue: 3, tags: ["Cơm", "Gà", "Lành mạnh"], description: "Cơm nấu nước gà thơm bùi, gà luộc mềm ngọt — dinh dưỡng cân bằng cho ngày xuân năng động.", recipeId: "2" },
  { id: "s5", rank: 5, name: "Mì Quảng", image: "https://images.unsplash.com/photo-1648912500365-e0930ea34924?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", season: "Xuân", calories: 490, cookTime: 50, score: 8.7, trend: "up", trendValue: 5, tags: ["Mì", "Tôm", "Đậu phộng"], description: "Mì vàng đặc trưng, nước lèo sánh đậm, tôm tươi và đậu phộng rang — đặc sản đầy màu sắc." },
];

const BESTSELLER_DISHES: RankedDish[] = [
  { id: "b1", rank: 1, name: "Cơm tấm sườn bì", image: "https://images.unsplash.com/photo-1677128344719-0ee46369e112?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", calories: 620, cookTime: 35, score: 9.9, trend: "up", trendValue: 24, tags: ["Cơm", "Sườn", "Nam bộ"], description: "Bán chạy nhất tháng 3! Sườn nướng chảy mỡ, bì trộn dai sần sật, nước mắm chua ngọt pha chuẩn." },
  { id: "b2", rank: 2, name: "Bánh mì thịt nguội", image: "https://images.unsplash.com/photo-1610080099909-159e0c0b08d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", calories: 320, cookTime: 10, score: 9.6, trend: "up", trendValue: 18, tags: ["Nhanh", "Sáng", "Đường phố"], description: "Biểu tượng ẩm thực Việt — bánh mì giòn, pate béo, thịt nguội thơm, rau thơm tươi." },
  { id: "b3", rank: 3, name: "Bún bò Huế", image: "https://images.unsplash.com/photo-1597345637412-9fd611e758f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", calories: 510, cookTime: 90, score: 9.3, trend: "stable", tags: ["Cay", "Sả", "Mắm ruốc"], description: "Nước dùng sả cay nồng, bún lớn dai, giò heo mềm béo — top 3 bán chạy tháng 3." },
  { id: "b4", rank: 4, name: "Phở bò Hà Nội", image: "https://images.unsplash.com/photo-1701480253822-1842236c9a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", calories: 450, cookTime: 120, score: 9.1, trend: "up", trendValue: 6, tags: ["Bò", "Nước dùng", "Sáng"], description: "Món quốc dân dẫn đầu bảng xếp hạng tháng qua — không có tháng nào phở ra khỏi top 5.", recipeId: "1" },
  { id: "b5", rank: 5, name: "Mì Quảng", image: "https://images.unsplash.com/photo-1648912500365-e0930ea34924?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", calories: 490, cookTime: 50, score: 8.8, trend: "down", trendValue: 2, tags: ["Mì", "Đậm đà", "Miền Trung"], description: "Hương vị miền Trung đặc trưng leo top bán chạy toàn quốc tháng này." },
];

const REGIONAL_DISHES: RankedDish[] = [
  { id: "r1", rank: 1, name: "Phở bò Hà Nội", image: "https://images.unsplash.com/photo-1701480253822-1842236c9a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", region: "Hà Nội · Miền Bắc", calories: 450, cookTime: 120, score: 9.9, trend: "up", trendValue: 5, tags: ["Quốc dân", "Sáng", "Truyền thống"], description: "Đặc sản biểu tượng Hà Nội được UNESCO vinh danh — nước dùng trong, thanh, không quá ngọt.", recipeId: "1" },
  { id: "r2", rank: 2, name: "Bún bò Huế", image: "https://images.unsplash.com/photo-1597345637412-9fd611e758f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", region: "Huế · Miền Trung", calories: 510, cookTime: 90, score: 9.7, trend: "up", trendValue: 11, tags: ["Cay", "Sả", "Cố đô"], description: "Hương vị cung đình — sợi bún lớn, nước sả cay nồng mắm ruốc, thịt bò chả cua đặc trưng." },
  { id: "r3", rank: 3, name: "Cao lầu Hội An", image: "https://images.unsplash.com/photo-1679279726940-be5ce80c632c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", region: "Hội An · Miền Trung", calories: 460, cookTime: 40, score: 9.5, trend: "stable", tags: ["Độc đáo", "Phố cổ", "Du lịch"], description: "Mì cao lầu chỉ ngon đúng điệu khi làm từ nước giếng Bá Lễ — đặc sản bí ẩn chỉ có ở Hội An." },
  { id: "r4", rank: 4, name: "Bánh xèo miền Trung", image: "https://images.unsplash.com/photo-1606998619435-355790568f5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", region: "Đà Nẵng · Miền Trung", calories: 380, cookTime: 25, score: 9.2, trend: "up", trendValue: 7, tags: ["Giòn", "Tôm", "Nướng"], description: "Bánh nhỏ hơn, nhân nhiều tôm tươi, ăn kèm lá mít và rau sống." },
  { id: "r5", rank: 5, name: "Cơm tấm sườn bì", image: "https://images.unsplash.com/photo-1677128344719-0ee46369e112?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", region: "TP.HCM · Miền Nam", calories: 620, cookTime: 35, score: 9.0, trend: "stable", tags: ["Ngọt", "Nam bộ", "Sáng sớm"], description: "Hạt cơm tấm trắng ngần, sườn nướng chảy mỡ — tinh hoa ẩm thực Sài Gòn mỗi buổi sáng." },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
      style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}>
      <Crown className="w-3.5 h-3.5 text-gray-900" />
    </div>
  );
  if (rank === 2) return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "linear-gradient(135deg, #cbd5e1, #94a3b8)" }}>
      <Medal className="w-3.5 h-3.5 text-gray-900" />
    </div>
  );
  if (rank === 3) return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "linear-gradient(135deg, #fb923c, #ea580c)" }}>
      <Medal className="w-3.5 h-3.5 text-white" />
    </div>
  );
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
      <span className="text-xs font-bold text-slate-400">{rank}</span>
    </div>
  );
}

function TrendBadge({ trend, value }: { trend?: "up" | "down" | "stable"; value?: number }) {
  if (!trend || trend === "stable") return null;
  return (
    <span className="text-xs font-semibold flex items-center gap-0.5"
      style={{ color: trend === "up" ? "#a3e635" : "#f87171" }}>
      {trend === "up" ? "▲" : "▼"}{value}%
    </span>
  );
}

function DishCard({ dish, showRegion = false }: { dish: RankedDish; showRegion?: boolean }) {
  return (
    <div
      className="flex rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: dish.rank === 1 ? "rgba(163,230,53,0.04)" : "rgba(26,31,46,0.9)",
        border: dish.rank === 1 ? "1px solid rgba(163,230,53,0.25)" : "1px solid rgba(255,255,255,0.06)",
        boxShadow: dish.rank === 1 ? "0 4px 24px rgba(163,230,53,0.08)" : "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Image */}
      <div className="relative w-32 flex-shrink-0">
        <ImageWithFallback src={dish.image} alt={dish.name} className="w-full h-full object-cover min-h-[130px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      {/* Body */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start gap-2 mb-1.5">
            <RankBadge rank={dish.rank} />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base leading-tight text-white truncate">{dish.name}</h3>
              {showRegion && dish.region && (
                <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "#64748b" }}>
                  <MapPin className="w-3 h-3" />{dish.region}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-lime-400 text-lime-400" />
              <span className="text-sm font-bold text-lime-400">{dish.score}</span>
            </div>
          </div>

          <p className="text-xs leading-relaxed line-clamp-2 mb-2 ml-10" style={{ color: "#64748b" }}>
            {dish.description}
          </p>

          <div className="flex flex-wrap gap-1 ml-10">
            {dish.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs rounded-full"
                style={{ background: "rgba(163,230,53,0.08)", color: "#a3e635", border: "1px solid rgba(163,230,53,0.15)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3 text-xs" style={{ color: "#64748b" }}>
            <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-400" />{dish.calories} kcal</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-lime-400" />{dish.cookTime} phút</span>
            <TrendBadge trend={dish.trend} value={dish.trendValue} />
          </div>
          <Link to={dish.recipeId ? `/recipe/${dish.recipeId}` : "#"}>
            <button className="h-7 px-2 text-xs flex items-center gap-0.5 rounded-lg transition-colors"
              style={{ color: "#a3e635" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(163,230,53,0.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
              Xem công thức <ChevronRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Tabs ────────────────────────────────────────────────────────────────────

type TabId = "season" | "bestseller" | "regional";

const TABS = [
  { id: "season" as TabId, label: "Theo mùa", icon: <Leaf className="w-4 h-4" /> },
  { id: "bestseller" as TabId, label: "Bán chạy tháng", icon: <TrendingUp className="w-4 h-4" /> },
  { id: "regional" as TabId, label: "Đặc sản vùng miền", icon: <MapPin className="w-4 h-4" /> },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ResultsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("season");

  const dishes = activeTab === "season" ? SEASONAL_DISHES
    : activeTab === "bestseller" ? BESTSELLER_DISHES
      : REGIONAL_DISHES;

  const activeTabConfig = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        {/* Header */}
        <div className="pt-10 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)" }}>
              <Trophy className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Xếp hạng</h1>
              <p className="text-xs" style={{ color: "#64748b" }}>Cập nhật tháng {CURRENT_MONTH}/2026</p>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-6 p-1 rounded-2xl"
          style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all"
              style={activeTab === tab.id
                ? { background: "linear-gradient(135deg, #a3e635, #4ade80)", color: "#0f1117" }
                : { color: "#64748b" }}
              onMouseEnter={(e) => { if (activeTab !== tab.id) (e.currentTarget as HTMLButtonElement).style.color = "#f1f5f9"; }}
              onMouseLeave={(e) => { if (activeTab !== tab.id) (e.currentTarget as HTMLButtonElement).style.color = "#64748b"; }}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg text-white"
              style={{ background: "rgba(163,230,53,0.15)", color: "#a3e635" }}>
              {activeTabConfig.icon}
            </span>
            <div>
              <h2 className="font-bold text-base text-white">{activeTabConfig.label}</h2>
              <p className="text-xs" style={{ color: "#64748b" }}>
                {activeTab === "season" && `Mùa ${CURRENT_SEASON} · ${dishes.length} món nổi bật`}
                {activeTab === "bestseller" && `Tháng ${CURRENT_MONTH}/2026 · Top bán chạy toàn quốc`}
                {activeTab === "regional" && `${dishes.length} đặc sản 3 miền Bắc - Trung - Nam`}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: "rgba(163,230,53,0.1)", color: "#a3e635", border: "1px solid rgba(163,230,53,0.2)" }}>
            TOP {dishes.length}
          </span>
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