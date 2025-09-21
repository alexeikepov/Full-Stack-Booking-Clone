import Header from "@/components/Header";
import { CartSheet } from "@/components/CartSheet";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Outlet, useLocation } from "react-router-dom";

export default function App() {
  const { pathname } = useLocation();
  
  const hideHeader =
    pathname === "/list-your-property" || pathname.startsWith("/list-your-property/") || pathname === "/partner-register"|| pathname === "/admin/sign-in";

  return (
    <div className="min-h-screen">
      {!hideHeader && <Header />}
      <main className="mx-auto">
        <Outlet />
      </main>
      <CartSheet />
      <ConfirmModal />
    </div>
  );
}
