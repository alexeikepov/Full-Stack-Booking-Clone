import { Request, Response, NextFunction } from "express";
import { HotelModel } from "../../models/Hotel";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function listCategories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { city } = req.query as Record<string, string | undefined>;
    const filter: any = {};
    if (city)
      filter.city = { $regex: `^${escapeRegExp(city)}$`, $options: "i" };

    const categories = await HotelModel.aggregate<{
      _id: string;
      count: number;
    }>([
      { $match: filter },
      { $unwind: "$categories" },
      { $group: { _id: "$categories", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const stars = await HotelModel.aggregate<{ _id: number; count: number }>([
      { $match: filter },
      { $group: { _id: "$stars", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      categories: categories.map((c) => ({
        id: c._id,
        label: c._id,
        count: c.count,
      })),
      stars: stars
        .filter((s) => s._id != null)
        .map((s) => ({
          id: String(s._id),
          label: `${s._id} stars`,
          count: s.count,
        })),
    });
  } catch (err) {
    next(err);
  }
}

