import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import { WishlistService } from "../../services/wishlistService";
import type { CreateWishlistRequest } from "../../types/wishlist.types";

export async function createWishlist(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      name,
      description,
      isPublic = false,
    } = req.body as CreateWishlistRequest;

    console.log("Creating wishlist:", { name, userId: req.user?.id });

    const wishlist = await WishlistService.createWishlist(req.user!.id, {
      name,
      description,
      isPublic,
    });

    console.log("Successfully created wishlist:", wishlist.id);
    res.status(201).json(wishlist);
  } catch (err) {
    console.error("Error creating wishlist:", err);
    next(err);
  }
}
