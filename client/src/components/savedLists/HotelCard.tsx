import { useState } from "react";
import { Heart } from "lucide-react";
import { Stars, Pin, Dot } from "./ui";
import type { HotelCardProps } from "./types";

export default function HotelCard({
  hotel,
  wishlistId,
  onRemove,
}: HotelCardProps) {
  const [liked, setLiked] = useState(true);

  const handleRemove = () => {
    onRemove();
  };

  const getHotelImage = (hotel: any) => {
    if (hotel.media && hotel.media.length > 0) {
      // Find first image in media array
      const imageMedia = hotel.media.find((item: any) => item.type === "image");
      if (imageMedia) {
        return imageMedia.url;
      }
      // Fallback to first media item if no image type found
      return hotel.media[0].url || hotel.media[0];
    }
    return "https://cf.bstatic.com/xdata/images/hotel/square600/597783002.webp?k=3545efe5865606bf107ad177c20591c2048174246717d7b2f2476168143488d1&o=";
  };

  const getHotelRating = (hotel: any) => {
    return hotel.averageRating || hotel.rating || 8.1;
  };

  const getHotelStars = (hotel: any) => {
    if (hotel.stars) return hotel.stars;
    const rating = getHotelRating(hotel);
    return Math.round(rating / 2);
  };

  const getRatingText = (rating: number) => {
    if (rating >= 9) return "Excellent";
    if (rating >= 8) return "Very good";
    if (rating >= 7) return "Good";
    if (rating >= 6) return "Fair";
    return "Poor";
  };

  return (
    <article className="w-[320px] overflow-hidden rounded-[10px] border border-[#e6eaf0] bg-white shadow-[0_1px_2px_rgba(0,0,0,.04)]">
      <div className="relative">
        <img
          src={getHotelImage(hotel)}
          alt={hotel.name}
          className="h-[180px] w-full object-cover"
        />

        <button
          type="button"
          aria-pressed={liked}
          aria-label="Remove from saved"
          onClick={handleRemove}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/95 shadow ring-1 ring-black/10 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a5ad6]"
        >
          <Heart
            className="h-4 w-4 transition-colors"
            stroke="#e63946"
            fill="#e63946"
            strokeWidth={1.8}
          />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-semibold">{hotel.name}</h3>
          <Stars count={getHotelStars(hotel)} />
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-[4px] bg-[#003b95] px-[6px] text-[12px] font-semibold text-white">
            {getHotelRating(hotel).toFixed(1)}
          </span>
          <span className="text-[12px] text-[#1a1a1a]">
            {getRatingText(getHotelRating(hotel))}
          </span>
          <span className="text-[12px] text-[#6b7280]">
            {hotel.reviewsCount || 0} reviews
          </span>
        </div>

        <div className="mt-2 space-y-1 text-[12px] text-[#3b3f46]">
          <div className="flex items-center gap-1">
            <Pin /> {hotel.city || hotel.location?.city || "Unknown city"}
          </div>
          <div className="flex items-center gap-1">
            <Dot /> {hotel.distance || "Distance not available"}
          </div>
        </div>

        <div className="mt-3 text-right">
          <div className="text-[11.5px] text-[#6b7280]">Saved in wishlist</div>
          <button className="mt-1 text-[12px] text-[#0a5ad6] hover:underline">
            View hotel details
          </button>
          <div className="mt-2 text-[12px] font-medium text-[#0a5ad6]">
            {hotel.price ? `From $${hotel.price}/night` : "Price on request"}
          </div>
        </div>
      </div>
    </article>
  );
}
