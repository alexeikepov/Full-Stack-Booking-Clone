import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { queryClient } from "@/lib/queryClient";
import "./index.css";
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
import ListYourPropertyPage from "./pages/ListYourPropertyPage.tsx";
import PartnerRegisterPage from "./pages/PartnerRegisterPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import AdminSignInPage from "./pages/PartnerSignInPage.tsx";
import OwnerPage from "./pages/OwnerPage.tsx";
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
      { path: "list-your-property", element: <ListYourPropertyPage /> },
      { path: "/partner-register", element: <PartnerRegisterPage /> },

      { path: "/admin", element: <AdminPage /> },
      { path: "/admin/sign-in", element: <AdminSignInPage /> },

      { path: "/owner", element: <OwnerPage /> },

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
