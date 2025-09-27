import { Plus } from "lucide-react";
import type { WishlistFormProps } from "./types";

export default function WishlistForm({
  showCreateForm,
  newWishlistName,
  setNewWishlistName,
  setShowCreateForm,
  onCreateWishlist,
  editingWishlist,
  editName,
  setEditName,
  setEditingWishlist,
  onUpdateWishlist,
}: WishlistFormProps) {
  if (!showCreateForm && !editingWishlist) {
    return (
      <button
        onClick={() => setShowCreateForm(true)}
        className="rounded-[6px] bg-[#0a5ad6] px-3 py-2 text-[12px] font-medium text-white hover:bg-[#0950b5]"
      >
        <Plus className="w-3 h-3 inline mr-1" />
        Create a list
      </button>
    );
  }

  if (showCreateForm) {
    return (
      <form onSubmit={onCreateWishlist} className="flex gap-2">
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
    );
  }

  if (editingWishlist) {
    return (
      <form onSubmit={onUpdateWishlist} className="flex gap-2">
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
    );
  }

  return null;
}
