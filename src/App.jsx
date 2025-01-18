import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/home-page";
import CategoryPage from "./pages/category-page";
import RegisterPage from "./pages/auth/register-page";
import LoginPage from "./pages/auth/login-page";
import NotFoundPage from "./pages/not-found";
import { SessionProvider } from "./provider/session-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TodaySchedulePage from "./pages/dashboard/today-schedule-page";
import DashboardCategoriesPage from "./pages/dashboard/categories/dashboard-categories-page";
import DashboardLayout from "./components/layout/dashboard-layout";
import UpdateCategoryPage from "./pages/dashboard/categories/update-category-page";
import CreateCategoryPage from "./pages/dashboard/categories/create-category-page";
import DashboardPackagesPage from "./pages/dashboard/packages/dashboard-packages-page";
import CreatePackagePage from "./pages/dashboard/packages/create-package-page";
import UpdatePackagePage from "./pages/dashboard/packages/update-package-page";
import CategoryDetailPage from "./pages/category-detail-page";
import BaseLayout from "./components/layout/base-layout";
import DashboardTimeSlotPage from "./pages/dashboard/time-slot/dashboard-time-slots-page";
import DashboardAddonsPage from "./pages/dashboard/addons/dashboard-addons-page";
import CreateAddonPage from "./pages/dashboard/addons/create-addon-page";
import UpdateAddonPage from "./pages/dashboard/addons/update-addon-page";
import ReservationPage from "./pages/reservation-page";
import AuthenticatedLayout from "./components/layout/authenticated-layout";
import HistoryPage from "./pages/history-page";
import PaymentPage from "./pages/payment-page";
import DashboardTransactionsPage from "./pages/dashboard/transactions/dashboard-transactions-page";
import TransactionsDetailPage from "./pages/dashboard/transactions/transactions-detail-page";
import DashboardReservationPage from "./pages/dashboard/reservation/dashboard-reservation-page";
import { Navigate } from "react-router-dom";
import ReviewPage from "./pages/review-page";
import ReviewDetailPage from "./pages/review-detail";
import DashboardReviewsPage from "./pages/dashboard/reviews/dashboard-reviews-page";
import ProfilePage from "./pages/profile-page";
import GalleryPage from "./pages/gallery-page";
import ContactPage from "./pages/contact-page";
import ReservationDetailPage from "./pages/dashboard/reservation/reservation-detail-page";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  // Authentication
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },

  // Navigation
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/category",
        element: <CategoryPage />,
      },
      {
        path: "/category/:id",
        element: <CategoryDetailPage />,
      },
      {
        path: "/gallery",
        element: <GalleryPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        element: <AuthenticatedLayout />,
        children: [
          {
            path: "/reservation/:categoryPackageId",
            element: <ReservationPage />,
          },
          {
            path: "/payment/:transactionId",
            element: <PaymentPage />,
          },
          {
            path: "/history",
            element: <HistoryPage />,
          },
          {
            path: "/review/:reservationId",
            element: <ReviewPage />,
          },
          {
            path: "/review/:reservationId/detail",
            element: <ReviewDetailPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },

  // Dashboard and Protected Routes
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/today-schedule" />,
      },
      {
        path: "today-schedule",
        element: <TodaySchedulePage />,
      },
      {
        path: "categories",
        element: <DashboardCategoriesPage />,
      },
      {
        path: "categories/create",
        element: <CreateCategoryPage />,
      },
      {
        path: "categories/:id",
        element: <UpdateCategoryPage />,
      },
      {
        path: "packages",
        element: <DashboardPackagesPage />,
      },
      {
        path: "packages/create",
        element: <CreatePackagePage />,
      },
      {
        path: "packages/:id",
        element: <UpdatePackagePage />,
      },
      {
        path: "addons",
        element: <DashboardAddonsPage />,
      },
      {
        path: "addons/create",
        element: <CreateAddonPage />,
      },
      {
        path: "addons/:id",
        element: <UpdateAddonPage />,
      },
      {
        path: "times",
        element: <DashboardTimeSlotPage />,
      },
      {
        path: "reservations",
        element: <DashboardReservationPage />,
      },
      {
        path: "reservations/:reservationId/detail",
        element: <ReservationDetailPage />,
      },
      {
        path: "transactions",
        element: <DashboardTransactionsPage />,
      },
      {
        path: "transactions/:transactionId/detail",
        element: <TransactionsDetailPage />,
      },
      {
        path: "reviews",
        element: <DashboardReviewsPage />,
      },
    ],
  },

  // Not Found
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <RouterProvider router={router} />
      </SessionProvider>
    </QueryClientProvider>
  );
}
