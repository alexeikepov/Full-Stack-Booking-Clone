import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import {
  getOrCreateChat,
  getMyChats,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount,
} from "../controller/chatController";

const router = Router();

// Get or create chat with a friend
router.get("/with/:friendId", requireAuth, getOrCreateChat);

// Get my chats
router.get("/", requireAuth, getMyChats);

// Get chat messages
router.get("/:chatId/messages", requireAuth, getChatMessages);

// Send message
router.post("/:chatId/messages", requireAuth, sendMessage);

// Mark messages as read
router.patch("/:chatId/read", requireAuth, markMessagesAsRead);

// Get unread count
router.get("/unread/count", requireAuth, getUnreadCount);

export default router;
