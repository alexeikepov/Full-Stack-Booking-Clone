// src/pages/BookingsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, getReservations, getFriends, type Friend } from "@/lib/api";
import globeImg from "@/img/MyBooking/Bookings.png";
import { useNavigationTabsStore } from "@/stores/navigationTabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Trip = {
  id: string;
  city: string;
  from: string;
  to: string;
  bookings: number;
  imageUrl: string;
  quantity: number;
  pricePerNight: number;
  totalPrice: number;
  hotelId?: string;
  sharedWith?: string[];
  isShared?: boolean;
  isOwner?: boolean;
};

type ApiPayload = {
  past: Trip[];
  cancelled: Trip[];
  shared: Trip[];
};

//

export default function BookingsPage() {
  const { setShowTabs } = useNavigationTabsStore();
  const { user: currentUser } = useAuth();
  const [tab, setTab] = useState<"past" | "cancelled" | "shared">("past");
  const [data, setData] = useState<ApiPayload>({ past: [], cancelled: [], shared: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcoming, setUpcoming] = useState<Trip | null>(null);
  const [editing, setEditing] = useState<Trip | null>(null);

  useEffect(() => {
    setShowTabs(false);
    return () => setShowTabs(true);
  }, [setShowTabs]);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setError(null);
        const rows: any[] = await getReservations().catch((err) => {
          throw err;
        });

        console.log('Raw reservations from server:', rows);

        const toIso = (d: any) => {
          try {
            const dt = new Date(d);
            if (isNaN(+dt)) return String(d ?? "");
            // Use timezone-safe date formatting
            const year = dt.getFullYear();
            const month = String(dt.getMonth() + 1).padStart(2, '0');
            const day = String(dt.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          } catch {
            return String(d ?? "");
          }
        };

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const getHotelImage = (hotel: any): string => {
          if (!hotel) return "";
          const media = Array.isArray(hotel.media) ? hotel.media : [];
          const primary = media.find((m: any) => m?.url)?.url || media[0]?.url;
          if (primary) return String(primary);
          const rooms = Array.isArray(hotel.rooms) ? hotel.rooms : [];
          for (const r of rooms) {
            const rmMedia = Array.isArray(r?.media) ? r.media : [];
            const rmUrl = rmMedia.find((m: any) => m?.url)?.url || rmMedia[0]?.url;
            if (rmUrl) return String(rmUrl);
            if (Array.isArray(r?.photos) && r.photos[0]) return String(r.photos[0]);
          }
          return "";
        };

        const mapped: Trip[] = rows.map((r: any) => ({
          id: String(r._id || r.id),
          city: r.hotel?.city || r.hotel?.name || "",
          from: toIso(r.checkIn),
          to: toIso(r.checkOut),
          bookings: 1,
          imageUrl:
            getHotelImage(r.hotel) ||
            "https://images.unsplash.com/photo-1501117716987-c8e004f568d5?q=80&w=800&auto=format&fit=crop",
          quantity: Number(r.quantity) || 1,
          pricePerNight: Number(r.pricePerNight) || 0,
          totalPrice: Number(r.totalPrice) || 0,
          hotelId: String(r.hotel?._id || r.hotel?.id || ""),
          sharedWith: r.sharedWith || [],
          isShared: r.sharedWith && r.sharedWith.length > 0,
          isOwner: true, // Will be updated later
        }));

        const past: Trip[] = [];
        const cancelled: Trip[] = [];
        const shared: Trip[] = [];
        const upcoming: Trip[] = [];
        for (const r of rows) {
          const trip = mapped.find((t) => t.id === String(r._id || r.id));
          if (!trip) continue;
          
          // Update isOwner based on current user
          trip.isOwner = String(r.user) === String(currentUser?.id);
          
          const status = String(r.status || "").toUpperCase();
          const ci = new Date(trip.from);
          const co = new Date(trip.to);
          co.setHours(0, 0, 0, 0);
          
          // Check if this is a shared reservation (current user is in sharedWith array)
          const isSharedWithCurrentUser = trip.sharedWith && currentUser?.id && 
            trip.sharedWith.some((sharedUserId: any) => 
              String(sharedUserId) === String(currentUser.id)
            );
          
          console.log('Reservation:', trip.id, 'isOwner:', trip.isOwner, 'sharedWith:', trip.sharedWith, 'currentUser:', currentUser?.id, 'isSharedWithCurrentUser:', isSharedWithCurrentUser);
          
          if (!trip.isOwner && isSharedWithCurrentUser) {
            console.log('Adding to shared:', trip.id);
            shared.push(trip);
          } else if (status === "CANCELLED") {
            cancelled.push(trip);
          } else if (status === "COMPLETED" || +co < +today) {
            past.push(trip);
          } else if (status === "PENDING" || status === "CONFIRMED") {
            if (+ci >= +today) upcoming.push(trip);
          }
        }

        setData({ past, cancelled, shared });
        if (upcoming.length) {
          const nearest = upcoming.sort(
            (a, b) => +new Date(a.from) - +new Date(b.from)
          )[0];
          setUpcoming(nearest);
        } else {
          setUpcoming(null);
        }
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          setError(e?.response?.data?.error || "Failed to load reservations");
          setData({ past: DEMO_PAST, cancelled: DEMO_CANCELLED, shared: [] });
        }
      } finally {
        setLoading(false);
      }
    })();
    const onCancelled = (e: any) => {
      const id = e?.detail?.id;
      if (!id) return;
      setUpcoming((prev) => (prev && prev.id === id ? null : prev));
      setData((prev) => ({
        past: prev.past,
        cancelled: prev.cancelled.concat(
          prev.past.find((t) => t.id === id) || []
        ),
        shared: prev.shared,
      }));
    };
    window.addEventListener("reservation-cancelled", onCancelled as any);
    return () => {
      ctrl.abort();
      window.removeEventListener("reservation-cancelled", onCancelled as any);
    };
  }, []);

  const trips = useMemo(
    () => {
      if (tab === "past") return data.past;
      if (tab === "cancelled") return data.cancelled;
      if (tab === "shared") return data.shared;
      return [];
    },
    [tab, data]
  );

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      <main className="mx-auto max-w-[1128px] px-4 pt-12">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <h1 className="text-[24px] font-bold leading-none">
            Bookings &amp; Trips
          </h1>
          <Link
            to="#"
            className="text-[14px] font-medium text-[#0a5ad6] hover:underline"
          >
            Can't find a booking?
          </Link>
        </div>

        {/* Left column under the title */}
        <section className="mt-10 w-[920px]">
          {/* Top area: Upcoming reservation if exists, else hero */}
          {upcoming ? (
            <UpcomingTrip
              trip={upcoming}
              onEdit={() => setEditing(upcoming)}
              onAfterCancel={(id) => {
                if (upcoming && upcoming.id === id) setUpcoming(null);
              }}
            />
          ) : (
          <div className="flex items-start gap-6">
            <img
              src={globeImg}
              alt=""
              className="h-[200px] w-[200px] select-none object-contain object-center"
            />
            <div>
              <div className="text-[28px] font-bold">Where to next?</div>
              <div className="mt-3 text-[16px] text-black/60">
                You haven't started any trips yet. When you've made a booking,
                it will appear here.
              </div>
            </div>
          </div>
          )}

          {/* Tabs under the hero */}
          <div className="mt-8 flex items-center gap-2">
            <button
              onClick={() => setTab("past")}
              className={
                "rounded-full border px-6 py-3 text-[14px] font-medium " +
                (tab === "past"
                  ? "border-[#0071c2] bg-[#e6f2ff] text-[#0071c2]"
                  : "border-[#e6eaf0] bg-white text-[#1a1a1a] hover:bg-[#f6f7fb]")
              }
            >
              Past
            </button>
            <button
              onClick={() => setTab("cancelled")}
              className={
                "rounded-full border px-6 py-3 text-[14px] font-medium " +
                (tab === "cancelled"
                  ? "border-[#0071c2] bg-[#e6f2ff] text-[#0071c2]"
                  : "border-[#e6eaf0] bg-white text-[#1a1a1a] hover:bg-[#f6f7fb]")
              }
            >
              Cancelled
            </button>
            <button
              onClick={() => setTab("shared")}
              className={
                "rounded-full border px-6 py-3 text-[14px] font-medium " +
                (tab === "shared"
                  ? "border-[#0071c2] bg-[#e6f2ff] text-[#0071c2]"
                  : "border-[#e6eaf0] bg-white text-[#1a1a1a] hover:bg-[#f6f7fb]")
              }
            >
              Shared
            </button>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mt-6 w-[600px] max-w-full rounded-[10px] border border-[#f3c2c0] bg-[#fdeeee] px-4 py-3 text-[14px] text-[#8b1f1b]">
              {error}
            </div>
          )}

          {/* Trips grid */}
          <div className="mt-10 grid w-[920px] grid-cols-3 gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <TripSkeleton key={i} />
                ))
              : trips.map((t) => (
                  <TripCard key={t.id} trip={t} canReview={tab === "past"} />
                ))}
          </div>
          {editing && (
            <EditReservationModal
              trip={editing}
              onClose={() => setEditing(null)}
              onSaved={(updated) => {
                setEditing(null);
                if (upcoming && upcoming.id === updated.id) setUpcoming(updated);
              }}
            />)
          }
        </section>
      </main>

      {/* Dark blue band */}
      <div className="mt-14 w-full bg-[#003b95] text-white">
        <div className="mx-auto max-w-[1128px] px-4">
          <div className="flex justify-center pt-4">
            <Link
              to="#"
              className="rounded-[4px] border border-white/70 px-3 py-[6px] text-[12px] font-medium hover:bg-white/10"
            >
              List your property
            </Link>
          </div>
        </div>

        {/* full-width white separator */}
        <div className="h-px w-full bg-white/35" />

        {/* white nav links with underline (inside container) */}
        <div className="mx-auto max-w-[1128px] px-4">
          <nav className="flex flex-wrap items-center gap-x-8 gap-y-2 py-3 text-[13px] font-medium">
            <Link
              to="#"
              className="underline decoration-white/85 underline-offset-4 hover:decoration-white"
            >
              Mobile version
            </Link>
            <Link
              to="#"
              className="underline decoration-white/85 underline-offset-4 hover:decoration-white"
            >
              Manage your bookings
            </Link>
            <Link
              to="#"
              className="underline decoration-white/85 underline-offset-4 hover:decoration-white"
            >
              Customer Service help
            </Link>
            <Link
              to="#"
              className="underline decoration-white/85 underline-offset-4 hover:decoration-white"
            >
              Become an affiliate
            </Link>
            <Link
              to="#"
              className="underline decoration-white/85 underline-offset-4 hover:decoration-white"
            >
              Booking.com for Business
            </Link>
          </nav>
        </div>
      </div>

      {/* White area with blue links */}
      <div className="w-full bg-white py-10">
        <div className="mx-auto max-w-[1128px] px-4">
          <div className="grid grid-cols-2 gap-8 text-[13px] sm:grid-cols-4">
            <FooterCol
              title="Countries"
              items={[
                "Regions",
                "Cities",
                "Airports",
                "Hotels",
                "Places of interest",
              ]}
            />
            <FooterCol
              title="Homes & apts"
              items={[
                "Apartments",
                "Resorts",
                "Villas",
                "Hostels",
                "B&Bs",
                "Guest Houses",
              ]}
            />
            <FooterCol
              title="Car hire"
              items={[
                "Car hire",
                "Flight finder",
                "Restaurant reservations",
                "Booking.com for Travel Agents",
              ]}
            />
            <FooterCol
              title="Company"
              items={[
                "Coronavirus (COVID-19) FAQs",
                "About Booking.com",
                "Customer Service help",
                "Partner help",
                "Careers",
                "Sustainability",
                "Press centre",
                "Safety resource centre",
                "Investor relations",
                "Terms of Service",
                "Partner dispute",
                "Privacy & Cookie Statement",
                "Modern Slavery Statement",
                "Human Rights Statement",
                "Corporate contact",
                "Content guidelines and reporting",
                "We Price Match",
              ]}
            />
          </div>

          <div className="mt-10 text-center">
            <Link to="#" className="text-[#0071c2] hover:underline">
              Extranet login
            </Link>
          </div>

          <div className="mt-8 text-left text-[11px] text-black/50">
            © 1996–2025 Booking.com™. All rights reserved.
          </div>

          <div className="mt-2 text-center text-[11px] text-black/45">
            Booking.com is part of Booking Holdings Inc., the world leader in
            online travel and related services.
          </div>

          {/* Partner Logos */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <div className="text-blue-800 font-bold text-sm">Booking.com</div>
            <div className="text-blue-600 font-bold text-sm flex items-center gap-1">
              priceline
              <span className="text-orange-500 text-xs">®</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-orange-500 text-white px-1 py-1 text-xs font-bold">
                K
              </div>
              <div className="bg-orange-500 text-white px-1 py-1 text-xs font-bold">
                A
              </div>
              <div className="bg-orange-500 text-white px-1 py-1 text-xs font-bold">
                Y
              </div>
              <div className="bg-orange-500 text-white px-1 py-1 text-xs font-bold">
                A
              </div>
              <div className="bg-orange-500 text-white px-1 py-1 text-xs font-bold">
                K
              </div>
            </div>
            <div className="text-gray-700 font-bold text-sm flex flex-col items-center gap-1">
              <div>agoda</div>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                </div>
              </div>
              <span className="text-gray-700 font-bold text-xs">
                <span className="font-normal">Open</span>
                <span className="font-bold">Table</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpcomingTrip({
  trip,
  onEdit,
  onAfterCancel,
}: {
  trip: Trip;
  onEdit: () => void;
  onAfterCancel: (id: string) => void;
}) {
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
      const evt = new CustomEvent("reservation-cancelled", { detail: { id: trip.id } });
      window.dispatchEvent(evt);
      onAfterCancel(trip.id);
      setShowCancel(false);
    } catch (e: any) {
      alert(e?.response?.data?.error || "Failed to cancel reservation");
    }
  };

  return (
    <div className="flex items-center justify-between rounded-[16px] bg-[#f5f7fb] px-5 py-5">
      <div className="flex items-center gap-5">
        <img
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
            <div className="mb-3 text-[18px] font-semibold">Cancel reservation</div>
            <div className="space-y-2 text-[14px] text-black/70">
              <div>Are you sure you want to cancel this reservation?</div>
              <div className="rounded bg-[#f6f7fb] p-3 text-[13px]">
                <div className="font-medium text-black">{trip.city}</div>
                <div className="text-black/60">{fmtRange(trip.from, trip.to)}</div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setShowCancel(false)} className="flex-1 rounded border px-3 py-2">Keep reservation</button>
              <button onClick={doCancel} className="flex-1 rounded bg-[#b00020] px-3 py-2 text-white">Confirm cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Components */

function TripCard({ trip, canReview = false }: { trip: Trip; canReview?: boolean }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
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
                  navigate(`/reviews/write?hotelId=${encodeURIComponent(trip.hotelId!)}`);
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

function TripSkeleton() {
  return (
    <div className="flex items-center gap-5 rounded-[12px] bg-white px-5 py-5 min-h-[108px]">
      <div className="h-[84px] w-[80px] rounded bg-[#eef2f7]" />
      <div className="flex-1">
        <div className="h-4 w-28 rounded bg-[#eef2f7]" />
        <div className="mt-2 h-4 w-48 rounded bg-[#eef2f7]" />
      </div>
    </div>
  );
}
function EditReservationModal({
  trip,
  onClose,
  onSaved,
}: {
  trip: Trip;
  onClose: () => void;
  onSaved: (t: Trip) => void;
}) {
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
    // Use timezone-safe date formatting
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
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
    setSelectedFriends(prev => {
      const isSelected = prev.some(f => f._id === friend._id);
      if (isSelected) {
        return prev.filter(f => f._id !== friend._id);
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
        sharedWith: selectedFriends.map(f => f._id),
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
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-black/5">✕</button>
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
                // Prevent past check-in
                if (v < todayIso) v = todayIso;
                setFrom(v);
                // If checkout is not after new checkin, move checkout to next day
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
              <div className="mt-1 text-[12px] text-[#b00020]">Check-in cannot be in the past.</div>
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
                // Enforce to > from
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
            <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="w-full rounded border px-3 py-2" />
          </label>

          {/* Friends Selection */}
          <div className="block">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-600" />
              <div className="text-[13px] text-black/70">Share with friends (optional)</div>
            </div>
            {loadingFriends ? (
              <div className="text-center text-sm text-gray-500 py-2">Loading friends...</div>
            ) : friends.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-2">No friends found</div>
            ) : (
              <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-2">
                {friends.map(friend => (
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
                    {selectedFriends.some(f => f._id === friend._id) && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
            {selectedFriends.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                Selected {selectedFriends.length} friend{selectedFriends.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          <div className="mt-2 rounded bg-[#f6f7fb] p-3 text-[13px]">
            <div>Original total: ₪{trip.totalPrice.toLocaleString()}</div>
            <div>New total: ₪{newTotal.toLocaleString()}</div>
            <div className={diff >= 0 ? "text-[#b00020]" : "text-green-700"}>
              {diff >= 0 ? `Additional to pay: ₪${diff.toLocaleString()}` : `Refund: ₪${Math.abs(diff).toLocaleString()}`}
            </div>
            <div className="text-black/60">({nights} night{nights === 1 ? "" : "s"} × ₪{trip.pricePerNight.toLocaleString()} × {qty} room{qty === 1 ? "" : "s"})</div>
            {!isRangeValid && (
              <div className="mt-1 text-[12px] text-[#b00020]">Check-out must be after check-in.</div>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded border px-3 py-2">Cancel</button>
          <button onClick={save} disabled={saving || !isRangeValid} className="flex-1 rounded bg-[#0071c2] px-3 py-2 text-white disabled:opacity-50">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

//

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <Link
        to="#"
        className="block text-[#0071c2] font-semibold hover:underline"
      >
        {title}
      </Link>
      <ul className="mt-2 space-y-1">
        {items.map((i) => (
          <li key={i}>
            <Link to="#" className="text-[#0071c2] hover:underline">
              {i}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function fmtRange(from: string, to: string) {
  try {
    const f = new Date(from);
    const t = new Date(to);
    const ok = !isNaN(f.getTime()) && !isNaN(t.getTime());
    if (!ok) return `${from} — ${to}`;
    const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
    return `${f.toLocaleDateString(undefined, opts)} — ${t.toLocaleDateString(
      undefined,
      opts
    )}`;
  } catch {
    return `${from} — ${to}`;
  }
}

/* Demo fallback */

const DEMO_PAST: Trip[] = [
  {
    id: "eilat-0829",
    city: "Eilat",
    from: "2025-08-29",
    to: "2025-08-30",
    bookings: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
    quantity: 1,
    pricePerNight: 450,
    totalPrice: 450,
  },
  {
    id: "sofia-0311",
    city: "Sofia",
    from: "2025-03-11",
    to: "2025-03-15",
    bookings: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?q=80&w=800&auto=format&fit=crop",
    quantity: 1,
    pricePerNight: 450,
    totalPrice: 1800,
  },
  {
    id: "bucharest-0418",
    city: "Bucharest",
    from: "2025-04-18",
    to: "2025-04-22",
    bookings: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1567005231563-5d0c5e77f876?q=80&w=800&auto=format&fit=crop",
    quantity: 1,
    pricePerNight: 350,
    totalPrice: 1400,
  },
  {
    id: "thailand-0919",
    city: "Thailand",
    from: "2025-09-19",
    to: "2025-10-10",
    bookings: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?q=80&w=800&auto=format&fit=crop",
    quantity: 2,
    pricePerNight: 300,
    totalPrice: 13800,
  },
  {
    id: "telaviv-0905",
    city: "Tel Aviv",
    from: "2025-09-05",
    to: "2025-09-21",
    bookings: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?q=80&w=800&auto=format&fit=crop",
    quantity: 2,
    pricePerNight: 600,
    totalPrice: 19200,
  },
  {
    id: "sofia-0905",
    city: "Sofia",
    from: "2025-09-05",
    to: "2025-09-10",
    bookings: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1567005231563-5d0c5e77f876?q=80&w=800&auto=format&fit=crop",
    quantity: 1,
    pricePerNight: 400,
    totalPrice: 2000,
  },
];

const DEMO_CANCELLED: Trip[] = [
  {
    id: "rome-0510",
    city: "Rome",
    from: "2025-05-10",
    to: "2025-05-12",
    bookings: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1526481280698-8fcc13fd4fd8?q=80&w=800&auto=format&fit=crop",
    quantity: 1,
    pricePerNight: 500,
    totalPrice: 1000,
  },
];
