// src/schemas/groupSchemas.ts
import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(100),
  description: z.string().max(500).optional(),
  hotelId: z.string().min(1, "Hotel ID is required"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  adults: z.number().int().min(1, "At least 1 adult is required"),
  children: z.number().int().min(0).optional().default(0),
  rooms: z.number().int().min(1, "At least 1 room is required"),
  memberIds: z.array(z.string()).optional().default([]),
});

export const addMemberSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
});

export const removeMemberSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
});

export const updateGroupStatusSchema = z.object({
  status: z.enum(["planning", "booked", "completed", "cancelled"]),
});

export const groupQuerySchema = z.object({
  status: z
    .enum(["planning", "booked", "completed", "cancelled", "all"])
    .optional()
    .default("all"),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type RemoveMemberInput = z.infer<typeof removeMemberSchema>;
export type UpdateGroupStatusInput = z.infer<typeof updateGroupStatusSchema>;
export type GroupQueryInput = z.infer<typeof groupQuerySchema>;
