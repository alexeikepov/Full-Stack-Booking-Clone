import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FacilitiesItem from "./FacilitiesItem";

interface FacilityItem {
  name: string;
  available: boolean;
  note?: string;
}

interface FacilitiesSectionProps {
  title: string;
  items: FacilityItem[];
  onUpdate: (items: FacilityItem[]) => void;
  icon?: string;
}

export default function FacilitiesSection({
  title,
  items,
  onUpdate,
  icon,
}: FacilitiesSectionProps) {
  const addItem = () => {
    const newItem: FacilityItem = { name: "", available: true, note: "" };
    onUpdate([...items, newItem]);
  };

  const updateItem = (index: number, updatedItem: FacilityItem) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    onUpdate(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate(newItems);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="h-8 px-3 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <FacilitiesItem
            key={index}
            item={item}
            onUpdate={(updatedItem) => updateItem(index, updatedItem)}
            onRemove={() => removeItem(index)}
          />
        ))}

        {items.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No facilities added yet. Click "Add" to get started.
          </div>
        )}
      </div>
    </div>
  );
}
