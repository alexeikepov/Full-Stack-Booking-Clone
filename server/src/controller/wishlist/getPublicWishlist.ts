import { Request, Response, NextFunction } from "express";
import { WishlistService } from "../../services/wishlistService";

export async function getPublicWishlist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const wishlist = await WishlistService.getPublicWishlist(id);

    if (!wishlist) {
      return res.status(404).json({ error: "Public wishlist not found" });
    }

    res.json(wishlist);
  } catch (err) {
    next(err);
  }
}
