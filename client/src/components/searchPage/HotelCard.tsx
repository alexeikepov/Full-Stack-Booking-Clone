import { Link, useSearchParams } from "react-router-dom";
import type { Hotel } from "@/types/hotel";
import { Card } from "@/components/ui/card";

const fmt = (n: number, currency = "ILS") =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency }).format(n);

const safeFixed = (v: unknown, d = 1) => {
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(d) : "New";
};

function getPrimaryImage(hotel: Hotel): string {
  const hotelImage: string | undefined =
    (hotel.media?.find((m: any) => m?.url)?.url as string | undefined) ??
    (hotel.media?.[0]?.url as string | undefined);
  if (hotelImage) return hotelImage;

  for (const r of hotel.rooms ?? []) {
    const roomImg =
      (r.media?.find((m: any) => m?.url)?.url as string | undefined) ??
      (r.media?.[0]?.url as string | undefined) ??
      r.photos?.[0];
    if (roomImg) return roomImg;
  }
  return "/placeholder-hotel.jpg";
}

function starsRow(stars?: number | null) {
  if (!stars) return null;
  return Array(stars).fill("★").join("");
}

type Props = {
  hotel: Hotel;
  nights?: number | null;
  variant?: "list" | "grid";
};

export default function HotelCard({ hotel, nights, variant = "list" }: Props) {
  const [params] = useSearchParams();

  // Helper function to get hotel ID
  const getHotelId = (hotel: Hotel): string => {
    if (hotel.id) return hotel.id;
    if (hotel._id?.$oid) return hotel._id.$oid;
    if (typeof hotel._id === "string") return hotel._id;
    return "";
  };

  // Build hotel URL with search parameters
  const buildHotelUrl = (hotelId: string) => {
    if (!hotelId) {
      console.error("Hotel ID is undefined:", hotel);
      return "#";
    }
    const searchParams = new URLSearchParams();

    // Add search parameters from current URL
    const city = params.get("city");
    const from = params.get("from");
    const to = params.get("to");
    const adults = params.get("adults");
    const children = params.get("children");
    const rooms = params.get("rooms");

    if (city) searchParams.set("city", city);
    if (from) searchParams.set("from", from);
    if (to) searchParams.set("to", to);
    if (adults) searchParams.set("adults", adults);
    if (children) searchParams.set("children", children);
    if (rooms) searchParams.set("rooms", rooms);

    const queryString = searchParams.toString();
    return `/hotel/${hotelId}${queryString ? `?${queryString}` : ""}`;
  };

  const rating = hotel.averageRating ?? null;
  const ratingStr = rating === null ? "New" : safeFixed(rating, 1);
  const reviews = hotel.reviewsCount ?? 0;

  const total = Number.isFinite(Number((hotel as any).totalPrice))
    ? Number((hotel as any).totalPrice)
    : null;
  const perNight = Number.isFinite(Number((hotel as any).priceFrom))
    ? Number((hotel as any).priceFrom)
    : null;
  const priceToShow = total ?? perNight;
  const isTotal = total !== null;

  // Get room features from the first room
  const firstRoom = hotel.rooms?.[0];
  const featuresLine = firstRoom
    ? `${firstRoom.name} — ${firstRoom.bedrooms} bedroom${
        firstRoom.bedrooms > 1 ? "s" : ""
      } | ${firstRoom.bathrooms} bathroom${
        firstRoom.bathrooms > 1 ? "s" : ""
      } — ${firstRoom.sizeSqm} m²`
    : "Room details unavailable";

  if (variant === "grid") {
    return (
      <Card className="overflow-hidden rounded-xl border border-[#e7e7e7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <Link
          to={buildHotelUrl(getHotelId(hotel))}
          className="block w-full"
          style={{ aspectRatio: "16 / 9" }}
        >
          <img
            src={getPrimaryImage(hotel)}
            alt={hotel.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </Link>

        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  to={buildHotelUrl(getHotelId(hotel))}
                  className="line-clamp-2 text-[18px] font-semibold text-[#0071c2] hover:underline"
                >
                  {hotel.name}
                </Link>
                {!!hotel.stars && (
                  <span className="text-[#febb02]">
                    {starsRow(hotel.stars)}
                  </span>
                )}
              </div>

              <div className="mt-0.5 text-sm">
                <Link to="#" className="text-[#0071c2] hover:underline">
                  {hotel.city}
                </Link>
                <span className="text-muted-foreground">
                  {" "}
                  • 2.7 km from centre
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="rounded bg-[#003b95] px-2 py-1 text-sm font-semibold text-white">
                {ratingStr}
              </div>
              <div className="text-right">
                <div className="text-xs font-medium">
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
                <div className="text-xs text-muted-foreground">
                  {reviews} reviews
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 border-l border-[#e7e7e7] pl-3 text-[13px] text-muted-foreground">
            {featuresLine}
          </div>

          <div className="mt-3 flex items-end">
            <div className="ml-auto flex items-end gap-4">
              <div className="text-right">
                {priceToShow !== null ? (
                  <>
                    <div className="text-[20px] font-bold leading-none">
                      {fmt(priceToShow)}
                    </div>
                    <div className="mt-1 text-[12px] text-muted-foreground">
                      {isTotal
                        ? `${nights ?? 2} nights, ${
                            params.get("adults") ?? 1
                          } adult`
                        : "1 night, 1 adult"}
                    </div>
                    <div className="text-[12px] text-muted-foreground">
                      Includes taxes and charges
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Price unavailable
                  </div>
                )}
              </div>

              <Link
                to={buildHotelUrl(getHotelId(hotel))}
                className="inline-flex items-center rounded-md bg-[#0071c2] px-4 py-2 text-sm font-medium text-white hover:bg-[#005fa3]"
              >
                See availability
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-xl border border-[#e7e7e7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:gap-4">
        <Link
          to={buildHotelUrl(getHotelId(hotel))}
          className="block w-full shrink-0 overflow-hidden rounded-lg sm:w-[220px]"
          style={{ aspectRatio: "3 / 4" }}
        >
          <img
            src={getPrimaryImage(hotel)}
            alt={hotel.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <Link
              to={buildHotelUrl(getHotelId(hotel))}
              className="text-[20px] font-semibold text-[#0071c2] hover:underline"
            >
              {hotel.name}
            </Link>
            {!!hotel.stars && (
              <span className="text-[#febb02]">{starsRow(hotel.stars)}</span>
            )}
          </div>

          <div className="text-sm">
            <Link to="#" className="text-[#0071c2] hover:underline">
              {hotel.city}
            </Link>
            <span className="text-muted-foreground"> • 2.7 km from centre</span>
          </div>

          <div className="mt-1 border-l border-[#e7e7e7] pl-3 text-[13px] text-muted-foreground">
            {featuresLine}
          </div>

          <div className="mt-auto pt-2" />
        </div>

        <div className="flex shrink-0 flex-col items-end justify-between gap-3 sm:w-60">
          <div className="flex items-start gap-2">
            <div className="rounded bg-[#003b95] px-2 py-1 text-sm font-semibold text-white">
              {ratingStr}
            </div>
            <div className="text-right">
              <div className="font-medium text-xs">
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
              <div className="text-xs text-muted-foreground">
                {reviews} reviews
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              {priceToShow !== null ? (
                <>
                  <div className="text-[22px] font-bold leading-none">
                    {fmt(priceToShow)}
                  </div>
                  <div className="mt-1 text-[12px] text-muted-foreground">
                    {isTotal
                      ? `${nights ?? 2} nights, ${
                          params.get("adults") ?? 1
                        } adult`
                      : "1 night, 1 adult"}
                  </div>
                  <div className="text-[12px] text-muted-foreground">
                    Includes taxes and charges
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Price unavailable
                </div>
              )}
            </div>

            <Link
              to={buildHotelUrl(getHotelId(hotel))}
              className="inline-flex items-center rounded-md bg-[#0071c2] px-4 py-2 text-sm font-medium text-white hover:bg-[#005fa3]"
            >
              See availability
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
