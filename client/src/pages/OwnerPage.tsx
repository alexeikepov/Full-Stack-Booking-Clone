import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users } from "lucide-react";
import { EditHotelDialog } from "@/components/EditHotelDialog";
import { useNavigationTabsStore } from "@/stores/navigationTabs";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  AdminApplicationsSection,
  HotelManagementSection,
} from "@/components/admin";
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
import type { Application, Hotel } from "@/types/owner";

export default function OwnerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("applications");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const { setShowTabs } = useNavigationTabsStore();
  const qc = useQueryClient();

  useEffect(() => {
    setShowTabs(false);
    return () => {
      setShowTabs(true);
    };
  }, [setShowTabs]);

  const { data: me } = useQuery({ queryKey: ["me"], queryFn: getMe });

  const { data: applicationsData } = useQuery({
    queryKey: ["adminApplications"],
    queryFn: () => getAdminApplications({ status: undefined }),
    enabled: me?.role === "OWNER",
    retry: 0,
  });
  const applications: Application[] = (applicationsData?.items || []).map(
    (u: any) => ({
      id: String(u._id),
      ownerName: u.name,
      email: u.email,
      phone: u.phone,
      status: u.ownerApplicationStatus,
      submittedAt: new Date(u.createdAt).toISOString().slice(0, 10),
      description: "",
      hotelName: "",
    })
  );

  const { data: hotelsData } = useQuery({
    queryKey: ["ownerHotels"],
    queryFn: async () => {
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
      try {
        return await getAllHotelsForOwner();
      } catch {}
      return await getOwnerHotels();
    },
    enabled: true,
    retry: 0,
  });
  const hotelsSource = Array.isArray(hotelsData)
    ? hotelsData
    : (hotelsData as any)?.items ?? [];
  const hotels: Hotel[] = (hotelsSource || []).map((h: any) => ({
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
      let errorMessage = "Hotel update error";

      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.status === 403) {
        errorMessage = "Insufficient permissions to update hotel";
      } else if (error?.response?.status === 404) {
        errorMessage = "Hotel not found";
      } else if (error?.response?.status === 400) {
        errorMessage = "Invalid data for update";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      alert(`Error: ${errorMessage}`);
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

  const handleEditHotel = async (hotel: Hotel) => {
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
        throw new Error("Unable to determine hotel ID for update");
      }

      await updateHotelMut.mutateAsync({ hotelId, data: updatedHotel });
      setIsEditDialogOpen(false);
      setSelectedHotel(null);
    } catch (e: any) {
      console.error("Hotel update failed:", e);
      let errorMessage = "Unknown error";

      if (e?.response?.data?.error) {
        errorMessage = e.response.data.error;
      } else if (e?.response?.status === 403) {
        errorMessage = "Insufficient permissions to update hotel";
      } else if (e?.response?.status === 404) {
        errorMessage = "Hotel not found";
      } else if (e?.response?.status === 400) {
        errorMessage = "Invalid data for update";
      } else if (e?.message) {
        errorMessage = e.message;
      }

      alert(`Hotel update error: ${errorMessage}`);
    }
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedHotel(null);
  };

  const handleUpdateHotelStatus = (hotelId: string, status: string) => {
    updateHotelMut.mutate({
      hotelId,
      data: { approvalStatus: status },
    });
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
            <AdminApplicationsSection
              applications={applications}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onApprove={handleApproveApplication}
              onReject={handleRejectApplication}
            />
          )}

          {activeTab === "hotels" && (
            <HotelManagementSection
              hotels={hotels}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onEdit={handleEditHotel}
              onDelete={handleDeleteHotel}
              onUpdateStatus={handleUpdateHotelStatus}
            />
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
