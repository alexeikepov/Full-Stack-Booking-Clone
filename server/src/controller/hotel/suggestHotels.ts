import { Request, Response, NextFunction } from "express";
import { HotelModel } from "../../models/Hotel";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function suggestHotels(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { q } = req.query as Record<string, string | undefined>;
    const filter: any = {};
    if (q) filter.name = { $regex: escapeRegExp(q), $options: "i" };
    const rows = await HotelModel.find(filter)
      .select("_id name city")
      .limit(10)
      .sort({ name: 1 });
    res.json(
      rows.map((r) => ({
        id: r._id,
        name: r.name,
        city: r.city,
      }))
    );
  } catch (err) {
    next(err);
  }
}
