import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import { CartSheet } from "@/components/CartSheet";
import { ConfirmModal } from "@/components/ConfirmModal";


export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto">
        <Outlet />
      </main>
      <CartSheet />
      <ConfirmModal />
    </div>
  );
}
