// src/controller/friendRequest/getFriendRequests.ts
import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import { friendRequestQuerySchema } from "../../schemas/friendRequestSchemas";
import { findFriendRequests } from "../../services/friendRequestService";
import { FriendRequestFilter } from "../../types/friendRequestTypes";

export async function getFriendRequests(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const dto = friendRequestQuerySchema.parse(req.query);
    const { type } = dto;

    let filter: FriendRequestFilter = {};

    if (type === "sent") {
      filter.sender = userId;
    } else if (type === "received") {
      filter.receiver = userId;
    } else {
      filter.$or = [{ sender: userId }, { receiver: userId }];
    }

    const friendRequests = await findFriendRequests(filter);
    res.json(friendRequests);
  } catch (err) {
    next(err);
  }
}
