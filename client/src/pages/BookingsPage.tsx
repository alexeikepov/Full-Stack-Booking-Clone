import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getReservations } from "@/lib/api";
import globeImg from "@/img/MyBooking/Bookings.png";
import { useNavigationTabsStore } from "@/stores/navigationTabs";
import { useAuth } from "@/context/AuthContext";
import {
  UpcomingTrip,
  TripCard,
  TripSkeleton,
  EditReservationModal,
  FooterCol,
  type Trip,
  type ApiPayload,
} from "@/components/bookings";

export default function BookingsPage() {
  const { setShowTabs } = useNavigationTabsStore();
  const { user: currentUser } = useAuth();
  const [tab, setTab] = useState<"past" | "cancelled" | "shared">("past");
  const [data, setData] = useState<ApiPayload>({
    past: [],
    cancelled: [],
    shared: [],
  });
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

        console.log("Raw reservations from server:", rows);

        const toIso = (d: any) => {
          try {
            const dt = new Date(d);
            if (isNaN(+dt)) return String(d ?? "");
            const year = dt.getFullYear();
            const month = String(dt.getMonth() + 1).padStart(2, "0");
            const day = String(dt.getDate()).padStart(2, "0");
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
            const rmUrl =
              rmMedia.find((m: any) => m?.url)?.url || rmMedia[0]?.url;
            if (rmUrl) return String(rmUrl);
            if (Array.isArray(r?.photos) && r.photos[0])
              return String(r.photos[0]);
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
          isOwner: true,
        }));

        const past: Trip[] = [];
        const cancelled: Trip[] = [];
        const shared: Trip[] = [];
        const upcoming: Trip[] = [];
        for (const r of rows) {
          const trip = mapped.find((t) => t.id === String(r._id || r.id));
          if (!trip) continue;

          trip.isOwner = String(r.user) === String(currentUser?.id);

          const status = String(r.status || "").toUpperCase();
          const ci = new Date(trip.from);
          const co = new Date(trip.to);
          co.setHours(0, 0, 0, 0);

          const isSharedWithCurrentUser =
            trip.sharedWith &&
            currentUser?.id &&
            trip.sharedWith.some(
              (sharedUserId: any) =>
                String(sharedUserId) === String(currentUser.id)
            );

          console.log(
            "Reservation:",
            trip.id,
            "isOwner:",
            trip.isOwner,
            "sharedWith:",
            trip.sharedWith,
            "currentUser:",
            currentUser?.id,
            "isSharedWithCurrentUser:",
            isSharedWithCurrentUser
          );

          if (!trip.isOwner && isSharedWithCurrentUser) {
            console.log("Adding to shared:", trip.id);
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

  const trips = useMemo(() => {
    if (tab === "past") return data.past;
    if (tab === "cancelled") return data.cancelled;
    if (tab === "shared") return data.shared;
    return [];
  }, [tab, data]);

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

        <section className="mt-10 w-[920px]">
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

          {error && (
            <div className="mt-6 w-[600px] max-w-full rounded-[10px] border border-[#f3c2c0] bg-[#fdeeee] px-4 py-3 text-[14px] text-[#8b1f1b]">
              {error}
            </div>
          )}

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
                if (upcoming && upcoming.id === updated.id)
                  setUpcoming(updated);
              }}
            />
          )}
        </section>
      </main>

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

        <div className="h-px w-full bg-white/35" />

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
