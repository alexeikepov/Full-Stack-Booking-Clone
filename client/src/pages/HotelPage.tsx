import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import SearchTopBar from "@/components/search/HeroSearch";
import HotelHeader from "@/components/hotelPage/header/HotelHeader";
import HotelNavigation from "@/components/hotelPage/navigation/HotelNavigation";
import HotelGallery from "@/components/hotelPage/gallery/HotelGallery";
import HotelOverview from "@/components/hotelPage/overview/HotelOverview";
import HotelInfoPrices from "@/components/hotelPage/info/HotelInfoPrices";
import GuestReviews from "@/components/hotelPage/reviews/GuestReviews";
import HotelFacilities from "@/components/hotelPage/facilities/HotelFacilities";
import HouseRules from "@/components/hotelPage/rules/HouseRules";
import FinePrint from "@/components/hotelPage/rules/FinePrint";
import FullscreenMapModal from "@/components/hotelPage/gallery/FullscreenMapModal";
import Footer from "@/components/Footer";
import { useNavigationStore } from "@/stores/navigation";
import { useSearchStore } from "@/stores/search";

export default function HotelPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState("overview");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const { setActiveTab } = useNavigationStore();
  const { picker, setSearchParams } = useSearchStore();

  // Set active tab to 'stays' when hotel page loads
  useEffect(() => {
    setActiveTab("stays");
  }, [setActiveTab]);

  // Reset scroll to top when hotel page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Update search store from URL parameters
  useEffect(() => {
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  const { data: hotel, isLoading } = useQuery({
    queryKey: ["hotel", id, searchParams.toString()],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Use URL parameters if available, otherwise fall back to picker
      const from =
        searchParams.get("from") ||
        (picker.mode === "calendar" && picker.range?.from
          ? picker.range.from.toISOString().split("T")[0]
          : null);
      const to =
        searchParams.get("to") ||
        (picker.mode === "calendar" && picker.range?.to
          ? picker.range.to.toISOString().split("T")[0]
          : null);
      const adults = searchParams.get("adults");
      const children = searchParams.get("children");
      const rooms = searchParams.get("rooms");

      if (from) params.append("from", from);
      if (to) params.append("to", to);
      if (adults) params.append("adults", adults);
      if (children) params.append("children", children);
      if (rooms) params.append("rooms", rooms);

      const response = await api.get(`/api/hotels/${id}?${params.toString()}`);
      const data = response.data;

      // Convert MongoDB _id to id for frontend compatibility
      if (data && data._id && !data.id) {
        data.id = data._id;
      }

      // Convert room _id to id for frontend compatibility
      if (data && data.rooms) {
        data.rooms = data.rooms.map((room: any) => ({
          ...room,
          id: room._id || room.id,
          _id: room._id || room.id,
        }));
      }

      return data;
    },
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
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

      <HotelHeader hotel={hotel} onShowMap={() => setIsMapModalOpen(true)} />
      <HotelGallery hotel={hotel} />

      <div className="space-y-10">
        <HotelOverview hotel={hotel} />
        <HotelInfoPrices hotel={hotel} isLoading={isLoading} />
        <GuestReviews hotel={hotel} />
        <HotelFacilities hotelId={hotel.id} />
        <HouseRules hotelId={hotel.id} />
        <FinePrint hotelName={hotel.name} />
      </div>

      <Footer />

      {/* Fullscreen Map Modal */}
      <FullscreenMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        hotel={hotel}
      />
    </div>
  );
}
