// src/controller/group/removeMemberFromGroup.ts
import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import { removeMemberSchema } from "../../schemas/groupSchemas";
import {
  findGroupByIdWithoutPopulate,
  canRemoveMember,
  removeMemberFromGroup as removeMemberFromGroupService,
  updateGroupMembers,
} from "../../services/groupService";

export async function removeMemberFromGroup(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { groupId } = req.params;
    const dto = removeMemberSchema.parse(req.body);
    const { memberId } = dto;
    const userId = req.user!.id;

    const group = await findGroupByIdWithoutPopulate(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is creator or the member themselves
    if (!canRemoveMember(group.creator, memberId, userId)) {
      return res
        .status(403)
        .json({ error: "Not authorized to remove this member" });
    }

    // Cannot remove creator
    if (group.creator.toString() === memberId) {
      return res
        .status(400)
        .json({ error: "Cannot remove creator from group" });
    }

    const updatedMembers = removeMemberFromGroupService(
      group.members,
      memberId
    );
    const updatedGroup = await updateGroupMembers(groupId, updatedMembers);

    if (!updatedGroup) {
      return res.status(500).json({ error: "Failed to update group" });
    }

    // Populate details for response
    await updatedGroup.populate("creator", "name email");
    await updatedGroup.populate("members", "name email");
    await updatedGroup.populate("hotel", "name city images rating price");

    res.json(updatedGroup);
  } catch (err) {
    next(err);
  }
}
