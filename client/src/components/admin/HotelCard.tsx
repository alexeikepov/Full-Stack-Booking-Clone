import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type { Hotel } from "@/types/owner";

interface HotelCardProps {
  hotel: Hotel;
  onEdit: (hotel: Hotel) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (hotelId: string, status: string) => void;
}

export function HotelCard({
  hotel,
  onEdit,
  onDelete,
  onUpdateStatus,
}: HotelCardProps) {
  return (
    <Card className="border-l-4 border-l-green-500">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{hotel.name}</h3>
            <p className="text-gray-600">{hotel.location}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>⭐ {hotel.rating}</span>
              <span>🏨 {hotel.rooms} rooms</span>
              <span>📅 {hotel.createdAt}</span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <StatusBadge status={hotel.status} />
            <div className="flex items-center gap-2">
              <select
                value={hotel.approvalStatus}
                onChange={(e) => onUpdateStatus(hotel.id, e.target.value)}
                className="h-9 rounded border px-2 text-sm"
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <Button size="sm" variant="outline" onClick={() => onEdit(hotel)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(hotel.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
