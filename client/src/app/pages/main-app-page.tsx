import { Link } from "react-router";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Clock, Heart, ArrowUp, X, Flame, ChefHat, RotateCcw, SlidersHorizontal } from "lucide-react";
import { AppHeader } from "../components/app-header";
import { mockRecipes } from "../data/mock-recipes";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useFavorites } from "../contexts/favorites-context";
import { toast } from "sonner";

// ─── Tags (flat list) ─────────────────────────────────────────────────────────

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
  "Món Việt đơn giản",
  "Nấu nhanh < 20 phút",
  "Nhiều rau ít calo",
  "Đặc sản miền Nam",
  "Món cay cuối tuần",
  "Lãng mạn cho 2 người",
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
  const tagScrollRef = useRef<HTMLDivElement>(null);

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

  function handleQuickPrompt(p: string) {
    setPrompt(p);
    const q = p.toLowerCase();
    const filtered = mockRecipes.filter((r) =>
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q)
    );
    setResults(filtered.length ? filtered : mockRecipes.sort(() => Math.random() - 0.5).slice(0, 8));
    setSubmitted(true);
  }

  function handleReset() {
    setPrompt("");
    setActiveTags(new Set());
    setSubmitted(false);
    setResults(mockRecipes);
  }

  const activeCnt = activeTags.size + (prompt.trim() ? 1 : 0);

  return (
    <div className="min-h-screen bg-transparent">
      <AppHeader />

      <main className="max-w-3xl mx-auto px-6 py-10">

        {/* Hero */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/60 text-amber-600 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            AI Gợi ý món ăn
          </div>
          <h1 className="text-3xl font-black text-foreground mb-2 leading-tight">
            Hôm nay bạn muốn ăn gì?
          </h1>
          <p className="text-muted-foreground text-sm">
            Nhập mô tả hoặc chọn tag để tìm món phù hợp nhất
          </p>
        </div>

        {/* ── AI Input bar ──────────────────────────────────────────── */}
        <div className="mb-3">
          <div
            className={`flex items-end gap-3 bg-white/80 backdrop-blur-xl border rounded-2xl px-4 py-3 shadow-lg transition-all ${isTyping
                ? "border-amber-400 shadow-amber-100/60 shadow-xl"
                : "border-amber-200/60 hover:border-amber-300"
              }`}
          >
            <div className="flex-shrink-0 mb-0.5 w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>

            <textarea
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              placeholder="Ví dụ: Món Việt ít calo, dưới 30 phút, không cay..."
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground/50 leading-relaxed min-h-[28px] max-h-[120px] py-0.5"
            />

            {prompt && (
              <button
                onClick={() => setPrompt("")}
                className="flex-shrink-0 mb-0.5 w-6 h-6 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}

            <button
              onClick={handleSubmit}
              disabled={!prompt.trim() && activeTags.size === 0}
              className="flex-shrink-0 mb-0.5 w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-sm transition-all active:scale-95"
            >
              <ArrowUp className="w-4 h-4 text-white" />
            </button>
          </div>

          <p className="text-[11px] text-muted-foreground/40 mt-1.5 ml-1">
            <kbd className="px-1 py-0.5 bg-muted/40 rounded font-mono">Enter</kbd> gửi ·{" "}
            <kbd className="px-1 py-0.5 bg-muted/40 rounded font-mono">Shift+Enter</kbd> xuống dòng
          </p>
        </div>

        {/* ── Quick prompts ────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => handleQuickPrompt(p)}
              className="text-xs px-3 py-1.5 bg-white/60 border border-amber-100/80 text-muted-foreground hover:text-amber-700 hover:border-amber-300 hover:bg-amber-50/50 rounded-full transition-all"
            >
              {p}
            </button>
          ))}
        </div>

        {/* ── Compact Tag filter strip ──────────────────────────────── */}
        <div className="flex items-center gap-2 mb-6">
          {/* Icon label */}
          <div className="flex-shrink-0 flex items-center gap-1.5 text-xs text-muted-foreground/70 font-medium pr-2 border-r border-border/50">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lọc</span>
          </div>

          {/* Scrollable chip row */}
          <div
            ref={tagScrollRef}
            className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar"
            style={{ scrollbarWidth: "none" }}
          >
            {ALL_TAGS.map((tag) => {
              const active = activeTags.has(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all select-none whitespace-nowrap ${active
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-transparent shadow-sm"
                      : "bg-white/60 text-foreground/70 border-border/50 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50/50"
                    }`}
                >
                  {tag.label}
                  {active && (
                    <span className="ml-1 opacity-70">×</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Clear active tags */}
          {activeTags.size > 0 && (
            <button
              onClick={() => setActiveTags(new Set())}
              className="flex-shrink-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors pl-2 border-l border-border/50"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Xoá</span>
              <span className="w-4 h-4 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                {activeTags.size}
              </span>
            </button>
          )}
        </div>

        {/* ── Active filter pills (when any filter applied) ─────────── */}
        {activeCnt > 0 && (
          <div className="flex items-center gap-2 flex-wrap -mt-2 mb-5">
            <span className="text-xs text-muted-foreground/60">Đang lọc:</span>
            {prompt.trim() && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs border border-amber-200/60">
                <Sparkles className="w-3 h-3" />
                "{prompt.trim().slice(0, 24)}{prompt.trim().length > 24 ? "…" : ""}"
              </span>
            )}
            {getActiveTagObjects().map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs border border-orange-200/60 hover:bg-orange-200 transition-colors"
              >
                {tag.label} <X className="w-2.5 h-2.5" />
              </button>
            ))}
            <button onClick={handleReset} className="text-xs text-muted-foreground/60 hover:text-red-500 transition-colors">
              Đặt lại
            </button>
          </div>
        )}

        {/* ── CTA Button ───────────────────────────────────────────── */}
        <button
          onClick={handleSubmit}
          disabled={!prompt.trim() && activeTags.size === 0}
          className="w-full h-11 mb-10 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-200/40 transition-all active:scale-[0.99]"
        >
          <Sparkles className="w-4 h-4" />
          Gợi ý món cho tôi
        </button>

        {/* ── Results ───────────────────────────────────────────────── */}
        <div ref={resultsRef}>
          {submitted ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-base text-foreground">
                    {results.length > 0
                      ? `${results.length} món phù hợp`
                      : "Không tìm thấy kết quả"}
                  </h2>
                  {results.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">Thử điều chỉnh tag hoặc từ khoá nhé!</p>
                  )}
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-base text-foreground">Tất cả công thức</h2>
                <span className="text-sm text-muted-foreground">{mockRecipes.length} món</span>
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
    <div className="group bg-white/70 backdrop-blur-sm border border-amber-100/60 rounded-2xl overflow-hidden hover:shadow-xl hover:border-amber-300/60 transition-all">
      <div className="relative overflow-hidden h-44">
        <ImageWithFallback
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-foreground shadow-sm">
          {recipe.cuisine}
        </span>
        <button
          onClick={(e) => { e.preventDefault(); onToggleFav(); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${isFav ? "bg-red-500 text-white shadow-md" : "bg-white/80 text-muted-foreground hover:bg-white hover:text-red-500"
            }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
          <p className="text-white font-bold text-base leading-tight drop-shadow-sm line-clamp-1">{recipe.name}</p>
        </div>
      </div>

      <div className="px-4 py-3">
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{recipe.description}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" />{recipe.cookTime}</span>
          <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-400" />{recipe.calories}</span>
          <span className="flex items-center gap-1"><ChefHat className="w-3.5 h-3.5 text-muted-foreground/60" />{recipe.difficulty}</span>
        </div>
        <Link to={`/recipe/${recipe.id}`}>
          <button className="w-full h-9 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 hover:from-amber-100 hover:to-orange-100 hover:border-amber-300 text-amber-700 text-xs font-semibold transition-all">
            Xem công thức →
          </button>
        </Link>
      </div>
    </div>
  );
}
