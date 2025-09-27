import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TopPerformingHotel {
  name: string;
  revenue: number;
  bookings: number;
}

interface TopPerformingHotelsProps {
  hotels: TopPerformingHotel[];
  formatCurrency: (amount: number) => string;
}

export function TopPerformingHotels({
  hotels,
  formatCurrency,
}: TopPerformingHotelsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Hotels by Revenue</CardTitle>
        <CardDescription>Ranking of your hotels by performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hotels.map((hotel: TopPerformingHotel, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold">{hotel.name}</h4>
                  <p className="text-sm text-gray-600">
                    {hotel.bookings} bookings
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(hotel.revenue)}</p>
                <p className="text-sm text-gray-600">revenue</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
