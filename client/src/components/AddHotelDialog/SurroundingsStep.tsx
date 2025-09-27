import React from "react";
import SurroundingsSection from "@/components/ui/SurroundingsSection";
import { type StepProps } from "./types";

export default function SurroundingsStep({
  formData,
  onSurroundingsUpdate,
}: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-sm font-medium">Hotel Surroundings</div>
      <div className="space-y-6">
        <SurroundingsSection
          title="What's nearby"
          items={formData.surroundings.nearbyAttractions}
          onUpdate={(items) => onSurroundingsUpdate("nearbyAttractions", items)}
          hasType={false}
        />

        <SurroundingsSection
          title="Top attractions"
          items={formData.surroundings.topAttractions}
          onUpdate={(items) => onSurroundingsUpdate("topAttractions", items)}
          hasType={false}
        />

        <SurroundingsSection
          title="Restaurants & Cafes"
          items={formData.surroundings.restaurantsCafes}
          onUpdate={(items) => onSurroundingsUpdate("restaurantsCafes", items)}
          hasType={true}
        />

        <SurroundingsSection
          title="Natural beauty"
          items={formData.surroundings.naturalBeauty}
          onUpdate={(items) => onSurroundingsUpdate("naturalBeauty", items)}
          hasType={true}
        />

        <SurroundingsSection
          title="Public transport"
          items={formData.surroundings.publicTransport}
          onUpdate={(items) => onSurroundingsUpdate("publicTransport", items)}
          hasType={true}
        />

        <SurroundingsSection
          title="Closest airports"
          items={formData.surroundings.closestAirports}
          onUpdate={(items) => onSurroundingsUpdate("closestAirports", items)}
          hasType={false}
        />
      </div>
    </div>
  );
}
