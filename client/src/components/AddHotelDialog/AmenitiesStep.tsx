import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { type StepProps } from "./types";
import { availableAmenities, availableFacilities } from "./constants";

export default function AmenitiesStep({ formData, onUpdate }: StepProps) {
  const toggleAmenity = (amenity: string) => {
    const newAmenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter((a) => a !== amenity)
      : [...formData.amenities, amenity];
    onUpdate("amenities", newAmenities);
  };

  const toggleFacility = (facility: string) => {
    const newFacilities = formData.facilities.includes(facility)
      ? formData.facilities.filter((f) => f !== facility)
      : [...formData.facilities, facility];
    onUpdate("facilities", newFacilities);
  };

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
}
