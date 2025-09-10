// src/components/Header.tsx
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bed, Plane, CarFront, Sparkles, HelpCircle } from "lucide-react";
import CurrencySelector from "./CurrencySelector";
import LanguageSelector from "./LanguageSelector";
import { useAuth } from "@/context/AuthContext";
import * as React from "react";

function NavPill({
  to,
  icon: Icon,
  label,
  active,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}) {
  const base =
    "flex items-center gap-2 rounded-full px-4 py-2 text-white/90 transition";
  const activeCls = "bg-white/15 ring-1 ring-white/60 text-white";
  const idle = "hover:bg-white/10 hover:text-white";
  return (
    <NavLink to={to} className={`${base} ${active ? activeCls : idle}`}>
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </NavLink>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  const { user, signOut, isLoading } = useAuth();

  const initials = React.useMemo(() => {
    if (!user?.name) return "U";
    return user.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase() ?? "")
      .join("") || "U";
  }, [user?.name]);

  return (
    <header className="w-full bg-[#003b95] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight"
          aria-label="Booking Clone Home"
        >
          Booking<span className="text-[#febb02]">.com</span>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <div className="hidden sm:flex items-center gap-2">
            <CurrencySelector />
            <LanguageSelector />
          </div>

          <HelpCircle className="hidden sm:inline-block h-5 w-5 opacity-90" />

          <NavLink
            to="/list-your-property"
            className="hidden md:inline-block font-medium hover:underline"
          >
            List your property
          </NavLink>

          {!isLoading && !user && (
            <>
              <Link to="/register">
                <Button
                  variant="secondary"
                  className="bg-white text-[#0071c2] hover:bg-white/90"
                >
                  Register
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="secondary"
                  className="bg-white text-[#0071c2] hover:bg-white/90"
                >
                  Sign in
                </Button>
              </Link>
            </>
          )}

          {!isLoading && user && (
            <div className="flex items-center gap-2">
              <Link
                to="/account"
                className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-white/10 transition"
                aria-label="Account"
              >
                <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
                  {initials}
                </div>
                <span className="hidden sm:inline-block font-medium">
                  {user.name ?? "My Account"}
                </span>
              </Link>
              <Button
                onClick={signOut}
                variant="secondary"
                className="bg-white text-[#0071c2] hover:bg-white/90"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <NavPill
            to="/"
            icon={Bed}
            label="Stays"
            active={pathname === "/" || pathname.startsWith("/search")}
          />
          <NavPill to="/flights" icon={Plane} label="Flights" />
          <NavPill to="/car-rental" icon={CarFront} label="Car rental" />
          <NavPill to="/attractions" icon={Sparkles} label="Attractions" />
          <NavLink
            to="/airport-taxis"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-white/90 transition hover:bg-white/10 hover:text-white"
          >
            <span className="inline-flex items-center justify-center rounded-sm border border-white/70 px-1 text-[10px] leading-4 tracking-[0.08em]">
              TAXI
            </span>
            <span>Airport taxis</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
