import FacilitiesManager from "@/components/ui/FacilitiesManager";
import type { TabProps } from "./types";

export default function FacilitiesTab({ formData, setFormData }: TabProps) {
  return (
    <div className="space-y-4">
      <FacilitiesManager
        facilities={formData.facilities as any}
        onUpdate={(facilities) =>
          setFormData((prev) => ({
            ...prev,
            facilities: facilities as any,
          }))
        }
      />
    </div>
  );
}
