import { Request, Response, NextFunction } from "express";
import { HotelModel } from "../../models/Hotel";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function suggestCities(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { q } = req.query as Record<string, string | undefined>;
    const filter: any = {};
    if (q) filter.city = { $regex: escapeRegExp(q), $options: "i" };
    const rows = await HotelModel.aggregate<{ _id: string; count: number }>([
      { $match: filter },
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    res.json(rows.map((r) => ({ city: r._id, count: r.count })));
  } catch (err) {
    next(err);
  }
}
