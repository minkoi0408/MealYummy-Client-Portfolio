import { RouterProvider } from "react-router";
import { router } from "./routes/routes";
import { FavoritesProvider } from "./app/contexts/favorites-context";
import { MealPlanProvider } from "./app/contexts/meal-plan-context";
import { Toaster } from "./app/components/ui/sonner";
import { AnimatedBackground } from "./app/components/animated-background";
import { BrightnessProvider } from "./app/contexts/brightness-context";
import { AuthProvider } from "./app/contexts/auth-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60, // 1 hour
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrightnessProvider>
          <FavoritesProvider>
            <MealPlanProvider>
              <AnimatedBackground />
              <div className="relative z-10">
                <RouterProvider router={router} />
              </div>
              <Toaster />
            </MealPlanProvider>
          </FavoritesProvider>
        </BrightnessProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}