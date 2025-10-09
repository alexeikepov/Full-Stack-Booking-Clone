import { createContext, ReactNode, useContext, useState } from "react";

export interface Message {
  id: string;
  type: "property_owner" | "support" | "system";
  senderName: string;
  senderRole: "Property Owner" | "Support" | "System";
  propertyName?: string;
  subject: string;
  message: string;
  timestamp: Date;
  read: boolean;
  bookingId?: string; // Reference to related booking
  propertyId?: string; // Reference to related property
  avatar?: string; // Avatar image URL or placeholder
}

interface MessagesContextType {
  messages: Message[];
  addMessage: (message: Omit<Message, "id" | "timestamp" | "read">) => void;
  markAsRead: (messageId: string) => void;
  markAllAsRead: () => void;
  removeMessage: (messageId: string) => void;
  clearAllMessages: () => void;
  getUnreadCount: () => number;
  getUnreadMessages: () => Message[];
  getMessagesByBooking: (bookingId: string) => Message[];
}

const MessagesContext = createContext<MessagesContextType | undefined>(
  undefined,
);

export const MessagesProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Omit<Message, "id" | "timestamp" | "read">) => {
    const newMessage: Message = {
      ...message,
      id: `message_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      read: false,
    };
    setMessages((prev) => [newMessage, ...prev]);
  };

  const markAsRead = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, read: true } : m)),
    );
  };

  const markAllAsRead = () => {
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
  };

  const removeMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  const clearAllMessages = () => {
    setMessages([]);
  };

  const getUnreadCount = () => {
    return messages.filter((m) => !m.read).length;
  };

  const getUnreadMessages = () => {
    return messages.filter((m) => !m.read);
  };

  const getMessagesByBooking = (bookingId: string) => {
    return messages.filter((m) => m.bookingId === bookingId);
  };

  return (
    <MessagesContext.Provider
      value={{
        messages,
        addMessage,
        markAsRead,
        markAllAsRead,
        removeMessage,
        clearAllMessages,
        getUnreadCount,
        getUnreadMessages,
        getMessagesByBooking,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }
  return context;
};
