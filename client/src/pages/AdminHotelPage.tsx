import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, BarChart3, Star, Calendar } from "lucide-react";
import { EditHotelDialog } from "@/components/EditHotelDialog";
import { useNavigationTabsStore } from "@/stores/navigationTabs";
import AdminHeader from "@/components/admin/AdminHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOwnerHotels,
  getAllHotelsForOwner,
  createHotel,
  updateHotel,
  deleteHotel,
  getOwnerAnalytics,
  getReservations,
  setHotelVisibility,
} from "@/lib/api";
import { HotelList } from "@/components/admin/hotelList";
import { AnalyticsTab } from "@/components/admin/analytics";
import { ReservationsTab } from "@/components/admin/reservations";
import { ReviewsTab } from "@/components/admin/reviews";
import type { Hotel } from "@/types/admin";

const mockOwnerHotels: Hotel[] = [
  {
    id: "1",
    name: "Grand Hotel Moscow",
    address: "Tverskaya Street, 1",
    city: "Moscow",
    country: "Russia",
    status: "active",
    rooms: [],
    averageRating: 4.8,
    reviewsCount: 324,
    createdAt: "2024-01-15",
    lastBooking: "2024-01-20",
    contactInfo: {
      phone: "+7 (495) 123-45-67",
      email: "info@grandhotelmoscow.ru",
    },
  },
  {
    id: "2",
    name: "St. Petersburg Plaza",
    address: "Nevsky Prospect, 28",
    city: "St. Petersburg",
    country: "Russia",
    status: "active",
    rooms: [],
    averageRating: 4.6,
    reviewsCount: 198,
    createdAt: "2024-01-10",
    lastBooking: "2024-01-18",
    contactInfo: {
      phone: "+7 (812) 987-65-43",
      email: "info@stpetersburgplaza.ru",
    },
  },
  {
    id: "3",
    name: "Kazan Center Hotel",
    address: "Bauman Street, 15",
    city: "Kazan",
    country: "Russia",
    status: "inactive",
    rooms: [],
    averageRating: 4.2,
    reviewsCount: 87,
    createdAt: "2024-01-08",
    lastBooking: "2024-01-12",
    contactInfo: {
      phone: "+7 (843) 555-12-34",
      email: "info@kazancenter.ru",
    },
  },
];

export default function AdminHotelPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("hotels");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [reservationStatus, setReservationStatus] = useState<string>("");
  const { setShowTabs } = useNavigationTabsStore();
  const queryClient = useQueryClient();

  const {
    data: hotels = [],
    isLoading: hotelsLoading,
    error: hotelsError,
  } = useQuery({
    queryKey: ["owner-hotels"],
    queryFn: async () => {
      try {
        console.log("Trying to load hotels from API...");

        try {
          const response = await fetch("/api/hotels?limit=1000");
          if (response.ok) {
            const data = await response.json();
            console.log("Loaded hotels from public API:", data);
            return Array.isArray(data) ? data : data.items || [];
          }
        } catch (e) {
          console.log("Public API failed:", e);
        }

        try {
          return await getOwnerHotels();
        } catch (e) {
          console.log("Owner hotels API failed:", e);
        }

        try {
          return await getAllHotelsForOwner();
        } catch (e) {
          console.log("All hotels API failed:", e);
        }

        throw new Error("All API endpoints failed");
      } catch (error) {
        console.log("All APIs failed, using mock data:", error);
        return mockOwnerHotels;
      }
    },
    retry: false,
  });

  const { data: analytics } = useQuery({
    queryKey: ["owner-analytics", selectedHotel?.id],
    queryFn: () =>
      getOwnerAnalytics(
        selectedHotel?.id ? { hotelId: selectedHotel.id } : undefined
      ),
    retry: false,
    enabled: !!selectedHotel?.id,
  });

  const { data: reservations = [] } = useQuery({
    queryKey: ["owner-reservations", selectedHotel?.id, reservationStatus],
    queryFn: () =>
      getReservations({
        hotelId: selectedHotel?.id,
        status: reservationStatus || undefined,
        limit: 200,
        page: 1,
      }),
    enabled: !!selectedHotel?.id,
    retry: false,
  });

  const createHotelMutation = useMutation({
    mutationFn: createHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-hotels"] });
      queryClient.invalidateQueries({ queryKey: ["owner-analytics"] });
      setIsEditDialogOpen(false);
      setSelectedHotel(null);
    },
    onError: (err: any) => {
      console.error("Create hotel failed", err?.response?.data || err);
      alert("Failed to create hotel. Please check required fields.");
    },
  });

  const updateHotelMutation = useMutation({
    mutationFn: ({ hotelId, hotelData }: { hotelId: string; hotelData: any }) =>
      updateHotel(hotelId, hotelData),
    onSuccess: (updated: any, vars) => {
      queryClient.setQueryData(["owner-hotels"], (prev: any) => {
        if (!Array.isArray(prev)) return prev;
        return prev.map((h: any) =>
          String(h.id) === String(vars.hotelId)
            ? {
                ...h,
                name: updated?.name ?? vars.hotelData?.name ?? h.name,
                city: updated?.city ?? h.city,
                address: updated?.address ?? h.address,
                status: updated?.status ?? vars.hotelData?.status ?? h.status,
              }
            : h
        );
      });
      queryClient.invalidateQueries({ queryKey: ["owner-hotels"] });
      queryClient.invalidateQueries({ queryKey: ["owner-analytics"] });
      setIsEditDialogOpen(false);
      setSelectedHotel(null);
    },
    onError: (err: any) => {
      console.error("Update hotel failed", err?.response?.data || err);
      alert("Failed to save changes. Please review fields and try again.");
      queryClient.invalidateQueries({ queryKey: ["owner-hotels"] });
    },
  });

  const deleteHotelMutation = useMutation({
    mutationFn: deleteHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-hotels"] });
      queryClient.invalidateQueries({ queryKey: ["owner-analytics"] });
    },
  });

  useEffect(() => {
    setShowTabs(false);
    return () => {
      setShowTabs(true);
    };
  }, [setShowTabs]);

  useEffect(() => {
    if (
      !isEditDialogOpen &&
      !isAdding &&
      selectedHotel &&
      Array.isArray(hotels)
    ) {
      const stillExists = hotels.some(
        (h: Hotel) => String(h.id) === String(selectedHotel.id)
      );
      if (!stillExists) setSelectedHotel(null);
    }
  }, [hotels, selectedHotel, isEditDialogOpen, isAdding]);

  const handleAddHotel = () => {
    setIsAdding(true);
    setSelectedHotel(null);
    setIsEditDialogOpen(true);
  };

  const handleEditHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setIsEditDialogOpen(true);
  };

  const handleDeleteHotel = (id: string) => {
    deleteHotelMutation.mutate(id);
  };

  const handleToggleHotelStatus = (id: string) => {
    const hotel = hotels.find((h: Hotel) => String(h.id) === String(id));
    if (!hotel) return;
    const currentlyVisible = hotel.isVisible !== false;
    const nextVisible = !currentlyVisible;

    queryClient.setQueryData(["owner-hotels"], (prev: any) => {
      if (!Array.isArray(prev)) return prev;
      return prev.map((h: any) =>
        String(h.id) === String(id)
          ? {
              ...h,
              isVisible: nextVisible,
              status:
                nextVisible && h.approvalStatus === "APPROVED"
                  ? "active"
                  : "inactive",
            }
          : h
      );
    });

    setHotelVisibility(String(id), nextVisible)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["owner-hotels"] });
      })
      .catch(() => {
        alert("Failed to change visibility.");
        queryClient.invalidateQueries({ queryKey: ["owner-hotels"] });
      });
  };

  const handleSaveHotel = (updatedHotel: any) => {
    const id = updatedHotel?.id;
    const sanitizeRooms = (rooms: any[]) =>
      (rooms || []).map((r) => {
        const pricePerNight = Number(r.pricePerNight ?? 0);
        const photos = Array.isArray(r.photos)
          ? r.photos
          : Array.isArray(r.media)
          ? r.media
              .map((m: any) => (typeof m === "string" ? m : m?.url))
              .filter((x: any) => typeof x === "string" && x)
          : [];
        return {
          _id: r._id,
          name: r.name || "",
          roomType: r.roomType || r.type || "STANDARD",
          capacity: Number(r.capacity ?? r.maxAdults ?? 1),
          maxAdults: Number(r.maxAdults ?? 0),
          maxChildren: Number(r.maxChildren ?? 0),
          pricePerNight,
          totalRooms: Number(r.totalRooms ?? r.totalUnits ?? 1),
          sizeSqm: Number(r.sizeSqm ?? 0),
          bedrooms: Number(r.bedrooms ?? 0),
          bathrooms: Number(r.bathrooms ?? 1),
          features: Array.isArray(r.features)
            ? r.features
            : typeof r.features === "string"
            ? r.features
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
            : [],
          photos,
          media: photos,
          pricing: {
            basePrice: pricePerNight,
            currency: "₪",
            includesBreakfast: Boolean(r?.pricing?.includesBreakfast ?? false),
            freeCancellation: Boolean(r?.pricing?.freeCancellation ?? true),
            noPrepayment: Boolean(r?.pricing?.noPrepayment ?? true),
            priceMatch: Boolean(r?.pricing?.priceMatch ?? true),
          },
        };
      });

    const deepClean = (obj: any): any => {
      if (obj == null) return undefined as any;
      if (Array.isArray(obj))
        return obj.map(deepClean).filter((v) => v !== undefined);
      if (typeof obj === "object") {
        const out: any = {};
        Object.entries(obj).forEach(([k, v]) => {
          const cleaned = deepClean(v as any);
          if (k === "facilities" || k.startsWith("facilities")) {
            out[k] = cleaned;
          } else if (
            cleaned !== undefined &&
            !(typeof cleaned === "string" && cleaned.trim() === "") &&
            !(Array.isArray(cleaned) && cleaned.length === 0)
          ) {
            out[k] = cleaned;
          }
        });
        return out;
      }
      return obj;
    };

    const loc = updatedHotel.location || selectedHotel?.location;
    const validLocation =
      loc &&
      typeof loc.lat === "number" &&
      typeof loc.lng === "number" &&
      !Number.isNaN(loc.lat) &&
      !Number.isNaN(loc.lng);

    const baseFacilities = {
      ...(selectedHotel?.facilities || {}),
      ...((updatedHotel.facilities as any) || {}),
      greatForStay: updatedHotel.facilities?.greatForStay || [],
      bathroom: updatedHotel.facilities?.bathroom || [],
      bedroom: updatedHotel.facilities?.bedroom || [],
      view: updatedHotel.facilities?.view || [],
      outdoors: updatedHotel.facilities?.outdoors || [],
      kitchen: updatedHotel.facilities?.kitchen || [],
      roomAmenities: updatedHotel.facilities?.roomAmenities || [],
      livingArea: updatedHotel.facilities?.livingArea || [],
      mediaTechnology: updatedHotel.facilities?.mediaTechnology || [],
      foodDrink: updatedHotel.facilities?.foodDrink || [],
      internet: updatedHotel.facilities?.internet || "",
      parking: updatedHotel.facilities?.parking || "",
      receptionServices: updatedHotel.facilities?.receptionServices || [],
      safetySecurity: updatedHotel.facilities?.safetySecurity || [],
      generalFacilities: updatedHotel.facilities?.generalFacilities || [],
      languagesSpoken: updatedHotel.facilities?.languagesSpoken || [],
    };

    const mergedHouseRules = {
      ...(selectedHotel?.houseRules || {}),
      ...((updatedHotel.houseRules as any) || {}),
    } as any;
    mergedHouseRules.checkIn = {
      ...(selectedHotel?.houseRules?.checkIn || {}),
      ...((updatedHotel.houseRules?.checkIn as any) || {}),
    };
    if (
      !mergedHouseRules.checkIn.time ||
      String(mergedHouseRules.checkIn.time).trim() === ""
    ) {
      mergedHouseRules.checkIn.time = "15:00";
    }
    mergedHouseRules.checkOut = {
      ...(selectedHotel?.houseRules?.checkOut || {}),
      ...((updatedHotel.houseRules?.checkOut as any) || {}),
    };
    if (
      !mergedHouseRules.checkOut.time ||
      String(mergedHouseRules.checkOut.time).trim() === ""
    ) {
      mergedHouseRules.checkOut.time = "11:00";
    }
    if (mergedHouseRules.ageRestriction) {
      if (mergedHouseRules.ageRestriction.minimumAge === "")
        mergedHouseRules.ageRestriction.minimumAge = null;
    }

    const base: any = {
      name: updatedHotel.name,
      address: updatedHotel.address,
      city: updatedHotel.city,
      country: updatedHotel.country,
      stars: Number(updatedHotel.stars ?? 0),
      shortDescription: updatedHotel.shortDescription,
      description: updatedHotel.description,
      facilities: deepClean(baseFacilities),
      propertyHighlights: deepClean(
        updatedHotel.propertyHighlights || selectedHotel?.propertyHighlights
      ),
      houseRules: deepClean(mergedHouseRules),
      surroundings: deepClean(
        updatedHotel.surroundings || selectedHotel?.surroundings
      ),
      overview: deepClean(updatedHotel.overview || selectedHotel?.overview),
      mostPopularFacilities: Array.isArray(updatedHotel.mostPopularFacilities)
        ? updatedHotel.mostPopularFacilities
        : selectedHotel?.mostPopularFacilities || [],
      categories: Array.isArray(updatedHotel.categories)
        ? updatedHotel.categories
        : selectedHotel?.categories || [],
      travellersQuestions: deepClean(
        updatedHotel.travellersQuestions ||
          selectedHotel?.travellersQuestions ||
          []
      ),
      media: Array.isArray(updatedHotel.media)
        ? updatedHotel.media
        : Array.isArray(updatedHotel.images)
        ? updatedHotel.images
        : [],
      status: updatedHotel.status || selectedHotel?.status,
    };

    if (validLocation) base.location = loc;

    const mappedRooms = sanitizeRooms(updatedHotel.rooms || []);
    if (mappedRooms.length > 0) base.rooms = mappedRooms;

    const convertFacilitiesToServerFormat = (facilities: any) => {
      const converted: any = {};

      Object.keys(facilities || {}).forEach((key) => {
        const value = facilities[key];

        if (Array.isArray(value)) {
          converted[key] = value.map((item: any) => {
            if (typeof item === "object" && item.name) {
              let result = item.name;
              if (item.note && item.note.trim()) {
                result += ` (${item.note})`;
              }
              return result;
            }
            return String(item);
          });
        } else if (typeof value === "string") {
          converted[key] = value;
        }
      });

      return converted;
    };

    const dataToSave = {
      ...base,
      facilities: convertFacilitiesToServerFormat(base.facilities),
    };

    if (id) {
      updateHotelMutation.mutate({
        hotelId: String(id),
        hotelData: dataToSave,
      });
    } else {
      createHotelMutation.mutate(dataToSave);
    }
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedHotel(null);
    setIsAdding(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleHotelSelect = (hotel: Hotel | null) => {
    setSelectedHotel(hotel);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hotel Management
            </h1>
            <p className="text-gray-600">
              Manage your hotels and track statistics
            </p>
          </div>
        </div>

        <Tabs className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="hotels"
              className={`flex items-center gap-2 ${
                activeTab === "hotels" ? "bg-white shadow-sm" : ""
              }`}
              onClick={() => setActiveTab("hotels")}
            >
              <Building2 className="h-4 w-4" />
              My Hotels
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className={`flex items-center gap-2 ${
                activeTab === "analytics" ? "bg-white shadow-sm" : ""
              }`}
              onClick={() => setActiveTab("analytics")}
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="reservations"
              className={`flex items-center gap-2 ${
                activeTab === "reservations" ? "bg-white shadow-sm" : ""
              }`}
              onClick={() => setActiveTab("reservations")}
            >
              <Calendar className="h-4 w-4" />
              Reservations
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className={`flex items-center gap-2 ${
                activeTab === "reviews" ? "bg-white shadow-sm" : ""
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              <Star className="h-4 w-4" />
              Reviews
            </TabsTrigger>
          </TabsList>

          {activeTab === "hotels" && (
            <div className="space-y-6">
              <HotelList
                hotels={hotels}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAddHotel={handleAddHotel}
                onEditHotel={handleEditHotel}
                onDeleteHotel={handleDeleteHotel}
                onToggleHotelStatus={handleToggleHotelStatus}
                isLoading={hotelsLoading}
                error={!!hotelsError}
                formatCurrency={formatCurrency}
                isUpdating={updateHotelMutation.isPending}
                isDeleting={deleteHotelMutation.isPending}
              />
            </div>
          )}

          {activeTab === "analytics" && (
            <AnalyticsTab
              hotels={hotels}
              selectedHotel={selectedHotel}
              onHotelSelect={handleHotelSelect}
              analytics={analytics}
              formatCurrency={formatCurrency}
            />
          )}

          {activeTab === "reservations" && (
            <ReservationsTab
              hotels={hotels}
              selectedHotel={selectedHotel}
              onHotelSelect={handleHotelSelect}
              reservationStatus={reservationStatus}
              onStatusChange={setReservationStatus}
              reservations={reservations}
            />
          )}

          {activeTab === "reviews" && (
            <ReviewsTab
              hotels={hotels}
              selectedHotel={selectedHotel}
              onHotelSelect={handleHotelSelect}
            />
          )}
        </Tabs>

        <EditHotelDialog
          isOpen={isEditDialogOpen}
          onClose={handleCloseDialog}
          hotel={selectedHotel}
          onSave={handleSaveHotel}
        />
      </div>
    </div>
  );
}
