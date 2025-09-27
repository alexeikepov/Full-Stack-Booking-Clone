import { useEffect, useState } from "react";
import { api, getFriends, type Friend } from "@/lib/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, Users } from "lucide-react";
import type { Trip } from "./types";

interface EditReservationModalProps {
  trip: Trip;
  onClose: () => void;
  onSaved: (t: Trip) => void;
}

export default function EditReservationModal({
  trip,
  onClose,
  onSaved,
}: EditReservationModalProps) {
  const [from, setFrom] = useState(trip.from);
  const [to, setTo] = useState(trip.to);
  const [qty, setQty] = useState(trip.quantity);
  const [saving, setSaving] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  useEffect(() => {
    const loadFriends = async () => {
      setLoadingFriends(true);
      try {
        const friendsList = await getFriends();
        setFriends(friendsList);
      } catch (error) {
        console.error("Failed to load friends:", error);
      } finally {
        setLoadingFriends(false);
      }
    };
    loadFriends();
  }, []);

  const toLocalISO = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayIso = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return toLocalISO(d);
  })();

  const nextDayOf = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      d.setDate(d.getDate() + 1);
      return toLocalISO(d);
    } catch {
      return dateStr;
    }
  };

  const nights = (() => {
    try {
      const f = new Date(from);
      const t = new Date(to);
      const diff = Math.ceil((+t - +f) / 86400000);
      return Math.max(1, diff);
    } catch {
      return 1;
    }
  })();

  const newTotal = trip.pricePerNight * nights * qty;
  const diff = newTotal - trip.totalPrice;
  const isRangeValid = (() => {
    try {
      const f = new Date(from);
      const t = new Date(to);
      return +t > +f;
    } catch {
      return false;
    }
  })();
  const isFromInPast = from < todayIso;

  const toggleFriend = (friend: Friend) => {
    setSelectedFriends((prev) => {
      const isSelected = prev.some((f) => f._id === friend._id);
      if (isSelected) {
        return prev.filter((f) => f._id !== friend._id);
      } else {
        return [...prev, friend];
      }
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.patch(`/api/reservations/${trip.id}`, {
        checkIn: from,
        checkOut: to,
        quantity: qty,
        sharedWith: selectedFriends.map((f) => f._id),
      });
      onSaved({ ...trip, from, to, quantity: qty, totalPrice: newTotal });
    } catch (e: any) {
      alert(e?.response?.data?.error || "Failed to update reservation");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-5 max-h-[90vh] overflow-y-auto">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[18px] font-semibold">Edit reservation</div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-black/5"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-[14px]">
          <label className="block">
            <div className="mb-1 text-[13px] text-black/70">Check-in</div>
            <input
              type="date"
              value={from}
              min={todayIso}
              onChange={(e) => {
                let v = e.target.value;
                if (v < todayIso) v = todayIso;
                setFrom(v);
                try {
                  const nf = new Date(v);
                  const nt = new Date(to);
                  if (!(+nt > +nf)) {
                    setTo(nextDayOf(v));
                  }
                } catch {}
              }}
              className="w-full rounded border px-3 py-2"
            />
            {isFromInPast && (
              <div className="mt-1 text-[12px] text-[#b00020]">
                Check-in cannot be in the past.
              </div>
            )}
          </label>
          <label className="block">
            <div className="mb-1 text-[13px] text-black/70">Check-out</div>
            <input
              type="date"
              value={to}
              min={nextDayOf(from)}
              onChange={(e) => {
                const v = e.target.value;
                try {
                  const nf = new Date(from);
                  const nt = new Date(v);
                  if (+nt <= +nf) {
                    setTo(nextDayOf(from));
                  } else {
                    setTo(v);
                  }
                } catch {
                  setTo(v);
                }
              }}
              className="w-full rounded border px-3 py-2"
            />
          </label>
          <label className="block">
            <div className="mb-1 text-[13px] text-black/70">Rooms</div>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              className="w-full rounded border px-3 py-2"
            />
          </label>

          <div className="block">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-600" />
              <div className="text-[13px] text-black/70">
                Share with friends (optional)
              </div>
            </div>
            {loadingFriends ? (
              <div className="text-center text-sm text-gray-500 py-2">
                Loading friends...
              </div>
            ) : friends.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-2">
                No friends found
              </div>
            ) : (
              <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-2">
                {friends.map((friend) => (
                  <div
                    key={friend._id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                    onClick={() => toggleFriend(friend)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {friend.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{friend.name}</p>
                        <p className="text-xs text-gray-600">{friend.email}</p>
                      </div>
                    </div>
                    {selectedFriends.some((f) => f._id === friend._id) && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
            {selectedFriends.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                Selected {selectedFriends.length} friend
                {selectedFriends.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          <div className="mt-2 rounded bg-[#f6f7fb] p-3 text-[13px]">
            <div>Original total: ₪{trip.totalPrice.toLocaleString()}</div>
            <div>New total: ₪{newTotal.toLocaleString()}</div>
            <div className={diff >= 0 ? "text-[#b00020]" : "text-green-700"}>
              {diff >= 0
                ? `Additional to pay: ₪${diff.toLocaleString()}`
                : `Refund: ₪${Math.abs(diff).toLocaleString()}`}
            </div>
            <div className="text-black/60">
              ({nights} night{nights === 1 ? "" : "s"} × ₪
              {trip.pricePerNight.toLocaleString()} × {qty} room
              {qty === 1 ? "" : "s"})
            </div>
            {!isRangeValid && (
              <div className="mt-1 text-[12px] text-[#b00020]">
                Check-out must be after check-in.
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded border px-3 py-2">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving || !isRangeValid}
            className="flex-1 rounded bg-[#0071c2] px-3 py-2 text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
