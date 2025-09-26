import { Request, Response, NextFunction } from 'express';
import { AuthedRequest } from '../middlewares/auth';
import ChatModel from '../models/Chat';
import MessageModel from '../models/Message';
import { UserModel } from '../models/User';

// Get or create chat with a friend
export async function getOrCreateChat(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { friendId } = req.params;
    const userId = req.user!.id;

    if (userId === friendId) {
      return res.status(400).json({ error: 'Cannot chat with yourself' });
    }

    // Check if they are friends
    const user = await UserModel.findById(userId);
    if (!user?.friends?.some(friend => friend.toString() === friendId)) {
      return res.status(400).json({ error: 'Can only chat with friends' });
    }

    // Find existing chat
    let chat = await ChatModel.findOne({
      participants: { $all: [userId, friendId] }
    }).populate('participants', 'name email');

    // Create new chat if doesn't exist
    if (!chat) {
      chat = new ChatModel({
        participants: [userId, friendId]
      });
      await chat.save();
      await chat.populate('participants', 'name email');
    }

    res.json(chat);
  } catch (err) {
    next(err);
  }
}

// Get my chats
export async function getMyChats(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;

    const chats = await ChatModel.find({
      participants: userId
    })
    .populate('participants', 'name email')
    .populate('lastMessage')
    .sort({ lastMessageAt: -1 });

    res.json(chats);
  } catch (err) {
    next(err);
  }
}

// Get chat messages
export async function getChatMessages(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { chatId } = req.params;
    const userId = req.user!.id;
    const { page = 1, limit = 50 } = req.query;

    // Check if user is participant
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (!chat.participants.some(p => p.toString() === userId)) {
      return res.status(403).json({ error: 'Not authorized to view this chat' });
    }

    const messages = await MessageModel.find({ chat: chatId })
      .populate('sender', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json(messages.reverse());
  } catch (err) {
    next(err);
  }
}

// Send message
export async function sendMessage(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { chatId } = req.params;
    const { content, type = 'text', metadata } = req.body;
    const senderId = req.user!.id;

    // Check if chat exists and user is participant
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (!chat.participants.some(p => p.toString() === senderId)) {
      return res.status(403).json({ error: 'Not authorized to send messages to this chat' });
    }

    const message = new MessageModel({
      chat: chatId,
      sender: senderId,
      content,
      type,
      metadata,
      readBy: [senderId] // Sender has read their own message
    });

    await message.save();

    // Update chat's last message
    chat.lastMessage = message._id as any;
    chat.lastMessageAt = new Date();
    await chat.save();

    // Populate sender details
    await message.populate('sender', 'name email');

    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
}

// Mark messages as read
export async function markMessagesAsRead(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { chatId } = req.params;
    const userId = req.user!.id;

    // Check if chat exists and user is participant
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (!chat.participants.some(p => p.toString() === userId)) {
      return res.status(403).json({ error: 'Not authorized to mark messages as read' });
    }

    // Mark all unread messages in this chat as read
    await MessageModel.updateMany(
      { 
        chat: chatId, 
        sender: { $ne: userId },
        readBy: { $ne: userId }
      },
      { $push: { readBy: userId } }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    next(err);
  }
}

// Get unread message count
export async function getUnreadCount(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;

    // Get all chats where user is participant
    const chats = await ChatModel.find({
      participants: userId
    });

    const chatIds = chats.map(chat => chat._id);

    // Count unread messages
    const unreadCount = await MessageModel.countDocuments({
      chat: { $in: chatIds },
      sender: { $ne: userId },
      readBy: { $ne: userId }
    });

    res.json({ unreadCount });
  } catch (err) {
    next(err);
  }
}
