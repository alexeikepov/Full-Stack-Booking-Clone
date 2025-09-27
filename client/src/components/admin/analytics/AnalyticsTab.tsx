import { Card, CardContent } from "@/components/ui/card";
import { AnalyticsOverview } from "./AnalyticsOverview";
import { TopPerformingHotels } from "./TopPerformingHotels";
import type { Hotel, AnalyticsData } from "@/types/admin";

interface AnalyticsTabProps {
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  onHotelSelect: (hotel: Hotel | null) => void;
  analytics: AnalyticsData | null;
  formatCurrency: (amount: number) => string;
}

export function AnalyticsTab({
  hotels,
  selectedHotel,
  onHotelSelect,
  analytics,
  formatCurrency,
}: AnalyticsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Hotel:</span>
          <select
            className="rounded border px-2 py-1 text-sm"
            value={selectedHotel?.id ?? ""}
            onChange={(e) => {
              const id = e.target.value;
              const h = hotels.find((x: Hotel) => String(x.id) === id) || null;
              onHotelSelect(h);
            }}
          >
            <option value="">All hotels</option>
            {hotels.map((h: Hotel) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {!!selectedHotel?.id && !!analytics ? (
        <>
          <AnalyticsOverview analytics={analytics} formatCurrency={formatCurrency} />
          <TopPerformingHotels 
            hotels={analytics.topPerformingHotels} 
            formatCurrency={formatCurrency} 
          />
        </>
      ) : (
        <Card>
          <CardContent className="p-6 text-sm text-gray-600">
            Select a hotel to view analytics.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
