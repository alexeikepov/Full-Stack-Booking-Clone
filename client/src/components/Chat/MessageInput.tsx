import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Image as ImageIcon, Smile, Send } from "lucide-react";
import { type MessageInputProps } from "./types";

export default function MessageInput({
  newMessage,
  onMessageChange,
  onSendMessage,
  onKeyPress,
}: MessageInputProps) {
  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline">
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline">
          <Smile className="h-4 w-4" />
        </Button>
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={onKeyPress}
          className="flex-1"
        />
        <Button onClick={onSendMessage} disabled={!newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
