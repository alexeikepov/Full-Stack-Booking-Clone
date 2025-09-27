import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { type ChatItemProps } from "./types";
import { getOtherParticipant, formatTime, getMessageIcon } from "./utils";

export default function ChatItem({
  chat,
  isSelected,
  currentUserId,
  onSelect,
}: ChatItemProps) {
  const otherParticipant = getOtherParticipant(chat, currentUserId);

  if (!otherParticipant) return null;

  return (
    <div
      className={`p-3 hover:bg-gray-50 cursor-pointer border-l-2 ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-transparent"
      }`}
      onClick={() => onSelect(chat)}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback>
            {otherParticipant.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium truncate">
              {otherParticipant.name}
            </p>
            {chat.lastMessageAt && (
              <p className="text-xs text-gray-500">
                {formatTime(chat.lastMessageAt)}
              </p>
            )}
          </div>
          {chat.lastMessage && (
            <div className="flex items-center gap-1">
              <span className="text-xs">
                {getMessageIcon(chat.lastMessage.type)}
              </span>
              <p className="text-xs text-gray-600 truncate">
                {chat.lastMessage.content}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
