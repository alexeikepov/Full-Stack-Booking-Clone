import { useState } from "react";
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
  Users,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { EditHotelDialog } from "@/components/EditHotelDialog";
import { useNavigationTabsStore } from "@/stores/navigationTabs";
import { useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  api,
  approveAdminApplication,
  getAdminApplications,
  rejectAdminApplication,
  getOwnerHotels,
  getAllHotelsForOwner,
  deleteHotel as apiDeleteHotel,
  getHotelById,
  updateHotel as apiUpdateHotel,
  getMe,
} from "@/lib/api";

export default function OwnerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("applications");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const { setShowTabs } = useNavigationTabsStore();
  const qc = useQueryClient();

  // Hide navigation tabs on admin page
  useEffect(() => {
    setShowTabs(false);
    return () => {
      setShowTabs(true);
    };
  }, [setShowTabs]);

  // Load current user to check role
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: getMe });

  // Load admin applications (OWNER only)
  const { data: applicationsData } = useQuery({
    queryKey: ["adminApplications"],
    queryFn: () => getAdminApplications({ status: undefined }),
    enabled: me?.role === "OWNER",
    retry: 0,
  });
  const applications = (applicationsData?.items || []).map((u: any) => ({
    id: String(u._id),
    ownerName: u.name,
    email: u.email,
    phone: u.phone,
    status: u.ownerApplicationStatus,
    submittedAt: new Date(u.createdAt).toISOString().slice(0, 10),
    description: "",
    hotelName: "",
  }));

  // Load ALL hotels for platform owner (falls back to own hotels if not owner)
  const { data: hotelsData } = useQuery({
    queryKey: ["ownerHotels"],
    queryFn: async () => {
      // Prefer the public catalog endpoints first to list ALL hotels
      try {
        const r = await api.get("/api/hotels", {
          params: { all: 1, limit: 10000 },
        });
        return r.data;
      } catch {}
      try {
        const r = await api.get("/api/hotels", { params: { limit: 10000 } });
        return r.data;
      } catch {}
      // Then try owner-specific aggregated endpoints
      try {
        return await getAllHotelsForOwner();
      } catch {}
      // Final fallback: only the hotels current user manages
      return await getOwnerHotels();
    },
    enabled: true,
    retry: 0,
  });
  const hotelsSource = Array.isArray(hotelsData)
    ? hotelsData
    : (hotelsData as any)?.items ?? [];
  const hotels = (hotelsSource || []).map((h: any) => ({
    id: String((h as any)._id?.$oid || h.id || h._id),
    name: h.name,
    location: [h.address, h.city].filter(Boolean).join(", "),
    rating: Number(h.averageRating ?? 0),
    rooms: Array.isArray(h.rooms) ? h.rooms.length : Number(h.rooms ?? 0),
    status: h.status,
    approvalStatus: h.approvalStatus || "PENDING",
    owner: "",
    createdAt: h.createdAt ? new Date(h.createdAt).toLocaleDateString() : "",
    isVisible: h.isVisible !== false,
  }));

  const approveMut = useMutation({
    mutationFn: (userId: string) => approveAdminApplication(userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adminApplications"] }),
  });
  const rejectMut = useMutation({
    mutationFn: (userId: string) => rejectAdminApplication(userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adminApplications"] }),
  });
  const deleteHotelMut = useMutation({
    mutationFn: (hotelId: string) => apiDeleteHotel(hotelId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ownerHotels"] }),
  });
  const updateHotelMut = useMutation({
    mutationFn: ({ hotelId, data }: { hotelId: string; data: any }) =>
      apiUpdateHotel(hotelId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ownerHotels"] }),
    onError: (error: any) => {
      console.error("Update hotel mutation failed:", error);
      let errorMessage = "Ошибка обновления отеля";

      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.status === 403) {
        errorMessage = "Недостаточно прав для обновления отеля";
      } else if (error?.response?.status === 404) {
        errorMessage = "Отель не найден";
      } else if (error?.response?.status === 400) {
        errorMessage = "Некорректные данные для обновления";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      alert(`Ошибка: ${errorMessage}`);
    },
  });

  const handleApproveApplication = (id: string) => {
    approveMut.mutate(id);
  };

  const handleRejectApplication = (id: string) => {
    rejectMut.mutate(id);
  };

  const handleDeleteHotel = (id: string) => {
    deleteHotelMut.mutate(id);
  };

  const handleEditHotel = async (hotel: any) => {
    try {
      console.log("Editing hotel:", hotel);
      const full = await getHotelById(String(hotel.id));
      console.log("Full hotel data:", full);
      setSelectedHotel(full);
      setIsEditDialogOpen(true);
    } catch (error) {
      console.error("Failed to load full hotel data:", error);
      console.log("Using basic hotel data:", hotel);
      setSelectedHotel(hotel);
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveHotel = async (updatedHotel: any) => {
    try {
      console.log("Saving hotel:", updatedHotel);

      const hotelId = String(
        updatedHotel.id ||
          updatedHotel._id ||
          selectedHotel?.id ||
          selectedHotel?._id
      );

      console.log("Hotel ID:", hotelId);
      console.log("Selected hotel:", selectedHotel);

      if (!hotelId || hotelId === "undefined" || hotelId === "null") {
        throw new Error("Не удалось определить ID отеля для обновления");
      }

      await updateHotelMut.mutateAsync({ hotelId, data: updatedHotel });
      setIsEditDialogOpen(false);
      setSelectedHotel(null);
    } catch (e: any) {
      console.error("Hotel update failed:", e);
      let errorMessage = "Неизвестная ошибка";

      if (e?.response?.data?.error) {
        errorMessage = e.response.data.error;
      } else if (e?.response?.status === 403) {
        errorMessage = "Недостаточно прав для обновления отеля";
      } else if (e?.response?.status === 404) {
        errorMessage = "Отель не найден";
      } else if (e?.response?.status === 400) {
        errorMessage = "Некорректные данные для обновления";
      } else if (e?.message) {
        errorMessage = e.message;
      }

      alert(`Ошибка обновления отеля: ${errorMessage}`);
    }
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedHotel(null);
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHotels = hotels.filter(
    (hotel: any) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
    } as const;

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status === "pending" && "Pending"}
        {status === "approved" && "Approved"}
        {status === "rejected" && "Rejected"}
        {status === "active" && "Active"}
        {status === "inactive" && "Inactive"}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Owner Panel</h1>
          <p className="text-gray-600">Manage hotels and admin applications</p>
        </div>

        <Tabs className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="applications"
              className={`flex items-center gap-2 ${
                activeTab === "applications" ? "bg-white shadow-sm" : ""
              }`}
              onClick={() => setActiveTab("applications")}
            >
              <Users className="h-4 w-4" />
              Admin Applications
            </TabsTrigger>
            <TabsTrigger
              value="hotels"
              className={`flex items-center gap-2 ${
                activeTab === "hotels" ? "bg-white shadow-sm" : ""
              }`}
              onClick={() => setActiveTab("hotels")}
            >
              <Building2 className="h-4 w-4" />
              Hotel Management
            </TabsTrigger>
          </TabsList>

          {activeTab === "applications" && me?.role === "OWNER" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hotel Admin Applications</CardTitle>
                  <CardDescription>
                    Review and approve applications from users requesting hotel
                    admin role
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredApplications.map((application) => (
                      <Card
                        key={application.id}
                        className="border-l-4 border-l-blue-500"
                      >
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <h3 className="text-lg font-semibold">
                                {application.ownerName}
                              </h3>
                              <div className="space-y-1 text-sm text-gray-500">
                                <p>
                                  <strong>Email:</strong> {application.email}
                                </p>
                                <p>
                                  <strong>Phone:</strong> {application.phone}
                                </p>
                                <p>
                                  <strong>Submitted:</strong>{" "}
                                  {application.submittedAt}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              {getStatusBadge(application.status)}
                              {application.status === "pending" && (
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleApproveApplication(application.id)
                                    }
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      handleRejectApplication(application.id)
                                    }
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "hotels" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hotel Management</CardTitle>
                  <CardDescription>
                    View, edit and delete hotels
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search by hotel name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredHotels.map((hotel: any) => (
                      <Card
                        key={hotel.id}
                        className="border-l-4 border-l-green-500"
                      >
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <h3 className="text-lg font-semibold">
                                {hotel.name}
                              </h3>
                              <p className="text-gray-600">{hotel.location}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>⭐ {hotel.rating}</span>
                                <span>🏨 {hotel.rooms} rooms</span>
                                <span>📅 {hotel.createdAt}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              {getStatusBadge(hotel.status)}
                              <div className="flex items-center gap-2">
                                <select
                                  value={hotel.approvalStatus}
                                  onChange={(e) =>
                                    updateHotelMut.mutate({
                                      hotelId: hotel.id,
                                      data: { approvalStatus: e.target.value },
                                    })
                                  }
                                  className="h-9 rounded border px-2 text-sm"
                                >
                                  <option value="PENDING">Pending</option>
                                  <option value="APPROVED">Approved</option>
                                  <option value="REJECTED">Rejected</option>
                                </select>
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
                                  onClick={() => handleDeleteHotel(hotel.id)}
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
                </CardContent>
              </Card>
            </div>
          )}
        </Tabs>

        <EditHotelDialog
          isOpen={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          hotel={selectedHotel}
          onSave={handleSaveHotel}
        />
      </div>
    </div>
  );
}
