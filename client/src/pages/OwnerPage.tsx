import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Users,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import EditHotelDialog from "@/components/EditHotelDialog";
import { useNavigationTabsStore } from "@/stores/navigationTabs";
import { useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";

// Mock data for demonstration
const mockHotelApplications = [
  {
    id: 1,
    hotelName: "Grand Hotel Moscow",
    ownerName: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    status: "pending",
    submittedAt: "2024-01-15",
    description: "Luxury hotel in the center of Moscow with 200 rooms",
  },
  {
    id: 2,
    hotelName: "St. Petersburg Plaza",
    ownerName: "Maria Johnson",
    email: "maria.johnson@email.com",
    phone: "+1 (555) 987-6543",
    status: "approved",
    submittedAt: "2024-01-10",
    description: "Modern hotel on Nevsky Prospect",
  },
  {
    id: 3,
    hotelName: "Kazan Center",
    ownerName: "Alex Brown",
    email: "alex.brown@email.com",
    phone: "+1 (555) 555-1234",
    status: "rejected",
    submittedAt: "2024-01-08",
    description: "Business hotel in Kazan city center",
  },
];

const mockHotels = [
  {
    id: 1,
    name: "Grand Hotel Moscow",
    location: "Moscow, Russia",
    rating: 4.8,
    rooms: 200,
    status: "active",
    owner: "John Smith",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "St. Petersburg Plaza",
    location: "St. Petersburg, Russia",
    rating: 4.6,
    rooms: 150,
    status: "active",
    owner: "Maria Johnson",
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    name: "Kazan Center",
    location: "Kazan, Russia",
    rating: 4.2,
    rooms: 100,
    status: "inactive",
    owner: "Alex Brown",
    createdAt: "2024-01-08",
  },
];

export default function OwnerPage() {
  const [applications, setApplications] = useState(mockHotelApplications);
  const [hotels, setHotels] = useState(mockHotels);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("applications");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const { setShowTabs } = useNavigationTabsStore();

  // Hide navigation tabs on admin page
  useEffect(() => {
    setShowTabs(false);

    // Restore tabs when component unmounts
    return () => {
      setShowTabs(true);
    };
  }, [setShowTabs]);

  const handleApproveApplication = (id: number) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "approved" } : app))
    );
  };

  const handleRejectApplication = (id: number) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "rejected" } : app))
    );
  };

  const handleDeleteHotel = (id: number) => {
    setHotels((prev) => prev.filter((hotel) => hotel.id !== id));
  };

  const handleToggleHotelStatus = (id: number) => {
    setHotels((prev) =>
      prev.map((hotel) =>
        hotel.id === id
          ? {
              ...hotel,
              status: hotel.status === "active" ? "inactive" : "active",
            }
          : hotel
      )
    );
  };

  const handleEditHotel = (hotel: any) => {
    setSelectedHotel(hotel);
    setIsEditDialogOpen(true);
  };

  const handleSaveHotel = (updatedHotel: any) => {
    setHotels((prev) =>
      prev.map((hotel) => (hotel.id === updatedHotel.id ? updatedHotel : hotel))
    );
    setIsEditDialogOpen(false);
    setSelectedHotel(null);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedHotel(null);
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "default",
      approved: "default",
      rejected: "destructive",
      active: "default",
      inactive: "secondary",
    } as const;

    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
    };

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
          <p className="text-gray-600">Manage hotels and owner applications</p>
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
              Owner Applications
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

          {activeTab === "applications" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hotel Owner Applications</CardTitle>
                  <CardDescription>
                    Review and approve applications from hotel owners
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search by hotel name or owner..."
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
                                {application.hotelName}
                              </h3>
                              <p className="text-gray-600">
                                {application.description}
                              </p>
                              <div className="space-y-1 text-sm text-gray-500">
                                <p>
                                  <strong>Owner:</strong>{" "}
                                  {application.ownerName}
                                </p>
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
                    {filteredHotels.map((hotel) => (
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
                                <span>👤 {hotel.owner}</span>
                                <span>📅 {hotel.createdAt}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              {getStatusBadge(hotel.status)}
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
