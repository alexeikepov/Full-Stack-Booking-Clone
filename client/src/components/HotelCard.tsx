// src/components/HotelCard.tsx
import { Link } from "react-router-dom";
import type { Hotel } from "@/types/hotel";
import { Card } from "@/components/ui/card";
import { getPrimaryImage } from "@/utils/hotel-images";

const toFixedSafe = (v: unknown, d = 1) => {
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(d) : null;
};
const formatCurrency = (n: number, currency = "ILS", locale = "he-IL") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(n);

// fallback nightly from rooms if backend didn't attach priceFrom
function cheapestNightlyFromRooms(hotel: Hotel): number | null {
  const prices = hotel.rooms
    ?.map(r => Number(r.pricePerNight))
    .filter(n => Number.isFinite(n) && n >= 0) ?? [];
  if (!prices.length) return null;
  return Math.min(...prices);
}

type Props = { hotel: Hotel; nights?: number | null };

export default function HotelCard({ hotel, nights }: Props) {
  const ratingStr = toFixedSafe(hotel.averageRating, 1) ?? "New";
  const reviews = hotel.reviewsCount ?? 0;

  const total = Number.isFinite(Number(hotel.totalPrice)) ? Number(hotel.totalPrice) : null;
  const perNight = Number.isFinite(Number(hotel.priceFrom))
    ? Number(hotel.priceFrom)
    : cheapestNightlyFromRooms(hotel);

  const showTotal = total !== null;
  const priceToShow = showTotal ? total : perNight;

  const img = getPrimaryImage(hotel);

  return (
    <Card className="overflow-hidden border rounded-xl">
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:gap-4">
        {/* Left: image */}
        <Link
          to={`/hotel/${hotel.id}`}
          className="block w-full shrink-0 sm:w-[260px] aspect-[4/3] overflow-hidden rounded-lg"
        >
          <img
            src={img}
            alt={hotel.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Middle */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Link
            to={`/hotel/${hotel.id}`}
            className="text-lg font-semibold hover:underline line-clamp-2"
          >
            {hotel.name}
          </Link>
          <div className="text-sm text-muted-foreground">{hotel.city}</div>

          <div className="mt-auto pt-1">
            <Link
              to={`/hotel/${hotel.id}`}
              className="text-primary underline underline-offset-4"
            >
              View availability
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="flex shrink-0 flex-col items-end justify-between gap-3 sm:w-56">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="rounded bg-[#003580] px-2 py-1 text-sm font-semibold text-white">
              {ratingStr}
            </div>
            <div className="text-sm">
              <div className="font-medium">
                {ratingStr === "New"
                  ? "New"
                  : Number(ratingStr) >= 8.5
                  ? "Excellent"
                  : Number(ratingStr) >= 8
                  ? "Very good"
                  : Number(ratingStr) >= 7
                  ? "Good"
                  : "Review"}
              </div>
              <div className="text-muted-foreground">{reviews} reviews</div>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            {priceToShow !== null ? (
              <>
                <div className="text-2xl font-bold leading-none">
                  {formatCurrency(priceToShow)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {showTotal && nights
                    ? `total for ${nights} night${nights > 1 ? "s" : ""}`
                    : showTotal
                    ? "total"
                    : "per night"}
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Price unavailable</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
