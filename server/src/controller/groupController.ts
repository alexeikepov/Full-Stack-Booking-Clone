import { Request, Response, NextFunction } from 'express';
import { AuthedRequest } from '../middlewares/auth';
import GroupModel from '../models/Group';
import { UserModel } from '../models/User';
import { HotelModel } from '../models/Hotel';

// Create a group
export async function createGroup(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      name,
      description,
      hotelId,
      checkIn,
      checkOut,
      adults,
      children = 0,
      rooms,
      memberIds = []
    } = req.body;
    const creatorId = req.user!.id;

    // Validate hotel exists
    const hotel = await HotelModel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ error: 'Check-in must be before check-out' });
    }

    if (checkInDate < new Date()) {
      return res.status(400).json({ error: 'Check-in cannot be in the past' });
    }

    // Validate members are friends
    const creator = await UserModel.findById(creatorId);
    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    const validMembers = [];
    for (const memberId of memberIds) {
      if (creator.friends?.includes(memberId)) {
        validMembers.push(memberId);
      }
    }

    const group = new GroupModel({
      name,
      description,
      creator: creatorId,
      members: [creatorId, ...validMembers], // Include creator
      hotel: hotelId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults,
      children,
      rooms,
      status: 'planning'
    });

    await group.save();

    // Populate details for response
    await group.populate('creator', 'name email');
    await group.populate('members', 'name email');
    await group.populate('hotel', 'name city images rating price');

    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
}

// Get my groups
export async function getMyGroups(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const { status = 'all' } = req.query;

    let query: any = { members: userId };
    
    if (status !== 'all') {
      query.status = status;
    }

    const groups = await GroupModel.find(query)
      .populate('creator', 'name email')
      .populate('members', 'name email')
      .populate('hotel', 'name city images rating price')
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (err) {
    next(err);
  }
}

// Get group by ID
export async function getGroupById(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { groupId } = req.params;
    const userId = req.user!.id;

    const group = await GroupModel.findById(groupId)
      .populate('creator', 'name email')
      .populate('members', 'name email')
      .populate('hotel', 'name city images rating price');

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user is a member
    if (!group.members.some(member => member._id.toString() === userId)) {
      return res.status(403).json({ error: 'Not authorized to view this group' });
    }

    res.json(group);
  } catch (err) {
    next(err);
  }
}

// Add member to group
export async function addMemberToGroup(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const userId = req.user!.id;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user is creator or member
    if (group.creator.toString() !== userId && !group.members.some(member => member.toString() === userId)) {
      return res.status(403).json({ error: 'Not authorized to add members' });
    }

    // Check if member is a friend of creator
    const creator = await UserModel.findById(group.creator);
    if (!creator?.friends?.includes(memberId)) {
      return res.status(400).json({ error: 'Can only add friends to group' });
    }

    // Check if member is already in group
    if (group.members.some(member => member.toString() === memberId)) {
      return res.status(400).json({ error: 'Member already in group' });
    }

    group.members.push(memberId);
    await group.save();

    // Populate details for response
    await group.populate('creator', 'name email');
    await group.populate('members', 'name email');
    await group.populate('hotel', 'name city images rating price');

    res.json(group);
  } catch (err) {
    next(err);
  }
}

// Remove member from group
export async function removeMemberFromGroup(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const userId = req.user!.id;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user is creator or the member themselves
    if (group.creator.toString() !== userId && memberId !== userId) {
      return res.status(403).json({ error: 'Not authorized to remove this member' });
    }

    // Cannot remove creator
    if (group.creator.toString() === memberId) {
      return res.status(400).json({ error: 'Cannot remove creator from group' });
    }

    group.members = group.members.filter(id => id.toString() !== memberId);
    await group.save();

    // Populate details for response
    await group.populate('creator', 'name email');
    await group.populate('members', 'name email');
    await group.populate('hotel', 'name city images rating price');

    res.json(group);
  } catch (err) {
    next(err);
  }
}

// Update group status
export async function updateGroupStatus(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { groupId } = req.params;
    const { status } = req.body;
    const userId = req.user!.id;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user is creator
    if (group.creator.toString() !== userId) {
      return res.status(403).json({ error: 'Only creator can update group status' });
    }

    if (!['planning', 'booked', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    group.status = status;
    await group.save();

    // Populate details for response
    await group.populate('creator', 'name email');
    await group.populate('members', 'name email');
    await group.populate('hotel', 'name city images rating price');

    res.json(group);
  } catch (err) {
    next(err);
  }
}

// Delete group
export async function deleteGroup(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { groupId } = req.params;
    const userId = req.user!.id;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user is creator
    if (group.creator.toString() !== userId) {
      return res.status(403).json({ error: 'Only creator can delete group' });
    }

    await GroupModel.findByIdAndDelete(groupId);

    res.json({ message: 'Group deleted successfully' });
  } catch (err) {
    next(err);
  }
}
