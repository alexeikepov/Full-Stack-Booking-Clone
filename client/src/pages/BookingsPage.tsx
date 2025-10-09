// src/pages/BookingsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import globeImg from "@/img/MyBooking/Bookings.png";

type Trip = {
  id: string;
  city: string;
  from: string;
  to: string;
  bookings: number;
  imageUrl: string;
};

type ApiPayload = {
  past: Trip[];
  cancelled: Trip[];
};

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";

export default function BookingsPage() {
  const [tab, setTab] = useState<"past" | "cancelled">("past");
  const [data, setData] = useState<ApiPayload>({ past: [], cancelled: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setError(null);
        const res = await fetch(`${API_BASE}/api/bookings`, {
          signal: ctrl.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          setError(`HTTP ${res.status}`);
          setData({ past: DEMO_PAST, cancelled: DEMO_CANCELLED });
        } else {
          const json = (await res.json()) as ApiPayload;
          setData({
            past: Array.isArray(json.past) ? json.past : [],
            cancelled: Array.isArray(json.cancelled) ? json.cancelled : [],
          });
        }
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          setError("Network error");
          setData({ past: DEMO_PAST, cancelled: DEMO_CANCELLED });
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  const trips = useMemo(
    () => (tab === "past" ? data.past : data.cancelled),
    [tab, data]
  );

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      <main className="mx-auto max-w-[1128px] px-4 pt-8">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <h1 className="text-[20px] font-semibold leading-none">
            Bookings &amp; Trips
          </h1>
          <Link
            to="#"
            className="text-[12px] font-medium text-[#0a5ad6] hover:underline"
          >
            Can’t find a booking?
          </Link>
        </div>

        {/* Left column under the title */}
        <section className="mt-8 w-[736px]">
          {/* Hero */}
          <div className="flex items-start gap-4">
            <img
              src={globeImg}
              alt=""
              className="h-[96px] w-[96px] select-none"
            />
            <div>
              <div className="text-[18px] font-semibold">Where to next?</div>
              <div className="mt-1 text-[12px] text-black/60">
                You haven’t started any trips yet. When you’ve made a booking,
                it will appear here.
              </div>
            </div>
          </div>

          {/* Tabs under the hero */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => setTab("past")}
              className={
                "rounded-full border px-4 py-[6px] text-[12px] font-medium " +
                (tab === "past"
                  ? "border-[#c7d4e8] bg-white text-[#1a1a1a]"
                  : "border-transparent bg-[#eef2fa] text-[#1a1a1a]/70 hover:bg-[#e9effa]")
              }
            >
              Past
            </button>
            <button
              onClick={() => setTab("cancelled")}
              className={
                "rounded-full border px-4 py-[6px] text-[12px] font-medium " +
                (tab === "cancelled"
                  ? "border-[#c7d4e8] bg-white text-[#1a1a1a]"
                  : "border-transparent bg-[#eef2fa] text-[#1a1a1a]/70 hover:bg-[#e9effa]")
              }
            >
              Cancelled
            </button>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mt-4 w-[520px] max-w-full rounded-[10px] border border-[#f3c2c0] bg-[#fdeeee] px-3 py-2 text-[12px] text-[#8b1f1b]">
              {error}
            </div>
          )}

          {/* Trips grid */}
          <div className="mt-8 grid w-[736px] grid-cols-3 gap-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <TripSkeleton key={i} />
                ))
              : trips.map((t) => <TripCard key={t.id} trip={t} />)}
          </div>
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
      <Link to="#" className="underline decoration-white/85 underline-offset-4 hover:decoration-white">Mobile version</Link>
      <Link to="#" className="underline decoration-white/85 underline-offset-4 hover:decoration-white">Manage your bookings</Link>
      <Link to="#" className="underline decoration-white/85 underline-offset-4 hover:decoration-white">Customer Service help</Link>
      <Link to="#" className="underline decoration-white/85 underline-offset-4 hover:decoration-white">Become an affiliate</Link>
      <Link to="#" className="underline decoration-white/85 underline-offset-4 hover:decoration-white">Booking.com for Business</Link>
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
        </div>
      </div>
    </div>
  );
}

/* Components */

function TripCard({ trip }: { trip: Trip }) {
  return (
    <div className="flex items-center gap-3 rounded-[10px] border border-[#e6eaf0] bg-white px-3 py-2 hover:border-[#cfd7e2]">
      <img
        src={trip.imageUrl}
        alt=""
        className="h-[42px] w-[56px] rounded object-cover ring-1 ring-black/10"
      />
      <div className="min-w-0">
        <div className="truncate text-[13px] font-medium hover:underline">
          {trip.city}
        </div>
        <div className="mt-[2px] truncate text-[11.5px] text-black/60">
          {fmtRange(trip.from, trip.to)} · {trip.bookings} booking
          {trip.bookings === 1 ? "" : "s"}
        </div>
      </div>
    </div>
  );
}

function TripSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-[10px] border border-[#e6eaf0] bg-white px-3 py-2">
      <div className="h-[42px] w-[56px] rounded bg-[#eef2f7]" />
      <div className="flex-1">
        <div className="h-3 w-24 rounded bg-[#eef2f7]" />
        <div className="mt-2 h-3 w-40 rounded bg-[#eef2f7]" />
      </div>
    </div>
  );
}

function FooterTopLink({ children }: { children: React.ReactNode }) {
  return (
    <Link
      to="#"
      className="underline decoration-white/85 underline-offset-4 hover:decoration-white"
    >
      {children}
    </Link>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <Link to="#" className="block text-[#0071c2] font-semibold hover:underline">
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
  },
  {
    id: "sofia-0311",
    city: "Sofia",
    from: "2025-03-11",
    to: "2025-03-15",
    bookings: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "bucharest-0418",
    city: "Bucharest",
    from: "2025-04-18",
    to: "2025-04-22",
    bookings: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1567005231563-5d0c5e77f876?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "thailand-0919",
    city: "Thailand",
    from: "2025-09-19",
    to: "2025-10-10",
    bookings: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "telaviv-0905",
    city: "Tel Aviv",
    from: "2025-09-05",
    to: "2025-09-21",
    bookings: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "sofia-0905",
    city: "Sofia",
    from: "2025-09-05",
    to: "2025-09-10",
    bookings: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1567005231563-5d0c5e77f876?q=80&w=800&auto=format&fit=crop",
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
  },
];
