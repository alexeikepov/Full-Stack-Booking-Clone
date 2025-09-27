import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import { WishlistService } from "../../services/wishlistService";

export async function checkHotelInWishlist(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { hotelId } = req.params;

    console.log("Checking hotel in wishlist:", {
      hotelId,
      userId: req.user?.id,
    });

    const result = await WishlistService.checkHotelInWishlist(
      hotelId,
      req.user!.id
    );

    console.log("Wishlist check result:", {
      hotelId,
      isInWishlist: result.isInWishlist,
      wishlistsCount: result.wishlists.length,
    });

    res.json(result);
  } catch (err) {
    console.error("Error checking hotel in wishlist:", err);

    if (err instanceof Error) {
      if (err.message === "Invalid hotel ID format") {
        return res.status(400).json({ error: err.message });
      }
      if (err.message === "Hotel not found") {
        return res.status(404).json({ error: err.message });
      }
    }

    next(err);
  }
}
