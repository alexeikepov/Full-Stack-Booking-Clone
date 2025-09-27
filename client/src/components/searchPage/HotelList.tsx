import type { Hotel } from "@/types/hotel";
import HotelCard from "./HotelCard";
import LoadingSkeleton from "./LoadingSkeleton";
import ErrorPanel from "./ErrorPanel";
import NoResultsPanel from "./NoResultsPanel";

type ViewMode = "list" | "grid";

interface HotelListProps {
  hotels: Hotel[];
  isLoading: boolean;
  error: Error | null;
  view: ViewMode;
  nights: number | null;
  city: string | null;
}

export default function HotelList({
  hotels,
  isLoading,
  error,
  view,
  nights,
  city,
}: HotelListProps) {
  if (error) {
    return <ErrorPanel error={error} />;
  }

  if (isLoading) {
    return <LoadingSkeleton view={view} />;
  }

  if (hotels.length === 0) {
    return <NoResultsPanel city={city} />;
  }

  return (
    <>
      {hotels.map((h) => (
        <HotelCard key={h._id.$oid} hotel={h} nights={nights} variant={view} />
      ))}
    </>
  );
}
