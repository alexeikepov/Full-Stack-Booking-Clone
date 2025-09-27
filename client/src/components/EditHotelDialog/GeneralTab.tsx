import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TabProps } from "./types";

interface GeneralTabProps extends TabProps {
  addressInputRef?: React.RefObject<HTMLInputElement | null>;
}

const GeneralTab = forwardRef<HTMLInputElement, GeneralTabProps>(
  ({ formData, setFormData, addressInputRef }) => {
    const handleChange = (field: string, value: any) => {
      setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
            <div className="text-xs text-gray-500">
              Hotel display name shown to guests.
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="text-xs text-gray-500">
              Active = visible and bookable, Inactive = hidden.
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              ref={addressInputRef}
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            />
            <div className="text-xs text-gray-500">
              Street and number (you may include ZIP).
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
            <div className="text-xs text-gray-500">
              City/town of the property.
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
            />
            <div className="text-xs text-gray-500">Country (e.g., Israel).</div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short description</Label>
          <Input
            id="shortDescription"
            value={formData.shortDescription}
            onChange={(e) => handleChange("shortDescription", e.target.value)}
            placeholder="A concise marketing sentence"
          />
          <div className="text-xs text-gray-500">
            One short marketing sentence (used in teasers).
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={5}
            placeholder="Full property description"
          />
          <div className="text-xs text-gray-500">
            Full property description, facilities and highlights.
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stars">Stars</Label>
            <Input
              id="stars"
              type="number"
              min="1"
              max="5"
              step="1"
              value={formData.stars}
              onChange={(e) =>
                handleChange("stars", parseInt(e.target.value || "0"))
              }
            />
            <div className="text-xs text-gray-500">
              Star rating 1–5 (if applicable).
            </div>
          </div>
        </div>
      </div>
    );
  }
);

GeneralTab.displayName = "GeneralTab";

export default GeneralTab;
