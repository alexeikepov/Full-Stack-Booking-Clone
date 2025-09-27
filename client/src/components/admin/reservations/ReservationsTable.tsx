import { Button } from "@/components/ui/button";
import { updateReservationStatus } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import type { Reservation } from "@/types/admin";

interface ReservationsTableProps {
  reservations: Reservation[];
}

export function ReservationsTable({ reservations }: ReservationsTableProps) {
  const queryClient = useQueryClient();

  const handleStatusUpdate = async (reservationId: string, status: string) => {
    try {
      await updateReservationStatus(reservationId, status);
      queryClient.invalidateQueries({
        queryKey: ["owner-reservations"],
      });
    } catch (error) {
      console.error("Failed to update reservation status:", error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-3">Guest</th>
            <th className="py-2 pr-3">Dates</th>
            <th className="py-2 pr-3">Rooms</th>
            <th className="py-2 pr-3">Guests</th>
            <th className="py-2 pr-3">Total</th>
            <th className="py-2 pr-3">Status</th>
            <th className="py-2 pr-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r: Reservation) => (
            <tr key={String(r._id || r.id)} className="border-b">
              <td className="py-2 pr-3">
                {r.guestInfo?.firstName} {r.guestInfo?.lastName}
              </td>
              <td className="py-2 pr-3">
                {new Date(r.checkIn).toLocaleDateString()} –{" "}
                {new Date(r.checkOut).toLocaleDateString()}
              </td>
              <td className="py-2 pr-3">{r.quantity}</td>
              <td className="py-2 pr-3">
                {r.guests?.total ??
                  (r.guests?.adults || 0) + (r.guests?.children || 0)}
              </td>
              <td className="py-2 pr-3">
                ₪{(r.totalPrice || 0).toLocaleString()}
              </td>
              <td className="py-2 pr-3">{r.status}</td>
              <td className="py-2 pr-3">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      handleStatusUpdate(String(r._id || r.id), "CONFIRMED")
                    }
                  >
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() =>
                      handleStatusUpdate(String(r._id || r.id), "COMPLETED")
                    }
                  >
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      handleStatusUpdate(String(r._id || r.id), "CANCELLED")
                    }
                  >
                    Cancel
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
