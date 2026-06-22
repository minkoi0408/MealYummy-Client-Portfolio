import { Link, useParams, useNavigate } from "react-router-dom";
import { Clock, Users, Heart, ChefHat, Flame, ArrowLeft, MapPin, CheckCircle, Loader2, Zap, Droplet, Dumbbell, ShoppingCart, Leaf } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AppHeader } from "../components/app-header";
import { useQuery } from "@tanstack/react-query";
import { mealApi } from "../../apis/meal.api";
import { useFavorites } from "../contexts/favorites-context";
import { toast } from "sonner";
import { ThreeGlobe } from "../components/three-globe";

const EARTH_TEXTURES = [
  "/textures/earth/earthmap.jpg",
  "/textures/earth/earth_lights.png",
  "/textures/earth/cloud_combined.jpg",
];

function mapMealResponseToRecipe(meal: any): any {
  return {
    id: meal.id,
    name: meal.name,
    description: meal.description,
    image: meal.images?.find((img: any) => img.isThumbnail)?.url || meal.images?.[0]?.url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
    categories: meal.categories || [],
    tags: meal.tags || [],
    ingredients: meal.ingredients || [],
    nutrition: meal.nutrition || null,
  };
}

export function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

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

  const { data: recipe, isLoading } = useQuery({
    queryKey: ['meal', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const res = await mealApi.getById(id);
        return mapMealResponseToRecipe(res.data.data);
      } catch (err) {
        return null;
      }
    },
    enabled: !!id
  });

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

  const handleToggleFavorite = () => {
    if (!recipe) return;
    toggleFavorite(recipe.id);
  };


  const fav = recipe ? isFavorite(recipe.id) : false;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f1117" }}>
        <Loader2 className="w-10 h-10 text-lime-400 animate-spin" />
      </div>
    );
  }

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
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{recipe.name}</h1>
            <p className="text-white/80 text-base">{recipe.description}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
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

        {/* ── Thông tin Dinh dưỡng ── */}
        <section className="mb-8">
          <h2 className="text-xl font-black text-white mb-5 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>🔥</span>
              Thông tin dinh dưỡng
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl p-4 flex flex-col items-center justify-center text-center" style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.1), rgba(26,31,46,0.9))", border: "1px solid rgba(168,85,247,0.3)", boxShadow: "0 4px 20px rgba(168,85,247,0.05)" }}>
                  <span className="text-sm font-medium text-gray-400 mb-1">Calories</span>
                  <span className="text-xl font-black text-purple-400">{recipe.nutrition?.calories ?? 0} <span className="text-xs font-normal">kcal</span></span>
              </div>
              <div className="rounded-2xl p-4 flex flex-col items-center justify-center text-center" style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.1), rgba(26,31,46,0.9))", border: "1px solid rgba(56,189,248,0.3)", boxShadow: "0 4px 20px rgba(56,189,248,0.05)" }}>
                  <span className="text-sm font-medium text-gray-400 mb-1">Protein</span>
                  <span className="text-xl font-black text-sky-400">{recipe.nutrition?.protein ?? 0} <span className="text-xs font-normal">g</span></span>
              </div>
              <div className="rounded-2xl p-4 flex flex-col items-center justify-center text-center" style={{ background: "linear-gradient(135deg, rgba(250,204,21,0.1), rgba(26,31,46,0.9))", border: "1px solid rgba(250,204,21,0.3)", boxShadow: "0 4px 20px rgba(250,204,21,0.05)" }}>
                  <span className="text-sm font-medium text-gray-400 mb-1">Carbs</span>
                  <span className="text-xl font-black text-yellow-400">{recipe.nutrition?.carbs ?? 0} <span className="text-xs font-normal">g</span></span>
              </div>
              <div className="rounded-2xl p-4 flex flex-col items-center justify-center text-center" style={{ background: "linear-gradient(135deg, rgba(248,113,113,0.1), rgba(26,31,46,0.9))", border: "1px solid rgba(248,113,113,0.3)", boxShadow: "0 4px 20px rgba(248,113,113,0.05)" }}>
                  <span className="text-sm font-medium text-gray-400 mb-1">Fat</span>
                  <span className="text-xl font-black text-red-400">{recipe.nutrition?.fat ?? 0} <span className="text-xs font-normal">g</span></span>
              </div>

          </div>
        </section>

        {/* ── Thông tin Món ăn ── */}
        <section className="mb-8">
            <h2 className="text-xl font-black text-white mb-5 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                    style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>📌</span>
                Phân loại & Đặc điểm
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Categories */}
                <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(251,146,60,0.1), rgba(26,31,46,0.9))", border: "1px solid rgba(251,146,60,0.2)", boxShadow: "0 4px 24px rgba(251,146,60,0.05)" }}>
                    <div className="flex items-center gap-2 mb-4">
                        <Flame className="w-5 h-5 text-orange-400" />
                        <h3 className="font-bold text-white">Danh mục</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {recipe.categories && recipe.categories.length > 0 ? (
                            recipe.categories.map((cat: string, index: number) => (
                                <span key={index} className="px-3 py-1.5 rounded-xl text-sm font-medium"
                                    style={{ background: "rgba(251,146,60,0.1)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.2)" }}>
                                    {cat}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-gray-500">Chưa phân loại</span>
                        )}
                    </div>
                </div>

                {/* Tags */}
                <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.1), rgba(26,31,46,0.9))", border: "1px solid rgba(34,211,238,0.2)", boxShadow: "0 4px 24px rgba(34,211,238,0.05)" }}>
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-cyan-400" />
                        <h3 className="font-bold text-white">Thẻ (Tags)</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {recipe.tags && recipe.tags.length > 0 ? (
                            recipe.tags.map((tag: string, index: number) => (
                                <span key={index} className="px-3 py-1.5 rounded-xl text-sm font-medium flex items-center gap-1.5"
                                    style={{ background: "rgba(34,211,238,0.1)", color: "#22d3ee", border: "1px solid rgba(34,211,238,0.2)" }}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                    {tag}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-gray-500">Chưa gắn thẻ</span>
                        )}
                    </div>
                </div>
            </div>
        </section>

        {/* Ingredients */}
        <div className="mb-8">
            <h2 className="text-xl font-black text-white mb-5 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                    style={{ background: "rgba(163,230,53,0.15)", color: "#a3e635" }}>🥬</span>
                Nguyên liệu
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    recipe.ingredients.map((ing: any, i: number) => (
                        <div key={ing.ingredientId || i} className="flex flex-col items-center justify-center text-center p-5 rounded-2xl transition-all hover:scale-[1.05]"
                            style={{ background: "linear-gradient(135deg, rgba(163,230,53,0.1), rgba(26,31,46,0.9))", border: "1px solid rgba(163,230,53,0.3)", boxShadow: "0 4px 20px rgba(163,230,53,0.05)" }}>
                            <span className="font-bold text-white text-base mb-1">{ing.name || 'Nguyên liệu'}</span>
                            <span className="text-sm font-medium" style={{ color: "#a3e635" }}>{ing.value} {ing.unitDesc || ing.unit}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">Đang cập nhật</p>
                )}
            </div>
        </div>

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