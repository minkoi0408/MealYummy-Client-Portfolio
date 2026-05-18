import { Link } from "react-router";
import { Heart, Clock, Calendar, Sparkles, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AppHeader } from "../components/app-header";
import { useFavorites } from "../contexts/favorites-context";
import { useMealPlan } from "../contexts/meal-plan-context";
import { toast } from "sonner";

export function FavoritePage() {
  const { favorites } = useFavorites();
  const { addToMealPlan } = useMealPlan();

  const handleAddToMealPlan = (recipe: any) => {
    addToMealPlan(recipe);
    toast.success(`${recipe.name} đã được thêm vào thực đơn`);
  };

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 text-xs font-bold uppercase tracking-widest"
              style={{
                background: "rgba(163,230,53,0.08)",
                border: "1px solid rgba(163,230,53,0.2)",
                color: "#a3e635",
              }}
            >
              <Heart className="w-3.5 h-3.5" />
              Yêu Thích
            </div>
            <h1 className="text-3xl font-black text-white mb-1">
              Món ăn yêu thích
            </h1>
            <p style={{ color: "#64748b" }}>
              {favorites.length} món ăn đã lưu
            </p>
          </div>
          <Link to="/history">
            <button
              className="h-9 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              style={{
                background: "rgba(163,230,53,0.08)",
                border: "1px solid rgba(163,230,53,0.25)",
                color: "#a3e635",
              }}
            >
              Xem lịch sử bữa ăn
            </button>
          </Link>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.15)" }}>
              <Heart className="w-10 h-10" style={{ color: "rgba(163,230,53,0.4)" }} />
            </div>
            <h2 className="text-2xl font-black text-white mb-3">Chưa có món ăn nào được lưu</h2>
            <p className="mb-8" style={{ color: "#64748b" }}>Khám phá và lưu các món ăn yêu thích của bạn</p>
            <Link to="/app">
              <button className="h-12 px-8 rounded-2xl font-bold text-gray-900 flex items-center gap-2 mx-auto transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)", boxShadow: "0 0 30px rgba(163,230,53,0.3)" }}>
                <Sparkles className="w-4 h-4" />
                Khám phá món ăn
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {favorites.map((recipe) => (
              <div key={recipe.id}
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
                <Link to={`/meal/${recipe.id}`}>
                  <div className="relative overflow-hidden h-48">
                    <ImageWithFallback
                      src={recipe.image} alt={recipe.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full"
                      style={{ background: "rgba(15,17,23,0.8)", backdropFilter: "blur(8px)", color: "#f1f5f9", border: "1px solid rgba(255,255,255,0.12)" }}>
                      {recipe.cuisine}
                    </span>
                    <p className="absolute bottom-3 left-3 right-3 text-white font-bold text-base line-clamp-1 drop-shadow-sm">{recipe.name}</p>
                  </div>
                </Link>

                <div className="p-4">
                  <p className="text-xs line-clamp-2 mb-3 leading-relaxed" style={{ color: "#64748b" }}>{recipe.description}</p>
                  <div className="flex items-center gap-3 text-xs mb-4" style={{ color: "#64748b" }}>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-lime-400" />{recipe.cookTime}</span>
                    {recipe.servings && <span className="flex items-center gap-1">· {recipe.servings}</span>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToMealPlan(recipe)}
                      className="flex-1 h-9 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(163,230,53,0.08)";
                        (e.currentTarget as HTMLButtonElement).style.color = "#a3e635";
                        (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(163,230,53,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                        (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
                        (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(255,255,255,0.1)";
                      }}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Thêm thực đơn
                    </button>
                    <Link to={`/meal/${recipe.id}`} className="flex-1">
                      <button className="w-full h-9 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                        style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.2)", color: "#a3e635" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(163,230,53,0.15)";
                          (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(163,230,53,0.4)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(163,230,53,0.08)";
                          (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(163,230,53,0.2)";
                        }}
                      >
                        Xem chi tiết <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}