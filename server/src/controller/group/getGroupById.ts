// src/controller/group/getGroupById.ts
import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import { findGroupById, isUserGroupMember } from "../../services/groupService";

export async function getGroupById(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { groupId } = req.params;
    const userId = req.user!.id;

    const group = await findGroupById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is a member
    if (!isUserGroupMember(group.members, userId)) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this group" });
    }

    res.json(group);
  } catch (err) {
    next(err);
  }
}
