import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Heart, Check } from "lucide-react";
import {
  getWishlists,
  createWishlist,
  addHotelToWishlist,
  type Wishlist,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface WishlistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  hotelName: string;
  onSuccess?: () => void;
}

export default function WishlistDialog({
  isOpen,
  onClose,
  hotelId,
  hotelName,
  onSuccess,
}: WishlistDialogProps) {
  const { user } = useAuth();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [selectedWishlistId, setSelectedWishlistId] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadWishlists();
    }
  }, [isOpen, user]);

  const loadWishlists = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Loading wishlists...");
      const data = await getWishlists();
      console.log("Loaded wishlists:", data.length);
      setWishlists(data);
      if (data.length > 0) {
        setSelectedWishlistId(data[0]._id);
      }
    } catch (err: any) {
      console.error("Error loading wishlists:", err);
      const errorMessage =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to load wishlists";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWishlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishlistName.trim()) return;

    try {
      setLoading(true);
      setError(null);
      console.log("Creating new wishlist:", newWishlistName.trim());
      const newWishlist = await createWishlist({
        name: newWishlistName.trim(),
        description: "",
        isPublic: false,
      });
      console.log("Successfully created wishlist:", newWishlist._id);
      setWishlists([newWishlist, ...wishlists]);
      setSelectedWishlistId(newWishlist._id);
      setNewWishlistName("");
      setShowCreateForm(false);
    } catch (err: any) {
      console.error("Error creating wishlist:", err);
      const errorMessage =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to create wishlist";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToWishlist = async () => {
    if (!selectedWishlistId) {
      console.error("No wishlist selected");
      return;
    }

    if (!hotelId) {
      console.error("Hotel ID is missing:", hotelId);
      setError("Hotel ID is missing");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Saving hotel to wishlist:", {
        wishlistId: selectedWishlistId,
        hotelId,
      });
      await addHotelToWishlist(selectedWishlistId, hotelId);
      console.log("Successfully saved hotel to wishlist");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Error saving hotel to wishlist:", err);
      const errorMessage =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to save hotel to wishlist";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setShowCreateForm(false);
    setNewWishlistName("");
    onClose();
  };

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              You need to sign in to save hotels to your wishlists.
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Save to wishlist
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose where to save <strong>{hotelName}</strong>
          </p>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {loading && !showCreateForm ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <>
              {!showCreateForm ? (
                <div className="space-y-3">
                  {wishlists.length > 0 ? (
                    <div className="space-y-2">
                      {wishlists.map((wishlist) => (
                        <label
                          key={wishlist._id}
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedWishlistId === wishlist._id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="wishlist"
                            value={wishlist._id}
                            checked={selectedWishlistId === wishlist._id}
                            onChange={(e) =>
                              setSelectedWishlistId(e.target.value)
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              selectedWishlistId === wishlist._id
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedWishlistId === wishlist._id && (
                              <Check className="w-2.5 h-2.5 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {wishlist.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {wishlist.hotelIds.length} saved{" "}
                              {wishlist.hotelIds.length === 1
                                ? "property"
                                : "properties"}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Heart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No wishlists yet</p>
                    </div>
                  )}

                  <Button
                    onClick={() => setShowCreateForm(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create new wishlist
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleCreateWishlist} className="space-y-3">
                  <div>
                    <label
                      htmlFor="wishlistName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Wishlist name
                    </label>
                    <Input
                      id="wishlistName"
                      type="text"
                      value={newWishlistName}
                      onChange={(e) => setNewWishlistName(e.target.value)}
                      placeholder="Enter wishlist name"
                      autoFocus
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={loading || !newWishlistName.trim()}
                      className="flex-1"
                    >
                      {loading ? "Creating..." : "Create"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {!showCreateForm && (
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleSaveToWishlist}
                    disabled={loading || !selectedWishlistId}
                    className="flex-1"
                  >
                    {loading ? "Saving..." : "Save to wishlist"}
                  </Button>
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
