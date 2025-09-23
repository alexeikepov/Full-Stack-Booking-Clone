import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Hotel {
  id: number;
  name: string;
  location: string;
  rating: number;
  rooms: number;
  status: string;
  owner: string;
  createdAt: string;
}

interface EditHotelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel | null;
  onSave: (hotel: Hotel) => void;
}

export default function EditHotelDialog({
  isOpen,
  onClose,
  hotel,
  onSave,
}: EditHotelDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    rating: 0,
    rooms: 0,
    status: "active",
    owner: "",
  });

  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name,
        location: hotel.location,
        rating: hotel.rating,
        rooms: hotel.rooms,
        status: hotel.status,
        owner: hotel.owner,
      });
    }
  }, [hotel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hotel) {
      onSave({
        ...hotel,
        ...formData,
      });
      onClose();
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Hotel</DialogTitle>
          <DialogDescription>
            Update hotel information and settings
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Hotel Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter hotel name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Enter location"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) =>
                  handleChange("rating", parseFloat(e.target.value))
                }
                placeholder="4.5"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rooms">Number of Rooms</Label>
              <Input
                id="rooms"
                type="number"
                min="1"
                value={formData.rooms}
                onChange={(e) =>
                  handleChange("rooms", parseInt(e.target.value))
                }
                placeholder="100"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Input
                id="owner"
                value={formData.owner}
                onChange={(e) => handleChange("owner", e.target.value)}
                placeholder="Enter owner name"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
