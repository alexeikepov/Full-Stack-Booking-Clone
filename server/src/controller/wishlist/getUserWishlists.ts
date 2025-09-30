import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import { WishlistService } from "../../services/wishlistService";

export async function getUserWishlists(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const wishlists = await WishlistService.getUserWishlists(req.user!.id);
    res.json(wishlists);
  } catch (err) {
    next(err);
  }
}
