import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Heart, Clock, Calendar } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AppHeader } from "../components/app-header";
import { useFavorites } from "../contexts/favorites-context";
import { useMealPlan } from "../contexts/meal-plan-context";
import { toast } from "sonner";

export function DashboardPage() {
  const { favorites, removeFavorite } = useFavorites();
  const { addToMealPlan } = useMealPlan();

  const handleAddToMealPlan = (recipe: any) => {
    addToMealPlan(recipe);
    toast.success(`${recipe.name} đã được thêm vào thực đơn`);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <AppHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Món ăn yêu thích</h1>
          <p className="text-muted-foreground">
            {favorites.length} món ăn đã lưu
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-primary/50" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Chưa có món ăn nào được lưu</h2>
            <p className="text-muted-foreground mb-6">
              Khám phá và lưu các món ăn yêu thích ca bạn
            </p>
            <Link to="/app">
              <Button size="lg">
                Khám phá món ăn
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((recipe) => (
              <Card key={recipe.id} className="group hover:shadow-xl transition-all overflow-hidden">
                <Link to={`/recipe/${recipe.id}`}>
                  <div className="relative overflow-hidden">
                    <ImageWithFallback
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-foreground border">
                      {recipe.cuisine}
                    </Badge>
                  </div>
                </Link>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{recipe.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.cookTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>•</span>
                      <span>{recipe.servings}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddToMealPlan(recipe)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Thêm vào thực đơn
                    </Button>
                    <Link to={`/recipe/${recipe.id}`} className="flex-1">
                      <Button variant="default" size="sm" className="w-full">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}