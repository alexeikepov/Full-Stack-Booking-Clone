// src/controller/group/addMemberToGroup.ts
import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import { addMemberSchema } from "../../schemas/groupSchemas";
import {
  findGroupByIdWithoutPopulate,
  findUserById,
  canAddMember,
  isMemberAlreadyInGroup,
  updateGroupMembers,
} from "../../services/groupService";

export async function addMemberToGroup(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { groupId } = req.params;
    const dto = addMemberSchema.parse(req.body);
    const { memberId } = dto;
    const userId = req.user!.id;

    const group = await findGroupByIdWithoutPopulate(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is creator or member
    if (!canAddMember(group.creator, group.members, userId)) {
      return res.status(403).json({ error: "Not authorized to add members" });
    }

    // Check if member is a friend of creator
    const creator = await findUserById(group.creator.toString());
    if (!creator?.friends?.some((friend) => friend.toString() === memberId)) {
      return res.status(400).json({ error: "Can only add friends to group" });
    }

    // Check if member is already in group
    if (isMemberAlreadyInGroup(group.members, memberId)) {
      return res.status(400).json({ error: "Member already in group" });
    }

    const updatedMembers = [
      ...group.members.map((member) => member.toString()),
      memberId,
    ];
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
