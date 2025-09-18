// src/pages/SavedListsPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import Footer from "@/components/Footer";
import { useNavigationTabsStore } from "@/stores/navigationTabs";
import { useNavigationStore } from "@/stores/navigation";

function BluePill(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={
        "inline-flex items-center gap-1 rounded-[6px] border border-[#b9d2f5] bg-white px-2.5 py-[6px] text-[12px] font-medium text-[#0a5ad6] " +
        (props.className || "")
      }
    />
  );
}
function TagPlain(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={
        "inline-flex items-center gap-1 px-0 py-[6px] text-[12px] font-medium text-[#6b7280] " +
        (props.className || "")
      }
    />
  );
}

const railLink = "text-[12px] text-[#6b7280] hover:underline whitespace-nowrap";

const ITEM = {
  id: "galini",
  name: "Galini Palace",
  img: "https://cf.bstatic.com/xdata/images/hotel/square600/597783002.webp?k=3545efe5865606bf107ad177c20591c2048174246717d7b2f2476168143488d1&o=",
  rating: 8.1,
  ratingText: "Very good",
  reviews: 298,
  city: "Kolymvari",
  distance: "0.8 km from centre",
  dates: "15 Sept – 17 Sept",
  note: "Sold out on Booking.com",
  stars: 4,
};

export default function SavedListsPage() {
  const { setShowTabs } = useNavigationTabsStore();
  const { activeTab, setActiveTab } = useNavigationStore();

  useEffect(() => {
    setShowTabs(true);
    return () => setShowTabs(true);
  }, [setShowTabs]);

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      <main className="mx-auto max-w-[1128px] px-4 pt-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[#3b3f46]">Select list:</span>
            <select
              className="h-8 rounded-[6px] border border-[#b9d2f5] bg-white px-2.5 text-[12px] font-medium text-[#0a5ad6] outline-none focus:ring-2 focus:ring-[#b9d2f5]"
              defaultValue="Mitzpe Ramon"
            >
              <option>Mitzpe Ramon</option>
              <option>Summer trip</option>
            </select>
            <button className="rounded-[6px] bg-[#0a5ad6] px-3 py-2 text-[12px] font-medium text-white hover:bg-[#0950b5]">
              Share the list
            </button>
            <button className="rounded-[6px] bg-[#0a5ad6] px-3 py-2 text-[12px] font-medium text-white hover:bg-[#0950b5]">
              Create a list
            </button>
          </div>

          <button className="rounded-[6px] border border-[#b9d2f5] bg-white px-3 py-2 text-[12px] font-medium text-[#0a5ad6] hover:bg-[#f0f6ff]">
            Show on map
          </button>
        </div>

        <h1 className="mb-1 text-[28px] font-bold text-[#1a1a1a]">
          Mitzpe Ramon
        </h1>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <TagPlain>
            <span className="text-[#d23b3b]">♥</span>1 saved property
          </TagPlain>
          <BluePill>Mon 15 Sept – Wed 17 Sept</BluePill>
          <BluePill>2 adults · 0 children · 1 room</BluePill>
        </div>

        <div className="mb-5 w-[520px] max-w-full rounded-[10px] border border-[#f3c2c0] bg-[#fdeeee] px-3 py-2 text-center text-[12px] text-[#8b1f1b]">
          HTTP 404
        </div>

        <div className="mb-8">
          <HotelCard />
        </div>
      </main>

      <div className="w-full">
        <div className="mx-auto max-w-[1128px] px-4">
          <div className="py-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <Link to="#" className={railLink}>
                Countries
              </Link>
              <Link to="#" className={railLink}>
                Regions
              </Link>
              <Link to="#" className={railLink}>
                Cities
              </Link>
              <Link to="#" className={railLink}>
                Districts
              </Link>
              <Link to="#" className={railLink}>
                Airports
              </Link>
              <Link to="#" className={railLink}>
                Hotels
              </Link>
              <Link to="#" className={railLink}>
                Places of interest
              </Link>
              <span className="text-[12px] text-[#6b7280]">•</span>
              <Link to="#" className={railLink}>
                Holiday Homes
              </Link>
              <Link to="#" className={railLink}>
                Apartments
              </Link>
              <Link to="#" className={railLink}>
                Resorts
              </Link>
              <Link to="#" className={railLink}>
                Villas
              </Link>
              <Link to="#" className={railLink}>
                Hostels
              </Link>
              <Link to="#" className={railLink}>
                B&amp;Bs
              </Link>
              <Link to="#" className={railLink}>
                Guest Houses
              </Link>
              <span className="text-[12px] text-[#6b7280]">•</span>
              <Link to="#" className={railLink}>
                Unique places to stay
              </Link>
              <Link to="#" className={railLink}>
                Reviews
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* card */
function HotelCard() {
  const [liked, setLiked] = useState(false);

  return (
    <article className="w-[320px] overflow-hidden rounded-[10px] border border-[#e6eaf0] bg-white shadow-[0_1px_2px_rgba(0,0,0,.04)]">
      <div className="relative">
        <img
          src={ITEM.img}
          alt={ITEM.name}
          className="h-[180px] w-full object-cover"
        />

        {/* Heart keeps identical geometry; only fill/stroke change */}
        <button
          type="button"
          aria-pressed={liked}
          aria-label={liked ? "Remove from saved" : "Save to list"}
          onClick={() => setLiked((v) => !v)}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/95 shadow ring-1 ring-black/10 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a5ad6]"
        >
          <Heart
            className="h-4 w-4 transition-colors"
            stroke={liked ? "#e63946" : "#1f2937"}
            fill={liked ? "#e63946" : "none"}
            strokeWidth={1.8}
          />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-semibold">{ITEM.name}</h3>
          <Stars count={ITEM.stars} />
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-[4px] bg-[#003b95] px-[6px] text-[12px] font-semibold text-white">
            {ITEM.rating.toFixed(1)}
          </span>
          <span className="text-[12px] text-[#1a1a1a]">{ITEM.ratingText}</span>
          <span className="text-[12px] text-[#6b7280]">
            {ITEM.reviews} reviews
          </span>
        </div>

        <div className="mt-2 space-y-1 text-[12px] text-[#3b3f46]">
          <div className="flex items-center gap-1">
            <Pin /> {ITEM.city}
          </div>
          <div className="flex items-center gap-1">
            <Dot /> {ITEM.distance}
          </div>
        </div>

        <div className="mt-3 text-right">
          <div className="text-[11.5px] text-[#6b7280]">{ITEM.dates}</div>
          <button className="mt-1 text-[12px] text-[#0a5ad6] hover:underline">
            Change dates to see prices
          </button>
          <div className="mt-2 text-[12px] font-medium text-[#d40000]">
            {ITEM.note}
          </div>
        </div>
      </div>
    </article>
  );
}

function Stars({ count = 0 }: { count?: number }) {
  if (!count) return null;
  return (
    <span className="text-[#febb02] text-[12px] leading-none">
      {"★".repeat(count)}
      {"☆".repeat(Math.max(0, 5 - count))}
    </span>
  );
}
function Pin() {
  return (
    <svg viewBox="0 0 24 24" className="h-[14px] w-[14px] fill-[#6b7280]">
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}
function Dot() {
  return (
    <svg viewBox="0 0 24 24" className="h-[14px] w-[14px] fill-[#6b7280]">
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}
