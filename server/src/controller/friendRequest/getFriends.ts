// src/controller/friendRequest/getFriends.ts
import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import { getUserWithFriends } from "../../services/friendRequestService";

export async function getFriends(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;

    const user = await getUserWithFriends(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.friends || []);
  } catch (err) {
    next(err);
  }
}
