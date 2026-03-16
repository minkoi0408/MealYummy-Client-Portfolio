import { createBrowserRouter } from "react-router";
import { HomePage } from "../app/pages/home-page";
import { LoginPage } from "../app/pages/login-page";
import { MainAppPage } from "../app/pages/main-app-page";
import { ResultsPage } from "../app/pages/results-page";
import { DashboardPage } from "../app/pages/dashboard-page";
import { RecipeDetailPage } from "../app/pages/recipe-detail-page";
import { MealPlanPage } from "../app/pages/meal-plan-page";
import { ProfilePage } from "../app/pages/profile-page";
import { NearbyRestaurantsPage } from "../app/pages/nearby-restaurants-page";
import { ShoppingPage } from "../app/pages/shopping-page";
import { MealDetailPage } from "../app/pages/meal-detail-page";
import { NotFoundPage } from "../app/pages/not-found-page";
import { MembershipPage } from "../app/pages/membership-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/home",
    Component: HomePage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/app",
    Component: MainAppPage,
  },
  {
    path: "/results",
    Component: ResultsPage,
  },
  {
    path: "/dashboard",
    Component: DashboardPage,
  },
  {
    path: "/recipe/:id",
    Component: RecipeDetailPage,
  },
  {
    path: "/meal-plan",
    Component: MealPlanPage,
  },
  {
    path: "/profile",
    Component: ProfilePage,
  },
  {
    path: "/recipe/:id/nearby",
    Component: NearbyRestaurantsPage,
  },
  {
    path: "/nearby-restaurants",
    Component: NearbyRestaurantsPage,
  },
  {
    path: "/shopping",
    Component: ShoppingPage,
  },
  {
    path: "/meal/:id",
    Component: MealDetailPage,
  },
  {
    path: "/membership",
    Component: MembershipPage,
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);