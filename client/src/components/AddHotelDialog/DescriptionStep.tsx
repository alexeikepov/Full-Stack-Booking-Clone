import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type StepProps } from "./types";

export default function DescriptionStep({ formData, onUpdate }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Hotel Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          placeholder="Describe your hotel, its features and advantages"
          rows={4}
          required
        />
      </div>
    </div>
  );
}
