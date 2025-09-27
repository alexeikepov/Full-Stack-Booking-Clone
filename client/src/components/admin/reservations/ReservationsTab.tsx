import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReservationsTable } from "./ReservationsTable";
import type { Hotel, Reservation } from "@/types/admin";

interface ReservationsTabProps {
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  onHotelSelect: (hotel: Hotel | null) => void;
  reservationStatus: string;
  onStatusChange: (status: string) => void;
  reservations: Reservation[];
}

export function ReservationsTab({
  hotels,
  selectedHotel,
  onHotelSelect,
  reservationStatus,
  onStatusChange,
  reservations,
}: ReservationsTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Reservations</CardTitle>
          <CardDescription>
            View and update reservation status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <select
              className="rounded border px-2 py-1 text-sm"
              value={selectedHotel?.id ?? ""}
              onChange={(e) => {
                const id = e.target.value;
                const h = hotels.find((x: Hotel) => String(x.id) === id) || null;
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
            <select
              className="rounded border px-2 py-1 text-sm"
              value={reservationStatus}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          {!selectedHotel?.id ? (
            <div className="text-sm text-gray-600">
              Select a hotel to view its reservations.
            </div>
          ) : (
            <ReservationsTable reservations={reservations} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
