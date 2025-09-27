import { ChevronDown, Edit2, Trash2 } from "lucide-react";
import type { WishlistDropdownProps } from "./types";

export default function WishlistDropdown({
  wishlists,
  selectedWishlist,
  onSelectWishlist,
  onEditWishlist,
  onDeleteWishlist,
  showDropdown,
  setShowDropdown,
}: WishlistDropdownProps) {
  return (
    <div className="relative">
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
                  selectedWishlist?._id === wishlist._id ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  onSelectWishlist(wishlist);
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
                        onEditWishlist(wishlist);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Edit wishlist"
                    >
                      <Edit2 className="w-3 h-3 text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteWishlist(wishlist._id);
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
  );
}
