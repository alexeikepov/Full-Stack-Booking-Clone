import { Router } from "express";
import { requireAuth, AuthedRequest } from "../middlewares/auth";
import { UserModel } from "../models/User";
import { ReservationModel } from "../models/Reservation";
import { getMyReviews } from "../controller/hotel";

const router = Router();

// GET /api/me
router.get("/me", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const me = await UserModel.findById(req.user!.id).lean();
    if (!me) return res.status(404).json({ error: "User not found" });

    // Compute Genius level based on completed reservations in last 24 months
    const since = new Date();
    since.setMonth(since.getMonth() - 24);
    const completedCount = await ReservationModel.countDocuments({
      user: req.user!.id,
      status: "COMPLETED",
      checkOut: { $gte: since },
    });

    let level = 1; // Level 1 – account only
    if (completedCount >= 15) level = 3; // Level 3 – 15 in 24 months
    else if (completedCount >= 5) level = 2; // Level 2 – 5 in 24 months

    const nextThreshold = level === 1 ? 5 : level === 2 ? 15 : null;
    const remaining = nextThreshold
      ? Math.max(0, nextThreshold - completedCount)
      : 0;

    res.json({
      id: me._id,
      name: me.name,
      email: me.email,
      phone: me.phone,
      role: me.role,
      ownerApplicationStatus: me.ownerApplicationStatus || "none",
      genius: {
        level,
        completedLast24Months: completedCount,
        nextThreshold,
        remaining,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/me/reviews  → all my reviews (paginated)
router.get("/reviews", requireAuth, getMyReviews);

export default router;
