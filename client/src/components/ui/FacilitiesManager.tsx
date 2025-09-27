import FacilitiesSection from "./FacilitiesSection";

interface FacilityItem {
  name: string;
  available: boolean;
  note?: string;
}

interface FacilitiesData {
  greatForStay: FacilityItem[];
  bathroom: FacilityItem[];
  bedroom: FacilityItem[];
  view: FacilityItem[];
  outdoors: FacilityItem[];
  kitchen: FacilityItem[];
  roomAmenities: FacilityItem[];
  livingArea: FacilityItem[];
  mediaTechnology: FacilityItem[];
  foodDrink: FacilityItem[];
  internet: string;
  parking: string;
  receptionServices: FacilityItem[];
  safetySecurity: FacilityItem[];
  generalFacilities: FacilityItem[];
}

interface FacilitiesManagerProps {
  facilities: FacilitiesData;
  onUpdate: (facilities: FacilitiesData) => void;
}

export default function FacilitiesManager({
  facilities,
  onUpdate,
}: FacilitiesManagerProps) {
  const updateSection = (
    section: keyof FacilitiesData,
    items: FacilityItem[] | string
  ) => {
    onUpdate({
      ...facilities,
      [section]: items,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-sm font-medium text-gray-900 mb-4">
        Hotel Facilities Management
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <FacilitiesSection
            title="Great for your stay"
            icon="👤"
            items={facilities.greatForStay || []}
            onUpdate={(items) => updateSection("greatForStay", items)}
          />

          <FacilitiesSection
            title="Bathroom"
            icon="🛁"
            items={facilities.bathroom || []}
            onUpdate={(items) => updateSection("bathroom", items)}
          />

          <FacilitiesSection
            title="Bedroom"
            icon="🛏️"
            items={facilities.bedroom || []}
            onUpdate={(items) => updateSection("bedroom", items)}
          />

          <FacilitiesSection
            title="View"
            icon="🏔️"
            items={facilities.view || []}
            onUpdate={(items) => updateSection("view", items)}
          />

          <FacilitiesSection
            title="Outdoors"
            icon="☀️"
            items={facilities.outdoors || []}
            onUpdate={(items) => updateSection("outdoors", items)}
          />

          {/* Internet - Special text field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">📶</span>
              <h4 className="text-sm font-medium text-gray-900">Internet</h4>
            </div>
            <textarea
              value={facilities.internet || ""}
              onChange={(e) => updateSection("internet", e.target.value)}
              placeholder="WiFi is available in the rooms and is free of charge."
              className="w-full p-3 border rounded-lg bg-gray-50 text-sm resize-none"
              rows={2}
            />
          </div>

          {/* Parking - Special text field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🅿️</span>
              <h4 className="text-sm font-medium text-gray-900">Parking</h4>
            </div>
            <textarea
              value={facilities.parking || ""}
              onChange={(e) => updateSection("parking", e.target.value)}
              placeholder="No parking available."
              className="w-full p-3 border rounded-lg bg-gray-50 text-sm resize-none"
              rows={2}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <FacilitiesSection
            title="Kitchen"
            icon="🍳"
            items={facilities.kitchen || []}
            onUpdate={(items) => updateSection("kitchen", items)}
          />

          <FacilitiesSection
            title="Room Amenities"
            icon="🛏️"
            items={facilities.roomAmenities || []}
            onUpdate={(items) => updateSection("roomAmenities", items)}
          />

          <FacilitiesSection
            title="Living Area"
            icon="🛋️"
            items={facilities.livingArea || []}
            onUpdate={(items) => updateSection("livingArea", items)}
          />

          <FacilitiesSection
            title="Media & Technology"
            icon="💻"
            items={facilities.mediaTechnology || []}
            onUpdate={(items) => updateSection("mediaTechnology", items)}
          />

          <FacilitiesSection
            title="Food & Drink"
            icon="🍷"
            items={facilities.foodDrink || []}
            onUpdate={(items) => updateSection("foodDrink", items)}
          />

          <FacilitiesSection
            title="Reception services"
            icon="🔔"
            items={facilities.receptionServices || []}
            onUpdate={(items) => updateSection("receptionServices", items)}
          />

          <FacilitiesSection
            title="Safety & security"
            icon="🔒"
            items={facilities.safetySecurity || []}
            onUpdate={(items) => updateSection("safetySecurity", items)}
          />

          <FacilitiesSection
            title="General"
            icon="ℹ️"
            items={facilities.generalFacilities || []}
            onUpdate={(items) => updateSection("generalFacilities", items)}
          />
        </div>
      </div>
    </div>
  );
}
