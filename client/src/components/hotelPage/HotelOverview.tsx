import type { Hotel } from "@/types/hotel";
import { Button } from "@/components/ui/button";

interface HotelOverviewProps {
  hotel: Hotel;
}

export default function HotelOverview({ hotel }: HotelOverviewProps) {
  const features = [
    "Free WiFi",
    "Air conditioning",
    "Private bathroom",
    "Flat-screen TV",
    "Kitchenette",
    "Balcony",
    "City view",
    "Non-smoking rooms",
  ];

  const highlights = [
    {
      icon: "📍",
      title: "Excellent location",
      description: "9.9 location score for 2-person trips",
    },
    {
      icon: "🛏️",
      title: "Guests who stayed here loved",
      description:
        '"Wonderful and stylish hotel, big and clean rooms, nice location. We\'ve got complimentary wine bottle for a little waiting time which was really..."',
    },
    {
      icon: "🏆",
      title: "Fabulous",
      description: `${hotel.reviewsCount || 372} reviews`,
    },
  ];

  return (
    <div id="overview" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                Most popular facilities
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <span className="text-green-600 text-lg">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                Property highlights
              </h2>
              <div className="space-y-6">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-4">
                    <span className="text-3xl flex-shrink-0">{highlight.icon}</span>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {highlight.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {hotel.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                  About this property
                </h2>
                <p className="text-gray-700 leading-relaxed text-base">
                  {hotel.description}
                </p>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Couples particularly like the location
              </h2>
              <p className="text-gray-600 text-base">
                They rated it {hotel.averageRating?.toFixed(1) || "9.9"} for a
                two-person trip.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#f0f8ff] rounded-lg p-6 mb-6 border border-[#e6f3ff]">
              <h3 className="font-semibold text-[#003b95] mb-4 text-lg">
                Property highlights
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-[#0071c2] text-lg">📍</span>
                  <span className="text-gray-700">
                    Perfect for a {Math.ceil(Math.random() * 3)}-night stay!
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#0071c2] text-lg">🏆</span>
                  <span className="text-gray-700">
                    Top location: Highly rated by recent guests (
                    {hotel.averageRating?.toFixed(1) || "9.9"})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#0071c2] text-lg">🛌</span>
                  <span className="text-gray-700">
                    Want a great night's sleep? This hotel was highly rated for
                    its very comfy beds.
                  </span>
                </div>
              </div>
            </div>

            <div className="border-2 border-[#0071c2] rounded-lg p-6 bg-white">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-[#0071c2] mb-2">
                  {hotel.priceFrom ? `₪${hotel.priceFrom}` : "₪520"}
                </div>
                <div className="text-gray-600 text-sm">per night</div>
                <div className="text-xs text-gray-500 mt-1">
                  Includes taxes and charges
                </div>
              </div>

              <Button className="w-full bg-[#0071c2] hover:bg-[#005fa3] py-3 text-base font-semibold mb-4">
                Reserve
              </Button>

              <div className="text-xs text-center text-gray-600 space-y-1">
                <div>✓ No payment needed today</div>
                <div>✓ Free cancellation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}