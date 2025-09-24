import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface SurroundingsItemProps {
  item: {
    name: string;
    distance: string;
    type?: string;
  };
  onUpdate: (item: { name: string; distance: string; type?: string }) => void;
  onRemove: () => void;
  hasType?: boolean;
}

export default function SurroundingsItem({
  item,
  onUpdate,
  onRemove,
  hasType = false,
}: SurroundingsItemProps) {
  return (
    <div className="flex gap-2 items-end p-3 border rounded-lg bg-gray-50">
      {hasType && (
        <div className="flex-1">
          <Label className="text-xs text-gray-600">Type</Label>
          <Input
            value={item.type || ""}
            onChange={(e) => onUpdate({ ...item, type: e.target.value })}
            placeholder="Enter type"
            className="text-sm"
          />
        </div>
      )}
      <div className="flex-1">
        <Label className="text-xs text-gray-600">Name</Label>
        <Input
          value={item.name}
          onChange={(e) => onUpdate({ ...item, name: e.target.value })}
          placeholder="Enter name"
          className="text-sm"
        />
      </div>
      <div className="w-20">
        <Label className="text-xs text-gray-600">Distance</Label>
        <Input
          value={item.distance}
          onChange={(e) => onUpdate({ ...item, distance: e.target.value })}
          placeholder="1.2 km"
          className="text-sm"
        />
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRemove}
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
