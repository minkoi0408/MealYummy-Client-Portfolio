import { Link, useParams } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Clock, Users, Heart, ChefHat, Flame, ArrowLeft, MapPin } from "lucide-react";
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
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy món ăn</h1>
          <Link to="/app">
            <Button>Quay lại</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    if (isFavorite(recipe.id)) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <AppHeader />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8 py-8">
        {/* Back link */}
        <Link to="/app" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Link>

        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden mb-8 shadow-2xl">
          <ImageWithFallback
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <Badge className="mb-3 bg-white/20 backdrop-blur-sm border-white/40">{recipe.cuisine}</Badge>
            <h1 className="text-4xl font-bold mb-2">{recipe.name}</h1>
            <p className="text-lg text-white/90">{recipe.description}</p>
          </div>
        </div>

        {/* Quick Info & Actions */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Chuẩn bị</p>
                <p className="font-semibold">{recipe.prepTime}</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <ChefHat className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Nấu</p>
                <p className="font-semibold">{recipe.cookTime}</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Khẩu phần</p>
                <p className="font-semibold">{recipe.servings}</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Flame className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Calo</p>
                <p className="font-semibold">{recipe.calories}</p>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Button
                  variant={isFavorite(recipe.id) ? "default" : "outline"}
                  size="lg"
                  onClick={handleToggleFavorite}
                  className="w-full"
                >
                  <Heart className={`w-5 h-5 mr-2 ${isFavorite(recipe.id) ? "fill-current" : ""}`} />
                  {isFavorite(recipe.id) ? "Đã lưu" : "Lưu món"}
                </Button>
                <Link to={`/recipe/${recipe.id}/nearby`} className="w-full">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-amber-300 text-amber-600 hover:bg-amber-50 hover:border-amber-400"
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    Địa điểm bán
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle>Nguyên liệu</CardTitle>
              <CardDescription>Chuẩn bị đầy đủ các nguyên liệu sau</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-base">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Cách làm</CardTitle>
              <CardDescription>Làm theo các bước dưới đây</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-base pt-1">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        {recipe.tips && (
          <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="w-5 h-5" />
                Mẹo nhỏ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base">{recipe.tips}</p>
            </CardContent>
          </Card>
        )}

        {/* Nutrition & Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Độ khó</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {recipe.difficulty}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calo trên khẩu phần</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{recipe.calories}</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}