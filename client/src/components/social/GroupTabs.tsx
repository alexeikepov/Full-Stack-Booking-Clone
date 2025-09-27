import { Users, Clock, CheckCircle } from "lucide-react";

interface GroupTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  groupsCount: number;
}

export default function GroupTabs({
  activeTab,
  onTabChange,
  groupsCount,
}: GroupTabsProps) {
  return (
    <div className="grid w-full grid-cols-3 mb-6">
      <button
        onClick={() => onTabChange("my-groups")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          activeTab === "my-groups"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <Users className="h-4 w-4" />
        My Groups ({groupsCount})
      </button>
      <button
        onClick={() => onTabChange("planning")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          activeTab === "planning"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <Clock className="h-4 w-4" />
        Planning
      </button>
      <button
        onClick={() => onTabChange("booked")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          activeTab === "booked"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <CheckCircle className="h-4 w-4" />
        Booked
      </button>
    </div>
  );
}
