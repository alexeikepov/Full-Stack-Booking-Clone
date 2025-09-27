import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import { WishlistService } from "../../services/wishlistService";
import type { AddHotelToWishlistRequest } from "../../types/wishlist.types";

export async function addHotelToWishlist(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { hotelId } = req.body as AddHotelToWishlistRequest;

    console.log("Adding hotel to wishlist:", {
      wishlistId: id,
      hotelId,
      userId: req.user?.id,
    });

    if (!hotelId) {
      return res.status(400).json({ error: "Hotel ID is required" });
    }

    const wishlist = await WishlistService.addHotelToWishlist(
      id,
      req.user!.id,
      hotelId
    );

    console.log("Successfully added hotel to wishlist:", hotelId);
    res.json(wishlist);
  } catch (err) {
    console.error("Error adding hotel to wishlist:", err);

    if (err instanceof Error) {
      if (
        err.message === "Invalid hotel ID format" ||
        err.message === "Invalid wishlist ID format"
      ) {
        return res.status(400).json({ error: err.message });
      }
      if (err.message === "Hotel not found") {
        return res.status(404).json({ error: err.message });
      }
      if (err.message === "Wishlist not found") {
        return res.status(404).json({ error: err.message });
      }
      if (err.message === "Hotel already in wishlist") {
        return res.status(400).json({ error: err.message });
      }
    }

    next(err);
  }
}
