import React from "react";
import { MessageCircle } from "lucide-react";

export default function EmptyChatState() {
  return (
    <div className="flex-1 flex items-center justify-center text-gray-500">
      <div className="text-center">
        <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">Select a chat</h3>
        <p className="text-sm">Choose a conversation from the sidebar</p>
      </div>
    </div>
  );
}
