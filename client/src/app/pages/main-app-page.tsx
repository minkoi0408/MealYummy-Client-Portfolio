import { Link } from "react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles, Clock, Heart, ArrowUp, X, Flame, ChefHat,
  RotateCcw, SlidersHorizontal, Search, Zap, ChevronDown, Check, Bot
} from "lucide-react";
import { AppHeader } from "../components/app-header";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useFavorites } from "../contexts/favorites-context";
import { toast } from "sonner";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "motion/react";

import { Select, ConfigProvider, theme } from "antd";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { categoryApi, type Category } from "../../apis/category.api";
import { tagApi, type Tag } from "../../apis/tag.api";
import { ingredientApi, type Ingredient } from "../../apis/ingredient.api";
import { mealApi } from "../../apis/meal.api";

// ─── 3D card tilt hook ────────────────────────────────────────────────────────
function useTiltCard(strength = 10) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), { stiffness: 300, damping: 30 });
  const scale = useSpring(1, { stiffness: 300, damping: 26 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
    scale.set(1.04);
  }, [x, y, scale]);

  const onMouseLeave = useCallback(() => {
    x.set(0); y.set(0); scale.set(1);
  }, [x, y, scale]);

  return { rotateX, rotateY, scale, onMouseMove, onMouseLeave };
}


function mapMealResponseToRecipe(meal: any): any {
  return {
    id: meal.id,
    name: meal.name,
    description: meal.description,
    image: meal.images?.find((img: any) => img.isThumbnail)?.url || meal.images?.[0]?.url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
    cuisine: meal.categories?.[0]?.name || "Món ăn",
    prepTime: "15 phút",
    cookTime: "30 phút",
    servings: "2 người",
    difficulty: "Vừa",
    calories: "350 kcal", // Placeholder
    ingredients: meal.ingredients?.map((i: any) => `${i.value} ${i.unitDesc || i.unit} ${i.name || 'Nguyên liệu'}`) || [],
    instructions: ["Xem chi tiết để biết cách nấu"],
    tips: "Chúc bạn ngon miệng!"
  };
}

// ─────────────────────────────────────────────────────────────────────────────

export function MainAppPage() {
  const [prompt, setPrompt] = useState("");
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await categoryApi.getAll(0, 1000);
      return res.data.data.content || [];
    }
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await tagApi.getAll(0, 1000);
      return res.data.data.content || [];
    }
  });

  const { data: ingredients = [] } = useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const res = await ingredientApi.getAll(0, 1000);
      return res.data.data.content || [];
    }
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);

  const [filterOpen, setFilterOpen] = useState(false);

  const {
    data: infiniteMealsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['defaultMealsInfinite'],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await mealApi.getAll(pageParam, 4);
      return res.data.data;
    },
    getNextPageParam: (lastPage) => {
      const number = lastPage.page !== undefined ? lastPage.page.number : lastPage.number;
      const totalPages = lastPage.page !== undefined ? lastPage.page.totalPages : lastPage.totalPages;
      if (number !== undefined && totalPages !== undefined && number < totalPages - 1) {
        return number + 1;
      }
      return undefined;
    },
    initialPageParam: 0
  });

  const defaultMeals = infiniteMealsData ? infiniteMealsData.pages.flatMap(p => p.content.map(mapMealResponseToRecipe)) : [];

  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [prompt]);

  async function handleSubmit() {
    const isFilterActive = prompt.trim() || selectedCategories.length > 0 || selectedTags.length > 0 || excludedIngredients.length > 0;
    if (!isFilterActive) return;

    setSubmitted(true);
    setResults([]);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);

    const question = prompt.trim() || "Gợi ý món ăn";
    setPrompt("");
    setIsAiLoading(true);

    try {
      const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`http://localhost:8082/api/v1/ai/knowledge/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          question: question,
          categoryIds: selectedCategories,
          tagIds: selectedTags,
          excludedIngredientIds: excludedIngredients
        })
      });
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        const mappedData = data.data.map(mapMealResponseToRecipe);
        setResults(mappedData);
      } else {
        toast.error("Không tìm thấy món ăn phù hợp.");
      }
    } catch (error) {
      console.error("Lỗi gọi AI:", error);
      toast.error("Hệ thống AI đang gặp sự cố. Vui lòng thử lại sau.");
    } finally {
      setIsAiLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  }

  const handleReset = () => {
    setPrompt("");
    setSelectedCategories([]);
    setSelectedTags([]);
    setExcludedIngredients([]);
    setSubmitted(false);
    setResults([]);
  }

  const activeCnt = selectedCategories.length + selectedTags.length + excludedIngredients.length + (prompt.trim() ? 1 : 0);

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">

        {/* ── Narrow wrapper: Hero + Search + Tags ──────────────────────── */}
        <div className="max-w-3xl mx-auto">

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
              Không biết ăn gì ?{" "}
              <span className="text-lime-400">tìm kiếm món ngay</span>
            </h1>
            <p className="text-slate-400 text-sm">
              Nhập mô tả hoặc chọn tag để AI gợi ý món phù hợp với thể trạng của bạn
            </p>
          </div>

          {/* ── AI Search Input ────────────────────────────────────────────── */}
          <div className="mb-4">
            <div
              className="flex items-center gap-3 rounded-2xl px-4 py-2 transition-all"
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
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(163,230,53,0.15)" }}
              >
                <img src="/logo.svg" alt="AI" className="w-5 h-5 object-contain" />
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
                className="flex-1 bg-transparent resize-none outline-none text-sm leading-normal py-2 max-h-[120px]"
                style={{ color: "#f1f5f9" }}
              />

              {prompt && (
                <button
                  onClick={() => setPrompt("")}
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}

              <button
                onClick={handleSubmit}
                disabled={!prompt.trim() && selectedCategories.length === 0 && selectedTags.length === 0 && excludedIngredients.length === 0}
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
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

          {/* ── Advanced Filter Toggle ─────────────────────────────────────── */}
          <div className="mb-4">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
              style={{
                background: filterOpen ? "rgba(163,230,53,0.08)" : "rgba(26,31,46,0.6)",
                border: filterOpen ? "1px solid rgba(163,230,53,0.3)" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center gap-2" style={{ color: filterOpen ? "#a3e635" : "#94a3b8" }}>
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm font-semibold">{filterOpen ? "Đóng bộ lọc nâng cao" : "Bộ lọc nâng cao (Danh mục, Thẻ, Nguyên liệu tránh)"}</span>
              </div>
              <ChevronDown className="w-4 h-4 transition-transform" style={{ color: filterOpen ? "#a3e635" : "#475569", transform: filterOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>

            {/* Filter Panel Dropdown */}
            {filterOpen && (
              <div className="mt-2 p-4 sm:p-5 rounded-xl animate-in fade-in" style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, token: { colorPrimary: '#a3e635', colorBgContainer: '#1a1f2e', colorBorder: 'rgba(255,255,255,0.1)' } }}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#64748b" }}>Danh mục món ăn</h3>
                      <Select
                        mode="multiple"
                        placeholder="Chọn danh mục..."
                        value={selectedCategories}
                        onChange={setSelectedCategories}
                        style={{ width: '100%', minHeight: '40px' }}
                        options={categories.map(c => ({ label: c.name, value: c.id }))}
                        maxTagCount="responsive"
                      />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#64748b" }}>Thẻ trạng thái</h3>
                      <Select
                        mode="multiple"
                        placeholder="Chọn thẻ..."
                        value={selectedTags}
                        onChange={setSelectedTags}
                        style={{ width: '100%', minHeight: '40px' }}
                        options={tags.map(t => ({ label: t.name, value: t.id }))}
                        maxTagCount="responsive"
                      />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#64748b" }}>Tránh nguyên liệu</h3>
                      <Select
                        mode="multiple"
                        placeholder="Tránh nguyên liệu..."
                        value={excludedIngredients}
                        onChange={setExcludedIngredients}
                        style={{ width: '100%', minHeight: '40px' }}
                        options={ingredients.map(i => ({ label: i.name, value: i.id }))}
                        maxTagCount="responsive"
                      />
                    </div>
                  </div>
                </ConfigProvider>
              </div>
            )}
          </div>

          {activeCnt > 0 && (
            <div className="flex items-center gap-2 flex-wrap -mt-2 mb-5">
              <span className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>Đang lọc {activeCnt} điều kiện</span>
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
            disabled={!prompt.trim() && selectedCategories.length === 0 && selectedTags.length === 0 && excludedIngredients.length === 0}
            className="w-full h-12 mb-10 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #a3e635, #4ade80)",
              color: "#0f1117",
              boxShadow: "0 0 30px rgba(163,230,53,0.25)",
            }}
          >
            <img src="/logo.svg" alt="logo" className="w-5 h-5 object-contain brightness-0" />
            Gợi ý món cho tôi
          </button>

        </div > {/* end narrow wrapper */}

        {/* ── Results ───────────────────────────────────────────────────── */}
        <div ref={resultsRef}>
          {submitted ? (
            <>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-base text-white">
                    {isAiLoading ? "Đang tìm kiếm..." : (results.length > 0 ? `${results.length} món gợi ý từ menu` : "Không tìm thấy kết quả")}
                  </h2>
                  {results.length === 0 && !isAiLoading && (
                    <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>Thử điều chỉnh tag hoặc từ khoá nhé!</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
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
              </div>

              {isAiLoading && (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="flex gap-2 mb-3">
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-3 h-3 rounded-full bg-lime-400" />
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-3 h-3 rounded-full bg-lime-400" />
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-3 h-3 rounded-full bg-lime-400" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">Đang tìm kiếm món ăn phù hợp...</p>
                </div>
              )}

              {results.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.map((r) => (
                    <RecipeCard
                      key={r.id}
                      recipe={r}
                      isFav={isFavorite(r.id)}
                      onToggleFav={() => toggleFavorite(r.id)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-base text-white">Một vài món bạn có thể thích</h2>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ background: "rgba(163,230,53,0.1)", color: "#a3e635", border: "1px solid rgba(163,230,53,0.2)" }}>
                  {defaultMeals.length} món
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {defaultMeals.map((r: any) => (
                  <RecipeCard
                    key={r.id}
                    recipe={r}
                    isFav={isFavorite(r.id)}
                    onToggleFav={() => toggleFavorite(r.id)}
                  />
                ))}
              </div>
              {hasNextPage && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="h-11 px-8 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.2)", color: "#a3e635" }}
                    onMouseEnter={(e) => { if (!isFetchingNextPage) (e.currentTarget as HTMLButtonElement).style.background = "rgba(163,230,53,0.15)"; }}
                    onMouseLeave={(e) => { if (!isFetchingNextPage) (e.currentTarget as HTMLButtonElement).style.background = "rgba(163,230,53,0.08)"; }}
                  >
                    {isFetchingNextPage ? 'Đang tải...' : 'Xem thêm 4 món ↓'}
                  </button>
                </div>
              )}
              {!hasNextPage && defaultMeals.length > 0 && (
                <p className="text-center text-xs mt-4" style={{ color: "#475569" }}>— Đã hiển thị tất cả {defaultMeals.length} món —</p>
              )}
            </>
          )}
        </div>
      </main >
    </div >
  );
}

// ─── Recipe Card ──────────────────────────────────────────────────────────────

function RecipeCard({ recipe, isFav, onToggleFav }: { recipe: any; isFav: boolean; onToggleFav: () => void }) {
  const tilt = useTiltCard(9);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      style={{
        perspective: 900,
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        scale: tilt.scale,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 28, filter: "blur(4px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      whileHover={{ boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 30px rgba(163,230,53,0.1)" }}
      className="group rounded-2xl overflow-hidden cursor-pointer"
    >
      <div
        className="rounded-2xl overflow-hidden h-full"
        style={{
          background: "rgba(26,31,46,0.9)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Image */}
        <div className="relative overflow-hidden h-44">
          <motion.div
            className="w-full h-full"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <ImageWithFallback
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
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
          <motion.button
            onClick={(e) => { e.preventDefault(); onToggleFav(); }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.85 }}
            animate={isFav ? { scale: [1, 1.35, 1] } : {}}
            transition={{ type: "spring", stiffness: 300 }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={
              isFav
                ? { background: "#ef4444", color: "white", boxShadow: "0 0 16px rgba(239,68,68,0.5)" }
                : {
                  background: "rgba(15,17,23,0.75)",
                  backdropFilter: "blur(8px)",
                  color: "#94a3b8",
                  border: "1px solid rgba(255,255,255,0.1)",
                }
            }
          >
            <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
          </motion.button>

          {/* Recipe name */}
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

          {/* Meta */}
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
            <motion.button
              whileHover={{
                background: "rgba(163,230,53,0.18)",
                borderColor: "rgba(163,230,53,0.5)",
                color: "#bef264",
                scale: 1.02,
              }}
              whileTap={{ scale: 0.97 }}
              className="w-full h-9 rounded-xl text-xs font-semibold"
              style={{
                background: "rgba(163,230,53,0.08)",
                border: "1px solid rgba(163,230,53,0.2)",
                color: "#a3e635",
              }}
            >
              Xem dinh dưỡng →
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
