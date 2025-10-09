import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import { WishlistService } from "../../services/wishlistService";

export async function removeHotelFromWishlist(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id, hotelId } = req.params;

    const wishlist = await WishlistService.removeHotelFromWishlist(
      id,
      req.user!.id,
      hotelId
    );

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    res.json(wishlist);
  } catch (err) {
    if (err instanceof Error && err.message === "Wishlist not found") {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}
