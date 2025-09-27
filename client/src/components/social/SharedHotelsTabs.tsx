import { Share2, Send, Hotel } from "lucide-react";

interface SharedHotelsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  receivedCount: number;
  sentCount: number;
}

export default function SharedHotelsTabs({
  activeTab,
  onTabChange,
  receivedCount,
  sentCount,
}: SharedHotelsTabsProps) {
  return (
    <div className="grid w-full grid-cols-3 mb-6">
      <button
        onClick={() => onTabChange("received")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          activeTab === "received"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <Share2 className="h-4 w-4" />
        Received ({receivedCount})
      </button>
      <button
        onClick={() => onTabChange("sent")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          activeTab === "sent"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <Send className="h-4 w-4" />
        Sent ({sentCount})
      </button>
      <button
        onClick={() => onTabChange("friends")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          activeTab === "friends"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <Hotel className="h-4 w-4" />
        Share with Friends
      </button>
    </div>
  );
}
