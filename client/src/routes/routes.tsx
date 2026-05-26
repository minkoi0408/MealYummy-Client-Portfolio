import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./protected-route";
import { HomePage } from "../app/pages/home-page";
import { LoginPage } from "../app/pages/login-page";
import { MainAppPage } from "../app/pages/main-app-page";
import { ResultsPage } from "../app/pages/results-page";
// Admin Imports
import { AdminLayout } from "../app/layouts/admin-layout";
import { DashboardHomePage } from "../app/pages/admin/dashboard-home";
import { CategoryManagementPage } from "../app/pages/admin/food/category-management-page";
import { TagManagementPage } from "../app/pages/admin/food/tag-management-page";
import { IngredientManagementPage } from "../app/pages/admin/food/ingredient-management-page";
import { MealManagementPage } from "../app/pages/admin/food/meal-management-page";
import { BundleManagementPage } from "../app/pages/admin/subscriptions/bundle-management-page";
import { PaymentHistoryPage } from "../app/pages/admin/subscriptions/payment-history-page";
import { UserSubscriptionPage } from "../app/pages/admin/subscriptions/user-subscription-page";
import { UserManagementPage } from "../app/pages/admin/users/user-management-page";
import { RoleManagementPage } from "../app/pages/admin/users/role-management-page";
import { RecipeDetailPage } from "../app/pages/recipe-detail-page";
import { MealPlanPage } from "../app/pages/meal-plan-page";
import { ProfilePage } from "../app/pages/profile-page";
import { NearbyRestaurantsPage } from "../app/pages/nearby-restaurants-page";
import { NearbyMarketsPage } from "../app/pages/nearby-markets-page";
import { ShoppingPage } from "../app/pages/shopping-page";
import { MealDetailPage } from "../app/pages/meal-detail-page";
import { NotFoundPage } from "../app/pages/not-found-page";
import { MembershipPage } from "../app/pages/membership-page";
import { MealHistoryPage } from "../app/pages/meal-history-page";
import { GymModePage } from "../app/pages/gym-mode-page";
import { FavoritePage } from "../app/pages/favorite-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/home",
    Component: HomePage,
  },
  {
    Component: ProtectedRoute,
    children: [
      {
        path: "/app",
        Component: MainAppPage,
      },
      {
        path: "/results",
        Component: ResultsPage,
      },
      {
        path: "/admin",
        Component: AdminLayout,
        children: [
          { index: true, Component: DashboardHomePage },
          { path: "categories", Component: CategoryManagementPage },
          { path: "tags", Component: TagManagementPage },
          { path: "ingredients", Component: IngredientManagementPage },
          { path: "meals", Component: MealManagementPage },
          { path: "bundles", Component: BundleManagementPage },
          { path: "payment-histories", Component: PaymentHistoryPage },
          { path: "user-subscriptions", Component: UserSubscriptionPage },
          { path: "users", Component: UserManagementPage },
          { path: "roles", Component: RoleManagementPage },
        ]
      },
      // Redirect legacy /dashboard
      {
        path: "/dashboard",
        element: <Navigate to="/admin" replace />,
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
        path: "/history",
        Component: MealHistoryPage,
      },
      {
        path: "/gym",
        Component: GymModePage,
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
        path: "/nearby-markets",
        Component: NearbyMarketsPage,
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
        path: "/favorites",
        Component: FavoritePage,
      }
    ]
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);