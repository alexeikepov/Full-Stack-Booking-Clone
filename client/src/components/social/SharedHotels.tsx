import { useState, useEffect } from "react";
import {
  getSharedHotels,
  getMySharedHotels,
  updateSharedHotelStatus,
  deleteSharedHotel,
  shareHotel,
  getFriends,
  type SharedHotel,
  type Friend,
  type SendSharedHotelData,
} from "@/lib/api";
import HotelSelector from "@/components/maps/HotelSelector";
import SharedHotelsTabs from "./SharedHotelsTabs";
import SharedHotelCard from "./SharedHotelCard";
import FriendCard from "./FriendCard";
import ShareHotelModal from "./ShareHotelModal";
import EmptyStateCard from "./EmptyStateCard";
import { Share2, Send, Hotel } from "lucide-react";

export default function SharedHotels() {
  const [sharedHotels, setSharedHotels] = useState<SharedHotel[]>([]);
  const [mySharedHotels, setMySharedHotels] = useState<SharedHotel[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("received");
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showHotelSelector, setShowHotelSelector] = useState<boolean>(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (): Promise<void> => {
    setLoading(true);
    try {
      const [received, sent, friendsList] = await Promise.all([
        getSharedHotels("all"),
        getMySharedHotels(),
        getFriends(),
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

  const handleStatusUpdate = async (
    sharedHotelId: string,
    status: string
  ): Promise<void> => {
    try {
      await updateSharedHotelStatus(sharedHotelId, status);
      await loadData();
      alert(`Hotel ${status} successfully`);
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (sharedHotelId: string): Promise<void> => {
    if (!confirm("Are you sure you want to delete this shared hotel?")) return;

    try {
      await deleteSharedHotel(sharedHotelId);
      await loadData();
      alert("Shared hotel deleted successfully");
    } catch (error) {
      alert("Failed to delete shared hotel");
    }
  };

  const handleShareHotel = (friend: Friend): void => {
    setSelectedFriend(friend);
    setShowHotelSelector(true);
  };

  const handleHotelSelected = (hotel: any): void => {
    setSelectedHotel(hotel);
    setShowHotelSelector(false);
    setTimeout(() => {
      setShowShareModal(true);
    }, 100);
  };

  const handleShareHotelSubmit = async (
    shareData: SendSharedHotelData
  ): Promise<void> => {
    try {
      await shareHotel(shareData);
      setShowShareModal(false);
      setSelectedFriend(null);
      setSelectedHotel(null);
      await loadData();
      alert("Hotel shared successfully");
    } catch (error) {
      alert("Failed to share hotel");
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shared Hotels</h2>
          <p className="text-gray-600">
            Share and discover hotels with friends
          </p>
        </div>
      </div>

      <SharedHotelsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        receivedCount={sharedHotels.length}
        sentCount={mySharedHotels.length}
      />

      {activeTab === "received" && (
        <div className="space-y-4">
          {sharedHotels.length === 0 ? (
            <EmptyStateCard
              icon={Share2}
              title="No shared hotels"
              description="No one has shared hotels with you yet."
            />
          ) : (
            sharedHotels.map((sharedHotel) => (
              <SharedHotelCard
                key={sharedHotel._id}
                sharedHotel={sharedHotel}
                type="received"
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}

      {activeTab === "sent" && (
        <div className="space-y-4">
          {mySharedHotels.length === 0 ? (
            <EmptyStateCard
              icon={Send}
              title="No sent shares"
              description="You haven't shared any hotels yet."
            />
          ) : (
            mySharedHotels.map((sharedHotel) => (
              <SharedHotelCard
                key={sharedHotel._id}
                sharedHotel={sharedHotel}
                type="sent"
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}

      {activeTab === "friends" && (
        <div className="space-y-4">
          {friends.length === 0 ? (
            <EmptyStateCard
              icon={Hotel}
              title="No friends to share with"
              description="Add some friends first to share hotels with them."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <FriendCard
                  key={friend._id}
                  friend={friend}
                  onShareHotel={handleShareHotel}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {showHotelSelector && (
        <HotelSelector
          onSelectHotel={handleHotelSelected}
          onClose={() => {
            setShowHotelSelector(false);
            setSelectedFriend(null);
          }}
        />
      )}

      <ShareHotelModal
        isOpen={showShareModal}
        selectedFriend={selectedFriend}
        selectedHotel={selectedHotel}
        onClose={() => {
          setShowShareModal(false);
          setSelectedFriend(null);
          setSelectedHotel(null);
        }}
        onShareHotel={handleShareHotelSubmit}
      />
    </div>
  );
}
