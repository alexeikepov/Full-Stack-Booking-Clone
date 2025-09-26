import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import {
  createGroup,
  getMyGroups,
  getGroupById,
  addMemberToGroup,
  removeMemberFromGroup,
  updateGroupStatus,
  deleteGroup,
} from "../controller/groupController";

const router = Router();

// Create a group
router.post("/", requireAuth, createGroup);

// Get my groups
router.get("/", requireAuth, getMyGroups);

// Get group by ID
router.get("/:groupId", requireAuth, getGroupById);

// Add member to group
router.post("/:groupId/members", requireAuth, addMemberToGroup);

// Remove member from group
router.delete("/:groupId/members", requireAuth, removeMemberFromGroup);

// Update group status
router.patch("/:groupId/status", requireAuth, updateGroupStatus);

// Delete group
router.delete("/:groupId", requireAuth, deleteGroup);

export default router;
