import { useParams, Link } from "react-router";
import { ArrowLeft, Flame, Clock, Users, ChefHat, Leaf, Zap, Droplet, Dumbbell, ShoppingCart, Heart } from "lucide-react";
import { AppHeader } from "../components/app-header";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { mockRecipes } from "../data/mock-recipes";
import { useFavorites } from "../contexts/favorites-context";
import { useMealPlan } from "../contexts/meal-plan-context";
import { toast } from "sonner";

// Nutrition is mocked/derived from the recipe data for MVP
function estimateNutrition(calories: number) {
    // Rough macro split: 30% protein, 40% carb, 30% fat
    const protein = Math.round((calories * 0.30) / 4);
    const carbs = Math.round((calories * 0.40) / 4);
    const fat = Math.round((calories * 0.30) / 9);
    const fiber = Math.round(protein * 0.25);
    return { protein, carbs, fat, fiber };
}

const NUTRITION_TIPS: Record<string, string> = {
    protein: "Protein giúp xây dựng và phục hồi cơ bắp sau tập luyện.",
    carbs: "Carbohydrate là nguồn năng lượng chính cho buổi tập.",
    fat: "Chất béo hỗ trợ hấp thụ vitamin và điều tiết hormone.",
    fiber: "Chất xơ hỗ trợ tiêu hóa và duy trì cảm giác no lâu.",
};

export function MealDetailPage() {
    const { id } = useParams();
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const { addToMealPlan } = useMealPlan();

    // Find by id in mock data — id here comes from the ranked dish id (s1, b1, r1…)
    // We map s->season, b->bestseller, r->regional back to mock recipes by index
    const recipeIndex = id ? (parseInt(id.replace(/\D/g, "")) - 1) : -1;
    const recipe = mockRecipes[recipeIndex >= 0 ? recipeIndex % mockRecipes.length : 0];

    if (!recipe) {
        return (
            <div className="min-h-screen">
                <AppHeader />
                <div className="flex flex-col items-center justify-center h-64 gap-3">
                    <p className="text-white text-lg font-bold">Không tìm thấy món ăn</p>
                    <Link to="/results" className="text-lime-400 text-sm underline">← Quay lại</Link>
                </div>
            </div>
        );
    }

    const caloriesNum = parseInt(recipe.calories) || 400;
    const nutrition = estimateNutrition(caloriesNum);
    const fav = isFavorite(recipe.id);

    const handleFav = () => {
        if (fav) { removeFavorite(recipe.id); toast.success("Đã bỏ yêu thích"); }
        else { addFavorite(recipe); toast.success("Đã thêm vào yêu thích 💚"); }
    };

    const handleAddMeal = () => {
        const today = new Date().toISOString().split("T")[0];
        addToMealPlan(recipe, today, "lunch");
        toast.success("Đã thêm vào thực đơn hôm nay 📅");
    };

    const macros = [
        { label: "Protein", value: nutrition.protein, unit: "g", color: "#a3e635", bg: "rgba(163,230,53,0.08)", border: "rgba(163,230,53,0.2)", icon: <Dumbbell className="w-4 h-4" />, tip: NUTRITION_TIPS.protein },
        { label: "Carbs", value: nutrition.carbs, unit: "g", color: "#fb923c", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.2)", icon: <Zap className="w-4 h-4" />, tip: NUTRITION_TIPS.carbs },
        { label: "Fat", value: nutrition.fat, unit: "g", color: "#c4b5fd", bg: "rgba(196,181,253,0.08)", border: "rgba(196,181,253,0.2)", icon: <Droplet className="w-4 h-4" />, tip: NUTRITION_TIPS.fat },
        { label: "Chất xơ", value: nutrition.fiber, unit: "g", color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)", icon: <Leaf className="w-4 h-4" />, tip: NUTRITION_TIPS.fiber },
    ];

    return (
        <div className="min-h-screen">
            <AppHeader />

            <main className="max-w-3xl mx-auto px-4 sm:px-8 pb-20">
                {/* Back */}
                <div className="pt-6 mb-4">
                    <Link to="/results"
                        className="inline-flex items-center gap-1.5 text-sm transition-colors"
                        style={{ color: "#64748b" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#f1f5f9"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#64748b"; }}>
                        <ArrowLeft className="w-4 h-4" /> Quay lại gợi ý
                    </Link>
                </div>

                {/* Hero Card */}
                <div className="rounded-3xl overflow-hidden mb-6 shadow-2xl"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="relative h-72">
                        <ImageWithFallback src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,17,23,0.95) 0%, rgba(15,17,23,0.3) 60%, transparent 100%)" }} />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                            <h1 className="text-3xl font-black text-white mb-2">{recipe.name}</h1>
                            <p className="text-base leading-relaxed line-clamp-2" style={{ color: "rgba(241,245,249,0.7)" }}>{recipe.description}</p>
                        </div>
                    </div>

                    {/* ── CTA Buttons ── */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-5 mt-5">
                        <button onClick={handleAddMeal}
                            className="flex-1 h-12 rounded-2xl font-bold text-gray-900 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                            style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)", boxShadow: "0 0 24px rgba(163,230,53,0.25)" }}>
                            <ShoppingCart className="w-5 h-5" /> Thêm vào thực đơn
                        </button>
                        <button onClick={handleFav}
                            className="h-12 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all"
                            style={fav
                                ? { background: "rgba(163,230,53,0.1)", color: "#a3e635", border: "1px solid rgba(163,230,53,0.3)" }
                                : { background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <Heart className={`w-5 h-5 ${fav ? "fill-lime-400 text-lime-400" : ""}`} />
                            {fav ? "Đã yêu thích" : "Yêu thích"}
                        </button>
                    </div>
                    {/* Quick stats bar */}
                    <div className="flex" style={{ background: "rgba(26,31,46,0.95)" }}>
                        {[
                            { icon: <Flame className="w-5 h-5 text-orange-400" />, label: recipe.calories },
                            { icon: <Clock className="w-5 h-5 text-lime-400" />, label: recipe.cookTime },
                            { icon: <Users className="w-5 h-5 text-blue-400" />, label: recipe.servings },
                            { icon: <ChefHat className="w-5 h-5 text-purple-400" />, label: recipe.difficulty },
                        ].map((stat, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center py-4 gap-1.5"
                                style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                                {stat.icon}
                                <span className="text-sm font-medium" style={{ color: "#94a3b8" }}>{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Dinh dưỡng ── */}
                <section className="mb-6">
                    <h2 className="text-xl font-black text-white mb-5 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                            style={{ background: "rgba(163,230,53,0.15)", color: "#a3e635" }}>⚡</span>
                        Thông tin dinh dưỡng
                    </h2>

                    {/* Calories big display */}
                    <div className="rounded-2xl p-6 mb-5 flex items-center gap-6"
                        style={{ background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.2)" }}>
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(251,146,60,0.12)" }}>
                            <Flame className="w-10 h-10 text-orange-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium mb-1" style={{ color: "#fb923c" }}>Tổng calo / khẩu phần</p>
                            <p className="text-5xl font-black text-white">{caloriesNum} <span className="text-xl font-semibold" style={{ color: "#64748b" }}>kcal</span></p>
                            <p className="text-sm mt-1" style={{ color: "#64748b" }}>≈ {Math.round(caloriesNum / 2000 * 100)}% nhu cầu calo ngày (2000 kcal)</p>
                        </div>
                    </div>

                    {/* Macro grid */}
                    <div className="grid grid-cols-2 gap-4 mb-5">
                        {macros.map((m) => (
                            <div key={m.label} className="rounded-2xl p-5"
                                style={{ background: m.bg, border: `1px solid ${m.border}` }}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2" style={{ color: m.color }}>
                                        {m.icon}
                                        <span className="text-base font-bold">{m.label}</span>
                                    </div>
                                    <span className="text-2xl font-black text-white">{m.value}<span className="text-sm font-normal" style={{ color: "#64748b" }}>{m.unit}</span></span>
                                </div>
                                {/* Bar */}
                                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (m.value / 100) * 100)}%`, background: m.color }} />
                                </div>
                                <p className="text-xs mt-2.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{m.tip}</p>
                            </div>
                        ))}
                    </div>

                    {/* Fitness tip banner */}
                    <div className="rounded-2xl p-5 flex items-start gap-4"
                        style={{ background: "rgba(163,230,53,0.04)", border: "1px solid rgba(163,230,53,0.15)" }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: "rgba(163,230,53,0.1)" }}>
                            <Dumbbell className="w-5 h-5 text-lime-400" />
                        </div>
                        <div>
                            <p className="text-base font-semibold text-lime-400 mb-1">Gợi ý cho người tập gym</p>
                            <p className="text-sm leading-relaxed" style={{ color: "rgba(241,245,249,0.5)" }}>
                                Món này cung cấp <strong className="text-white">{nutrition.protein}g protein</strong> — tương đương
                                ~{Math.round(nutrition.protein / 0.3)}g thịt nạc. Phù hợp cho bữa ăn{" "}
                                {caloriesNum < 350 ? "trước tập (pre-workout) để tránh nặng bụng." : caloriesNum > 500 ? "sau tập (post-workout) để phục hồi cơ bắp." : "chính trong ngày tập luyện."}
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── Nguyên liệu ── */}
                <section className="mb-8">
                    <h2 className="text-xl font-black text-white mb-5 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                            style={{ background: "rgba(139,92,246,0.15)", color: "#c4b5fd" }}>🧪</span>
                        Nguyên liệu
                    </h2>
                    <div className="rounded-2xl overflow-hidden"
                        style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        {recipe.ingredients.map((ingredient, i) => (
                            <div key={i} className="flex items-center gap-4 px-6 py-4"
                                style={{ borderBottom: i < recipe.ingredients.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                                <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                                    style={{ background: "rgba(163,230,53,0.1)", color: "#a3e635" }}>
                                    {i + 1}
                                </span>
                                <span className="text-base text-white">{ingredient}</span>
                            </div>
                        ))}
                    </div>
                </section>


            </main>
        </div>
    );
}
