import {
  type Chat,
  type Message,
  type Friend,
  type SendMessageData,
} from "@/lib/api";

export interface ChatProps {
  chats: Chat[];
  friends: Friend[];
  selectedChat: Chat | null;
  messages: Message[];
  newMessage: string;
  loading: boolean;
  unreadCount: number;
  currentUserId?: string;
  onChatSelect: (chat: Chat) => void;
  onFriendSelect: (friend: Friend) => void;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export interface ChatSidebarProps {
  chats: Chat[];
  friends: Friend[];
  selectedChat: Chat | null;
  unreadCount: number;
  currentUserId?: string;
  onChatSelect: (chat: Chat) => void;
  onFriendSelect: (friend: Friend) => void;
}

export interface ChatHeaderProps {
  selectedChat: Chat | null;
  currentUserId?: string;
}

export interface MessagesListProps {
  messages: Message[];
  currentUserId?: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export interface MessageInputProps {
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export interface FriendsListProps {
  friends: Friend[];
  onFriendSelect: (friend: Friend) => void;
}

export interface MessageItemProps {
  message: Message;
  currentUserId?: string;
}

export interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  currentUserId?: string;
  onSelect: (chat: Chat) => void;
}

export { type Chat, type Message, type Friend, type SendMessageData };
