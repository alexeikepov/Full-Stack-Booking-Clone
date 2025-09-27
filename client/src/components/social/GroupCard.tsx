import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  MapPin,
  Star,
  Hotel,
  UserPlus,
  UserMinus,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { Group } from "@/lib/api";

interface GroupCardProps {
  group: Group;
  currentUserId?: string;
  onAddMember: (groupId: string) => void;
  onRemoveMember: (groupId: string, memberId: string) => void;
  onDeleteGroup: (groupId: string) => void;
}

export default function GroupCard({
  group,
  currentUserId,
  onAddMember,
  onRemoveMember,
  onDeleteGroup,
}: GroupCardProps) {
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
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div>
                <h3 className="text-lg font-semibold">{group.name}</h3>
                <p className="text-sm text-gray-600">
                  Created by {group.creator.name} • {group.members.length}{" "}
                  members
                </p>
              </div>
            </div>

            {group.description && (
              <p className="text-gray-700 mb-3">{group.description}</p>
            )}

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Hotel className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-lg">{group.hotel.name}</h4>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {group.hotel.city}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {group.hotel.rating}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(group.checkIn).toLocaleDateString()} -{" "}
                  {new Date(group.checkOut).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {group.adults} adults, {group.children} children, {group.rooms}{" "}
                rooms
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Badge className={getStatusColor(group.status)}>
                {getStatusIcon(group.status)}
                <span className="ml-1 capitalize">{group.status}</span>
              </Badge>
              <span className="text-sm text-gray-500">
                Created {new Date(group.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Members ({group.members.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {group.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{member.name}</span>
                    {group.creator._id === member._id && (
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        Creator
                      </Badge>
                    )}
                    {group.creator._id === currentUserId &&
                      member._id !== currentUserId && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRemoveMember(group._id, member._id)}
                          className="h-6 w-6 p-0"
                        >
                          <UserMinus className="h-3 w-3" />
                        </Button>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {group.creator._id === currentUserId && (
              <>
                <Button size="sm" onClick={() => onAddMember(group._id)}>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Add Member
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDeleteGroup(group._id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
