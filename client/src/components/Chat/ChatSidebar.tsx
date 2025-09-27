import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Search, MoreVertical } from "lucide-react";
import { type ChatSidebarProps } from "./types";
import ChatItem from "./ChatItem";
import FriendsList from "./FriendsList";

export default function ChatSidebar({
  chats,
  friends,
  selectedChat,
  unreadCount,
  currentUserId,
  onChatSelect,
  onFriendSelect,
}: ChatSidebarProps) {
  return (
    <div className="w-1/3 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Chats</h2>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {unreadCount > 0 && (
          <Badge className="bg-red-100 text-red-800">
            {unreadCount} unread messages
          </Badge>
        )}
      </div>

      {/* Friends List */}
      <FriendsList friends={friends} onFriendSelect={onFriendSelect} />

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No chats yet</p>
            <p className="text-xs">Start a conversation with a friend</p>
          </div>
        ) : (
          <div className="space-y-1">
            {chats.map((chat) => (
              <ChatItem
                key={chat._id}
                chat={chat}
                isSelected={selectedChat?._id === chat._id}
                currentUserId={currentUserId}
                onSelect={onChatSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
