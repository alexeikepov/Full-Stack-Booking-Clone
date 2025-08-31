import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controller/userController";
import { requireAuth } from "../middlewares/auth"

const router = Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected
router.get("/", requireAuth, getUsers);
router.get("/:id", requireAuth, getUserById);
router.put("/:id", requireAuth, updateUser);
router.delete("/:id", requireAuth, deleteUser);

export default router;
