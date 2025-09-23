import { useState, useEffect, Fragment } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Star,
  Calendar,
  DollarSign,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import EditHotelDialog from "@/components/EditHotelDialog";
import AddHotelDialog from "@/components/AddHotelDialog";
import { useNavigationTabsStore } from "@/stores/navigationTabs";
import AdminHeader from "@/components/AdminHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOwnerHotels,
  createHotel,
  updateHotel,
  deleteHotel,
  getOwnerAnalytics,
  getReservations,
  updateReservationStatus,
  getHotelReviews,
  respondToReview,
} from "@/lib/api";

// Mock data for hotel owner's hotels
const mockOwnerHotels = [
  {
    id: 1,
    name: "Grand Hotel Moscow",
    location: "Moscow, Russia",
    address: "Tverskaya Street, 1",
    rating: 4.8,
    rooms: 200,
    status: "active",
    totalBookings: 1250,
    revenue: 45000,
    occupancy: 85,
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
    id: 2,
    name: "St. Petersburg Plaza",
    location: "St. Petersburg, Russia",
    address: "Nevsky Prospect, 28",
    rating: 4.6,
    rooms: 150,
    status: "active",
    totalBookings: 890,
    revenue: 32000,
    occupancy: 72,
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
    id: 3,
    name: "Kazan Center Hotel",
    location: "Kazan, Russia",
    address: "Bauman Street, 15",
    rating: 4.2,
    rooms: 100,
    status: "inactive",
    totalBookings: 456,
    revenue: 18500,
    occupancy: 58,
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

// Mock analytics data
const mockAnalytics = {
  totalRevenue: 95500,
  totalBookings: 2596,
  averageOccupancy: 72,
  totalReviews: 609,
  monthlyRevenue: [32000, 28000, 35500],
  monthlyBookings: [890, 756, 950],
  topPerformingHotels: [
    { name: "Grand Hotel Moscow", revenue: 45000, bookings: 1250 },
    { name: "St. Petersburg Plaza", revenue: 32000, bookings: 890 },
    { name: "Kazan Center Hotel", revenue: 18500, bookings: 456 },
  ],
};

function AdminHotelReviewsList({ hotelId }: { hotelId: string }) {
  const queryClient = useQueryClient();
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["owner-hotel-reviews", hotelId],
    queryFn: () => getHotelReviews(hotelId, { limit: 100 }),
    retry: false,
  });

  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [editingResponseId, setEditingResponseId] = useState<string | null>(null);

  const replyMutation = useMutation({
    mutationFn: ({ reviewId, text }: { reviewId: string; text: string }) =>
      respondToReview(reviewId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-hotel-reviews", hotelId] });
    },
  });

  if (isLoading) {
    return <div className="text-sm text-gray-600">Loading reviews...</div>;
  }

  return (
    <div className="space-y-4">
      {(reviews as any[]).map((rv: any) => {
        const createdAt = rv.createdAt ? new Date(rv.createdAt) : null;
        const stayDate = rv.stayDate ? new Date(rv.stayDate) : null;
        const categories = rv.categoryRatings || {};
        const categoryEntries = Object.entries(categories).filter(([, v]) => typeof v === "number");

        return (
          <Card key={String(rv._id || rv.id)}>
            <CardContent className="p-5 space-y-4">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md bg-blue-600 text-white flex items-center justify-center font-semibold">
                      {Number(rv.rating)?.toFixed?.(1) ?? rv.rating}
                    </div>
                    <Badge variant="secondary">Rating</Badge>
                  </div>
                  <span className="font-medium">
                    {rv.guestName || rv.user?.name || "Guest"}
                    {rv.guestCountry ? ` • ${rv.guestCountry}` : ""}
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex gap-3">
                  {createdAt && <span>Posted {createdAt.toLocaleDateString()}</span>}
                  {stayDate && <span>Stayed {stayDate.toLocaleDateString()}</span>}
                  {rv.roomType && <span>Room: {rv.roomType}</span>}
                  {rv.travelType && <span>Type: {rv.travelType}</span>}
                </div>
              </div>

              {/* Content */}
              {(rv.comment || rv.negative) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rv.comment && (
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium mb-1">Positive</div>
                      <div className="text-sm text-gray-800 whitespace-pre-wrap">{rv.comment}</div>
                    </div>
                  )}
                  {rv.negative && (
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium mb-1">Negative</div>
                      <div className="text-sm text-gray-800 whitespace-pre-wrap">{rv.negative}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Categories */}
              {categoryEntries.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Category ratings</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {categoryEntries.map(([key, val]) => (
                      <div key={key} className="bg-gray-50 rounded p-2 text-center">
                        <div className="text-xs text-gray-500 capitalize">{key}</div>
                        <div className="text-sm font-semibold">{Number(val as number).toFixed(1)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Response */}
            {rv.hotelResponse ? (
              <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium">Hotel response</div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setEditingResponseId(String(rv._id || rv.id));
                      setReplyText((m) => ({ ...m, [String(rv._id || rv.id)]: rv.hotelResponse?.text || "" }));
                    }}
                  >
                    Edit
                  </Button>
                </div>
                {editingResponseId === String(rv._id || rv.id) ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      className="flex-1 rounded border px-2 py-1 text-sm"
                      placeholder="Edit response"
                      value={replyText[String(rv._id || rv.id)] || ""}
                      onChange={(e) =>
                        setReplyText((m) => ({ ...m, [String(rv._id || rv.id)]: e.target.value }))
                      }
                    />
                    <Button
                      size="sm"
                      onClick={() =>
                        replyMutation.mutate({
                          reviewId: String(rv._id || rv.id),
                          text: replyText[String(rv._id || rv.id)] || "",
                        }, {
                          onSuccess: () => setEditingResponseId(null),
                        })
                      }
                      disabled={!replyText[String(rv._id || rv.id)] || replyMutation.isPending}
                    >
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingResponseId(null)}>Cancel</Button>
                  </div>
                ) : (
                  <>
                    <div className="whitespace-pre-wrap">{rv.hotelResponse.text}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {rv.hotelResponse.respondedAt
                        ? new Date(rv.hotelResponse.respondedAt).toLocaleString()
                        : null}
                    </div>
                  </>
                )}
              </div>
            ) : (
                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 rounded border px-2 py-1 text-sm"
                    placeholder="Write a response to this review"
                    value={replyText[String(rv._id || rv.id)] || ""}
                    onChange={(e) =>
                      setReplyText((m) => ({ ...m, [String(rv._id || rv.id)]: e.target.value }))
                    }
                  />
                  <Button
                    size="sm"
                    disabled={!replyText[String(rv._id || rv.id)] || replyMutation.isPending}
                    onClick={() =>
                      replyMutation.mutate({
                        reviewId: String(rv._id || rv.id),
                        text: replyText[String(rv._id || rv.id)],
                      })
                    }
                  >
                  Reply
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function HotelKpis({ hotelId }: { hotelId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["owner-analytics", hotelId],
    queryFn: () => getOwnerAnalytics({ hotelId }),
    staleTime: 60_000,
  });

  const currency = (amount: number) =>
    new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      minimumFractionDigits: 0,
    }).format(Number.isFinite(amount) ? amount : 0);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-50 p-3 rounded-lg h-[66px] animate-pulse" />
        ))}
      </div>
    );
  }

  const totalBookings = Number(data?.totalBookings || 0);
  const totalRevenue = Number(data?.totalRevenue || 0);
  const averageOccupancy = Number(data?.averageOccupancy || 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          Bookings
        </div>
        <div className="text-lg font-semibold">{totalBookings}</div>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="h-4 w-4" />
          Revenue
        </div>
        <div className="text-lg font-semibold">{currency(totalRevenue)}</div>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="h-4 w-4" />
          Occupancy
        </div>
        <div className="text-lg font-semibold">{averageOccupancy}%</div>
      </div>
    </div>
  );
}

export default function AdminHotelPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("hotels");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [reservationStatus, setReservationStatus] = useState<string>("");
  const { setShowTabs } = useNavigationTabsStore();
  const queryClient = useQueryClient();

  // API queries
  const {
    data: hotels = [],
    isLoading: hotelsLoading,
    error: hotelsError,
  } = useQuery({
    queryKey: ["owner-hotels"],
    queryFn: getOwnerHotels,
    // Fallback to mock data if API fails
    retry: false,
  });

  const { data: analytics = mockAnalytics } = useQuery({
    queryKey: ["owner-analytics", selectedHotel?.id],
    queryFn: () => getOwnerAnalytics(selectedHotel?.id ? { hotelId: selectedHotel.id } : undefined),
    retry: false,
    enabled: true,
  });

  // Reservations list for selected hotel
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

  // Mutations
  const createHotelMutation = useMutation({
    mutationFn: createHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-hotels"] });
      queryClient.invalidateQueries({ queryKey: ["owner-analytics"] });
    },
  });

  const updateHotelMutation = useMutation({
    mutationFn: ({ hotelId, hotelData }: { hotelId: string; hotelData: any }) =>
      updateHotel(hotelId, hotelData),
    onSuccess: (updated: any, vars) => {
      // Optimistically update cache
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
    },
    onError: () => {
      // fall back to refetch
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

  // Hide navigation tabs on admin page
  useEffect(() => {
    setShowTabs(false);

    // Restore tabs when component unmounts
    return () => {
      setShowTabs(true);
    };
  }, [setShowTabs]);

  // Preselect first hotel when list loads
  useEffect(() => {
    if (!selectedHotel && Array.isArray(hotels) && hotels.length > 0) {
      setSelectedHotel(hotels[0]);
    }
  }, [hotels, selectedHotel]);

  const handleAddHotel = () => {
    setSelectedHotel(null);
    setIsAddDialogOpen(true);
  };

  const handleEditHotel = (hotel: any) => {
    setSelectedHotel(hotel);
    setIsEditDialogOpen(true);
  };

  const handleDeleteHotel = (id: string) => {
    deleteHotelMutation.mutate(id);
  };

  const handleToggleHotelStatus = (id: string) => {
    const hotel = hotels.find((h: any) => String(h.id) === String(id));
    if (hotel) {
      const newStatus = hotel.status === "active" ? "inactive" : "active";
      updateHotelMutation.mutate({
        hotelId: String(id),
        hotelData: { ...hotel, status: newStatus },
      });
    }
  };

  const handleSaveHotel = (updatedHotel: any) => {
    const id = updatedHotel?.id ?? selectedHotel?.id;
    const sanitizeRooms = (rooms: any[]) =>
      (rooms || []).map((r) => {
        const pricePerNight = Number(r.pricePerNight ?? 0);
        const photos = Array.isArray(r.photos)
          ? r.photos
          : Array.isArray(r.media)
          ? r.media.map((m: any) => (typeof m === "string" ? m : m?.url)).filter((x: any) => typeof x === "string" && x)
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
            ? r.features.split(",").map((s: string) => s.trim()).filter(Boolean)
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

    const loc = updatedHotel.location || selectedHotel?.location;
    const validLocation = loc && typeof loc.lat === "number" && typeof loc.lng === "number" && !Number.isNaN(loc.lat) && !Number.isNaN(loc.lng);

    const base: any = {
      name: updatedHotel.name,
      address: updatedHotel.address,
      city: updatedHotel.city,
      country: updatedHotel.country,
      stars: Number(updatedHotel.stars ?? 0),
      shortDescription: updatedHotel.shortDescription,
      description: updatedHotel.description,
      facilities: updatedHotel.facilities || selectedHotel?.facilities || {},
      propertyHighlights: updatedHotel.propertyHighlights || selectedHotel?.propertyHighlights,
      houseRules: updatedHotel.houseRules || selectedHotel?.houseRules,
      surroundings: updatedHotel.surroundings || selectedHotel?.surroundings,
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

    if (id) {
      updateHotelMutation.mutate({
        hotelId: String(id),
        hotelData: base,
      });
    } else {
      createHotelMutation.mutate(base);
    }
    setIsEditDialogOpen(false);
    setIsAddDialogOpen(false);
    setSelectedHotel(null);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setIsAddDialogOpen(false);
    setSelectedHotel(null);
  };

  const filteredHotels = (hotels as any[]).filter((hotel: any) => {
    const hay = `${hotel.name || ""} ${hotel.city || ""} ${hotel.address || ""}`.toLowerCase();
    return hay.includes(searchTerm.toLowerCase());
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status === "active" && "Active"}
        {status === "inactive" && "Inactive"}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
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
            <TabsTrigger
              value="add-hotel"
              className={`flex items-center gap-2 ${
                activeTab === "add-hotel" ? "bg-white shadow-sm" : ""
              }`}
              onClick={() => setActiveTab("add-hotel")}
            >
              <Plus className="h-4 w-4" />
              Add Hotel
            </TabsTrigger>
          </TabsList>

          {activeTab === "hotels" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>My Hotels</CardTitle>
                      <CardDescription>
                        Manage your hotels on the platform
                      </CardDescription>
                    </div>
                    <Button
                      onClick={handleAddHotel}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Hotel
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search by name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {hotelsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading hotels...</p>
                      </div>
                    </div>
                  ) : hotelsError ? (
                    <div className="text-center py-12">
                      <p className="text-red-600 mb-4">Error loading hotels</p>
                      <p className="text-gray-600 text-sm">Using demo data</p>
                      <div className="space-y-4 mt-6">
                        {mockOwnerHotels.map((hotel) => (
                          <Card
                            key={hotel.id}
                            className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow"
                          >
                            <CardContent className="pt-6">
                              <div className="flex justify-between items-start">
                                <div className="space-y-3 flex-1">
                                  <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-semibold">
                                      {hotel.name}
                                    </h3>
                                    {getStatusBadge(hotel.status)}
                                  </div>

                                  <div className="flex items-center gap-4 text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {hotel.address}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 text-yellow-500" />
                                      {hotel.averageRating} (
                                      {hotel.reviewsCount} отзывов)
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Building2 className="h-4 w-4" />
                                        Rooms
                                      </div>
                                      <div className="text-lg font-semibold">
                                        {hotel.rooms}
                                      </div>
                                    </div>
                                    <Fragment>
                                      <HotelKpis hotelId={String(hotel.id)} />
                                    </Fragment>
                                  </div>

                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>
                                      Created: {hotel.createdAt ? new Date(hotel.createdAt).toLocaleString() : "—"}
                                    </span>
                                    {hotel.lastBooking && (
                                      <span>Last booking: {hotel.lastBooking}</span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-4 text-sm">
                                    {hotel.contactInfo.phone && (
                                      <div className="flex items-center gap-1">
                                        <Phone className="h-4 w-4" />
                                        {hotel.contactInfo.phone}
                                      </div>
                                    )}
                                    {hotel.contactInfo.email && (
                                      <div className="flex items-center gap-1">
                                        <Mail className="h-4 w-4" />
                                        {hotel.contactInfo.email}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-col items-end space-y-2 ml-4">
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleToggleHotelStatus(String(hotel.id))
                                      }
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      {hotel.status === "active"
                                        ? "Deactivate"
                                        : "Activate"}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditHotel(hotel)}
                                    >
                                      <Edit className="h-4 w-4 mr-1" />
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleDeleteHotel(String(hotel.id))}
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredHotels.map((hotel: any) => (
                        <Card
                          key={hotel.id}
                          className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow"
                        >
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                              <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-xl font-semibold">
                                    {hotel.name}
                                  </h3>
                                  {getStatusBadge(hotel.status)}
                                </div>

                                <div className="flex items-center gap-4 text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {hotel.address}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    {hotel.averageRating} ({hotel.reviewsCount}{" "}
                                    reviews)
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <Building2 className="h-4 w-4" />
                                      Rooms
                                    </div>
                                    <div className="text-lg font-semibold">
                                      {hotel.rooms}
                                    </div>
                                  </div>
                                  <Fragment>
                                    <HotelKpis hotelId={String(hotel.id)} />
                                  </Fragment>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>
                                    Created: {hotel.createdAt ? new Date(hotel.createdAt).toLocaleString() : "—"}
                                  </span>
                                  {hotel.lastBooking && (
                                    <span>Last booking: {hotel.lastBooking}</span>
                                  )}
                                </div>

                                <div className="flex items-center gap-4 text-sm">
                                  {hotel.contactInfo?.phone && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="h-4 w-4" />
                                      {hotel.contactInfo.phone}
                                    </div>
                                  )}
                                  {hotel.contactInfo?.email && (
                                    <div className="flex items-center gap-1">
                                      <Mail className="h-4 w-4" />
                                      {hotel.contactInfo.email}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col items-end space-y-2 ml-4">
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleToggleHotelStatus(String(hotel.id))
                                    }
                                    disabled={updateHotelMutation.isPending}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    {hotel.status === "active"
                                      ? "Deactivate"
                                      : "Activate"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditHotel(hotel)}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteHotel(String(hotel.id))}
                                    disabled={deleteHotelMutation.isPending}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Hotel:</span>
                  <select
                    className="rounded border px-2 py-1 text-sm"
                    value={selectedHotel?.id ?? ""}
                    onChange={(e) => {
                      const id = e.target.value;
                      const h = hotels.find((x: any) => String(x.id) === id) || null;
                      setSelectedHotel(h);
                    }}
                  >
                    <option value="">All hotels</option>
                    {hotels.map((h: any) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Revenue
                        </p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(analytics.totalRevenue)}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Bookings
                        </p>
                        <p className="text-2xl font-bold">
                          {analytics.totalBookings}
                        </p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Average Occupancy
                        </p>
                        <p className="text-2xl font-bold">
                          {analytics.averageOccupancy}%
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Reviews
                        </p>
                        <p className="text-2xl font-bold">
                          {analytics.totalReviews}
                        </p>
                      </div>
                      <Star className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Hotels by Revenue</CardTitle>
                  <CardDescription>Ranking of your hotels by performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(analytics?.topPerformingHotels ?? []).map(
                      (hotel: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold">{hotel.name}</h4>
                              <p className="text-sm text-gray-600">
                                {hotel.bookings} bookings
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {formatCurrency(hotel.revenue)}
                            </p>
                            <p className="text-sm text-gray-600">revenue</p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "reservations" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reservations</CardTitle>
                  <CardDescription>View and update reservation status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <select
                      className="rounded border px-2 py-1 text-sm"
                      value={selectedHotel?.id ?? ""}
                      onChange={(e) => {
                        const id = e.target.value;
                        const h = hotels.find((x: any) => String(x.id) === id) || null;
                        setSelectedHotel(h);
                      }}
                    >
                      <option value="">Select a hotel</option>
                      {hotels.map((h: any) => (
                        <option key={h.id} value={h.id}>
                          {h.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className="rounded border px-2 py-1 text-sm"
                      value={reservationStatus}
                      onChange={(e) => setReservationStatus(e.target.value)}
                    >
                      <option value="">All statuses</option>
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                  {!selectedHotel?.id ? (
                    <div className="text-sm text-gray-600">Select a hotel to view its reservations.</div>
                  ) : (
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
                          {(reservations as any[]).map((r: any) => (
                            <tr key={String(r._id || r.id)} className="border-b">
                              <td className="py-2 pr-3">{r.guestInfo?.firstName} {r.guestInfo?.lastName}</td>
                              <td className="py-2 pr-3">{new Date(r.checkIn).toLocaleDateString()} – {new Date(r.checkOut).toLocaleDateString()}</td>
                              <td className="py-2 pr-3">{r.quantity}</td>
                              <td className="py-2 pr-3">{r.guests?.total ?? ((r.guests?.adults || 0) + (r.guests?.children || 0))}</td>
                              <td className="py-2 pr-3">₪{(r.totalPrice || 0).toLocaleString()}</td>
                              <td className="py-2 pr-3">{r.status}</td>
                              <td className="py-2 pr-3">
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => updateReservationStatus(String(r._id || r.id), "CONFIRMED").then(() => queryClient.invalidateQueries({ queryKey: ["owner-reservations"] }))}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => updateReservationStatus(String(r._id || r.id), "COMPLETED").then(() => queryClient.invalidateQueries({ queryKey: ["owner-reservations"] }))}
                                  >
                                    Complete
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => updateReservationStatus(String(r._id || r.id), "CANCELLED").then(() => queryClient.invalidateQueries({ queryKey: ["owner-reservations"] }))}
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
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "reviews" && (
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
                        const h = hotels.find((x: any) => String(x.id) === id) || null;
                        setSelectedHotel(h);
                      }}
                    >
                      <option value="">Select a hotel</option>
                      {hotels.map((h: any) => (
                        <option key={h.id} value={h.id}>
                          {h.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {!selectedHotel?.id ? (
                    <div className="text-sm text-gray-600">Select a hotel to view its reviews.</div>
                  ) : (
                    <AdminHotelReviewsList hotelId={String(selectedHotel.id)} />
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "add-hotel" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Hotel</CardTitle>
                  <CardDescription>
                    Fill in the information about the new hotel to add it to the
                    platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center py-12">
                      <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Add New Hotel
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Click the button below to open the form for adding a new
                        hotel
                      </p>
                      <Button
                        onClick={handleAddHotel}
                        size="lg"
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-5 w-5" />
                        Add Hotel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </Tabs>

        <EditHotelDialog
          isOpen={isEditDialogOpen}
          onClose={handleCloseDialog}
          hotel={selectedHotel}
          onSave={handleSaveHotel}
        />

        <AddHotelDialog
          isOpen={isAddDialogOpen}
          onClose={handleCloseDialog}
          onSave={handleSaveHotel}
        />
      </div>
    </div>
  );
}
