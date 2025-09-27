import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Heart, Plus, Share2, MapPin, Calendar } from "lucide-react";
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
} from "@/lib/api";
import {
  HotelCard,
  WishlistDropdown,
  WishlistForm,
  BluePill,
  TagPlain,
} from "@/components/savedLists";

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
            <div ref={dropdownRef}>
              <WishlistDropdown
                wishlists={wishlists}
                selectedWishlist={selectedWishlist}
                onSelectWishlist={setSelectedWishlist}
                onEditWishlist={handleEditWishlist}
                onDeleteWishlist={handleDeleteWishlist}
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
              />
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
            <WishlistForm
              showCreateForm={showCreateForm}
              newWishlistName={newWishlistName}
              setNewWishlistName={setNewWishlistName}
              setShowCreateForm={setShowCreateForm}
              onCreateWishlist={handleCreateWishlist}
              editingWishlist={editingWishlist}
              editName={editName}
              setEditName={setEditName}
              setEditingWishlist={setEditingWishlist}
              onUpdateWishlist={handleUpdateWishlist}
            />
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
