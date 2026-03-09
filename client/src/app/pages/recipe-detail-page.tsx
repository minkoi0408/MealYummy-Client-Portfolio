import { Link, useParams } from "react-router";
import { Clock, Users, Heart, ChefHat, Flame, ArrowLeft, MapPin, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AppHeader } from "../components/app-header";
import { mockRecipes } from "../data/mock-recipes";
import { useFavorites } from "../contexts/favorites-context";

export function RecipeDetailPage() {
  const { id } = useParams();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const recipe = mockRecipes.find((r) => r.id === id);

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
        <div className="flex gap-3 mb-8">
          <button onClick={handleToggleFavorite}
            className="flex-1 h-12 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            style={fav
              ? { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }
              : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }
            }
          >
            <Heart className={`w-5 h-5 ${fav ? "fill-current" : ""}`} />
            {fav ? "Đã lưu" : "Lưu món"}
          </button>
          <Link to={`/recipe/${recipe.id}/nearby`} className="flex-1">
            <button className="w-full h-12 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.25)", color: "#a3e635" }}>
              <MapPin className="w-5 h-5" />
              Địa điểm bán
            </button>
          </Link>
        </div>

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

        {/* Difficulty + Calories */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl p-5 flex items-center gap-3"
            style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(163,230,53,0.1)" }}>
              <CheckCircle className="w-5 h-5 text-lime-400" />
            </div>
            <div>
              <p className="text-xs mb-0.5" style={{ color: "#64748b" }}>Độ khó</p>
              <p className="font-bold text-white">{recipe.difficulty}</p>
            </div>
          </div>
          <div className="rounded-2xl p-5 flex items-center gap-3"
            style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(251,146,60,0.1)" }}>
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs mb-0.5" style={{ color: "#64748b" }}>Calo / khẩu phần</p>
              <p className="font-bold text-white">{recipe.calories}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}