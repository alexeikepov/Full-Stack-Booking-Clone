import { Request, Response, NextFunction } from 'express';
import { AuthedRequest } from '../middlewares/auth';
import SharedHotelModel from '../models/SharedHotel';
import { UserModel } from '../models/User';
import { HotelModel } from '../models/Hotel';

// Share a hotel with a friend
export async function shareHotel(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { receiverId, hotelId, message } = req.body;
    const senderId = req.user!.id;

    console.log('Share hotel request:', { receiverId, hotelId, message, senderId });

    if (senderId === receiverId) {
      return res.status(400).json({ error: 'Cannot share hotel with yourself' });
    }

    // Check if receiver exists and is a friend
    const receiver = await UserModel.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if they are friends
    const sender = await UserModel.findById(senderId);
    if (!sender?.friends?.some(friend => friend.toString() === receiverId)) {
      return res.status(400).json({ error: 'Can only share with friends' });
    }

    // Check if hotel exists
    const hotel = await HotelModel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Check if already shared recently (within 24 hours)
    const recentShare = await SharedHotelModel.findOne({
      sender: senderId,
      receiver: receiverId,
      hotel: hotelId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (recentShare) {
      return res.status(400).json({ error: 'Hotel already shared recently' });
    }

    const sharedHotel = new SharedHotelModel({
      sender: senderId,
      receiver: receiverId,
      hotel: hotelId,
      message: message || undefined,
      status: 'pending'
    });

    await sharedHotel.save();

    // Populate details for response
    await sharedHotel.populate('sender', 'name email');
    await sharedHotel.populate('receiver', 'name email');
    await sharedHotel.populate('hotel', 'name city images rating');

    res.status(201).json(sharedHotel);
  } catch (err) {
    next(err);
  }
}

// Get shared hotels (received)
export async function getSharedHotels(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const { status = 'all' } = req.query;

    let query: any = { receiver: userId };
    
    if (status !== 'all') {
      query.status = status;
    }

    const sharedHotels = await SharedHotelModel.find(query)
      .populate('sender', 'name email')
      .populate('hotel', 'name city images rating price')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(sharedHotels);
  } catch (err) {
    next(err);
  }
}

// Get hotels I shared
export async function getMySharedHotels(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;

    const sharedHotels = await SharedHotelModel.find({ sender: userId })
      .populate('receiver', 'name email')
      .populate('hotel', 'name city images rating price')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(sharedHotels);
  } catch (err) {
    next(err);
  }
}

// Update shared hotel status
export async function updateSharedHotelStatus(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { sharedHotelId } = req.params;
    const { status } = req.body;
    const userId = req.user!.id;

    const sharedHotel = await SharedHotelModel.findById(sharedHotelId);
    if (!sharedHotel) {
      return res.status(404).json({ error: 'Shared hotel not found' });
    }

    if (sharedHotel.receiver.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this share' });
    }

    if (!['viewed', 'accepted', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    sharedHotel.status = status;
    await sharedHotel.save();

    // Populate details for response
    await sharedHotel.populate('sender', 'name email');
    await sharedHotel.populate('hotel', 'name city images rating price');

    res.json(sharedHotel);
  } catch (err) {
    next(err);
  }
}

// Delete shared hotel
export async function deleteSharedHotel(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { sharedHotelId } = req.params;
    const userId = req.user!.id;

    const sharedHotel = await SharedHotelModel.findById(sharedHotelId);
    if (!sharedHotel) {
      return res.status(404).json({ error: 'Shared hotel not found' });
    }

    if (sharedHotel.sender.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this share' });
    }

    await SharedHotelModel.findByIdAndDelete(sharedHotelId);

    res.json({ message: 'Shared hotel deleted successfully' });
  } catch (err) {
    next(err);
  }
}
