import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Hotel } from "@/types/hotel";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import WishlistDialog from "@/components/ui/WishlistDialog";
import { useAuth } from "@/context/AuthContext";

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
  initialLiked?: boolean;
  onToggleLike?: (hotelId: string, liked: boolean) => void;
};

export default function HotelCard({
  hotel,
  nights,
  variant = "list",
  initialLiked = false,
  onToggleLike,
}: Props) {
  const [params] = useSearchParams();
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [showWishlistDialog, setShowWishlistDialog] = useState(false);
  const { user } = useAuth();

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // If user is not logged in, show wishlist dialog to prompt login
      setShowWishlistDialog(true);
      return;
    }
    
    if (!liked) {
      // If not liked, show wishlist dialog to choose where to save
      setShowWishlistDialog(true);
    } else {
      // If already liked, remove from wishlist (this would need additional API call)
      setLiked(false);
      onToggleLike?.(id, false);
    }
  };

  const handleWishlistSuccess = () => {
    setLiked(true);
    onToggleLike?.(hotelId, true);
  };

  const getHotelId = (hotel: Hotel): string => {
    if ((hotel as any)._id?.$oid) return (hotel as any)._id.$oid as string;
    if (typeof (hotel as any)._id === "string") return (hotel as any)._id as string;
    return "";
  };

  const buildHotelUrl = (hotelId: string) => {
    if (!hotelId) return "#";
    const searchParams = new URLSearchParams();
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

  const firstRoom = hotel.rooms?.[0];
  const featuresLine = firstRoom
    ? `${firstRoom.name} — ${firstRoom.bedrooms} bedroom${firstRoom.bedrooms > 1 ? "s" : ""} | ${firstRoom.bathrooms} bathroom${firstRoom.bathrooms > 1 ? "s" : ""} — ${firstRoom.sizeSqm} m²`
    : "Room details unavailable";

  const hotelId = getHotelId(hotel);

  const LikeButton = (
    <button
      aria-label={liked ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={liked}
      onClick={(e) => toggleLike(e, hotelId)}
      className="absolute right-2 top-2 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white focus:outline-none focus:ring-0"
    >
      <Heart
        className={`h-5 w-5 ${liked ? "text-red-600" : "text-[#003b95]"}`}
        fill={liked ? "currentColor" : "none"}
        strokeWidth={1.75}
      />
    </button>
  );

  if (variant === "grid") {
    return (
      <Card className="relative w-[252px] overflow-hidden rounded-xl border border-[#e7e7e7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-0 mb-3 focus:outline-none focus:ring-0">
        <Link
          to={buildHotelUrl(hotelId)}
          className="absolute inset-0 z-10 focus:outline-none focus:ring-0"
          aria-label={`Open ${hotel.name}`}
        />
        <div className="relative">
          <div className="block w-full">
            <img
              src={getPrimaryImage(hotel)}
              alt={hotel.name}
              className="h-[310px] w-[252px] object-cover"
              loading="lazy"
            />
          </div>
          {LikeButton}
        </div>
        <div className="p-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="line-clamp-2 text-[16px] font-semibold text-[#0071c2]">
                {hotel.name}
              </div>
              {!!hotel.stars && <span className="text-[#febb02]">{starsRow(hotel.stars)}</span>}
              <div className="mt-0.5 text-[12px]">
                <span className="text-[#0071c2]">{hotel.city}</span>
                <span className="text-muted-foreground"> • 2.7 km from centre</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="rounded bg-[#003b95] px-2 py-1 text-[11px] font-semibold text-white">
                {ratingStr}
              </div>
              <div className="text-right">
                <div className="text-[11px] font-medium">
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
                <div className="text-[11px] text-muted-foreground">{reviews} reviews</div>
              </div>
            </div>
          </div>

          <div className="mt-1 border-l border-[#e7e7e7] pl-2 text-[12px] text-muted-foreground">
            {featuresLine}
          </div>

          <div className="mt-2 flex items-end">
            <div className="ml-auto flex items-end gap-2.5">
              <div className="text-right">
                {priceToShow !== null ? (
                  <>
                    <div className="text-[18px] font-bold leading-none">{fmt(priceToShow)}</div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {isTotal
                        ? `${nights ?? 2} nights, ${params.get("adults") ?? 1} adult`
                        : "1 night, 1 adult"}
                    </div>
                    <div className="text-[11px] text-muted-foreground">Includes taxes and charges</div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">Price unavailable</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <WishlistDialog
          isOpen={showWishlistDialog}
          onClose={() => setShowWishlistDialog(false)}
          hotelId={hotelId}
          hotelName={hotel.name}
          onSuccess={handleWishlistSuccess}
        />
      </Card>
    );
  }

  return (
    <Card className="min-h-[274px] overflow-hidden rounded-xl border border-[#e7e7e7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-3 pb-0 mb-3 focus:outline-none focus:ring-0">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-2.5">
        <div className="relative shrink-0 overflow-hidden rounded-lg sm:h-[240px] sm:w-[240px]">
          <Link to={buildHotelUrl(hotelId)} className="block h-full w-full focus:outline-none focus:ring-0">
            <img
              src={getPrimaryImage(hotel)}
              alt={hotel.name}
              className="h-[240px] w-[240px] object-cover"
              loading="lazy"
            />
          </Link>
          {LikeButton}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <Link
              to={buildHotelUrl(hotelId)}
              className="text-[18px] font-semibold text-[#0071c2] hover:underline focus:outline-none focus:ring-0"
            >
              {hotel.name}
            </Link>
            {!!hotel.stars && <span className="text-[#febb02]">{starsRow(hotel.stars)}</span>}
          </div>

          <div className="text-[13px]">
            <Link to="#" className="text-[#0071c2] hover:underline">
              {hotel.city}
            </Link>
            <span className="text-muted-foreground"> • 2.7 km from centre</span>
          </div>

          <div className="mt-0.5 border-l border-[#e7e7e7] pl-2 text-[12px] text-muted-foreground">
            {featuresLine}
          </div>

          <div className="mt-auto" />
        </div>

        <div className="flex shrink-0 flex-col items-end justify-between gap-2 sm:w-[232px]">
          <div className="flex items-start gap-2">
            <div className="rounded bg-[#003b95] px-2 py-1 text-xs font-semibold text-white">
              {ratingStr}
            </div>
            <div className="text-right">
              <div className="text-[12px] font-medium">
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
              <div className="text-[11px] text-muted-foreground">{reviews} reviews</div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <div className="text-right">
              {priceToShow !== null ? (
                <>
                  <div className="text-[20px] font-bold leading-none">{fmt(priceToShow)}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    {isTotal
                      ? `${nights ?? 2} nights, ${params.get("adults") ?? 1} adult`
                      : "1 night, 1 adult"}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Includes taxes and charges</div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Price unavailable</div>
              )}
            </div>

            <Link
              to={buildHotelUrl(hotelId)}
              className="inline-flex items-center rounded-md bg-[#0071c2] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[#005fa3] focus:outline-none focus:ring-0"
            >
              See availability
            </Link>
          </div>
        </div>
      </div>

      <WishlistDialog
        isOpen={showWishlistDialog}
        onClose={() => setShowWishlistDialog(false)}
        hotelId={hotelId}
        hotelName={hotel.name}
        onSuccess={handleWishlistSuccess}
      />
    </Card>
  );
}
