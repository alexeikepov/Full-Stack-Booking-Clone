import { Link } from "react-router-dom";
import type { Hotel } from "@/types/hotel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{hotel.name}</span>
           <span className="text-sm opacity-70">
            ★ {hotel.rating !== undefined && hotel.rating !== null
              ? hotel.rating.toFixed(1)
              : "New"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="opacity-80">{hotel.city}</div>
          <div className="font-semibold">${hotel.priceFrom} / night</div>
        </div>
        <Link
          to={`/hotel/${hotel.id}`}
          className="mt-3 inline-block text-primary underline"
        >
          View
        </Link>
      </CardContent>
    </Card>
  );
}
