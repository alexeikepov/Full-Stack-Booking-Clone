import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import type { Trip } from "./types";

interface TripCardProps {
  trip: Trip;
  canReview?: boolean;
}

export default function TripCard({ trip, canReview = false }: TripCardProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const fmtRange = (from: string, to: string) => {
    try {
      const f = new Date(from);
      const t = new Date(to);
      const ok = !isNaN(f.getTime()) && !isNaN(t.getTime());
      if (!ok) return `${from} — ${to}`;
      const opts: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
      };
      return `${f.toLocaleDateString(undefined, opts)} — ${t.toLocaleDateString(
        undefined,
        opts
      )}`;
    } catch {
      return `${from} — ${to}`;
    }
  };

  return (
    <div className="flex items-center justify-between rounded-[12px] bg-white px-5 py-5 min-h-[108px]">
      <div className="flex items-center gap-5">
        <img
          src={trip.imageUrl}
          alt=""
          className="h-[84px] w-[80px] rounded object-cover ring-1 ring-black/10"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-[15px] font-medium hover:underline">
              {trip.city}
            </div>
            {trip.isShared && (
              <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                <Users className="h-3 w-3" />
                <span>Shared</span>
              </div>
            )}
          </div>
          <div className="mt-1 truncate text-[13px] text-black/60">
            {fmtRange(trip.from, trip.to)} · {trip.bookings} booking
            {trip.bookings === 1 ? "" : "s"}
            {trip.isShared && !trip.isOwner && (
              <span className="text-blue-600"> · Shared with you</span>
            )}
          </div>
        </div>
      </div>
      {canReview && trip.hotelId && (
        <div className="relative">
          <button
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-black/5"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-black/60" />
            <span className="mx-[2px] inline-block h-1.5 w-1.5 rounded-full bg-black/60" />
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-black/60" />
          </button>
          {open && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-40 overflow-hidden rounded-md border border-black/10 bg-white py-1 text-[14px] shadow-md"
            >
              <button
                className="block w-full px-3 py-2 text-left hover:bg-[#f6f7fb]"
                onClick={() => {
                  setOpen(false);
                  navigate(
                    `/reviews/write?hotelId=${encodeURIComponent(
                      trip.hotelId!
                    )}`
                  );
                }}
                role="menuitem"
              >
                Write a review
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
