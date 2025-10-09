// src/controller/friendRequest/rejectFriendRequest.ts
import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import {
  findFriendRequestById,
  updateFriendRequestStatus,
} from "../../services/friendRequestService";

export async function rejectFriendRequest(
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

    if (friendRequest.receiver.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to reject this request" });
    }

    if (friendRequest.status !== "pending") {
      return res.status(400).json({ error: "Friend request is not pending" });
    }

    await updateFriendRequestStatus(requestId, "rejected");

    // Populate details for response
    await friendRequest.populate("sender", "name email");
    await friendRequest.populate("receiver", "name email");

    res.json(friendRequest);
  } catch (err) {
    next(err);
  }
}
