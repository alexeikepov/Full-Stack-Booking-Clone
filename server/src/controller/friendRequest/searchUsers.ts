// src/controller/friendRequest/searchUsers.ts
import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import { searchUsersQuerySchema } from "../../schemas/friendRequestSchemas";
import { searchUsers } from "../../services/friendRequestService";
import { UserSearchFilter } from "../../types/friendRequestTypes";

export async function searchUsersController(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const dto = searchUsersQuerySchema.parse(req.query);
    const { q } = dto;

    console.log("Search request:", { q, userId });

    // Search users by name or email, excluding current user
    const filter: UserSearchFilter = {
      _id: { $ne: userId }, // Exclude current user
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
    };

    const users = await searchUsers(filter);

    console.log("Search results:", users);
    res.json(users);
  } catch (err) {
    console.error("Search error:", err);
    next(err);
  }
}
