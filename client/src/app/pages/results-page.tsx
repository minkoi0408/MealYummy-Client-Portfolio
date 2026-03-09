import { useState } from "react";
import { Link } from "react-router";
import {
  Trophy, TrendingUp, Flame, Clock, Star,
  Crown, Medal, ChevronRight, Dumbbell, Leaf, Zap, Shield,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AppHeader } from "../components/app-header";
import { mockRecipes } from "../data/mock-recipes";

// ─── Scoring helpers ───────────────────────────────────────────────────────────

function parseCalories(cal: string): number {
  const m = cal?.match(/(\d+)/);
  return m ? parseInt(m[1]) : 400;
}

function parseCookMinutes(t: string): number {
  if (!t) return 30;
  const h = t.match(/(\d+)\s*gi[oờ]/i);
  const m = t.match(/(\d+)\s*(phút|ph)/i);
  return (h ? parseInt(h[1]) * 60 : 0) + (m ? parseInt(m[1]) : 0) || 30;
}

function calcProteinScore(cal: number) { return Math.round((cal * 0.30) / 4); }

// ─── Tab scoring ───────────────────────────────────────────────────────────────

/** High-protein → ranked by protein estimate, then low calorie */
function scoreProtein(r: typeof mockRecipes[0]) {
  const cal = parseCalories(r.calories);
  const protein = calcProteinScore(cal);
  return protein * 3 - cal * 0.01;
}

/** Low-calorie balanced → ranked by lowest calories + ingredient count bonus */
function scoreClean(r: typeof mockRecipes[0]) {
  const cal = parseCalories(r.calories);
  const minutes = parseCookMinutes(r.cookTime);
  return -cal + (r.ingredients?.length ?? 0) * 5 - minutes * 0.2;
}

/** Quick & nutritious → ranked by short cook time + decent protein */
function scoreQuick(r: typeof mockRecipes[0]) {
  const cal = parseCalories(r.calories);
  const protein = calcProteinScore(cal);
  const minutes = parseCookMinutes(r.cookTime);
  return -minutes * 2 + protein;
}

type TabId = "protein" | "clean" | "quick";

const TABS: { id: TabId; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
  {
    id: "protein",
    label: "Cao Protein",
    icon: <Dumbbell className="w-4 h-4" />,
    desc: "Xếp hạng theo hàm lượng protein ước tính — lý tưởng cho buổi sau tập",
    color: "#a3e635",
  },
  {
    id: "clean",
    label: "Clean Eating",
    icon: <Leaf className="w-4 h-4" />,
    desc: "Ưu tiên món ít calo, nhiều nguyên liệu tự nhiên — phù hợp ngày cắt giảm",
    color: "#34d399",
  },
  {
    id: "quick",
    label: "Nhanh & Bổ",
    icon: <Zap className="w-4 h-4" />,
    desc: "Nấu nhanh dưới 30 phút nhưng vẫn đảm bảo dinh dưỡng",
    color: "#fb923c",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
      style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}>
      <Crown className="w-4 h-4 text-gray-900" />
    </div>
  );
  if (rank === 2) return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "linear-gradient(135deg, #cbd5e1, #94a3b8)" }}>
      <Medal className="w-4 h-4 text-gray-900" />
    </div>
  );
  if (rank === 3) return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "linear-gradient(135deg, #fb923c, #ea580c)" }}>
      <Medal className="w-4 h-4 text-white" />
    </div>
  );
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
      <span className="text-xs font-bold text-slate-400">{rank}</span>
    </div>
  );
}

interface RankedRecipe {
  recipe: typeof mockRecipes[0];
  rank: number;
  score: number;
  protein: number;
  calories: number;
  minutes: number;
  badge: string;
}

function MetaBadge({ color, icon, label }: { color: string; icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
      {icon}{label}
    </span>
  );
}

function DishCard({ item, tabColor }: { item: RankedRecipe; tabColor: string }) {
  const isTop3 = item.rank <= 3;
  return (
    <div
      className="flex rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: isTop3 ? `rgba(${tabColor === "#a3e635" ? "163,230,53" : tabColor === "#34d399" ? "52,211,153" : "251,146,60"},0.04)` : "rgba(26,31,46,0.9)",
        border: isTop3 ? `1px solid ${tabColor}40` : "1px solid rgba(255,255,255,0.06)",
        boxShadow: isTop3 ? `0 4px 24px ${tabColor}15` : "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Image */}
      <div className="relative w-36 flex-shrink-0">
        <ImageWithFallback src={item.recipe.image} alt={item.recipe.name} className="w-full h-full object-cover min-h-[140px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      {/* Body */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start gap-2.5 mb-1.5">
            <RankBadge rank={item.rank} />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base leading-tight text-white truncate">{item.recipe.name}</h3>
              <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{item.recipe.cuisine}</p>
            </div>
            <span className="flex items-center gap-1 flex-shrink-0 px-2 py-1 rounded-lg text-xs font-black"
              style={{ background: `${tabColor}15`, color: tabColor }}>
              <Star className="w-3 h-3 fill-current" />
              {item.score.toFixed(0)}
            </span>
          </div>

          <p className="text-xs leading-relaxed line-clamp-2 mb-2.5 ml-11" style={{ color: "#64748b" }}>
            {item.recipe.description}
          </p>

          {/* Metric badges */}
          <div className="flex flex-wrap gap-1.5 ml-11">
            <MetaBadge color="#a3e635" icon={<Dumbbell className="w-3 h-3" />} label={`${item.protein}g protein`} />
            <MetaBadge color="#fb923c" icon={<Flame className="w-3 h-3" />} label={`${item.calories} kcal`} />
            <MetaBadge color="#94a3b8" icon={<Clock className="w-3 h-3" />} label={`${item.minutes} phút`} />
            {item.badge && (
              <MetaBadge color="#c4b5fd" icon={<Shield className="w-3 h-3" />} label={item.badge} />
            )}
          </div>
        </div>

        <div className="flex items-center justify-end mt-3 pt-2.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Link to={`/meal/${item.recipe.id}`}>
            <button className="h-7 px-3 text-xs flex items-center gap-1 rounded-lg transition-colors font-semibold"
              style={{ color: tabColor }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${tabColor}15`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
              Xem dinh dưỡng <ChevronRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const BADGE_MAP: Record<string, string> = {
  "Việt Nam": "Thuần Việt",
  "Nhật Bản": "Asian Fit",
  "Hàn Quốc": "K-Fitness",
  "Quốc tế": "Quốc tế",
};

function buildRanking(tab: TabId): RankedRecipe[] {
  const scoreFn = tab === "protein" ? scoreProtein : tab === "clean" ? scoreClean : scoreQuick;
  return [...mockRecipes]
    .map((r) => {
      const cal = parseCalories(r.calories);
      return {
        recipe: r,
        score: scoreFn(r),
        protein: calcProteinScore(cal),
        calories: cal,
        minutes: parseCookMinutes(r.cookTime),
        badge: BADGE_MAP[r.cuisine] ?? "",
        rank: 0,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((item, i) => ({ ...item, rank: i + 1 }));
}

export function ResultsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("protein");
  const ranking = buildRanking(activeTab);
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
              <h1 className="text-2xl font-black text-white">Xếp hạng Fitness</h1>
              <p className="text-xs" style={{ color: "#64748b" }}>Dựa trên dinh dưỡng & mức độ phù hợp với người tập</p>
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
                ? { background: `linear-gradient(135deg, ${tab.color}, ${tab.color}bb)`, color: "#0f1117" }
                : { color: "#64748b" }}
              onMouseEnter={(e) => { if (activeTab !== tab.id) (e.currentTarget as HTMLButtonElement).style.color = "#f1f5f9"; }}
              onMouseLeave={(e) => { if (activeTab !== tab.id) (e.currentTarget as HTMLButtonElement).style.color = "#64748b"; }}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab description */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg" style={{ background: `${activeTabConfig.color}20`, color: activeTabConfig.color }}>
              {activeTabConfig.icon}
            </span>
            <div>
              <h2 className="font-bold text-base text-white">{activeTabConfig.label}</h2>
              <p className="text-xs" style={{ color: "#64748b" }}>{activeTabConfig.desc}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: `${activeTabConfig.color}15`, color: activeTabConfig.color, border: `1px solid ${activeTabConfig.color}30` }}>
            TOP 10
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-5 px-1 text-xs" style={{ color: "#475569" }}>
          <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" />Điểm = protein × 3 − calories × 0.01</span>
        </div>

        {/* Ranking list */}
        <div className="space-y-4">
          {ranking.map((item) => (
            <DishCard key={item.recipe.id} item={item} tabColor={activeTabConfig.color} />
          ))}
        </div>
      </main>
    </div>
  );
}