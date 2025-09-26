import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Share2,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Send,
  Hotel,
  MapPin,
  Star,
  Calendar
} from "lucide-react";
import {
  getSharedHotels,
  getMySharedHotels,
  updateSharedHotelStatus,
  deleteSharedHotel,
  shareHotel,
  getFriends,
  type SharedHotel,
  type Friend,
  type SendSharedHotelData
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import HotelSelector from "./HotelSelector";

export default function SharedHotels() {
  const { user: currentUser } = useAuth();
  const [sharedHotels, setSharedHotels] = useState<SharedHotel[]>([]);
  const [mySharedHotels, setMySharedHotels] = useState<SharedHotel[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("received");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHotelSelector, setShowHotelSelector] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [received, sent, friendsList] = await Promise.all([
        getSharedHotels('all'),
        getMySharedHotels(),
        getFriends()
      ]);
      setSharedHotels(received);
      setMySharedHotels(sent);
      setFriends(friendsList);
    } catch (error) {
      alert("Failed to load shared hotels data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (sharedHotelId: string, status: string) => {
    try {
      await updateSharedHotelStatus(sharedHotelId, status);
      await loadData();
      alert(`Hotel ${status} successfully`);
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (sharedHotelId: string) => {
    if (!confirm("Are you sure you want to delete this shared hotel?")) return;
    
    try {
      await deleteSharedHotel(sharedHotelId);
      await loadData();
      alert("Shared hotel deleted successfully");
    } catch (error) {
      alert("Failed to delete shared hotel");
    }
  };

  const handleShareHotel = async (friend: Friend) => {
    setSelectedFriend(friend);
    setShowHotelSelector(true);
  };

  const handleHotelSelected = (hotel: any) => {
    setSelectedHotel(hotel);
    setShowHotelSelector(false);
    // Small delay to ensure the selector closes before opening the share modal
    setTimeout(() => {
      setShowShareModal(true);
    }, 100);
  };

  const submitShareHotel = async () => {
    if (!selectedFriend || !selectedHotel) return;

    try {
      const shareData: SendSharedHotelData = {
        receiverId: selectedFriend._id,
        hotelId: selectedHotel._id,
        message: shareMessage || undefined
      };

      await shareHotel(shareData);
      setShowShareModal(false);
      setSelectedFriend(null);
      setSelectedHotel(null);
      setShareMessage("");
      await loadData();
      alert("Hotel shared successfully");
    } catch (error) {
      alert("Failed to share hotel");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'viewed': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Eye className="h-4 w-4" />;
      case 'viewed': return <Eye className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'declined': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading shared hotels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shared Hotels</h2>
          <p className="text-gray-600">Share and discover hotels with friends</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid w-full grid-cols-3 mb-6">
        <button
          onClick={() => setActiveTab("received")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === "received"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Share2 className="h-4 w-4" />
          Received ({sharedHotels.length})
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === "sent"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Send className="h-4 w-4" />
          Sent ({mySharedHotels.length})
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === "friends"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Hotel className="h-4 w-4" />
          Share with Friends
        </button>
      </div>

      {/* Content */}
      {activeTab === "received" && (
        <div className="space-y-4">
          {sharedHotels.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No shared hotels</h3>
                <p className="text-gray-600">No one has shared hotels with you yet.</p>
              </CardContent>
            </Card>
          ) : (
            sharedHotels.map((sharedHotel) => (
              <Card key={sharedHotel._id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarFallback>
                            {sharedHotel.sender.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{sharedHotel.sender.name}</p>
                          <p className="text-sm text-gray-600">shared a hotel with you</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Hotel className="h-5 w-5 text-blue-600" />
                          <h4 className="font-semibold text-lg">{sharedHotel.hotel.name}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {sharedHotel.hotel.city}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {sharedHotel.hotel.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            ${sharedHotel.hotel.price}/night
                          </div>
                        </div>
                        {sharedHotel.message && (
                          <p className="mt-2 text-gray-700 italic">"{sharedHotel.message}"</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(sharedHotel.status)}>
                          {getStatusIcon(sharedHotel.status)}
                          <span className="ml-1 capitalize">{sharedHotel.status}</span>
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(sharedHotel.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {sharedHotel.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(sharedHotel._id, 'accepted')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(sharedHotel._id, 'declined')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "sent" && (
        <div className="space-y-4">
          {mySharedHotels.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No sent shares</h3>
                <p className="text-gray-600">You haven't shared any hotels yet.</p>
              </CardContent>
            </Card>
          ) : (
            mySharedHotels.map((sharedHotel) => (
              <Card key={sharedHotel._id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarFallback>
                            {sharedHotel.receiver.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">Shared with {sharedHotel.receiver.name}</p>
                          <p className="text-sm text-gray-600">on {new Date(sharedHotel.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Hotel className="h-5 w-5 text-blue-600" />
                          <h4 className="font-semibold text-lg">{sharedHotel.hotel.name}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {sharedHotel.hotel.city}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {sharedHotel.hotel.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            ${sharedHotel.hotel.price}/night
                          </div>
                        </div>
                        {sharedHotel.message && (
                          <p className="mt-2 text-gray-700 italic">"{sharedHotel.message}"</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(sharedHotel.status)}>
                          {getStatusIcon(sharedHotel.status)}
                          <span className="ml-1 capitalize">{sharedHotel.status}</span>
                        </Badge>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(sharedHotel._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "friends" && (
        <div className="space-y-4">
          {friends.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Hotel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No friends to share with</h3>
                <p className="text-gray-600">Add some friends first to share hotels with them.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <Card key={friend._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarFallback>
                          {friend.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{friend.name}</p>
                        <p className="text-sm text-gray-600">{friend.email}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleShareHotel(friend)}
                      className="w-full"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Hotel
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hotel Selector */}
      {showHotelSelector && (
        <HotelSelector
          onSelectHotel={handleHotelSelected}
          onClose={() => {
            setShowHotelSelector(false);
            setSelectedFriend(null); // Clear selectedFriend only when manually closing
          }}
        />
      )}

      {/* Share Modal */}
      {showShareModal && selectedFriend && selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Share Hotel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selected Friend */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sharing with
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Avatar>
                    <AvatarFallback>
                      {selectedFriend.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedFriend.name}</p>
                    <p className="text-sm text-gray-600">{selectedFriend.email}</p>
                  </div>
                </div>
              </div>

              {/* Selected Hotel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel to share
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Hotel className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold">{selectedHotel.name}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedHotel.city}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {selectedHotel.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      ${selectedHotel.price}/night
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <Textarea
                  placeholder="Add a personal message..."
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={submitShareHotel}
                  className="flex-1"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Hotel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowShareModal(false);
                    setSelectedFriend(null);
                    setSelectedHotel(null);
                    setShareMessage("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
