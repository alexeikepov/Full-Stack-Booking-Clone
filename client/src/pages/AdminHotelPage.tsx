import { useState, useEffect } from "react";
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

export default function AdminHotelPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("hotels");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
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
    queryKey: ["owner-analytics"],
    queryFn: getOwnerAnalytics,
    // Fallback to mock data if API fails
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-hotels"] });
      queryClient.invalidateQueries({ queryKey: ["owner-analytics"] });
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

  const handleAddHotel = () => {
    setSelectedHotel(null);
    setIsAddDialogOpen(true);
  };

  const handleEditHotel = (hotel: any) => {
    setSelectedHotel(hotel);
    setIsEditDialogOpen(true);
  };

  const handleDeleteHotel = (id: number) => {
    deleteHotelMutation.mutate(id.toString());
  };

  const handleToggleHotelStatus = (id: number) => {
    const hotel = hotels.find((h: any) => h.id === id);
    if (hotel) {
      const newStatus = hotel.status === "active" ? "inactive" : "active";
      updateHotelMutation.mutate({
        hotelId: id.toString(),
        hotelData: { ...hotel, status: newStatus },
      });
    }
  };

  const handleSaveHotel = (updatedHotel: any) => {
    if (updatedHotel.id) {
      // Edit existing hotel
      updateHotelMutation.mutate({
        hotelId: updatedHotel.id.toString(),
        hotelData: updatedHotel,
      });
    } else {
      // Add new hotel
      createHotelMutation.mutate(updatedHotel);
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

  const filteredHotels = hotels.filter(
    (hotel: any) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <TabsList className="grid w-full grid-cols-3">
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
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="h-4 w-4" />
                                        Bookings
                                      </div>
                                      <div className="text-lg font-semibold">
                                        {hotel.totalBookings}
                                      </div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <DollarSign className="h-4 w-4" />
                                        Revenue
                                      </div>
                                      <div className="text-lg font-semibold">
                                        {formatCurrency(hotel.revenue)}
                                      </div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <TrendingUp className="h-4 w-4" />
                                        Occupancy
                                      </div>
                                      <div className="text-lg font-semibold">
                                        {hotel.occupancy}%
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>Created: {hotel.createdAt}</span>
                                    {hotel.lastBooking && (
                                      <span>
                                        Last booking: {hotel.lastBooking}
                                      </span>
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
                                        handleToggleHotelStatus(hotel.id)
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
                                      onClick={() =>
                                        handleDeleteHotel(hotel.id)
                                      }
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
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <Calendar className="h-4 w-4" />
                                      Bookings
                                    </div>
                                    <div className="text-lg font-semibold">
                                      {hotel.totalBookings}
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <DollarSign className="h-4 w-4" />
                                      Revenue
                                    </div>
                                    <div className="text-lg font-semibold">
                                      {formatCurrency(hotel.revenue)}
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <TrendingUp className="h-4 w-4" />
                                      Occupancy
                                    </div>
                                    <div className="text-lg font-semibold">
                                      {hotel.occupancy}%
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>Created: {hotel.createdAt}</span>
                                  {hotel.lastBooking && (
                                    <span>
                                      Последнее бронирование:{" "}
                                      {hotel.lastBooking}
                                    </span>
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
                                      handleToggleHotelStatus(hotel.id)
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
                                    Редактировать
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteHotel(hotel.id)}
                                    disabled={deleteHotelMutation.isPending}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Удалить
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
                  <CardDescription>
                    Ranking of your hotels by performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topPerformingHotels.map(
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
