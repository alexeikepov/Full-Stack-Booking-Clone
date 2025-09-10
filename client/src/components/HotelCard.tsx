import { Link } from "react-router-dom";
import type { Hotel } from "@/types/hotel";
import { Card } from "@/components/ui/card";
import { numberOrNull, formatCurrency, toFixedSafe } from "@/utils/format";
import { getPrimaryImage } from "@/utils/hotel-images";

// optional prop nights only to print "total for X nights"
type Props = { hotel: Hotel; nights?: number | null };

export default function HotelCard({ hotel, nights }: Props) {
  const ratingStr = toFixedSafe(hotel.averageRating, 1) ?? "New";
  const reviews = hotel.reviewsCount ?? 0;

  const total = numberOrNull((hotel as any).totalPrice);
  const perNight = numberOrNull((hotel as any).priceFrom);
  const priceToShow = total ?? perNight ?? null;
  const isTotal = total !== null;

  const img = getPrimaryImage(hotel);

  // fake perks line like Booking (replace with real data if you have)
  const bullets = [
    "Entire apartment",
    "1 bedroom • 1 living room • 1 bathroom",
    "40 m²",
  ];

  return (
    <Card className="overflow-hidden rounded-xl border">
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:gap-4">
        {/* left: image */}
        <Link
          to={`/hotel/${hotel.id}`}
          className="block w-full shrink-0 overflow-hidden rounded-lg sm:w-[260px]"
          style={{ aspectRatio: "4 / 3" }}
        >
          <img
            src={img}
            alt={hotel.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* middle: info */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {/* title + badges line */}
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/hotel/${hotel.id}`}
              className="text-[20px] font-semibold text-[#0071c2] hover:underline"
            >
              {hotel.name}
            </Link>
          </div>

          <div className="text-sm">
            <Link to="#" className="text-[#0071c2] hover:underline">
              {hotel.city}
            </Link>
            <span className="text-muted-foreground"> • {`2.7 km from centre`}</span>
          </div>

          {/* stars (gold) */}
          <div className="mt-1 text-[#febb02]">
            {"★".repeat(hotel.stars ?? 0)}
          </div>

          {/* bullet list (booking style) */}
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[13px]">
            {bullets.map((b, i) => (
              <li key={i} className="text-muted-foreground">
                <span className="text-foreground">{b}</span>
              </li>
            ))}
          </ul>

          {/* alert line (red) */}
          <div className="mt-1 text-[12px] font-medium text-[#cc0000]">
            Only 1 left at this price on our site
          </div>

          {/* CTA under info */}
          <div className="mt-auto pt-2">
            <Link
              to={`/hotel/${hotel.id}`}
              className="inline-flex items-center rounded-md bg-[#0071c2] px-4 py-2 text-sm font-medium text-white hover:bg-[#005fa3]"
            >
              See availability
            </Link>
          </div>
        </div>

        {/* right: rating + price box */}
        <div className="flex shrink-0 flex-col items-end justify-between gap-3 sm:w-60">
          {/* rating block */}
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

          {/* price block */}
          <div className="text-right">
            {priceToShow !== null ? (
              <>
                {/* crossed old price example (optional) */}
                {/* <div className="text-xs text-muted-foreground line-through">
                  {formatCurrency(Math.round(priceToShow * 1.2))}
                </div> */}
                <div className="text-[22px] font-bold leading-none">
                  {formatCurrency(priceToShow)}
                </div>
                <div className="mt-1 text-[12px] text-muted-foreground">
                  {isTotal
                    ? `2 nights, 1 adult`
                    : `1 night, 1 adult`}
                </div>
                <div className="text-[12px] text-muted-foreground">
                  Includes taxes and charges
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
