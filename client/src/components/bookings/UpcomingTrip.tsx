import { useState } from "react";
import { api } from "@/lib/api";
import type { Trip } from "./types";
import ImageWithFallback from "../ui/ImageWithFallback";

interface UpcomingTripProps {
  trip: Trip;
  onEdit: () => void;
  onAfterCancel: (id: string) => void;
}

export default function UpcomingTrip({
  trip,
  onEdit,
  onAfterCancel,
}: UpcomingTripProps) {
  const [open, setOpen] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const toggle = () => setOpen((v) => !v);

  const handleEdit = () => {
    setOpen(false);
    onEdit();
  };

  const doCancel = async () => {
    try {
      await api.patch(`/api/reservations/${trip.id}/cancel`);
      const evt = new CustomEvent("reservation-cancelled", {
        detail: { id: trip.id },
      });
      window.dispatchEvent(evt);
      onAfterCancel(trip.id);
      setShowCancel(false);
    } catch (e: any) {
      alert(e?.response?.data?.error || "Failed to cancel reservation");
    }
  };

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
    <div className="flex items-center justify-between rounded-[16px] bg-[#f5f7fb] px-5 py-5">
      <div className="flex items-center gap-5">
        <ImageWithFallback
          src={trip.imageUrl}
          alt=""
          className="h-[96px] w-[96px] rounded object-cover ring-1 ring-black/10"
        />
        <div className="min-w-0">
          <div className="text-[18px] font-semibold text-[#1a1a1a]">
            Upcoming trip to {trip.city}
          </div>
          <div className="mt-1 text-[14px] text-black/60">
            {fmtRange(trip.from, trip.to)} · {trip.bookings} booking
            {trip.bookings === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div className="relative">
        <button
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={toggle}
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
              onClick={handleEdit}
              role="menuitem"
            >
              Edit
            </button>
            <button
              className="block w-full px-3 py-2 text-left text-[#b00020] hover:bg-[#fff2f2]"
              onClick={() => {
                setOpen(false);
                setShowCancel(true);
              }}
              role="menuitem"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {showCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5">
            <div className="mb-3 text-[18px] font-semibold">
              Cancel reservation
            </div>
            <div className="space-y-2 text-[14px] text-black/70">
              <div>Are you sure you want to cancel this reservation?</div>
              <div className="rounded bg-[#f6f7fb] p-3 text-[13px]">
                <div className="font-medium text-black">{trip.city}</div>
                <div className="text-black/60">
                  {fmtRange(trip.from, trip.to)}
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowCancel(false)}
                className="flex-1 rounded border px-3 py-2"
              >
                Keep reservation
              </button>
              <button
                onClick={doCancel}
                className="flex-1 rounded bg-[#b00020] px-3 py-2 text-white"
              >
                Confirm cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
