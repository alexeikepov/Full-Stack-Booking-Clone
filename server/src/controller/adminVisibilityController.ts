import { Request, Response, NextFunction } from "express";
import { HotelModel } from "../models/Hotel";
import { AuthedRequest } from "../middlewares/auth";
import { isOwnerOrAdmin } from "../middlewares/adminAuth";

export async function updateHotelVisibility(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!isOwnerOrAdmin(req.user?.role))
      return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const { isVisible } = req.body as { isVisible: boolean };
    const updated = await HotelModel.findOneAndUpdate(
      {
        _id: id,
        $or: [{ ownerId: req.user!.id }, { adminIds: req.user!.id }],
      },
      { isVisible: !!isVisible },
      { new: true }
    ).lean();
    if (!updated) return res.status(404).json({ error: "Hotel not found" });
    res.json({ id: String(updated._id), isVisible: updated.isVisible });
  } catch (err) {
    next(err);
  }
}
