import { useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CreateReviewForm from "@/components/hotelPage/reviews/CreateReviewForm";

export default function WriteReviewPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const hotelId = useMemo(() => params.get("hotelId") || "", [params]);

  if (!hotelId) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-2xl font-bold">Write a review</h1>
          <p className="mt-2 text-gray-600">Missing hotelId. Go back to your bookings and try again.</p>
          <div className="mt-4">
            <Link to="/account/bookings" className="text-[#0071c2] hover:underline">Back to bookings</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Write a review</h1>
          <button onClick={() => navigate(-1)} className="text-[#0071c2] hover:underline">Back</button>
        </div>
        <CreateReviewForm hotelId={hotelId} onSuccess={() => navigate("/account/reviews")} />
      </div>
    </div>
  );
}
