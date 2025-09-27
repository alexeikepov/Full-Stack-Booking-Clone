// src/controller/group/getMyGroups.ts
import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import { groupQuerySchema } from "../../schemas/groupSchemas";
import { findGroups } from "../../services/groupService";
import { GroupFilter } from "../../types/groupTypes";

export async function getMyGroups(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const dto = groupQuerySchema.parse(req.query);
    const { status } = dto;

    let filter: GroupFilter = { members: userId };

    if (status !== "all") {
      filter.status = status;
    }

    const groups = await findGroups(filter);
    res.json(groups);
  } catch (err) {
    next(err);
  }
}
