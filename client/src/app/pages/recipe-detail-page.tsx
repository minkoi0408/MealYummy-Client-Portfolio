import { Link, useParams, useNavigate } from "react-router-dom";
import { Clock, Users, Heart, ChefHat, Flame, ArrowLeft, MapPin, CheckCircle, Loader2, Zap, Droplet, Dumbbell, ShoppingCart, Leaf } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AppHeader } from "../components/app-header";
import { mockRecipes } from "../data/mock-recipes";
import { useFavorites } from "../contexts/favorites-context";
import { useMealPlan } from "../contexts/meal-plan-context";
import { toast } from "sonner";
import { ThreeGlobe } from "../components/three-globe";

const EARTH_TEXTURES = [
  "/textures/earth/earthmap.jpg",
  "/textures/earth/earth_lights.png",
  "/textures/earth/cloud_combined.jpg",
];

function estimateNutrition(calories: number) {
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

export function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToMealPlan } = useMealPlan();

  const [showLocationOverlay, setShowLocationOverlay] = useState(false);
  const [locationMessage, setLocationMessage] = useState("Đang xác định vị trí của bạn...");
  const [overlayPhase, setOverlayPhase] = useState<"scanning" | "zooming" | "done">("scanning");
  const [foundLocation, setFoundLocation] = useState<string | null>(null);

  useEffect(() => {
      EARTH_TEXTURES.forEach((src) => {
          const img = new Image();
          img.src = src;
      });
  }, []);

  const recipe = mockRecipes.find((r) => r.id === id);

  const handleFindRestaurant = useCallback(() => {
    if (!recipe) return;
    setShowLocationOverlay(true);
    setOverlayPhase("scanning");
    setFoundLocation(null);
    setLocationMessage("🛰️ Đang kết nối vệ tinh...");

    const msgTimer1 = setTimeout(() => setLocationMessage("📡 Đang quét tín hiệu GPS..."), 1500);
    const msgTimer2 = setTimeout(() => setLocationMessage("🌏 Đang xác định vị trí trên bản đồ..."), 3000);

    const minDelay = new Promise((r) => setTimeout(r, 4000));

    const geoPromise = new Promise<{ lat?: number; lng?: number }>((resolve) => {
        if (!navigator.geolocation) {
            resolve({});
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                clearTimeout(msgTimer1);
                clearTimeout(msgTimer2);
                resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            () => {
                clearTimeout(msgTimer1);
                clearTimeout(msgTimer2);
                resolve({});
            },
            { timeout: 8000, enableHighAccuracy: true }
        );
    });

    Promise.all([minDelay, geoPromise]).then(([, coords]) => {
        setOverlayPhase("zooming");
        if (coords.lat && coords.lng) {
            setFoundLocation(`${coords.lat.toFixed(4)}°N, ${coords.lng.toFixed(4)}°E`);
            setLocationMessage("📍 Đã xác định vị trí!");

            setTimeout(() => setLocationMessage("🔍 Đang tìm nhà hàng lân cận..."), 1200);
            
            setTimeout(() => {
                setOverlayPhase("done");
                setLocationMessage(`✅ Đã tìm thấy các nhà hàng!`);
            }, 2200);

            setTimeout(() => {
                setShowLocationOverlay(false);
                navigate(`/recipe/${recipe.id}/nearby`);
            }, 4700);

        } else {
            setFoundLocation("TP. Hồ Chí Minh, Việt Nam");
            setLocationMessage("📍 Vui lòng cấp quyền vị trí để tìm nhà hàng!");
            setTimeout(() => {
                setShowLocationOverlay(false);
                navigate(`/recipe/${recipe.id}/nearby`);
            }, 2500);
        }
    });
  }, [navigate, recipe]);

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f1117" }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(163,230,53,0.08)" }}>
            <ChefHat className="w-10 h-10 text-lime-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-3">Không tìm thấy món ăn</h1>
          <Link to="/app">
            <button className="h-11 px-6 rounded-xl font-bold text-gray-900 transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)" }}>
              Quay lại
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    if (isFavorite(recipe.id)) removeFavorite(recipe.id);
    else addFavorite(recipe);
  };

  const handleAddMeal = () => {
    if (!recipe) return;
    const today = new Date().toISOString().split("T")[0];
    addToMealPlan(recipe, today, "lunch");
    toast.success("Đã thêm vào thực đơn hôm nay 📅");
  };

  const fav = isFavorite(recipe.id);

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-8 pb-16">
        {/* Back */}
        <div className="pt-6 mb-6">
          <Link to="/app" className="inline-flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: "#64748b" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#f1f5f9"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#64748b"; }}
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </Link>
        </div>

        {/* Hero Image */}
        <div className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl">
          <ImageWithFallback src={recipe.image} alt={recipe.name} className="w-full h-80 sm:h-96 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3"
              style={{ background: "rgba(163,230,53,0.2)", color: "#a3e635", border: "1px solid rgba(163,230,53,0.3)" }}>
              {recipe.cuisine}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{recipe.name}</h1>
            <p className="text-white/80 text-base">{recipe.description}</p>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: <Clock className="w-5 h-5 text-lime-400" />, label: "Chuẩn bị", value: recipe.prepTime },
            { icon: <ChefHat className="w-5 h-5 text-blue-400" />, label: "Nấu", value: recipe.cookTime },
            { icon: <Users className="w-5 h-5 text-purple-400" />, label: "Khẩu phần", value: recipe.servings },
            { icon: <Flame className="w-5 h-5 text-orange-400" />, label: "Calo", value: recipe.calories },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-4 rounded-2xl"
              style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-2"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                {item.icon}
              </div>
              <p className="text-xs mb-1" style={{ color: "#64748b" }}>{item.label}</p>
              <p className="font-bold text-white text-sm">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button onClick={handleAddMeal}
              className="col-span-2 h-12 rounded-2xl font-bold text-gray-900 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)", boxShadow: "0 0 24px rgba(163,230,53,0.25)" }}>
              <ShoppingCart className="w-5 h-5" /> Thêm vào thực đơn
          </button>
          <button onClick={handleToggleFavorite}
            className="h-12 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            style={fav
              ? { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }
              : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }
            }
          >
            <Heart className={`w-5 h-5 ${fav ? "fill-current" : ""}`} />
            {fav ? "Đã lưu" : "Lưu món"}
          </button>
          <button onClick={handleFindRestaurant} className="h-12 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.25)", color: "#a3e635" }}>
            <MapPin className="w-5 h-5" />
            Kiếm quán ăn
          </button>
        </div>

        {/* ── Dinh dưỡng ── */}
        <section className="mb-8">
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
                    <p className="text-5xl font-black text-white">{parseInt(recipe.calories) || 400} <span className="text-xl font-semibold" style={{ color: "#64748b" }}>kcal</span></p>
                    <p className="text-sm mt-1" style={{ color: "#64748b" }}>≈ {Math.round((parseInt(recipe.calories) || 400) / 2000 * 100)}% nhu cầu calo ngày (2000 kcal)</p>
                </div>
            </div>

            {/* Macro grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Protein", value: estimateNutrition(parseInt(recipe.calories) || 400).protein, unit: "g", color: "#a3e635", bg: "rgba(163,230,53,0.08)", border: "rgba(163,230,53,0.2)", icon: <Dumbbell className="w-4 h-4" />, tip: NUTRITION_TIPS.protein },
                    { label: "Carbs", value: estimateNutrition(parseInt(recipe.calories) || 400).carbs, unit: "g", color: "#fb923c", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.2)", icon: <Zap className="w-4 h-4" />, tip: NUTRITION_TIPS.carbs },
                    { label: "Fat", value: estimateNutrition(parseInt(recipe.calories) || 400).fat, unit: "g", color: "#c4b5fd", bg: "rgba(196,181,253,0.08)", border: "rgba(196,181,253,0.2)", icon: <Droplet className="w-4 h-4" />, tip: NUTRITION_TIPS.fat },
                    { label: "Chất xơ", value: estimateNutrition(parseInt(recipe.calories) || 400).fiber, unit: "g", color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)", icon: <Leaf className="w-4 h-4" />, tip: NUTRITION_TIPS.fiber },
                ].map((m) => (
                    <div key={m.label} className="rounded-2xl p-4 sm:p-5"
                        style={{ background: m.bg, border: `1px solid ${m.border}` }}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2" style={{ color: m.color }}>
                                {m.icon}
                                <span className="text-base font-bold">{m.label}</span>
                            </div>
                            <span className="text-xl sm:text-2xl font-black text-white">{m.value}<span className="text-xs sm:text-sm font-normal" style={{ color: "#64748b" }}>{m.unit}</span></span>
                        </div>
                        {/* Bar */}
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <div className="h-full rounded-full" style={{ width: `${Math.min(100, (m.value / 100) * 100)}%`, background: m.color }} />
                        </div>
                        <p className="text-xs mt-2.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{m.tip}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Ingredients + Instructions grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Ingredients */}
          <div className="rounded-2xl p-6" style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="font-black text-lg text-white mb-1">Nguyên liệu</h2>
            <p className="text-xs mb-4" style={{ color: "#64748b" }}>Chuẩn bị đầy đủ các nguyên liệu sau</p>
            <ul className="space-y-2.5">
              {recipe.ingredients.map((ingredient: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#a3e635" }} />
                  <span className="text-sm" style={{ color: "#e2e8f0" }}>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="rounded-2xl p-6" style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="font-black text-lg text-white mb-1">Cách làm</h2>
            <p className="text-xs mb-4" style={{ color: "#64748b" }}>Làm theo các bước dưới đây</p>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 text-gray-900"
                    style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)" }}>
                    {i + 1}
                  </div>
                  <span className="text-sm pt-0.5" style={{ color: "#e2e8f0" }}>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Tips */}
        {recipe.tips && (
          <div className="rounded-2xl p-6 mb-6"
            style={{ background: "rgba(163,230,53,0.04)", border: "1px solid rgba(163,230,53,0.2)" }}>
            <h2 className="font-black text-base text-white flex items-center gap-2 mb-3">
              <ChefHat className="w-5 h-5 text-lime-400" />
              Mẹo nhỏ
            </h2>
            <p className="text-sm" style={{ color: "#cbd5e1" }}>{recipe.tips}</p>
          </div>
        )}

      </main>

      {/* ── Location Finding Overlay with 3D Globe ── */}
      {showLocationOverlay && (
          <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
              style={{
                  background: overlayPhase === "done"
                      ? "#0f1117"
                      : "radial-gradient(ellipse at center, #0a1628 0%, #050a14 60%, #000 100%)",
                  transition: "background 0.8s ease",
              }}>

              {/* 3D Globe (Three.js) — fills the entire overlay */}
              <ThreeGlobe phase={overlayPhase} />

              {/* Found location card — appears when zooming */}
              {(overlayPhase === "zooming" || overlayPhase === "done") && foundLocation && (
                  <div className="absolute z-30 flex flex-col items-center"
                      style={{
                          top: "50%", left: "50%",
                          transform: "translate(-50%, -50%)",
                          animation: "fadeSlideIn 0.6s ease",
                      }}>
                      <div className="rounded-2xl px-8 py-5 text-center"
                          style={{
                              background: "rgba(15,17,23,0.85)",
                              backdropFilter: "blur(20px)",
                              border: "1px solid rgba(163,230,53,0.3)",
                              boxShadow: "0 0 40px rgba(163,230,53,0.15), 0 20px 60px rgba(0,0,0,0.5)",
                          }}>
                          <div className="flex items-center justify-center gap-2 mb-2">
                              <div className="w-3 h-3 bg-lime-400 rounded-full" style={{ animation: "pulseGlow 1.5s ease-in-out infinite", boxShadow: "0 0 10px rgba(163,230,53,0.6)" }} />
                              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#a3e635" }}>Vị trí đã xác định</span>
                          </div>
                          <p className="text-xl font-black text-white mb-1">{foundLocation}</p>
                          <p className="text-sm" style={{ color: "#94a3b8" }}>{locationMessage}</p>
                      </div>
                  </div>
              )}

              {/* Status text — bottom, only during scanning */}
              {overlayPhase === "scanning" && (
                  <div className="absolute bottom-20 left-0 right-0 text-center z-10" style={{ animation: "fadeSlideIn 0.5s ease" }}>
                      <div className="flex items-center justify-center gap-2.5 mb-3">
                          <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                          <p className="text-lg font-semibold text-white">
                              {locationMessage}
                          </p>
                      </div>
                      <p className="text-sm" style={{ color: "rgba(148,163,184,0.6)" }}>
                          Vui lòng cho phép truy cập định vị để có kết quả chính xác hơn
                      </p>
                  </div>
              )}
          </div>
      )}
    </div>
  );
}