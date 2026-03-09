import { Link } from "react-router";
import { useState, useRef, useEffect } from "react";
import {
  Sparkles, Clock, Heart, ArrowUp, X, Flame, ChefHat,
  RotateCcw, SlidersHorizontal, Search, Zap,
} from "lucide-react";
import { AppHeader } from "../components/app-header";
import { mockRecipes } from "../data/mock-recipes";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useFavorites } from "../contexts/favorites-context";
import { toast } from "sonner";

// ─── Tags ─────────────────────────────────────────────────────────────────────

const ALL_TAGS = [
  { id: "viet", label: "🇻🇳 Việt Nam", match: (r: any) => r.cuisine === "Việt Nam" },
  { id: "thai", label: "🇹🇭 Thái Lan", match: (r: any) => r.cuisine === "Thái Lan" },
  { id: "an", label: "🇮🇳 Ấn Độ", match: (r: any) => r.cuisine === "Ấn Độ" },
  { id: "y", label: "🇮🇹 Ý", match: (r: any) => r.cuisine === "Ý" },
  { id: "achau", label: "🥢 Á châu", match: (r: any) => r.cuisine === "Á châu" },
  { id: "fast", label: "⚡ < 20 phút", match: (r: any) => parseInt(r.cookTime) < 20 },
  { id: "mid", label: "⏱ 20–45 phút", match: (r: any) => { const t = parseInt(r.cookTime); return t >= 20 && t <= 45; } },
  { id: "slow", label: "🍲 > 45 phút", match: (r: any) => parseInt(r.cookTime) > 45 },
  { id: "low", label: "🥗 Ít calo", match: (r: any) => parseInt(r.calories) < 400 },
  { id: "chay", label: "🌿 Ăn chay", match: (r: any) => !r.ingredients?.some((i: string) => /thịt|bò|gà|tôm|cá|mực/i.test(i)) },
  { id: "easy", label: "😊 Dễ làm", match: (r: any) => r.difficulty === "Dễ" },
  { id: "sang", label: "🌅 Bữa sáng", match: (r: any) => parseInt(r.cookTime) <= 20 },
  { id: "anvat", label: "🍡 Ăn vặt", match: (r: any) => parseInt(r.calories) < 300 },
];

const QUICK_PROMPTS = [
  { label: "💪 High protein", q: "protein" },
  { label: "⚡ Nấu nhanh", q: "Nấu nhanh < 20 phút" },
  { label: "🥗 Ít calo", q: "Nhiều rau ít calo" },
  { label: "🇻🇳 Việt Nam", q: "Món Việt" },
  { label: "🌶 Món cay", q: "Món cay cuối tuần" },
  { label: "🍳 Bữa sáng", q: "Bữa sáng" },
];

// ─────────────────────────────────────────────────────────────────────────────

export function MainAppPage() {
  const [prompt, setPrompt] = useState("");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(mockRecipes);
  const [isTyping, setIsTyping] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [prompt]);

  function toggleTag(id: string) {
    setActiveTags((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function getActiveTagObjects() {
    return ALL_TAGS.filter((t) => activeTags.has(t.id));
  }

  function computeResults() {
    let filtered = [...mockRecipes];
    const q = prompt.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.ingredients?.some((i: string) => i.toLowerCase().includes(q))
      );
    }
    const activeTagObjs = getActiveTagObjects();
    if (activeTagObjs.length > 0) {
      filtered = filtered.filter((r) => activeTagObjs.every((tag) => tag.match(r)));
    }
    if (q) filtered = filtered.sort(() => Math.random() - 0.5);
    return filtered;
  }

  function handleSubmit() {
    if (!prompt.trim() && activeTags.size === 0) return;
    setResults(computeResults());
    setSubmitted(true);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  }

  function handleQuickPrompt(q: string) {
    setPrompt(q);
    const query = q.toLowerCase();
    const filtered = mockRecipes.filter((r) =>
      r.name.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query) ||
      r.cuisine.toLowerCase().includes(query)
    );
    setResults(filtered.length ? filtered : mockRecipes.sort(() => Math.random() - 0.5).slice(0, 8));
    setSubmitted(true);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function handleReset() {
    setPrompt("");
    setActiveTags(new Set());
    setSubmitted(false);
    setResults(mockRecipes);
  }

  const activeCnt = activeTags.size + (prompt.trim() ? 1 : 0);

  return (
    <div className="min-h-screen" style={{ background: "#0f1117" }}>
      <AppHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="text-center pt-12 pb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold uppercase tracking-widest"
            style={{
              background: "rgba(163,230,53,0.08)",
              border: "1px solid rgba(163,230,53,0.25)",
              color: "#a3e635",
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            AI Gợi Ý Món Ăn
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight">
            Hôm nay ăn gì cho{" "}
            <span className="text-lime-400">đúng mục tiêu?</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Nhập mô tả hoặc chọn tag để AI gợi ý món phù hợp với thể trạng của bạn
          </p>
        </div>

        {/* ── AI Search Input ────────────────────────────────────────────── */}
        <div className="mb-4">
          <div
            className="flex items-end gap-3 rounded-2xl px-4 py-3 transition-all"
            style={{
              background: "rgba(26,31,46,0.9)",
              border: isTyping
                ? "1px solid rgba(163,230,53,0.5)"
                : "1px solid rgba(255,255,255,0.08)",
              boxShadow: isTyping
                ? "0 0 24px rgba(163,230,53,0.12)"
                : "0 4px 24px rgba(0,0,0,0.3)",
            }}
          >
            {/* Icon */}
            <div
              className="flex-shrink-0 mb-0.5 w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)" }}
            >
              <Sparkles className="w-4 h-4 text-gray-900" />
            </div>

            <textarea
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              placeholder="Ví dụ: Món giàu protein ít béo, dưới 30 phút..."
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed min-h-[28px] max-h-[120px] py-0.5"
              style={{ color: "#f1f5f9" }}
            />

            {prompt && (
              <button
                onClick={() => setPrompt("")}
                className="flex-shrink-0 mb-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}

            <button
              onClick={handleSubmit}
              disabled={!prompt.trim() && activeTags.size === 0}
              className="flex-shrink-0 mb-0.5 w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)" }}
            >
              <ArrowUp className="w-4 h-4 text-gray-900" />
            </button>
          </div>

          <p className="text-[11px] mt-1.5 ml-1" style={{ color: "rgba(148,163,184,0.5)" }}>
            <kbd
              className="px-1 py-0.5 rounded font-mono text-[10px]"
              style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
            >Enter</kbd>{" "}gửi ·{" "}
            <kbd
              className="px-1 py-0.5 rounded font-mono text-[10px]"
              style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
            >Shift+Enter</kbd>{" "}xuống dòng
          </p>
        </div>

        {/* ── Quick Prompts ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-5">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p.q}
              onClick={() => handleQuickPrompt(p.q)}
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(26,31,46,0.9)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#94a3b8",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(163,230,53,0.4)";
                (e.currentTarget as HTMLButtonElement).style.color = "#a3e635";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(163,230,53,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(26,31,46,0.9)";
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* ── Tag Filter Strip ───────────────────────────────────────────── */}
        <div
          className="flex items-center gap-3 mb-6 rounded-xl px-4 py-3"
          style={{
            background: "rgba(26,31,46,0.6)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Label */}
          <div
            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium pr-3"
            style={{
              color: "#64748b",
              borderRight: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lọc</span>
          </div>

          {/* Scrollable chips */}
          <div
            className="flex-1 flex items-center gap-1.5 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {ALL_TAGS.map((tag) => {
              const active = activeTags.has(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all select-none whitespace-nowrap"
                  style={
                    active
                      ? {
                        background: "linear-gradient(135deg, #a3e635, #4ade80)",
                        color: "#0f1117",
                        border: "1px solid transparent",
                        fontWeight: 700,
                      }
                      : {
                        background: "rgba(255,255,255,0.04)",
                        color: "#94a3b8",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }
                  }
                >
                  {tag.label}
                  {active && <span className="ml-1 opacity-70">×</span>}
                </button>
              );
            })}
          </div>

          {/* Clear */}
          {activeTags.size > 0 && (
            <button
              onClick={() => setActiveTags(new Set())}
              className="flex-shrink-0 flex items-center gap-1 text-xs transition-colors pl-3"
              style={{
                color: "#64748b",
                borderLeft: "1px solid rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#f87171"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#64748b"; }}
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Xoá</span>
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ background: "rgba(248,113,113,0.15)", color: "#f87171" }}
              >
                {activeTags.size}
              </span>
            </button>
          )}
        </div>

        {/* ── Active filter pills ────────────────────────────────────────── */}
        {activeCnt > 0 && (
          <div className="flex items-center gap-2 flex-wrap -mt-2 mb-5">
            <span className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>Đang lọc:</span>
            {prompt.trim() && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(163,230,53,0.1)",
                  border: "1px solid rgba(163,230,53,0.25)",
                  color: "#a3e635",
                }}
              >
                <Search className="w-3 h-3" />
                "{prompt.trim().slice(0, 24)}{prompt.trim().length > 24 ? "…" : ""}"
              </span>
            )}
            {getActiveTagObjects().map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors"
                style={{
                  background: "rgba(163,230,53,0.08)",
                  border: "1px solid rgba(163,230,53,0.2)",
                  color: "#a3e635",
                }}
              >
                {tag.label} <X className="w-2.5 h-2.5" />
              </button>
            ))}
            <button
              onClick={handleReset}
              className="text-xs transition-colors"
              style={{ color: "rgba(148,163,184,0.6)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#f87171"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(148,163,184,0.6)"; }}
            >
              Đặt lại
            </button>
          </div>
        )}

        {/* ── CTA Button ────────────────────────────────────────────────── */}
        <button
          onClick={handleSubmit}
          disabled={!prompt.trim() && activeTags.size === 0}
          className="w-full h-12 mb-10 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #a3e635, #4ade80)",
            color: "#0f1117",
            boxShadow: "0 0 30px rgba(163,230,53,0.25)",
          }}
        >
          <Sparkles className="w-4 h-4" />
          Gợi ý món cho tôi
        </button>

        {/* ── Results ───────────────────────────────────────────────────── */}
        <div ref={resultsRef}>
          {submitted ? (
            <>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-base text-white">
                    {results.length > 0
                      ? `${results.length} món phù hợp`
                      : "Không tìm thấy kết quả"}
                  </h2>
                  {results.length === 0 && (
                    <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>Thử điều chỉnh tag hoặc từ khoá nhé!</p>
                  )}
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs flex items-center gap-1 transition-colors"
                  style={{ color: "#64748b" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#f1f5f9"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#64748b"; }}
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Tìm lại
                </button>
              </div>
              {results.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.map((r) => (
                    <RecipeCard
                      key={r.id}
                      recipe={r}
                      isFav={isFavorite(r.id)}
                      onToggleFav={() => {
                        if (isFavorite(r.id)) { removeFavorite(r.id); toast.success("Đã bỏ khỏi yêu thích"); }
                        else { addFavorite(r); toast.success("Đã thêm vào yêu thích!"); }
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-base text-white">Tất cả công thức</h2>
                <span className="text-sm" style={{ color: "#64748b" }}>{mockRecipes.length} món</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockRecipes.map((r) => (
                  <RecipeCard
                    key={r.id}
                    recipe={r}
                    isFav={isFavorite(r.id)}
                    onToggleFav={() => {
                      if (isFavorite(r.id)) { removeFavorite(r.id); toast.success("Đã bỏ khỏi yêu thích"); }
                      else { addFavorite(r); toast.success("Đã thêm vào yêu thích!"); }
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Recipe Card ──────────────────────────────────────────────────────────────

function RecipeCard({ recipe, isFav, onToggleFav }: { recipe: any; isFav: boolean; onToggleFav: () => void }) {
  return (
    <div
      className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "rgba(26,31,46,0.9)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(163,230,53,0.25)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(163,230,53,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-44">
        <ImageWithFallback
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Cuisine badge */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full"
          style={{
            background: "rgba(15,17,23,0.8)",
            backdropFilter: "blur(8px)",
            color: "#f1f5f9",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {recipe.cuisine}
        </span>

        {/* Favorite button */}
        <button
          onClick={(e) => { e.preventDefault(); onToggleFav(); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={
            isFav
              ? { background: "#ef4444", color: "white" }
              : {
                background: "rgba(15,17,23,0.75)",
                backdropFilter: "blur(8px)",
                color: "#94a3b8",
                border: "1px solid rgba(255,255,255,0.1)",
              }
          }
        >
          <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
        </button>

        {/* Recipe name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
          <p className="text-white font-bold text-base leading-tight line-clamp-1 drop-shadow-sm">
            {recipe.name}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <p className="text-xs line-clamp-2 mb-3 leading-relaxed" style={{ color: "#64748b" }}>
          {recipe.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-3 text-xs mb-3" style={{ color: "#64748b" }}>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-lime-400" />
            {recipe.cookTime}
          </span>
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            {recipe.calories}
          </span>
          <span className="flex items-center gap-1">
            <ChefHat className="w-3.5 h-3.5" style={{ color: "#475569" }} />
            {recipe.difficulty}
          </span>
        </div>

        {/* CTA */}
        <Link to={`/recipe/${recipe.id}`}>
          <button
            className="w-full h-9 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: "rgba(163,230,53,0.08)",
              border: "1px solid rgba(163,230,53,0.2)",
              color: "#a3e635",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(163,230,53,0.15)";
              (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(163,230,53,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(163,230,53,0.08)";
              (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(163,230,53,0.2)";
            }}
          >
            Xem công thức →
          </button>
        </Link>
      </div>
    </div>
  );
}
