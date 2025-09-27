// src/pages/SavedListsPage.tsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Plus,
  Share2,
  MapPin,
  Calendar,
  Edit2,
  Trash2,
  ChevronDown,
} from "lucide-react";
import Footer from "@/components/navigation/Footer";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/context/AuthContext";
import {
  getWishlists,
  createWishlist,
  deleteWishlist,
  updateWishlist,
  removeHotelFromWishlist,
  type Wishlist,
  type CreateWishlistData,
} from "@/lib/api";

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

export default function SavedListsPage() {
  const { user } = useAuth();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [editingWishlist, setEditingWishlist] = useState<Wishlist | null>(null);
  const [editName, setEditName] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [wishlistToDelete, setWishlistToDelete] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadWishlists();
  }, []);

  const loadWishlists = async () => {
    try {
      setLoading(true);
      const data = await getWishlists();
      setWishlists(data);
      if (data.length > 0) {
        setSelectedWishlist(data[0]);
      }
    } catch (err) {
      setError("Failed to load wishlists");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWishlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishlistName.trim()) return;

    try {
      const newWishlist = await createWishlist({
        name: newWishlistName.trim(),
        description: "",
        isPublic: false,
      });
      setWishlists([newWishlist, ...wishlists]);
      setSelectedWishlist(newWishlist);
      setNewWishlistName("");
      setShowCreateForm(false);
    } catch (err) {
      setError("Failed to create wishlist");
      console.error(err);
    }
  };

  const handleRemoveHotel = async (wishlistId: string, hotelId: string) => {
    try {
      await removeHotelFromWishlist(wishlistId, hotelId);
      loadWishlists(); // Reload to get updated data
    } catch (err) {
      setError("Failed to remove hotel from wishlist");
      console.error(err);
    }
  };

  const handleEditWishlist = (wishlist: Wishlist) => {
    setEditingWishlist(wishlist);
    setEditName(wishlist.name);
    setShowDropdown(false);
  };

  const handleUpdateWishlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWishlist || !editName.trim()) return;

    try {
      await updateWishlist(editingWishlist._id, {
        name: editName.trim(),
      });
      loadWishlists();
      setEditingWishlist(null);
      setEditName("");
    } catch (err) {
      setError("Failed to update wishlist");
      console.error(err);
    }
  };

  const handleDeleteWishlist = (wishlistId: string) => {
    setWishlistToDelete(wishlistId);
    setShowDeleteDialog(true);
    setShowDropdown(false);
  };

  const confirmDeleteWishlist = async () => {
    if (!wishlistToDelete) return;

    try {
      await deleteWishlist(wishlistToDelete);
      const updatedWishlists = wishlists.filter(
        (w) => w._id !== wishlistToDelete
      );
      setWishlists(updatedWishlists);
      if (selectedWishlist?._id === wishlistToDelete) {
        setSelectedWishlist(
          updatedWishlists.length > 0 ? updatedWishlists[0] : null
        );
      }
    } catch (err) {
      setError("Failed to delete wishlist");
      console.error(err);
    } finally {
      setWishlistToDelete(null);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to view your saved lists.
          </p>
          <Link
            to="/login"
            className="inline-block bg-[#0a5ad6] text-white px-6 py-2 rounded-md hover:bg-[#0950b5]"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a5ad6] mx-auto mb-4"></div>
          <p>Loading your saved lists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      <main className="mx-auto max-w-[1128px] px-4 pt-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[#3b3f46]">Select list:</span>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="h-8 rounded-[6px] border border-[#b9d2f5] bg-white px-2.5 text-[12px] font-medium text-[#0a5ad6] outline-none focus:ring-2 focus:ring-[#b9d2f5] flex items-center gap-1 min-w-[120px]"
              >
                <span className="truncate">
                  {selectedWishlist?.name || "Select a list"}
                </span>
                <ChevronDown className="w-3 h-3 flex-shrink-0" />
              </button>

              {showDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-[#b9d2f5] rounded-[6px] shadow-lg z-10">
                  <div className="max-h-60 overflow-y-auto">
                    {wishlists.map((wishlist) => (
                      <div
                        key={wishlist._id}
                        className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                          selectedWishlist?._id === wishlist._id
                            ? "bg-blue-50"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedWishlist(wishlist);
                          setShowDropdown(false);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[#0a5ad6] truncate">
                              {wishlist.name}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              {wishlist.hotelIds.length} saved{" "}
                              {wishlist.hotelIds.length === 1
                                ? "property"
                                : "properties"}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditWishlist(wishlist);
                              }}
                              className="p-1 hover:bg-gray-200 rounded"
                              title="Edit wishlist"
                            >
                              <Edit2 className="w-3 h-3 text-gray-600" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteWishlist(wishlist._id);
                              }}
                              className="p-1 hover:bg-red-100 rounded"
                              title="Delete wishlist"
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {selectedWishlist && (
              <Link
                to="/share"
                className="rounded-[6px] bg-[#0a5ad6] px-3 py-2 text-[12px] font-medium text-white hover:bg-[#0950b5] inline-flex items-center"
              >
                <Share2 className="w-3 h-3 inline mr-1" />
                Share the list
              </Link>
            )}
            {!showCreateForm && !editingWishlist ? (
              <button
                onClick={() => setShowCreateForm(true)}
                className="rounded-[6px] bg-[#0a5ad6] px-3 py-2 text-[12px] font-medium text-white hover:bg-[#0950b5]"
              >
                <Plus className="w-3 h-3 inline mr-1" />
                Create a list
              </button>
            ) : showCreateForm ? (
              <form onSubmit={handleCreateWishlist} className="flex gap-2">
                <input
                  type="text"
                  value={newWishlistName}
                  onChange={(e) => setNewWishlistName(e.target.value)}
                  placeholder="List name"
                  className="h-8 rounded-[6px] border border-[#b9d2f5] px-2.5 text-[12px] outline-none focus:ring-2 focus:ring-[#b9d2f5]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="rounded-[6px] bg-green-600 px-3 py-2 text-[12px] font-medium text-white hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewWishlistName("");
                  }}
                  className="rounded-[6px] bg-gray-500 px-3 py-2 text-[12px] font-medium text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              </form>
            ) : editingWishlist ? (
              <form onSubmit={handleUpdateWishlist} className="flex gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="List name"
                  className="h-8 rounded-[6px] border border-[#b9d2f5] px-2.5 text-[12px] outline-none focus:ring-2 focus:ring-[#b9d2f5]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="rounded-[6px] bg-green-600 px-3 py-2 text-[12px] font-medium text-white hover:bg-green-700"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingWishlist(null);
                    setEditName("");
                  }}
                  className="rounded-[6px] bg-gray-500 px-3 py-2 text-[12px] font-medium text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              </form>
            ) : null}
          </div>

          <button className="rounded-[6px] border border-[#b9d2f5] bg-white px-3 py-2 text-[12px] font-medium text-[#0a5ad6] hover:bg-[#f0f6ff]">
            <MapPin className="w-3 h-3 inline mr-1" />
            Show on map
          </button>
        </div>

        {error && (
          <div className="mb-5 w-[520px] max-w-full rounded-[10px] border border-[#f3c2c0] bg-[#fdeeee] px-3 py-2 text-center text-[12px] text-[#8b1f1b]">
            {error}
          </div>
        )}

        {selectedWishlist ? (
          <>
            <h1 className="mb-1 text-[28px] font-bold text-[#1a1a1a]">
              {selectedWishlist.name}
            </h1>
            <h2 className="mb-3 text-[18px] font-semibold">Stays</h2>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <TagPlain>
                <span className="text-[#d23b3b]">♥</span>
                {selectedWishlist.hotelIds.length} saved{" "}
                {selectedWishlist.hotelIds.length === 1
                  ? "property"
                  : "properties"}
              </TagPlain>
              <BluePill>
                <Calendar className="w-3 h-3 inline mr-1" />
                Created{" "}
                {new Date(selectedWishlist.createdAt).toLocaleDateString()}
              </BluePill>
            </div>

            <div className="mb-8">
              {selectedWishlist.hotelIds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedWishlist.hotelIds.map((hotel: any) => (
                    <HotelCard
                      key={hotel._id}
                      hotel={hotel}
                      wishlistId={selectedWishlist._id}
                      onRemove={() =>
                        handleRemoveHotel(selectedWishlist._id, hotel._id)
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No saved properties yet
                  </h3>
                  <p className="text-gray-500">
                    Start exploring and save your favorite hotels!
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-600 mb-2">
              No wishlists yet
            </h1>
            <p className="text-gray-500 mb-6">
              Create your first wishlist to start saving hotels!
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-block bg-[#0a5ad6] text-white px-6 py-2 rounded-md hover:bg-[#0950b5]"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Create your first list
            </button>
          </div>
        )}
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

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setWishlistToDelete(null);
        }}
        onConfirm={confirmDeleteWishlist}
        title="Delete wishlist"
        description="Are you sure you want to delete this wishlist? This action cannot be undone and all saved hotels will be removed from this list."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}

/* card */
interface HotelCardProps {
  hotel: any;
  wishlistId: string;
  onRemove: () => void;
}

function HotelCard({ hotel, wishlistId, onRemove }: HotelCardProps) {
  const [liked, setLiked] = useState(true); // Always liked since it's in wishlist

  const handleRemove = () => {
    onRemove();
  };

  const getHotelImage = (hotel: any) => {
    if (hotel.images && hotel.images.length > 0) {
      return hotel.images[0].url || hotel.images[0];
    }
    return "https://cf.bstatic.com/xdata/images/hotel/square600/597783002.webp?k=3545efe5865606bf107ad177c20591c2048174246717d7b2f2476168143488d1&o=";
  };

  const getHotelRating = (hotel: any) => {
    return hotel.averageRating || hotel.rating || 8.1;
  };

  const getHotelStars = (hotel: any) => {
    // Use stars if available, otherwise convert rating to stars
    if (hotel.stars) return hotel.stars;
    const rating = getHotelRating(hotel);
    return Math.round(rating / 2); // Convert 10-point scale to 5-star scale
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

        {/* Heart button to remove from wishlist */}
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
