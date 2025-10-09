// src/controller/group/deleteGroup.ts
import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import {
  findGroupByIdWithoutPopulate,
  isUserGroupCreator,
  deleteGroupById,
} from "../../services/groupService";

export async function deleteGroup(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { groupId } = req.params;
    const userId = req.user!.id;

    const group = await findGroupByIdWithoutPopulate(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is creator
    if (!isUserGroupCreator(group.creator, userId)) {
      return res.status(403).json({ error: "Only creator can delete group" });
    }

    await deleteGroupById(groupId);

    res.json({ message: "Group deleted successfully" });
  } catch (err) {
    next(err);
  }
}
