import { Fragment } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, MapPin, Star, Phone, Mail } from "lucide-react";
import { HotelKpisMini } from "../hotelKpis";
import type { Hotel } from "@/types/admin";

interface HotelCardProps {
  hotel: Hotel;
  formatCurrency: (amount: number) => string;
  onEdit: (hotel: Hotel) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function HotelCard({
  hotel,
  formatCurrency,
  onEdit,
  onDelete,
  onToggleStatus,
  isUpdating = false,
  isDeleting = false,
}: HotelCardProps) {
  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status === "active" && "Active"}
        {status === "inactive" && "Inactive"}
      </Badge>
    );
  };

  return (
    <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold">{hotel.name}</h3>
              {getStatusBadge(hotel.status)}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="truncate max-w-[360px]">
                  {hotel.address || hotel.city}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{hotel.averageRating ?? 0}</span>
                <span className="text-gray-500">
                  ({hotel.reviewsCount} reviews)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-2 rounded-md">
                <div className="text-[11px] text-gray-500">Rooms</div>
                <div className="text-base font-semibold">
                  {hotel.rooms?.length || 0}
                </div>
              </div>
              <HotelKpisMini
                hotelId={String(hotel.id)}
                formatCurrency={formatCurrency}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span>
                Created:{" "}
                {hotel.createdAt
                  ? new Date(hotel.createdAt).toLocaleString()
                  : "—"}
              </span>
              {hotel.lastBooking && (
                <span>Last booking: {hotel.lastBooking}</span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm">
              {hotel.contactInfo?.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {hotel.contactInfo.phone}
                </div>
              )}
              {hotel.contactInfo?.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {hotel.contactInfo.email}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2 ml-4">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onToggleStatus(String(hotel.id))}
                disabled={isUpdating}
              >
                <Eye className="h-4 w-4 mr-1" />
                {hotel.status === "active" ? "Deactivate" : "Activate"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => onEdit(hotel)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(hotel.id)}
                disabled={isDeleting}
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
