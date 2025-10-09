// src/components/ProfileMenu.tsx
import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  User as UserIcon,
  Briefcase,
  MessageSquareText,
  Heart,
  LogOut,
  ChevronRight,
  ChevronDown,
  Star,
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
          <span className="text-white font-semibold">{user?.name ?? "My account"}</span>
          <span className="mt-0.5 text-[13px] font-semibold text-[#febb02]">
            {geniusLabel}
          </span>
        </div>

        <ChevronDown className="hidden md:block h-4 w-4 opacity-80" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-black/5 bg-white text-[#1a1a1a] shadow-[0_8px_32px_rgba(0,0,0,.18)]"
        >
          <div className="py-2">
            <TopRow
              to="/account/rewards"
              label="Unlocked Genius rewards"
              count={user?.rewardsCount ?? 5}
            />
            <TopRow
              to="/account/credits"
              label="Credits and Vouchers"
              count={user?.creditsCount ?? 0}
            />
          </div>

          <div className="my-1 h-px bg-black/10" />

          <MenuItem to="/account" icon={<UserIcon className="h-4 w-4" />} label="My account" />
          <MenuItem
            to="/account/bookings"
            icon={<Briefcase className="h-4 w-4" />}
            label="Bookings & Trips"
          />
          <MenuItem to="/account/saved" icon={<Heart className="h-4 w-4" />} label="Saved" />
          <MenuItem
            to="/account/reviews"
            icon={<MessageSquareText className="h-4 w-4" />}
            label="Reviews"
          />

          <div className="my-1 h-px bg-black/10" />

          <button
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-black/[.04]"
            role="menuitem"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}

function TopRow({
  to,
  label,
  count,
}: {
  to: string;
  label: string;
  count: number;
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between px-4 py-3 hover:bg-black/[.04]"
      role="menuitem"
    >
      <div className="flex items-center gap-3">
        <Star className="h-4 w-4 text-[#0a3d91]" />
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-black/5 px-2 py-[2px] text-xs font-semibold">
          {count}
        </span>
        <ChevronRight className="h-4 w-4 opacity-70" />
      </div>
    </Link>
  );
}

function MenuItem({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 hover:bg-black/[.04]"
      role="menuitem"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
