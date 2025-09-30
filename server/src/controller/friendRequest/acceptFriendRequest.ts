// src/controller/friendRequest/acceptFriendRequest.ts
import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import {
  findFriendRequestById,
  updateFriendRequestStatus,
  addFriendsToUsers,
} from "../../services/friendRequestService";

export async function acceptFriendRequest(
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
        .json({ error: "Not authorized to accept this request" });
    }

    if (friendRequest.status !== "pending") {
      return res.status(400).json({ error: "Friend request is not pending" });
    }

    // Update friend request status
    await updateFriendRequestStatus(requestId, "accepted");

    // Add each other to friends list
    await addFriendsToUsers(
      friendRequest.sender.toString(),
      friendRequest.receiver.toString()
    );

    // Populate details for response
    await friendRequest.populate("sender", "name email");
    await friendRequest.populate("receiver", "name email");

    res.json(friendRequest);
  } catch (err) {
    next(err);
  }
}
