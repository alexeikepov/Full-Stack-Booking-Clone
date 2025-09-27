import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle } from "lucide-react";
import type { Group } from "@/lib/api";

interface SimpleGroupCardProps {
  group: Group;
  currentUserId?: string;
  onUpdateStatus: (groupId: string, status: string) => void;
}

export default function SimpleGroupCard({
  group,
  currentUserId,
  onUpdateStatus,
}: SimpleGroupCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "bg-yellow-100 text-yellow-800";
      case "booked":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planning":
        return <Clock className="h-4 w-4" />;
      case "booked":
        return <CheckCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "planning":
        return "booked";
      case "booked":
        return "completed";
      default:
        return currentStatus;
    }
  };

  const getNextStatusLabel = (currentStatus: string) => {
    switch (currentStatus) {
      case "planning":
        return "Mark as Booked";
      case "booked":
        return "Mark as Completed";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
            <p className="text-gray-600 mb-4">{group.description}</p>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(group.status)}>
                {getStatusIcon(group.status)}
                <span className="ml-1 capitalize">{group.status}</span>
              </Badge>
              <span className="text-sm text-gray-500">
                {group.members.length} members
              </span>
            </div>
          </div>
          {group.creator._id === currentUserId && (
            <Button
              onClick={() =>
                onUpdateStatus(group._id, getNextStatus(group.status))
              }
            >
              {getNextStatusLabel(group.status)}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
