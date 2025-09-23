import { Request, Response, NextFunction } from "express";
import { AuthedRequest } from "../middlewares/auth";
import { WishlistModel } from "../models/Wishlist";
import { HotelModel } from "../models/Hotel";

// Create a new wishlist
export async function createWishlist(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, description, isPublic = false } = req.body;
    
    const wishlist = new WishlistModel({
      userId: req.user!.id,
      name: name || "My Wishlist",
      description,
      isPublic,
      hotelIds: []
    });

    await wishlist.save();
    await wishlist.populate('hotelIds', 'name location images rating');
    
    res.status(201).json(wishlist);
  } catch (err) {
    next(err);
  }
}

// Get all wishlists for the authenticated user
export async function getUserWishlists(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const wishlists = await WishlistModel.find({ userId: req.user!.id })
      .populate('hotelIds', 'name location images rating')
      .sort({ updatedAt: -1 })
      .lean();

    res.json(wishlists);
  } catch (err) {
    next(err);
  }
}

// Get a specific wishlist by ID
export async function getWishlistById(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    
    const wishlist = await WishlistModel.findOne({
      _id: id,
      userId: req.user!.id
    })
    .populate({
      path: 'hotelIds',
      select: 'name location images rating price city'
    })
    .lean();

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    res.json(wishlist);
  } catch (err) {
    next(err);
  }
}

// Update wishlist details
export async function updateWishlist(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { name, description, isPublic } = req.body;

    const wishlist = await WishlistModel.findOneAndUpdate(
      { _id: id, userId: req.user!.id },
      { name, description, isPublic },
      { new: true, runValidators: true }
    );

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    await wishlist.populate('hotelIds', 'name location images rating');
    res.json(wishlist);
  } catch (err) {
    next(err);
  }
}

// Delete a wishlist
export async function deleteWishlist(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const wishlist = await WishlistModel.findOneAndDelete({
      _id: id,
      userId: req.user!.id
    });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Add hotel to wishlist
export async function addHotelToWishlist(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { hotelId } = req.body;

    // Verify hotel exists
    const hotel = await HotelModel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const wishlist = await WishlistModel.findOne({
      _id: id,
      userId: req.user!.id
    });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    // Check if hotel is already in the wishlist
    if (wishlist.hotelIds.includes(hotelId as any)) {
      return res.status(400).json({ error: "Hotel already in wishlist" });
    }

    wishlist.hotelIds.push(hotelId as any);
    await wishlist.save();
    
    await wishlist.populate('hotelIds', 'name location images rating');
    res.json(wishlist);
  } catch (err) {
    next(err);
  }
}

// Remove hotel from wishlist
export async function removeHotelFromWishlist(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id, hotelId } = req.params;

    const wishlist = await WishlistModel.findOne({
      _id: id,
      userId: req.user!.id
    });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    wishlist.hotelIds = wishlist.hotelIds.filter(
      (id) => id.toString() !== hotelId
    );
    await wishlist.save();
    
    await wishlist.populate('hotelIds', 'name location images rating');
    res.json(wishlist);
  } catch (err) {
    next(err);
  }
}

// Check if hotel is in any wishlist
export async function checkHotelInWishlist(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { hotelId } = req.params;

    const wishlists = await WishlistModel.find({
      userId: req.user!.id,
      hotelIds: hotelId
    }).select('_id name');

    res.json({
      isInWishlist: wishlists.length > 0,
      wishlists
    });
  } catch (err) {
    next(err);
  }
}

// Get public wishlists (for sharing)
export async function getPublicWishlist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const wishlist = await WishlistModel.findOne({
      _id: id,
      isPublic: true
    })
    .populate('userId', 'name')
    .populate({
      path: 'hotelIds',
      select: 'name location images rating price city'
    })
    .lean();

    if (!wishlist) {
      return res.status(404).json({ error: "Public wishlist not found" });
    }

    res.json(wishlist);
  } catch (err) {
    next(err);
  }
}
