import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import { WishlistService } from "../../services/wishlistService";
import type { UpdateWishlistRequest } from "../../types/wishlist.types";

export async function updateWishlist(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { name, description, isPublic } = req.body as UpdateWishlistRequest;

    const wishlist = await WishlistService.updateWishlist(id, req.user!.id, {
      name,
      description,
      isPublic,
    });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    res.json(wishlist);
  } catch (err) {
    next(err);
  }
}
