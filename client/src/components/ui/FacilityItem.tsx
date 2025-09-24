import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface FacilityItemProps {
  item: {
    name: string;
    available: boolean;
    note?: string;
  };
  onUpdate: (item: { name: string; available: boolean; note?: string }) => void;
  onRemove: () => void;
}

export default function FacilityItem({
  item,
  onUpdate,
  onRemove,
}: FacilityItemProps) {
  return (
    <div className="flex gap-2 items-end p-3 border rounded-lg bg-gray-50">
      <div className="flex-1">
        <Label className="text-xs text-gray-600">Name</Label>
        <Input
          value={item.name}
          onChange={(e) => onUpdate({ ...item, name: e.target.value })}
          placeholder="Enter facility name"
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
