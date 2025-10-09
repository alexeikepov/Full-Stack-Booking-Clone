// src/controller/friendRequest/cancelFriendRequest.ts
import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import {
  findFriendRequestById,
  deleteFriendRequest,
} from "../../services/friendRequestService";

export async function cancelFriendRequest(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { requestId } = req.params;
    const userId = req.user!.id;

    const friendRequest = await findFriendRequestById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    if (friendRequest.sender.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to cancel this request" });
    }

    if (friendRequest.status !== "pending") {
      return res.status(400).json({ error: "Friend request is not pending" });
    }

    await deleteFriendRequest(requestId);

    res.json({ message: "Friend request cancelled" });
  } catch (err) {
    next(err);
  }
}
