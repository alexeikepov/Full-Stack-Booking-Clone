import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type StepProps } from "./types";

export default function HotelDetailsStep({
  formData,
  onUpdate,
  onContactUpdate,
}: StepProps) {
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
            onChange={(e) => onUpdate("rooms", parseInt(e.target.value))}
            placeholder="100"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stars">Star Rating *</Label>
          <Select
            value={formData.stars.toString()}
            onValueChange={(value) => onUpdate("stars", parseInt(value))}
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
          onChange={(e) => onContactUpdate("phone", e.target.value)}
          placeholder="+1 (XXX) XXX-XXXX"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.contactInfo.email}
          onChange={(e) => onContactUpdate("email", e.target.value)}
          placeholder="info@hotel.com"
        />
      </div>
    </div>
  );
}
