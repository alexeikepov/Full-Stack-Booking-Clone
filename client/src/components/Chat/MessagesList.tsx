import { MessageCircle } from "lucide-react";
import { type MessagesListProps } from "./types";
import MessageItem from "./MessageItem";

export default function MessagesList({
  messages,
  currentUserId,
  messagesEndRef,
}: MessagesListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No messages yet</p>
          <p className="text-sm">Start the conversation!</p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageItem
            key={message._id}
            message={message}
            currentUserId={currentUserId}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
