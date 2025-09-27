import { type Chat } from "./types";

export const getOtherParticipant = (chat: Chat, currentUserId?: string) => {
  return chat.participants.find((p) => p._id !== currentUserId);
};

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffInHours < 168) {
    // 7 days
    return date.toLocaleDateString([], { weekday: "short" });
  } else {
    return date.toLocaleDateString();
  }
};

export const getMessageIcon = (type: string) => {
  const icons = {
    image: "🖼️",
    file: "📄",
    hotel_share: "🏨",
    group_invite: "👥",
    default: null,
  };

  return icons[type as keyof typeof icons] || icons.default;
};

export const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
  ref.current?.scrollIntoView({ behavior: "smooth" });
};
