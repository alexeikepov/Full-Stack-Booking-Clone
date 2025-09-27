import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Video, MoreVertical } from "lucide-react";
import { type ChatHeaderProps } from "./types";
import { getOtherParticipant } from "./utils";

export default function ChatHeader({
  selectedChat,
  currentUserId,
}: ChatHeaderProps) {
  if (!selectedChat) return null;

  const otherParticipant = getOtherParticipant(selectedChat, currentUserId);

  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {otherParticipant?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{otherParticipant?.name}</p>
            <p className="text-sm text-gray-600">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Phone className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Video className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
