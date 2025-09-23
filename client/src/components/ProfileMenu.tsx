// src/components/ProfileMenu.tsx
import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  User as UserIcon,
  Briefcase,
  Heart,
  ChevronDown,
  Wallet,
  Users,
  ArrowLeft,
} from "lucide-react";

type User = {
  name?: string | null;
  email?: string | null;
  geniusLevel?: number | null;
  rewardsCount?: number | null;
  creditsCount?: number | null;
};

export default function ProfileMenu({
  user,
  onSignOut,
}: {
  user: User | null | undefined;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const initials = useMemo(() => {
    if (!user?.name) return "U";
    return (
      user.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase() ?? "")
        .join("") || "U"
    );
  }, [user?.name]);

  const geniusLabel = `Genius Level ${user?.geniusLevel ?? 3}`;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 rounded-full px-2 py-1 hover:bg-white/10 transition text-left focus:outline-none"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {/* avatar: thin gold ring, no extra halo */}
        <div className="h-9 w-9 rounded-full p-[1px] bg-[#febb02]">
          <div
            className="grid h-full w-full place-items-center rounded-full text-white font-semibold"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, #cf5418 0 60%, #b84512 100%)",
            }}
          >
            {initials}
          </div>
        </div>

        <div className="hidden md:flex flex-col items-start leading-tight">
          <span className="text-white font-semibold">
            {user?.name ?? "My account"}
          </span>
          <span className="mt-0.5 text-[13px] font-semibold text-[#febb02]">
            {geniusLabel}
          </span>
        </div>

        <ChevronDown className="hidden md:block h-4 w-4 opacity-80" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-black/5 bg-white text-[#1a1a1a] shadow-[0_8px_32px_rgba(0,0,0,.18)] z-[100]"
        >
          <MenuItem
            to="/account"
            icon={<UserIcon className="h-4 w-4" />}
            label="My account"
            onClick={() => setOpen(false)}
          />
          <MenuItem
            to="/account/bookings"
            icon={<Briefcase className="h-4 w-4" />}
            label="Bookings & Trips"
            onClick={() => setOpen(false)}
          />
          <MenuItem
            to="/account/genius"
            icon={<GeniusIcon />}
            label="Genius loyalty programme"
            onClick={() => setOpen(false)}
          />
          <MenuItem
            to="/account/rewards"
            icon={<Wallet className="h-4 w-4" />}
            label="Rewards & Wallet"
            onClick={() => setOpen(false)}
          />
          <MenuItem
            to="/account/reviews"
            icon={<Users className="h-4 w-4" />}
            label="Reviews"
            onClick={() => setOpen(false)}
          />
          <MenuItem
            to="/account/saved"
            icon={<Heart className="h-4 w-4" />}
            label="Saved"
            onClick={() => setOpen(false)}
          />
          <MenuItem
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            icon={<ArrowLeft className="h-4 w-4" />}
            label="Sign out"
            isButton={true}
          />
        </div>
      )}
    </div>
  );
}

function GeniusIcon() {
  return (
    <div className="h-4 w-4 flex items-center justify-center">
      <span className="text-[#0a3d91] font-bold text-sm">G</span>
    </div>
  );
}

function MenuItem({
  to,
  icon,
  label,
  onClick,
  isButton = false,
}: {
  to?: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isButton?: boolean;
}) {
  if (isButton) {
    return (
      <button
        onClick={onClick}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-black/[.04]"
        role="menuitem"
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link
      to={to!}
      className="flex items-center gap-3 px-4 py-3 hover:bg-black/[.04]"
      role="menuitem"
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
