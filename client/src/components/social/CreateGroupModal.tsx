import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Hotel, MapPin, Star } from "lucide-react";
import type { CreateGroupData } from "@/lib/api";
import HotelSelector from "@/components/maps/HotelSelector";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (groupData: CreateGroupData) => void;
}

export default function CreateGroupModal({
  isOpen,
  onClose,
  onCreateGroup,
}: CreateGroupModalProps) {
  const [newGroup, setNewGroup] = useState<Partial<CreateGroupData>>({
    name: "",
    description: "",
    adults: 1,
    children: 0,
    rooms: 1,
  });
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [showHotelSelector, setShowHotelSelector] = useState(false);

  const handleHotelSelected = (hotel: any) => {
    setSelectedHotel(hotel);
    setShowHotelSelector(false);
    setNewGroup({ ...newGroup, hotelId: hotel._id });
  };

  const handleCreateGroup = () => {
    if (
      !newGroup.name ||
      !newGroup.hotelId ||
      !newGroup.checkIn ||
      !newGroup.checkOut
    ) {
      alert("Please fill in all required fields");
      return;
    }

    onCreateGroup(newGroup as CreateGroupData);
    setSelectedHotel(null);
    setNewGroup({
      name: "",
      description: "",
      adults: 1,
      children: 0,
      rooms: 1,
    });
  };

  const handleClose = () => {
    onClose();
    setSelectedHotel(null);
    setNewGroup({
      name: "",
      description: "",
      adults: 1,
      children: 0,
      rooms: 1,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>Create New Group</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name *
              </label>
              <Input
                placeholder="Enter group name"
                value={newGroup.name || ""}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                placeholder="Describe your trip..."
                value={newGroup.description || ""}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adults *
                </label>
                <Input
                  type="number"
                  min="1"
                  value={newGroup.adults || 1}
                  onChange={(e) =>
                    setNewGroup({
                      ...newGroup,
                      adults: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Children
                </label>
                <Input
                  type="number"
                  min="0"
                  value={newGroup.children || 0}
                  onChange={(e) =>
                    setNewGroup({
                      ...newGroup,
                      children: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rooms *
              </label>
              <Input
                type="number"
                min="1"
                value={newGroup.rooms || 1}
                onChange={(e) =>
                  setNewGroup({
                    ...newGroup,
                    rooms: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in *
                </label>
                <Input
                  type="date"
                  value={newGroup.checkIn || ""}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, checkIn: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out *
                </label>
                <Input
                  type="date"
                  value={newGroup.checkOut || ""}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, checkOut: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hotel *
              </label>
              {selectedHotel ? (
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
                      {selectedHotel.rating || selectedHotel.averageRating || 0}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedHotel(null);
                      setNewGroup({ ...newGroup, hotelId: undefined });
                    }}
                    className="mt-2"
                  >
                    Change Hotel
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowHotelSelector(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Hotel className="h-4 w-4 mr-2" />
                  Select Hotel
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateGroup} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {showHotelSelector && (
        <HotelSelector
          onSelectHotel={handleHotelSelected}
          onClose={() => setShowHotelSelector(false)}
        />
      )}
    </>
  );
}
