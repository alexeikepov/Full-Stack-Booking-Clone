// src/schemas/friendRequestSchemas.ts
import { z } from "zod";

export const sendFriendRequestSchema = z.object({
  receiverId: z.string().min(1, "Receiver ID is required"),
});

export const friendRequestQuerySchema = z.object({
  type: z.enum(["sent", "received", "all"]).optional().default("all"),
});

export const searchUsersQuerySchema = z.object({
  q: z.string().min(1, "Search query is required"),
});

export type SendFriendRequestInput = z.infer<typeof sendFriendRequestSchema>;
export type FriendRequestQueryInput = z.infer<typeof friendRequestQuerySchema>;
export type SearchUsersQueryInput = z.infer<typeof searchUsersQuerySchema>;
