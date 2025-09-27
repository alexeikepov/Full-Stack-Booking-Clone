export interface HotelCardProps {
  hotel: any;
  wishlistId: string;
  onRemove: () => void;
}

export interface WishlistDropdownProps {
  wishlists: any[];
  selectedWishlist: any | null;
  onSelectWishlist: (wishlist: any) => void;
  onEditWishlist: (wishlist: any) => void;
  onDeleteWishlist: (wishlistId: string) => void;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
}

export interface WishlistFormProps {
  showCreateForm: boolean;
  newWishlistName: string;
  setNewWishlistName: (name: string) => void;
  setShowCreateForm: (show: boolean) => void;
  onCreateWishlist: (e: React.FormEvent) => void;
  editingWishlist: any | null;
  editName: string;
  setEditName: (name: string) => void;
  setEditingWishlist: (wishlist: any | null) => void;
  onUpdateWishlist: (e: React.FormEvent) => void;
}

export interface StarsProps {
  count?: number;
}
