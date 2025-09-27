import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { HotelModel } from "../../models/Hotel";
import { AuthedRequest } from "../../middlewares/auth";

export async function deleteHotel(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "Invalid hotel id" });
    const h = await HotelModel.findById(id);
    if (!h) return res.status(404).json({ error: "Hotel not found" });
    await h.deleteOne();
    res.json({ message: "Hotel deleted" });
  } catch (err) {
    next(err);
  }
}
