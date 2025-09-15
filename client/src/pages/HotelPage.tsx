import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import SearchTopBar from "@/components/search/HeroSearch";
import HotelHeader from "@/components/hotelPage/HotelHeader";
import HotelNavigation from "@/components/hotelPage/HotelNavigation";
import HotelGallery from "@/components/hotelPage/HotelGallery";
import HotelOverview from "@/components/hotelPage/HotelOverview";
import HotelInfoPrices from "@/components/hotelPage/HotelInfoPrices";
import RoomSelection from "@/components/hotelPage/RoomSelection";
import { useNavigationStore } from "@/stores/navigation";

export default function HotelPage() {
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState("overview");
  const { setActiveTab } = useNavigationStore();

  // Set active tab to 'stays' when hotel page loads
  useEffect(() => {
    setActiveTab("stays");
  }, [setActiveTab]);

  const { data: hotel, isLoading } = useQuery({
    queryKey: ["hotel", id],
    queryFn: async () => {
      const response = await api.get(`/api/hotels/${id}`);
      const data = response.data;
      // Convert MongoDB _id to id for frontend compatibility
      if (data && data._id && !data.id) {
        data.id = data._id;
      }
      return data;
    },
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Blue background section for spacing like on home page */}
        <section className="w-full bg-[#003b95] text-white">
          <div className="mx-auto max-w-6xl px-2">
            <div className="text-sm">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
          </div>
        </section>

        {/* Search Bar - Overlapping between blue and white */}
        <div className="relative -mt-4 z-10">
          <SearchTopBar />
        </div>

        <div className="animate-pulse">
          <div className="bg-white border-b">
            <div className="mx-auto max-w-6xl px-4 py-4">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-white">
        {/* Blue background section for spacing like on home page */}
        <section className="w-full bg-[#003b95] text-white">
          <div className="mx-auto max-w-6xl px-2">
            <div className="text-sm">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
          </div>
        </section>

        {/* Search Bar - Overlapping between blue and white */}
        <div className="relative -mt-4 z-10">
          <SearchTopBar />
        </div>

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Hotel not found</h1>
            <p className="text-gray-600 mb-4">
              The hotel you're looking for doesn't exist.
            </p>
            <Link to="/search" className="text-[#0071c2] hover:underline">
              Back to search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Blue background section for spacing like on home page */}
      <section className="w-full bg-[#003b95] text-white">
        <div className="mx-auto max-w-6xl px-2">
          <div className="text-3xl font-bold md:text-[1px]">&nbsp;</div>
          <div className="text-2xl mt-2 text-white/90">&nbsp;</div>
        </div>
      </section>

      {/* Search Bar - Overlapping between blue and white */}
      <div className="relative -mt-8 z-10">
        <SearchTopBar />
      </div>

      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-2">
          <nav className="text-sm text-gray-500">
            <Link to="/" className="text-[#0071c2] hover:underline">
              Home
            </Link>
            <span className="mx-2">›</span>
            <Link to="#" className="text-[#0071c2] hover:underline">
              Israel
            </Link>
            <span className="mx-2">›</span>
            <Link to="#" className="text-[#0071c2] hover:underline">
              {hotel.city}
            </Link>
            <span className="mx-2">›</span>
            <span>{hotel.name}</span>
          </nav>
        </div>
      </div>

      <div className="mt-4">
        <HotelNavigation
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
        />
      </div>

      <HotelHeader hotel={hotel} />
      <HotelGallery hotel={hotel} />

      <div className="space-y-8">
        <HotelOverview hotel={hotel} />
        <HotelInfoPrices hotel={hotel} />


        {/* Facilities Section */}
        <div id="facilities" className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <h2 className="text-2xl font-semibold mb-8 text-gray-900">
              Facilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: "📶",
                  name: "Free WiFi",
                  description: "Available in all areas",
                },
                {
                  icon: "❄️",
                  name: "Air conditioning",
                  description: "Available in all rooms",
                },
                {
                  icon: "🚗",
                  name: "Parking",
                  description: "Available on site",
                },
                {
                  icon: "🏊",
                  name: "Swimming pool",
                  description: "Outdoor pool",
                },
                {
                  icon: "🍽️",
                  name: "Restaurant",
                  description: "On-site restaurant",
                },
                {
                  icon: "💼",
                  name: "Business center",
                  description: "Available 24/7",
                },
                {
                  icon: "🏋️",
                  name: "Fitness center",
                  description: "Available 24/7",
                },
                {
                  icon: "🛎️",
                  name: "Room service",
                  description: "Available 24/7",
                },
                {
                  icon: "🚿",
                  name: "Spa & wellness",
                  description: "Full service spa",
                },
              ].map((facility, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <span className="text-3xl">{facility.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {facility.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {facility.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* House Rules Section */}
        <div id="house-rules" className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6">
            <h2 className="text-2xl font-semibold mb-6">House rules</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-3">Check-in</h3>
                <p className="text-sm text-gray-600">From 15:00 to 00:00</p>
                <p className="text-xs text-gray-500 mt-1">
                  Guests are required to show a photo identification and credit
                  card upon check-in
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-3">Check-out</h3>
                <p className="text-sm text-gray-600">From 07:00 to 11:00</p>
              </div>
              <div>
                <h3 className="font-medium mb-3">Cancellation/prepayment</h3>
                <p className="text-sm text-gray-600">
                  Cancellation and prepayment policies vary by rate type. Please
                  check what conditions might apply to each option when making
                  your selection.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Children and beds</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Children of all ages are welcome</li>
                  <li>
                    • Children 18 and above are considered adults at this
                    property
                  </li>
                  <li>
                    • To see correct prices and occupancy info, add the number
                    and ages of children in your group to your search
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Age restriction</h3>
                <p className="text-sm text-gray-600">
                  The minimum age for check-in is 18
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Pets</h3>
                <p className="text-sm text-gray-600">Pets are not allowed.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                Guest reviews
              </h2>
              <div className="flex items-center gap-4">
                <div className="bg-[#003b95] text-white px-4 py-2 rounded font-bold text-lg">
                  {hotel.averageRating?.toFixed(1) || "8.9"}
                </div>
                <div>
                  <div className="font-semibold text-lg text-gray-900">
                    Fabulous
                  </div>
                  <div className="text-sm text-gray-600">
                    {hotel.reviewsCount || 372} reviews
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  name: "Michael",
                  country: "Israel",
                  rating: 9.2,
                  comment:
                    "Wonderful and stylish hotel, big and clean rooms, nice location. We've got complimentary wine bottle for a little waiting time which was really...",
                },
                {
                  name: "Sarah",
                  country: "United States",
                  rating: 8.8,
                  comment:
                    "Great location, very clean and comfortable. The staff was extremely helpful and friendly. Would definitely stay here again!",
                },
                {
                  name: "David",
                  country: "Germany",
                  rating: 9.5,
                  comment:
                    "Exceptional service and beautiful rooms. The breakfast was amazing and the staff went above and beyond to make our stay perfect.",
                },
                {
                  name: "Emma",
                  country: "France",
                  rating: 8.5,
                  comment:
                    "Perfect location in the city center. The room was spacious and clean. Highly recommend this hotel for business travelers.",
                },
              ].map((review, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#0071c2] text-white rounded-full flex items-center justify-center text-lg font-semibold">
                        {review.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {review.name}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <span>🇮🇱</span>
                          <span>{review.country}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#003b95] text-white px-3 py-1 rounded font-bold">
                      {review.rating}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="text-[#0071c2] hover:underline font-medium">
                Show all {hotel.reviewsCount || 372} reviews
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
