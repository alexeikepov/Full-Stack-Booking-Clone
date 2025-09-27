import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import {
  Hotel,
  MapPin,
  Star,
  Calendar,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
} from "lucide-react";
import type { SharedHotel } from "@/lib/api";

interface SharedHotelCardProps {
  sharedHotel: SharedHotel;
  type: "received" | "sent";
  onStatusUpdate: (sharedHotelId: string, status: string) => void;
  onDelete: (sharedHotelId: string) => void;
}

export default function SharedHotelCard({
  sharedHotel,
  type,
  onStatusUpdate,
  onDelete,
}: SharedHotelCardProps) {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "viewed":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Eye className="h-4 w-4" />;
      case "viewed":
        return <Eye className="h-4 w-4" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "declined":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Avatar>
                <AvatarFallback>
                  {type === "received"
                    ? sharedHotel.sender.name.charAt(0).toUpperCase()
                    : sharedHotel.receiver.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">
                  {type === "received"
                    ? sharedHotel.sender.name
                    : `Shared with ${sharedHotel.receiver.name}`}
                </p>
                <p className="text-sm text-gray-600">
                  {type === "received"
                    ? "shared a hotel with you"
                    : `on ${new Date(
                        sharedHotel.createdAt
                      ).toLocaleDateString()}`}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Hotel className="h-5 w-5 text-blue-600" />
                <Link 
                  to={`/hotel/${sharedHotel.hotel._id || sharedHotel.hotel.id}`}
                  className="font-semibold text-lg text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  {sharedHotel.hotel.name}
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {sharedHotel.hotel.city}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {sharedHotel.hotel.rating}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />${sharedHotel.hotel.price}
                  /night
                </div>
              </div>
              {sharedHotel.message && (
                <p className="mt-2 text-gray-700 italic">
                  "{sharedHotel.message}"
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(sharedHotel.status)}>
                {getStatusIcon(sharedHotel.status)}
                <span className="ml-1 capitalize">{sharedHotel.status}</span>
              </Badge>
              {type === "received" && (
                <span className="text-sm text-gray-500">
                  {new Date(sharedHotel.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {type === "received" && sharedHotel.status === "pending" && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onStatusUpdate(sharedHotel._id, "accepted")}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusUpdate(sharedHotel._id, "declined")}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Decline
              </Button>
            </div>
          )}

          {type === "sent" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(sharedHotel._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
