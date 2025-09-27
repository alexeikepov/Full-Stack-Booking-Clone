import { Router } from "express";
import { AuthedRequest, requireAuth } from "../middlewares/auth";
import { UserModel } from "../models/User";
import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controller/userController";

const router = Router();

function isPlatformOwner(role?: string) {
  // Platform owner is the site owner; reuse OWNER role for platform-level
  return role === "OWNER";
}


// GET /api/users/admin-applications?status=pending|approved|rejected  (preferred)
router.get("/admin-applications", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    if (!isPlatformOwner(req.user?.role)) return res.status(403).json({ error: "Forbidden" });
    const { status } = (req.query || {}) as { status?: string };
    const filter: any = { ownerApplicationStatus: { $in: ["pending", "approved", "rejected"] } };
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.ownerApplicationStatus = status;
    }
    const items = await UserModel.find(filter)
      .select("name email phone ownerApplicationStatus requestedOwner role createdAt")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ items });
  } catch (err) {
    next(err);
  }
});


// PATCH /api/users/:id/admin-approve  { action: "approve" | "reject" } (preferred)
router.patch("/:id/admin-approve", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    if (!isPlatformOwner(req.user?.role)) return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const { action } = req.body as { action: "approve" | "reject" };
    if (!action || !["approve", "reject"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }
    const update: any = {};
    if (action === "approve") {
      update.role = "HOTEL_ADMIN";
      update.ownerApplicationStatus = "approved";
      update.requestedOwner = false;
    } else {
      update.ownerApplicationStatus = "rejected";
      update.requestedOwner = false;
    }
    const user = await UserModel.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ id: String(user._id), role: user.role, ownerApplicationStatus: user.ownerApplicationStatus });
  } catch (err) {
    next(err);
  }
});


// POST /api/users/request-admin  → regular user requests hotel admin (preferred)
router.post("/request-admin", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const me = await UserModel.findByIdAndUpdate(
      req.user!.id,
      { requestedOwner: true, ownerApplicationStatus: "pending" },
      { new: true }
    ).lean();
    if (!me) return res.status(404).json({ error: "User not found" });
    res.json({ ok: true, ownerApplicationStatus: me.ownerApplicationStatus });
  } catch (err) {
    next(err);
  }
});

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected
router.get("/", requireAuth, getUsers);
router.get("/:id", requireAuth, getUserById);
router.put("/:id", requireAuth, updateUser);
router.delete("/:id", requireAuth, deleteUser);

export default router;
