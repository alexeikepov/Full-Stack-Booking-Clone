import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { HotelCard } from "./HotelCard";
import type { Hotel } from "@/types/owner";

interface HotelManagementSectionProps {
  hotels: Hotel[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (hotel: Hotel) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (hotelId: string, status: string) => void;
}

export function HotelManagementSection({
  hotels,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  onUpdateStatus,
}: HotelManagementSectionProps) {
  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hotel Management</CardTitle>
          <CardDescription>View, edit and delete hotels</CardDescription>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by hotel name or location..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onEdit={onEdit}
                onDelete={onDelete}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
