import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { type MessageItemProps } from "./types";
import { formatTime, getMessageIcon } from "./utils";

export default function MessageItem({
  message,
  currentUserId,
}: MessageItemProps) {
  const isOwnMessage = message.sender._id === currentUserId;

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex gap-2 max-w-xs lg:max-w-md ${
          isOwnMessage ? "flex-row-reverse" : ""
        }`}
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">
            {message.sender.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div
          className={`rounded-lg px-4 py-2 ${
            isOwnMessage
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-900"
          }`}
        >
          {message.type !== "text" && (
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs">{getMessageIcon(message.type)}</span>
              <span className="text-xs opacity-75">
                {message.type.replace("_", " ")}
              </span>
            </div>
          )}
          <p className="text-sm">{message.content}</p>
          <p
            className={`text-xs mt-1 ${
              isOwnMessage ? "text-blue-100" : "text-gray-500"
            }`}
          >
            {formatTime(message.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
