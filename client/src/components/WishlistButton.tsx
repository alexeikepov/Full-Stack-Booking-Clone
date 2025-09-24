import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  checkHotelInWishlist,
  addHotelToWishlist,
  removeHotelFromWishlist,
  getWishlists,
  type Wishlist,
} from "@/lib/api";
import WishlistDialog from "@/components/ui/WishlistDialog";

interface WishlistButtonProps {
  hotelId: string;
  hotelName?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function WishlistButton({
  hotelId,
  hotelName = "this hotel",
  className = "",
  size = "md",
}: WishlistButtonProps) {
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlists, setWishlists] = useState<
    Array<{ _id: string; name: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [showWishlistDialog, setShowWishlistDialog] = useState(false);

  useEffect(() => {
    if (user && hotelId) {
      checkHotelStatus();
    }
  }, [user, hotelId]);

  const checkHotelStatus = async () => {
    try {
      const result = await checkHotelInWishlist(hotelId);
      setIsInWishlist(result.isInWishlist);
      setWishlists(result.wishlists);
    } catch (err) {
      console.error("Failed to check wishlist status:", err);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }

    if (isInWishlist) {
      // Remove from all wishlists
      try {
        setLoading(true);
        for (const wishlist of wishlists) {
          await removeHotelFromWishlist(wishlist._id, hotelId);
        }
        setIsInWishlist(false);
        setWishlists([]);
      } catch (err) {
        console.error("Failed to remove from wishlist:", err);
      } finally {
        setLoading(false);
      }
    } else {
      // Show wishlist dialog
      setShowWishlistDialog(true);
    }
  };

  const handleWishlistSuccess = () => {
    setIsInWishlist(true);
    setShowWishlistDialog(false);
    // Refresh wishlist status
    checkHotelStatus();
  };

  if (!user) {
    return (
      <button
        className={`rounded-full bg-white/95 shadow ring-1 ring-black/10 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a5ad6] ${className}`}
        onClick={() => {
          // Could redirect to login or show login modal
          window.location.href = "/login";
        }}
      >
        <Heart
          className={`transition-colors ${
            size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"
          }`}
          stroke="#1f2937"
          fill="none"
          strokeWidth={1.8}
        />
      </button>
    );
  }

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const iconSizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-pressed={isInWishlist}
        aria-label={isInWishlist ? "Remove from saved" : "Save to list"}
        onClick={handleToggleWishlist}
        disabled={loading}
        className={`grid place-items-center rounded-full bg-white/95 shadow ring-1 ring-black/10 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a5ad6] ${
          sizeClasses[size]
        } ${className} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Heart
          className={`transition-colors ${iconSizeClasses[size]}`}
          stroke={isInWishlist ? "#e63946" : "#1f2937"}
          fill={isInWishlist ? "#e63946" : "none"}
          strokeWidth={1.8}
        />
      </button>

      {/* Wishlist Dialog */}
      <WishlistDialog
        isOpen={showWishlistDialog}
        onClose={() => setShowWishlistDialog(false)}
        hotelId={hotelId}
        hotelName={hotelName}
        onSuccess={handleWishlistSuccess}
      />
    </div>
  );
}
