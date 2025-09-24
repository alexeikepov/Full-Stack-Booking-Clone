import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { queryClient } from "@/lib/queryClient";
import "./index.css";
import "./i18n";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import HotelPage from "@/pages/HotelPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import { AuthProvider } from "@/context/AuthContext";
import AccountPage from "./pages/AccountPage";
import BookingsPage from "./pages/BookingsPage";
import WishlistPage from "./pages/SavedListsPage.tsx";
import ReviewsTimelinePage from "./pages/ReviewsTimelinePage.tsx";
import WriteReviewPage from "./pages/WriteReviewPage.tsx";
import ListYourPropertyPage from "./pages/ListYourPropertyPage.tsx";
import PartnerRegisterPage from "./pages/PartnerRegisterPage.tsx";
import OwnerPage from "./pages/OwnerPage.tsx";
import AdminHotelPage from "./pages/AdminHotelPage.tsx";
import AdminHotelSignInPage from "./pages/PartnerSignInPage.tsx";
import ComingSoonPage from "./pages/ComingSoonPage.tsx";
import FlightsPage from "./pages/FlightsPage.tsx";
import RewardsWalletPage from "./pages/RewardsWalletPage";
import GeniusPage from "./pages/GeniusPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "search", element: <SearchPage /> },
      { path: "hotel/:id", element: <HotelPage /> },
      { path: "account", element: <AccountPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "/account/bookings", element: <BookingsPage /> },
      { path: "/account/saved", element: <WishlistPage /> },
      { path: "/account/reviews", element: <ReviewsTimelinePage /> },
      { path: "/reviews/write", element: <WriteReviewPage /> },
      { path: "/account/rewards", element: <RewardsWalletPage /> },
      { path: "/account/genius", element: <GeniusPage /> },
      { path: "list-your-property", element: <ListYourPropertyPage /> },
      { path: "/partner-register", element: <PartnerRegisterPage /> },

      { path: "/owner", element: <OwnerPage /> },
      { path: "/adminhotel", element: <AdminHotelPage /> },
      { path: "/admin-hotel/sign-in", element: <AdminHotelSignInPage /> },
      { path: "/flights", element: <FlightsPage /> },
      { path: "*", element: <ComingSoonPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
