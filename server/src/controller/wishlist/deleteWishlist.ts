import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import { WishlistService } from "../../services/wishlistService";

export async function deleteWishlist(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const deleted = await WishlistService.deleteWishlist(id, req.user!.id);

    if (!deleted) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
