// src/controller/group/createGroup.ts
import { Response, NextFunction } from "express";
import { AuthedRequest } from "../../middlewares/auth";
import { createGroupSchema } from "../../schemas/groupSchemas";
import {
  createGroup,
  findHotelById,
  findUserById,
  validateDates,
  validateGroupMembers,
} from "../../services/groupService";

export async function createGroupController(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const dto = createGroupSchema.parse(req.body);
    const {
      name,
      description,
      hotelId,
      checkIn,
      checkOut,
      adults,
      children = 0,
      rooms,
      memberIds = [],
    } = dto;
    const creatorId = req.user!.id;

    // Validate hotel exists
    const hotel = await findHotelById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    // Validate dates
    const dateValidation = validateDates(checkIn, checkOut);
    if (!dateValidation.isValid) {
      return res.status(400).json({ error: dateValidation.error });
    }

    // Validate members are friends
    const creator = await findUserById(creatorId);
    if (!creator) {
      return res.status(404).json({ error: "Creator not found" });
    }

    const validMembers = validateGroupMembers(
      (creator.friends || []).map((friend) => friend.toString()),
      memberIds
    );

    const groupData = {
      name,
      description,
      creator: creatorId,
      members: [creatorId, ...validMembers], // Include creator
      hotel: hotelId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      adults,
      children,
      rooms,
      status: "planning",
    };

    const group = await createGroup(groupData);

    // Populate details for response
    await group.populate("creator", "name email");
    await group.populate("members", "name email");
    await group.populate("hotel", "name city images rating price");

    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
}
