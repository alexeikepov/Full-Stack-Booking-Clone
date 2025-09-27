import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Share2,
  Hotel,
  MapPin,
  Star,
  Calendar,
  Users,
  CheckCircle,
} from "lucide-react";
import {
  shareHotel,
  getFriends,
  type Friend,
  type SendSharedHotelData,
} from "@/lib/api";

interface HotelShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: any; // Hotel type
}

export default function HotelShareModal({
  isOpen,
  onClose,
  hotel,
}: HotelShareModalProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadFriends();
    }
  }, [isOpen]);

  const loadFriends = async () => {
    setLoading(true);
    try {
      const friendsList = await getFriends();
      setFriends(friendsList);
    } catch (error) {
      alert("Failed to load friends");
    } finally {
      setLoading(false);
    }
  };

  const toggleFriend = (friend: Friend) => {
    setSelectedFriends((prev) => {
      const isSelected = prev.some((f) => f._id === friend._id);
      if (isSelected) {
        return prev.filter((f) => f._id !== friend._id);
      } else {
        return [...prev, friend];
      }
    });
  };

  const handleShare = async () => {
    if (selectedFriends.length === 0) {
      alert("Please select at least one friend");
      return;
    }

    setSharing(true);
    try {
      // Share with all selected friends
      const sharePromises = selectedFriends.map((friend) =>
        shareHotel({
          receiverId: friend._id,
          hotelId: hotel.id || hotel._id,
          message: message || undefined,
        })
      );

      await Promise.all(sharePromises);

      alert(
        `Hotel shared successfully with ${selectedFriends.length} friend${
          selectedFriends.length > 1 ? "s" : ""
        }`
      );
      onClose();
      setSelectedFriends([]);
      setMessage("");
    } catch (error) {
      alert("Failed to share hotel");
    } finally {
      setSharing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Hotel with Friends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hotel Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                {hotel.images && hotel.images.length > 0 ? (
                  <img
                    src={hotel.images[0]}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Hotel className="h-8 w-8" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Hotel className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-lg">{hotel.name}</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {hotel.city}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {hotel.rating}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />${hotel.price}/night
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Available
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Friends Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Friends ({selectedFriends.length} selected)
            </label>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading friends...</p>
              </div>
            ) : friends.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No friends yet
                </h3>
                <p className="text-gray-600">
                  Add some friends first to share hotels with them.
                </p>
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-2">
                {friends.map((friend) => {
                  const isSelected = selectedFriends.some(
                    (f) => f._id === friend._id
                  );
                  return (
                    <div
                      key={friend._id}
                      onClick={() => toggleFriend(friend)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-blue-50 border-2 border-blue-200"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {friend.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{friend.name}</p>
                        <p className="text-sm text-gray-600 truncate">
                          {friend.email}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personal Message (Optional)
            </label>
            <Textarea
              placeholder="Add a personal message about this hotel..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleShare}
              disabled={selectedFriends.length === 0 || sharing}
              className="flex-1"
            >
              {sharing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sharing...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share with {selectedFriends.length} friend
                  {selectedFriends.length !== 1 ? "s" : ""}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={sharing}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
