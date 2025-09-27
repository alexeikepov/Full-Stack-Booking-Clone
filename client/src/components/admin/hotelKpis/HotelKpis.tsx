import { useQuery } from "@tanstack/react-query";
import { Calendar, DollarSign, TrendingUp } from "lucide-react";
import { getOwnerAnalytics } from "@/lib/api";

interface HotelKpisProps {
  hotelId: string;
}

export function HotelKpis({ hotelId }: HotelKpisProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["owner-analytics", hotelId],
    queryFn: () => getOwnerAnalytics({ hotelId }),
    staleTime: 60_000,
  });

  const currency = (amount: number) =>
    new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      minimumFractionDigits: 0,
    }).format(Number.isFinite(amount) ? amount : 0);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-50 p-3 rounded-lg h-[66px] animate-pulse"
          />
        ))}
      </div>
    );
  }

  const totalBookings = Number(data?.totalBookings || 0);
  const totalRevenue = Number(data?.totalRevenue || 0);
  const averageOccupancy = Number(data?.averageOccupancy || 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          Bookings
        </div>
        <div className="text-lg font-semibold">{totalBookings}</div>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="h-4 w-4" />
          Revenue
        </div>
        <div className="text-lg font-semibold">{currency(totalRevenue)}</div>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="h-4 w-4" />
          Occupancy
        </div>
        <div className="text-lg font-semibold">{averageOccupancy}%</div>
      </div>
    </div>
  );
}
