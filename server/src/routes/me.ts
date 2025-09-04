import { Router } from "express";
import { requireAuth, AuthedRequest } from "../middlewares/auth";
import { UserModel } from "../models/User";
import { getMyReviews } from "../controller/hotelController";

const router = Router();

// GET /api/me
router.get("/", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const me = await UserModel.findById(req.user!.id).lean();
    if (!me) return res.status(404).json({ error: "User not found" });
    res.json({ id: me._id, name: me.name, email: me.email, phone: me.phone, role: me.role });
  } catch (err) {
    next(err);
  }
});

// GET /api/me/reviews  → all my reviews (paginated)
router.get("/reviews", requireAuth, getMyReviews);

export default router;
