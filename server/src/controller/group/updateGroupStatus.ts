// src/controller/group/updateGroupStatus.ts
import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import { updateGroupStatusSchema } from "../../schemas/groupSchemas";
import {
  findGroupByIdWithoutPopulate,
  isUserGroupCreator,
  isValidGroupStatus,
  updateGroupStatus,
} from "../../services/groupService";

export async function updateGroupStatusController(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { groupId } = req.params;
    const dto = updateGroupStatusSchema.parse(req.body);
    const { status } = dto;
    const userId = req.user!.id;

    const group = await findGroupByIdWithoutPopulate(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is creator
    if (!isUserGroupCreator(group.creator, userId)) {
      return res
        .status(403)
        .json({ error: "Only creator can update group status" });
    }

    if (!isValidGroupStatus(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedGroup = await updateGroupStatus(groupId, status);

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
