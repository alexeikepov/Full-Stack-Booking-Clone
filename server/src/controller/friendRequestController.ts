import { Request, Response, NextFunction } from 'express';
import { AuthedRequest } from '../middlewares/auth';
import FriendRequestModel from '../models/FriendRequest';
import { UserModel } from '../models/User';

// Send a friend request
export async function sendFriendRequest(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { receiverId } = req.body;
    const senderId = req.user!.id;

    if (senderId === receiverId) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    // Check if receiver exists
    const receiver = await UserModel.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if they are already friends
    const sender = await UserModel.findById(senderId);
    if (sender?.friends?.includes(receiverId)) {
      return res.status(400).json({ error: 'Already friends' });
    }

    // Check if friend request already exists
    const existingRequest = await FriendRequestModel.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'Friend request already exists' });
    }

    const friendRequest = new FriendRequestModel({
      sender: senderId,
      receiver: receiverId,
      status: 'pending'
    });

    await friendRequest.save();

    // Populate sender details for response
    await friendRequest.populate('sender', 'name email');
    await friendRequest.populate('receiver', 'name email');

    res.status(201).json(friendRequest);
  } catch (err) {
    next(err);
  }
}

// Get friend requests (sent and received)
export async function getFriendRequests(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const { type = 'all' } = req.query; // 'sent', 'received', or 'all'

    let query: any = {};
    
    if (type === 'sent') {
      query.sender = userId;
    } else if (type === 'received') {
      query.receiver = userId;
    } else {
      query.$or = [
        { sender: userId },
        { receiver: userId }
      ];
    }

    const friendRequests = await FriendRequestModel.find(query)
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 });

    res.json(friendRequests);
  } catch (err) {
    next(err);
  }
}

// Accept a friend request
export async function acceptFriendRequest(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { requestId } = req.params;
    const userId = req.user!.id;

    const friendRequest = await FriendRequestModel.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    if (friendRequest.receiver.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to accept this request' });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ error: 'Friend request is not pending' });
    }

    // Update friend request status
    friendRequest.status = 'accepted';
    await friendRequest.save();

    // Add each other to friends list
    await UserModel.findByIdAndUpdate(
      friendRequest.sender,
      { $addToSet: { friends: friendRequest.receiver } }
    );
    
    await UserModel.findByIdAndUpdate(
      friendRequest.receiver,
      { $addToSet: { friends: friendRequest.sender } }
    );

    // Populate details for response
    await friendRequest.populate('sender', 'name email');
    await friendRequest.populate('receiver', 'name email');

    res.json(friendRequest);
  } catch (err) {
    next(err);
  }
}

// Reject a friend request
export async function rejectFriendRequest(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { requestId } = req.params;
    const userId = req.user!.id;

    const friendRequest = await FriendRequestModel.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    if (friendRequest.receiver.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to reject this request' });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ error: 'Friend request is not pending' });
    }

    friendRequest.status = 'rejected';
    await friendRequest.save();

    // Populate details for response
    await friendRequest.populate('sender', 'name email');
    await friendRequest.populate('receiver', 'name email');

    res.json(friendRequest);
  } catch (err) {
    next(err);
  }
}

// Cancel a friend request (sender can cancel)
export async function cancelFriendRequest(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { requestId } = req.params;
    const userId = req.user!.id;

    const friendRequest = await FriendRequestModel.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    if (friendRequest.sender.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to cancel this request' });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ error: 'Friend request is not pending' });
    }

    await FriendRequestModel.findByIdAndDelete(requestId);

    res.json({ message: 'Friend request cancelled' });
  } catch (err) {
    next(err);
  }
}

// Get friends list
export async function getFriends(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;

    const user = await UserModel.findById(userId)
      .populate('friends', 'name email')
      .lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.friends || []);
  } catch (err) {
    next(err);
  }
}

// Remove a friend
export async function removeFriend(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { friendId } = req.params;
    const userId = req.user!.id;

    // Remove from both users' friends list
    await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } }
    );

    await UserModel.findByIdAndUpdate(
      friendId,
      { $pull: { friends: userId } }
    );

    // Delete any existing friend requests between them
    await FriendRequestModel.deleteMany({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId }
      ]
    });

    res.json({ message: 'Friend removed successfully' });
  } catch (err) {
    next(err);
  }
}

// Search users
export async function searchUsers(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { q } = req.query;
    const userId = req.user!.id;

    console.log('Search request:', { q, userId });

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Search users by name or email, excluding current user
    const users = await UserModel.find({
      _id: { $ne: userId }, // Exclude current user
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    })
    .select('name email role')
    .limit(20)
    .lean();

    console.log('Search results:', users);
    res.json(users);
  } catch (err) {
    console.error('Search error:', err);
    next(err);
  }
}
