import { RouterProvider } from "react-router";
import { router } from "./routes/routes";
import { FavoritesProvider } from "./app/contexts/favorites-context";
import { MealPlanProvider } from "./app/contexts/meal-plan-context";
import { Toaster } from "./app/components/ui/sonner";
import { AnimatedBackground } from "./app/components/animated-background";

export default function App() {
  return (
    <FavoritesProvider>
      <MealPlanProvider>
        <AnimatedBackground />
        <div className="relative z-10">
          <RouterProvider router={router} />
        </div>
        <Toaster />
      </MealPlanProvider>
    </FavoritesProvider>
  );
}