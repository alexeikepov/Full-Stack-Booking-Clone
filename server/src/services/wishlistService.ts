import mongoose from "mongoose";
import { WishlistModel } from "../models/Wishlist";
import { HotelModel } from "../models/Hotel";
import type {
  CreateWishlistRequest,
  UpdateWishlistRequest,
  WishlistWithHotels,
  PublicWishlistResponse,
  HotelInWishlistResponse,
} from "../types/wishlist.types";

export class WishlistService {
  static async createWishlist(
    userId: string,
    data: CreateWishlistRequest
  ): Promise<WishlistWithHotels> {
    const wishlist = new WishlistModel({
      userId,
      name: data.name || "My Wishlist",
      description: data.description,
      isPublic: data.isPublic || false,
      hotelIds: [],
    });

    await wishlist.save();
    await wishlist.populate("hotelIds", "name location media rating");

    return wishlist.toObject() as WishlistWithHotels;
  }

  static async getUserWishlists(userId: string): Promise<WishlistWithHotels[]> {
    const wishlists = await WishlistModel.find({ userId })
      .populate("hotelIds", "name location media rating")
      .sort({ updatedAt: -1 })
      .lean();

    return wishlists as WishlistWithHotels[];
  }

  static async getWishlistById(
    wishlistId: string,
    userId: string
  ): Promise<WishlistWithHotels | null> {
    const wishlist = await WishlistModel.findOne({
      _id: wishlistId,
      userId,
    })
      .populate({
        path: "hotelIds",
        select: "name location media rating price city",
      })
      .lean();

    return wishlist as WishlistWithHotels | null;
  }

  static async updateWishlist(
    wishlistId: string,
    userId: string,
    data: UpdateWishlistRequest
  ): Promise<WishlistWithHotels | null> {
    const wishlist = await WishlistModel.findOneAndUpdate(
      { _id: wishlistId, userId },
      data,
      { new: true, runValidators: true }
    );

    if (!wishlist) {
      return null;
    }

    await wishlist.populate("hotelIds", "name location media rating");
    return wishlist.toObject() as WishlistWithHotels;
  }

  static async deleteWishlist(
    wishlistId: string,
    userId: string
  ): Promise<boolean> {
    const result = await WishlistModel.findOneAndDelete({
      _id: wishlistId,
      userId,
    });

    return !!result;
  }

  static async addHotelToWishlist(
    wishlistId: string,
    userId: string,
    hotelId: string
  ): Promise<WishlistWithHotels | null> {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      throw new Error("Invalid hotel ID format");
    }

    if (!mongoose.Types.ObjectId.isValid(wishlistId)) {
      throw new Error("Invalid wishlist ID format");
    }

    // Verify hotel exists
    const hotel = await HotelModel.findById(hotelId).lean();
    if (!hotel) {
      throw new Error("Hotel not found");
    }

    const wishlist = await WishlistModel.findOne({
      _id: wishlistId,
      userId,
    });

    if (!wishlist) {
      throw new Error("Wishlist not found");
    }

    // Check if hotel is already in the wishlist
    if (wishlist.hotelIds.some((id) => id.toString() === hotelId)) {
      throw new Error("Hotel already in wishlist");
    }

    wishlist.hotelIds.push(hotelId);
    await wishlist.save();
    await wishlist.populate("hotelIds", "name location media rating");

    return wishlist.toObject() as WishlistWithHotels;
  }

  static async removeHotelFromWishlist(
    wishlistId: string,
    userId: string,
    hotelId: string
  ): Promise<WishlistWithHotels | null> {
    const wishlist = await WishlistModel.findOne({
      _id: wishlistId,
      userId,
    });

    if (!wishlist) {
      throw new Error("Wishlist not found");
    }

    wishlist.hotelIds = wishlist.hotelIds.filter(
      (id) => id.toString() !== hotelId
    );
    await wishlist.save();
    await wishlist.populate("hotelIds", "name location media rating");

    return wishlist.toObject() as WishlistWithHotels;
  }

  static async checkHotelInWishlist(
    hotelId: string,
    userId: string
  ): Promise<HotelInWishlistResponse> {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      throw new Error("Invalid hotel ID format");
    }

    // Check if hotel exists
    const hotelExists = await HotelModel.findById(hotelId).lean();
    if (!hotelExists) {
      throw new Error("Hotel not found");
    }

    const wishlists = await WishlistModel.find({
      userId,
      hotelIds: hotelId,
    }).select("_id name");

    return {
      isInWishlist: wishlists.length > 0,
      wishlists: wishlists.map((w) => ({
        _id: w._id,
        name: w.name,
      })),
    };
  }

  static async getPublicWishlist(
    wishlistId: string
  ): Promise<PublicWishlistResponse | null> {
    const wishlist = await WishlistModel.findOne({
      _id: wishlistId,
      isPublic: true,
    })
      .populate("userId", "name")
      .populate({
        path: "hotelIds",
        select: "name location media rating price city",
      })
      .lean();

    return wishlist as PublicWishlistResponse | null;
  }
}
