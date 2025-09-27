// src/controller/friendRequest/removeFriend.ts
import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import {
  removeFriendsFromUsers,
  deleteFriendRequestsBetweenUsers,
} from "../../services/friendRequestService";

export async function removeFriend(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { friendId } = req.params;
    const userId = req.user!.id;

    // Remove from both users' friends list
    await removeFriendsFromUsers(userId, friendId);

    // Delete any existing friend requests between them
    await deleteFriendRequestsBetweenUsers(userId, friendId);

    res.json({ message: "Friend removed successfully" });
  } catch (err) {
    next(err);
  }
}
