import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Share2, Hotel, MapPin, Star, Calendar } from "lucide-react";
import type { Friend, SendSharedHotelData } from "@/lib/api";

interface ShareHotelModalProps {
  isOpen: boolean;
  selectedFriend: Friend | null;
  selectedHotel: any;
  onClose: () => void;
  onShareHotel: (shareData: SendSharedHotelData) => void;
}

export default function ShareHotelModal({
  isOpen,
  selectedFriend,
  selectedHotel,
  onClose,
  onShareHotel,
}: ShareHotelModalProps) {
  const [shareMessage, setShareMessage] = useState<string>("");

  const handleShareHotel = (): void => {
    if (!selectedFriend || !selectedHotel) return;

    const shareData: SendSharedHotelData = {
      receiverId: selectedFriend._id,
      hotelId: selectedHotel._id,
      message: shareMessage || undefined,
    };

    onShareHotel(shareData);
    setShareMessage("");
  };

  const handleClose = (): void => {
    onClose();
    setShareMessage("");
  };

  if (!isOpen || !selectedFriend || !selectedHotel) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Share Hotel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                  <Calendar className="h-4 w-4" />${selectedHotel.price}/night
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
            <Button onClick={handleShareHotel} className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share Hotel
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
