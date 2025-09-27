import { Request, Response, NextFunction } from "express";
import { AuthedRequest } from "../middlewares/auth";
import { WishlistModel } from "../models/Wishlist";
import { HotelModel } from "../models/Hotel";
import mongoose from "mongoose";

// Create a new wishlist
export async function createWishlist(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, description, isPublic = false } = req.body;

    console.log("Creating wishlist:", { name, userId: req.user?.id });

    const wishlist = new WishlistModel({
      userId: req.user!.id,
      name: name || "My Wishlist",
      description,
      isPublic,
      hotelIds: [],
    });

    await wishlist.save();
    await wishlist.populate("hotelIds", "name location media rating");

    console.log("Successfully created wishlist:", wishlist._id);
    res.status(201).json(wishlist);
  } catch (err) {
    console.error("Error creating wishlist:", err);
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
      .populate("hotelIds", "name location media rating")
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
      userId: req.user!.id,
    })
      .populate({
        path: "hotelIds",
        select: "name location media rating price city",
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

    await wishlist.populate("hotelIds", "name location media rating");
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
      userId: req.user!.id,
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

    console.log("Adding hotel to wishlist:", {
      wishlistId: id,
      hotelId,
      userId: req.user?.id,
    });

    if (!hotelId) {
      return res.status(400).json({ error: "Hotel ID is required" });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      console.log("Invalid hotel ID format:", hotelId);
      return res.status(400).json({ error: "Invalid hotel ID format" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid wishlist ID format:", id);
      return res.status(400).json({ error: "Invalid wishlist ID format" });
    }

    // Verify hotel exists (simplified check for now)
    const hotel = await HotelModel.findById(hotelId).lean();
    if (!hotel) {
      console.log("Hotel not found in database:", hotelId);
      return res.status(404).json({ error: "Hotel not found" });
    }

    console.log("Hotel found:", {
      id: hotel._id,
      name: hotel.name,
      approvalStatus: hotel.approvalStatus,
      isVisible: hotel.isVisible,
    });

    const wishlist = await WishlistModel.findOne({
      _id: id,
      userId: req.user!.id,
    });

    if (!wishlist) {
      console.log("Wishlist not found:", {
        wishlistId: id,
        userId: req.user?.id,
      });
      return res.status(404).json({ error: "Wishlist not found" });
    }

    // Check if hotel is already in the wishlist
    if (wishlist.hotelIds.some((id) => id.toString() === hotelId)) {
      console.log("Hotel already in wishlist:", hotelId);
      return res.status(400).json({ error: "Hotel already in wishlist" });
    }

    wishlist.hotelIds.push(hotelId);
    await wishlist.save();

    await wishlist.populate("hotelIds", "name location media rating");
    console.log("Successfully added hotel to wishlist:", hotelId);
    res.json(wishlist);
  } catch (err) {
    console.error("Error adding hotel to wishlist:", err);
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
      userId: req.user!.id,
    });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    wishlist.hotelIds = wishlist.hotelIds.filter(
      (id) => id.toString() !== hotelId
    );
    await wishlist.save();

    await wishlist.populate("hotelIds", "name location media rating");
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

    console.log("Checking hotel in wishlist:", {
      hotelId,
      userId: req.user?.id,
    });

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      console.log("Invalid hotel ID format:", hotelId);
      return res.status(400).json({ error: "Invalid hotel ID format" });
    }

    // Check if hotel exists (simplified check for now)
    const hotelExists = await HotelModel.findById(hotelId).lean();
    if (!hotelExists) {
      console.log("Hotel not found in database:", hotelId);
      return res.status(404).json({ error: "Hotel not found" });
    }

    console.log("Hotel exists:", {
      id: hotelExists._id,
      name: hotelExists.name,
    });

    const wishlists = await WishlistModel.find({
      userId: req.user!.id,
      hotelIds: hotelId,
    }).select("_id name");

    console.log("Wishlist check result:", {
      hotelId,
      isInWishlist: wishlists.length > 0,
      wishlistsCount: wishlists.length,
    });

    res.json({
      isInWishlist: wishlists.length > 0,
      wishlists,
    });
  } catch (err) {
    console.error("Error checking hotel in wishlist:", err);
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
      isPublic: true,
    })
      .populate("userId", "name")
      .populate({
        path: "hotelIds",
        select: "name location media rating price city",
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
