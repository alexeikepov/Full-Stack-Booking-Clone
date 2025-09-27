import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminHotelReviewsList } from "../hotelReviews/AdminHotelReviewsList";
import type { Hotel } from "@/types/admin";

interface ReviewsTabProps {
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  onHotelSelect: (hotel: Hotel | null) => void;
}

export function ReviewsTab({
  hotels,
  selectedHotel,
  onHotelSelect,
}: ReviewsTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>View and reply to reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <select
              className="rounded border px-2 py-1 text-sm"
              value={selectedHotel?.id ?? ""}
              onChange={(e) => {
                const id = e.target.value;
                const h =
                  hotels.find((x: Hotel) => String(x.id) === id) || null;
                onHotelSelect(h);
              }}
            >
              <option value="">Select a hotel</option>
              {hotels.map((h: Hotel) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>
          {!selectedHotel?.id ? (
            <div className="text-sm text-gray-600">
              Select a hotel to view its reviews.
            </div>
          ) : (
            <AdminHotelReviewsList hotelId={String(selectedHotel.id)} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
