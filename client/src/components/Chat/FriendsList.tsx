import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import { type FriendsListProps } from "./types";

export default function FriendsList({
  friends,
  onFriendSelect,
}: FriendsListProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Start New Chat</h3>
      <div className="space-y-2">
        {friends.slice(0, 3).map((friend) => (
          <div
            key={friend._id}
            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
            onClick={() => onFriendSelect(friend)}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {friend.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{friend.name}</p>
              <p className="text-xs text-gray-500 truncate">{friend.email}</p>
            </div>
            <Button size="sm" variant="outline">
              <MessageCircle className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
