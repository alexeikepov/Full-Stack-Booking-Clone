import Header from "@/components/navigation/Header";
import { CartSheet } from "@/components/layout/CartSheet";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import ScrollToTop from "@/components/navigation/ScrollToTop";
import ScrollToTopButton from "@/components/navigation/ScrollToTopButton";
import { Outlet, useLocation } from "react-router-dom";

export default function App() {
  const { pathname } = useLocation();

  const hideHeader =
    pathname === "/list-your-property" ||
    pathname.startsWith("/list-your-property/") ||
    pathname === "/partner-register" ||
    pathname === "/owner" ||
    pathname === "/owner/sign-in" ||
    pathname === "/adminhotel" ||
    pathname === "/admin-hotel" ||
    pathname === "/admin-hotel/sign-in";

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      {!hideHeader && <Header />}
      <main className="mx-auto">
        <Outlet />
      </main>
      <CartSheet />
      <ConfirmModal />
      <ScrollToTopButton />
    </div>
  );
}
