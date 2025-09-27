import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  getFriends,
  removeFriend,
  searchUsers,
} from "../controller/friendRequest";

const router = Router();

// Send a friend request
router.post("/", requireAuth, sendFriendRequest);

// Get friend requests (sent, received, or all)
router.get("/", requireAuth, getFriendRequests);

// Accept a friend request
router.patch("/:requestId/accept", requireAuth, acceptFriendRequest);

// Reject a friend request
router.patch("/:requestId/reject", requireAuth, rejectFriendRequest);

// Cancel a friend request (sender can cancel)
router.delete("/:requestId", requireAuth, cancelFriendRequest);

// Get friends list
router.get("/friends", requireAuth, getFriends);

// Remove a friend
router.delete("/friends/:friendId", requireAuth, removeFriend);

// Search users
router.get("/search", requireAuth, searchUsers);

export default router;
