// src/controller/friendRequest/sendFriendRequest.ts
import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import { UserModel } from "../../models/User";
import { sendFriendRequestSchema } from "../../schemas/friendRequestSchemas";
import {
  createFriendRequest,
  checkExistingFriendRequest,
  checkIfUsersAreFriends,
} from "../../services/friendRequestService";

export async function sendFriendRequest(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const dto = sendFriendRequestSchema.parse(req.body);
    const { receiverId } = dto;
    const senderId = req.user!.id;

    if (senderId === receiverId) {
      return res
        .status(400)
        .json({ error: "Cannot send friend request to yourself" });
    }

    // Check if receiver exists
    const receiver = await UserModel.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if they are already friends
    const areFriends = await checkIfUsersAreFriends(senderId, receiverId);
    if (areFriends) {
      return res.status(400).json({ error: "Already friends" });
    }

    // Check if friend request already exists
    const existingRequest = await checkExistingFriendRequest(
      senderId,
      receiverId
    );
    if (existingRequest) {
      return res.status(400).json({ error: "Friend request already exists" });
    }

    const friendRequest = await createFriendRequest(senderId, receiverId);

    // Populate sender details for response
    await friendRequest.populate("sender", "name email");
    await friendRequest.populate("receiver", "name email");

    res.status(201).json(friendRequest);
  } catch (err) {
    next(err);
  }
}
