// src/components/Header.tsx
import { Link, NavLink, useLocation } from "react-router-dom";
import { Bed, Plane, CarFront, Sparkles, HelpCircle } from "lucide-react";
import * as React from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigationStore } from "@/stores/navigation";
import { useNavigationTabsStore } from "@/stores/navigationTabs";
import CurrencySelector from "./CurrencySelector";
import LanguageSelector from "./LanguageSelector";
import ProfileMenu from "./ProfileMenu";

function NavPill({
  icon: Icon,
  label,
  tab,
  onClick,
  active,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tab: "stays" | "flights" | "cars" | "attractions" | "taxis";
  onClick: (t: any) => void;
  active: boolean;
}) {
  return (
    <button
      onClick={() => onClick(tab)}
      className={[
        "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition",
        active
          ? "bg-[#003b95] text-white border border-white"
          : "text-white/90 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

export default function Header() {
  const { user, isLoading, signOut } = useAuth();
  const { activeTab, setActiveTab } = useNavigationStore();
  const { showTabs } = useNavigationTabsStore();

  return (
    <header className="w-full bg-[#003b95] text-white">
      <div className="mx-auto w-full max-w-[1128px] px-4">
        {/* Top line */}
        <div className="flex h-14 items-center justify-between">
          <Link
            to="/"
            className="text-[26px] font-bold tracking-tight leading-none"
            aria-label="Booking Home"
          >
            Booking<span className="text-[#febb02]">.com</span>
          </Link>

          <div className="flex items-center gap-3 text-sm">
            <div className="hidden sm:flex items-center gap-2">
              <CurrencySelector />
              <LanguageSelector />
            </div>

            <HelpCircle className="hidden sm:block h-5 w-5 opacity-90" />

            <NavLink
              to="/list-your-property"
              className="hidden md:inline-block rounded-full px-3 py-1 font-medium hover:bg-white/10"
            >
              List your property
            </NavLink>

            {!isLoading && !user && (
              <div className="flex items-center gap-2">
                <Link
                  to="/register"
                  className="rounded-md bg-white px-4 py-2 text-[#0071c2] hover:bg-white/90"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="rounded-md bg-white px-4 py-2 text-[#0071c2] hover:bg-white/90"
                >
                  Sign in
                </Link>
              </div>
            )}

            {!isLoading && user && (
              <ProfileMenu user={user} onSignOut={signOut} />
            )}
          </div>
        </div>

        {/* Subnav line */}
        {showTabs && (
          <div className="flex h-12 items-center gap-2">
            <NavPill
              icon={Bed}
              label="Stays"
              tab="stays"
              onClick={setActiveTab}
              active={activeTab === "stays"}
            />
            <NavPill
              icon={Plane}
              label="Flights"
              tab="flights"
              onClick={setActiveTab}
              active={activeTab === "flights"}
            />
            <NavPill
              icon={CarFront}
              label="Car rental"
              tab="cars"
              onClick={setActiveTab}
              active={activeTab === "cars"}
            />
            <NavPill
              icon={Sparkles}
              label="Attractions"
              tab="attractions"
              onClick={setActiveTab}
              active={activeTab === "attractions"}
            />

            <button
              onClick={() => setActiveTab("taxis")}
              className={[
                "ml-1 flex items-center gap-2 rounded-full px-4 py-2 text-sm transition",
                activeTab === "taxis"
                  ? "bg-[#003b95] text-white border border-white"
                  : "text-white/90 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              <span className="inline-flex items-center justify-center rounded-sm border border-white/70 px-1 text-[10px] leading-4 tracking-[0.08em]">
                TAXI
              </span>
              <span>Airport taxis</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
