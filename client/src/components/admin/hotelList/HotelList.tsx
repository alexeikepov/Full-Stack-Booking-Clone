import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { HotelCard } from "./HotelCard";
import type { Hotel } from "@/types/admin";

interface HotelListProps {
  hotels: Hotel[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddHotel: () => void;
  onEditHotel: (hotel: Hotel) => void;
  onDeleteHotel: (id: string) => void;
  onToggleHotelStatus: (id: string) => void;
  isLoading?: boolean;
  error?: boolean;
  formatCurrency: (amount: number) => string;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function HotelList({
  hotels,
  searchTerm,
  onSearchChange,
  onAddHotel,
  onEditHotel,
  onDeleteHotel,
  onToggleHotelStatus,
  isLoading = false,
  error = false,
  formatCurrency,
  isUpdating = false,
  isDeleting = false,
}: HotelListProps) {
  const filteredHotels = hotels.filter((hotel: Hotel) => {
    const hay = `${hotel.name || ""} ${hotel.city || ""} ${
      hotel.address || ""
    }`.toLowerCase();
    return hay.includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hotels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading hotels</p>
        <p className="text-gray-600 text-sm">Using demo data</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>My Hotels</CardTitle>
            <CardDescription>
              Manage your hotels on the platform
            </CardDescription>
          </div>
          <Button onClick={onAddHotel} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Hotel
          </Button>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredHotels.map((hotel: Hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              formatCurrency={formatCurrency}
              onEdit={onEditHotel}
              onDelete={onDeleteHotel}
              onToggleStatus={onToggleHotelStatus}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
