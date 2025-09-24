import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SurroundingsItem from "./SurroundingsItem";

interface SurroundingsSectionProps {
  title: string;
  items: Array<{
    name: string;
    distance: string;
    type?: string;
  }>;
  onUpdate: (
    items: Array<{
      name: string;
      distance: string;
      type?: string;
    }>
  ) => void;
  hasType?: boolean;
}

export default function SurroundingsSection({
  title,
  items,
  onUpdate,
  hasType = false,
}: SurroundingsSectionProps) {
  const addItem = () => {
    const newItem = hasType
      ? { name: "", distance: "", type: "" }
      : { name: "", distance: "" };
    onUpdate([...items, newItem]);
  };

  const updateItem = (
    index: number,
    updatedItem: {
      name: string;
      distance: string;
      type?: string;
    }
  ) => {
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
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
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
          <SurroundingsItem
            key={index}
            item={item}
            onUpdate={(updatedItem) => updateItem(index, updatedItem)}
            onRemove={() => removeItem(index)}
            hasType={hasType}
          />
        ))}

        {items.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No items added yet. Click "Add" to get started.
          </div>
        )}
      </div>
    </div>
  );
}
