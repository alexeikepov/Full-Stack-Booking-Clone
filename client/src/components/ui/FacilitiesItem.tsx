import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

interface FacilityItem {
  name: string;
  available: boolean;
  note?: string;
}

interface FacilitiesItemProps {
  item: FacilityItem;
  onUpdate: (item: FacilityItem) => void;
  onRemove: () => void;
}

export default function FacilitiesItem({
  item,
  onUpdate,
  onRemove,
}: FacilitiesItemProps) {
  return (
    <div className="flex gap-2 items-end p-3 border rounded-lg bg-gray-50">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`available-${item.name}`}
          checked={item.available}
          onCheckedChange={(checked) =>
            onUpdate({ ...item, available: !!checked })
          }
        />
        <Label htmlFor={`available-${item.name}`} className="text-xs">
          Available
        </Label>
      </div>

      <div className="flex-1">
        <Label className="text-xs text-gray-600">Facility Name</Label>
        <Input
          value={item.name}
          onChange={(e) => onUpdate({ ...item, name: e.target.value })}
          placeholder="Enter facility name"
          className="text-sm"
        />
      </div>

      <div className="flex-1">
        <Label className="text-xs text-gray-600">Note (optional)</Label>
        <Input
          value={item.note || ""}
          onChange={(e) => onUpdate({ ...item, note: e.target.value })}
          placeholder="Additional charge, etc."
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
