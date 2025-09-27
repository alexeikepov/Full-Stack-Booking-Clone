import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type StepProps } from "./types";

export default function BasicInfoStep({ formData, onUpdate }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Hotel Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onUpdate("name", e.target.value)}
          placeholder="Enter hotel name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => onUpdate("location", e.target.value)}
          placeholder="City, Country"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => onUpdate("address", e.target.value)}
          placeholder="Full hotel address"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="owner">Owner</Label>
        <Input
          id="owner"
          value={formData.owner}
          onChange={(e) => onUpdate("owner", e.target.value)}
          placeholder="Owner name"
        />
      </div>
    </div>
  );
}
