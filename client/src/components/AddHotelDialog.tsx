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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Building2, MapPin, Star, Users } from "lucide-react";

interface Hotel {
  id?: number;
  name: string;
  location: string;
  address: string;
  rating: number;
  rooms: number;
  status: string;
  owner: string;
  description: string;
  stars: number;
  amenities: string[];
  facilities: string[];
  contactInfo: {
    phone: string;
    email: string;
  };
}

interface AddHotelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (hotel: Hotel) => void;
}

const availableAmenities = [
  "Free WiFi",
  "Parking",
  "Air Conditioning",
  "Swimming Pool",
  "Spa",
  "Fitness Center",
  "Restaurant",
  "Bar",
  "Breakfast",
  "Airport Shuttle",
  "Laundry Service",
  "Dry Cleaning",
  "Business Center",
  "Conference Room",
  "Children's Playground",
  "Pet Friendly",
];

const availableFacilities = [
  "Elevator",
  "Parking",
  "Concierge",
  "24-Hour Front Desk",
  "Luggage Storage",
  "Currency Exchange",
  "Travel Agency",
  "Pharmacy",
  "Gift Shop",
  "ATM",
  "Car Rental",
  "Tour Desk",
];

export default function AddHotelDialog({
  isOpen,
  onClose,
  onSave,
}: AddHotelDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    rating: 0,
    rooms: 0,
    status: "active",
    owner: "",
    description: "",
    stars: 3,
    amenities: [] as string[],
    facilities: [] as string[],
    contactInfo: {
      phone: "",
      email: "",
    },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      location: "",
      address: "",
      rating: 0,
      rooms: 0,
      status: "active",
      owner: "",
      description: "",
      stars: 3,
      amenities: [],
      facilities: [],
      contactInfo: {
        phone: "",
        email: "",
      },
    });
    setCurrentStep(1);
    onClose();
  };

  const handleChange = (field: string, value: string | number | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const toggleFacility = (facility: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.location && formData.address;
      case 2:
        return formData.rooms > 0 && formData.stars > 0;
      case 3:
        return formData.description;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Hotel Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter hotel name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="City, Country"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Full hotel address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Input
                id="owner"
                value={formData.owner}
                onChange={(e) => handleChange("owner", e.target.value)}
                placeholder="Owner name"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rooms">Number of Rooms *</Label>
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
              <div className="space-y-2">
                <Label htmlFor="stars">Star Rating *</Label>
                <Select
                  value={formData.stars.toString()}
                  onValueChange={(value) =>
                    handleChange("stars", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select star rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <SelectItem key={star} value={star.toString()}>
                        {star} Star{star === 1 ? "" : "s"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.contactInfo.phone}
                onChange={(e) => handleContactChange("phone", e.target.value)}
                placeholder="+1 (XXX) XXX-XXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => handleContactChange("email", e.target.value)}
                placeholder="info@hotel.com"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Hotel Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe your hotel, its features and advantages"
                rows={4}
                required
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">Amenities</h4>
              <div className="grid grid-cols-2 gap-2">
                {availableAmenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => toggleAmenity(amenity)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded"
                    />
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
              {formData.amenities.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity) => (
                      <Badge
                        key={amenity}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {amenity}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => toggleAmenity(amenity)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-3">Services</h4>
              <div className="grid grid-cols-2 gap-2">
                {availableFacilities.map((facility) => (
                  <div
                    key={facility}
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => toggleFacility(facility)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.facilities.includes(facility)}
                      onChange={() => toggleFacility(facility)}
                      className="rounded"
                    />
                    <span className="text-sm">{facility}</span>
                  </div>
                ))}
              </div>
              {formData.facilities.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.facilities.map((facility) => (
                      <Badge
                        key={facility}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {facility}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => toggleFacility(facility)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Basic Information";
      case 2:
        return "Hotel Details";
      case 3:
        return "Description";
      case 4:
        return "Amenities and Services";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {isOpen && !formData.id ? "Add New Hotel" : "Edit Hotel"}
          </DialogTitle>
          <DialogDescription>
            {getStepTitle()} ({currentStep} of {totalSteps})
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`flex items-center ${
                i < currentStep
                  ? "text-blue-600"
                  : i === currentStep
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  i < currentStep
                    ? "bg-blue-600 text-white"
                    : i === currentStep
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    i < currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderStepContent()}

          <DialogFooter className="flex justify-between">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={!isStepValid()}>
                  Save Hotel
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
