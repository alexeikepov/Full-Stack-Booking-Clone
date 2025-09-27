import React, { useState, useEffect, useRef } from "react";
import {
  getMyChats,
  getOrCreateChat,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount,
  getFriends,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { type ChatProps } from "./types";
import LoadingState from "./LoadingState";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";
import EmptyChatState from "./EmptyChatState";

export default function Chat() {
  const { user: currentUser } = useAuth();
  const [chats, setChats] = useState<ChatProps["chats"]>([]);
  const [friends, setFriends] = useState<ChatProps["friends"]>([]);
  const [selectedChat, setSelectedChat] =
    useState<ChatProps["selectedChat"]>(null);
  const [messages, setMessages] = useState<ChatProps["messages"]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [chatsList, friendsList, unread] = await Promise.all([
        getMyChats(),
        getFriends(),
        getUnreadCount(),
      ]);
      setChats(chatsList);
      setFriends(friendsList);
      setUnreadCount(unread.unreadCount);
    } catch (error) {
      alert("Failed to load chat data");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedChat) return;

    try {
      const messagesList = await getChatMessages(selectedChat._id);
      setMessages(messagesList);

      // Mark messages as read
      await markMessagesAsRead(selectedChat._id);
      await loadData(); // Refresh unread count
    } catch (error) {
      alert("Failed to load messages");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const messageData = {
        content: newMessage.trim(),
        type: "text" as const,
      };

      const sentMessage = await sendMessage(selectedChat._id, messageData);
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
      await loadData(); // Refresh chats list
    } catch (error) {
      alert("Failed to send message");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startChatWithFriend = async (friend: ChatProps["friends"][0]) => {
    try {
      const chat = await getOrCreateChat(friend._id);
      setSelectedChat(chat);
      await loadData(); // Refresh chats list
    } catch (error) {
      alert("Failed to start chat");
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      <ChatSidebar
        chats={chats}
        friends={friends}
        selectedChat={selectedChat}
        unreadCount={unreadCount}
        currentUserId={currentUser?.id}
        onChatSelect={setSelectedChat}
        onFriendSelect={startChatWithFriend}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <ChatHeader
              selectedChat={selectedChat}
              currentUserId={currentUser?.id}
            />
            <MessagesList
              messages={messages}
              currentUserId={currentUser?.id}
              messagesEndRef={messagesEndRef}
            />
            <MessageInput
              newMessage={newMessage}
              onMessageChange={setNewMessage}
              onSendMessage={handleSendMessage}
              onKeyPress={handleKeyPress}
            />
          </>
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
}
