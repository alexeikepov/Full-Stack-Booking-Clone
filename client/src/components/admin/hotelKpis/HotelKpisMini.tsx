import { useQuery } from "@tanstack/react-query";
import { getOwnerAnalytics } from "@/lib/api";

interface HotelKpisMiniProps {
  hotelId: string;
  formatCurrency: (n: number) => string;
}

export function HotelKpisMini({ hotelId, formatCurrency }: HotelKpisMiniProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["owner-analytics-mini", hotelId],
    queryFn: () => getOwnerAnalytics({ hotelId }),
    staleTime: 60_000,
  });

  const totalBookings = Number(data?.totalBookings || 0);
  const totalRevenue = Number(data?.totalRevenue || 0);
  const averageOccupancy = Number(data?.averageOccupancy || 0);

  return (
    <>
      <div className="bg-gray-50 p-2 rounded-md">
        <div className="text-[11px] text-gray-500">Bookings</div>
        <div className="text-base font-semibold">
          {isLoading ? "…" : totalBookings}
        </div>
      </div>
      <div className="bg-gray-50 p-2 rounded-md">
        <div className="text-[11px] text-gray-500">Revenue</div>
        <div className="text-base font-semibold">
          {isLoading ? "…" : formatCurrency(totalRevenue)}
        </div>
      </div>
      <div className="bg-gray-50 p-2 rounded-md">
        <div className="text-[11px] text-gray-500">Occupancy</div>
        <div className="text-base font-semibold">
          {isLoading ? "…" : `${averageOccupancy}%`}
        </div>
      </div>
    </>
  );
}
