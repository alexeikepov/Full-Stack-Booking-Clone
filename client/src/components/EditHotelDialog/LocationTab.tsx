import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TabProps } from "./types";

export default function LocationTab({ formData, setFormData }: TabProps) {
  const handleLocation = (k: "lat" | "lng", value: number) => {
    setFormData((prev: any) => ({
      ...prev,
      location: { ...prev.location, [k]: value },
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lat">Latitude</Label>
          <Input
            id="lat"
            type="number"
            step="0.000001"
            value={formData.location?.lat ?? 0}
            onChange={(e) =>
              handleLocation("lat", parseFloat(e.target.value || "0"))
            }
          />
          <div className="text-xs text-gray-500">
            Latitude (decimal degrees).
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lng">Longitude</Label>
          <Input
            id="lng"
            type="number"
            step="0.000001"
            value={formData.location?.lng ?? 0}
            onChange={(e) =>
              handleLocation("lng", parseFloat(e.target.value || "0"))
            }
          />
          <div className="text-xs text-gray-500">
            Longitude (decimal degrees).
          </div>
        </div>
      </div>
    </div>
  );
}
