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

interface WishlistButtonProps {
  hotelId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function WishlistButton({ 
  hotelId, 
  className = "", 
  size = "md" 
}: WishlistButtonProps) {
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlists, setWishlists] = useState<Array<{ _id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [showWishlistSelector, setShowWishlistSelector] = useState(false);

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
      // Show wishlist selector or add to default wishlist
      try {
        const userWishlists = await getWishlists();
        if (userWishlists.length === 0) {
          // Create default wishlist
          // This would require creating a wishlist first
          setShowWishlistSelector(true);
        } else if (userWishlists.length === 1) {
          // Add to the only wishlist
          setLoading(true);
          await addHotelToWishlist(userWishlists[0]._id, hotelId);
          setIsInWishlist(true);
          setWishlists([{ _id: userWishlists[0]._id, name: userWishlists[0].name }]);
        } else {
          // Show selector for multiple wishlists
          setShowWishlistSelector(true);
        }
      } catch (err) {
        console.error("Failed to add to wishlist:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddToSpecificWishlist = async (wishlistId: string) => {
    try {
      setLoading(true);
      await addHotelToWishlist(wishlistId, hotelId);
      setIsInWishlist(true);
      // Update wishlists to include the new one
      const userWishlists = await getWishlists();
      const addedWishlist = userWishlists.find(w => w._id === wishlistId);
      if (addedWishlist) {
        setWishlists([...wishlists, { _id: addedWishlist._id, name: addedWishlist.name }]);
      }
      setShowWishlistSelector(false);
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
    } finally {
      setLoading(false);
    }
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
        className={`grid place-items-center rounded-full bg-white/95 shadow ring-1 ring-black/10 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a5ad6] ${sizeClasses[size]} ${className} ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <Heart
          className={`transition-colors ${iconSizeClasses[size]}`}
          stroke={isInWishlist ? "#e63946" : "#1f2937"}
          fill={isInWishlist ? "#e63946" : "none"}
          strokeWidth={1.8}
        />
      </button>

      {/* Wishlist Selector Modal */}
      {showWishlistSelector && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Add to wishlist
            </h3>
            <div className="space-y-1">
              {/* This would need to fetch user's wishlists */}
              <button
                className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                onClick={() => setShowWishlistSelector(false)}
              >
                Create new wishlist
              </button>
            </div>
            <button
              className="w-full mt-2 px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
              onClick={() => setShowWishlistSelector(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
