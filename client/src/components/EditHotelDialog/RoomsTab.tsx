import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TabProps, Room } from "./types";

interface RoomsTabProps extends TabProps {
  expandedRooms: Record<number, boolean>;
  setExpandedRooms: (
    rooms:
      | Record<number, boolean>
      | ((prev: Record<number, boolean>) => Record<number, boolean>)
  ) => void;
}

export default function RoomsTab({
  formData,
  setFormData,
  expandedRooms,
  setExpandedRooms,
}: RoomsTabProps) {
  const updateRoom = (index: number, key: string, value: unknown) => {
    setFormData((prev) => {
      const next = [...prev.rooms];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, rooms: next };
    });
  };

  const addRoom = () => {
    setFormData((prev) => {
      const newIndex = (prev.rooms || []).length;
      const newRoom: Room = {
        name: "",
        roomType: "STANDARD",
        capacity: 2,
        maxAdults: 2,
        maxChildren: 0,
        pricePerNight: 0,
        totalRooms: 1,
        sizeSqm: 0,
        bedrooms: 0,
        bathrooms: 1,
        features: [],
        photos: [],
      };
      const nextRooms = [...(prev.rooms || []), newRoom];
      setExpandedRooms((er) => ({ ...er, [newIndex]: true }));
      return { ...prev, rooms: nextRooms };
    });
  };

  const removeRoom = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      rooms: prev.rooms.filter((_: unknown, i: number) => i !== index),
    }));
  };

  const addRoomPhoto = (roomIndex: number, url: string) => {
    const v = url.trim();
    if (!v) return;
    setFormData((prev) => {
      const next = [...prev.rooms];
      const photos = Array.isArray(next[roomIndex]?.photos)
        ? next[roomIndex].photos
        : [];
      next[roomIndex] = { ...next[roomIndex], photos: [...photos, v] };
      return { ...prev, rooms: next };
    });
  };

  const updateRoomPhoto = (
    roomIndex: number,
    photoIndex: number,
    url: string
  ) => {
    setFormData((prev) => {
      const next = [...prev.rooms];
      const photos = [...(next[roomIndex].photos || [])];
      photos[photoIndex] = url;
      next[roomIndex] = { ...next[roomIndex], photos };
      return { ...prev, rooms: next };
    });
  };

  const removeRoomPhoto = (roomIndex: number, photoIndex: number) => {
    setFormData((prev) => {
      const next = [...prev.rooms];
      const photos = (next[roomIndex].photos || []).filter(
        (_: string, i: number) => i !== photoIndex
      );
      next[roomIndex] = { ...next[roomIndex], photos };
      return { ...prev, rooms: next };
    });
  };

  const toggleRoomExpanded = (idx: number) => {
    setExpandedRooms((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const expandAllRooms = () => {
    const map: Record<number, boolean> = {};
    (formData.rooms || []).forEach((_, i: number) => (map[i] = true));
    setExpandedRooms(map);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-medium">Rooms</div>
        <div className="flex items-center gap-2">
          <Button type="button" onClick={addRoom} size="sm">
            Add room
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={expandAllRooms}
          >
            Expand all
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        {formData.rooms.map((room, idx: number) => (
          <div key={idx} className="rounded border p-3 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-4 flex-wrap text-sm">
                <div>
                  <span className="text-gray-500">Name: </span>
                  <span className="font-medium">{room.name || "Untitled"}</span>
                </div>
                <div>
                  <span className="text-gray-500">Type: </span>
                  <span className="font-medium">
                    {room.roomType || "STANDARD"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Price: </span>
                  <span className="font-medium">{room.pricePerNight ?? 0}</span>
                </div>
                <div>
                  <span className="text-gray-500">Units: </span>
                  <span className="font-medium">{room.totalRooms ?? 1}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {Array.isArray(room.photos) && room.photos[0] && (
                  <div className="w-16 h-12 rounded overflow-hidden bg-gray-100">
                    <img
                      src={room.photos[0]}
                      alt="room"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {(() => {
                  const isOpen = !!expandedRooms[idx];
                  return (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => toggleRoomExpanded(idx)}
                    >
                      {isOpen ? "Hide" : "Edit"}
                    </Button>
                  );
                })()}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeRoom(idx)}
                >
                  Delete room
                </Button>
              </div>
            </div>

            {(() => {
              const isOpen = !!expandedRooms[idx];
              return isOpen ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                    <div>
                      <Label className="text-xs">Name</Label>
                      <Input
                        value={room.name || ""}
                        onChange={(e) =>
                          updateRoom(idx, "name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Type</Label>
                      <select
                        value={room.roomType || "STANDARD"}
                        onChange={(e) =>
                          updateRoom(idx, "roomType", e.target.value)
                        }
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                      >
                        <option value="STANDARD">STANDARD</option>
                        <option value="SUPERIOR">SUPERIOR</option>
                        <option value="DELUXE">DELUXE</option>
                        <option value="SUITE">SUITE</option>
                        <option value="FAMILY">FAMILY</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs">Price / night</Label>
                      <Input
                        type="number"
                        min="0"
                        value={room.pricePerNight ?? 0}
                        onChange={(e) =>
                          updateRoom(
                            idx,
                            "pricePerNight",
                            parseFloat(e.target.value || "0")
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Total rooms</Label>
                      <Input
                        type="number"
                        min="1"
                        value={room.totalRooms ?? 1}
                        onChange={(e) =>
                          updateRoom(
                            idx,
                            "totalRooms",
                            parseInt(e.target.value || "1")
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Adults</Label>
                      <Input
                        type="number"
                        min="0"
                        value={room.maxAdults ?? 0}
                        onChange={(e) =>
                          updateRoom(
                            idx,
                            "maxAdults",
                            parseInt(e.target.value || "0")
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Children</Label>
                      <Input
                        type="number"
                        min="0"
                        value={room.maxChildren ?? 0}
                        onChange={(e) =>
                          updateRoom(
                            idx,
                            "maxChildren",
                            parseInt(e.target.value || "0")
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Capacity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={room.capacity ?? 1}
                        onChange={(e) =>
                          updateRoom(
                            idx,
                            "capacity",
                            parseInt(e.target.value || "1")
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Size (sqm)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={room.sizeSqm ?? 0}
                        onChange={(e) =>
                          updateRoom(
                            idx,
                            "sizeSqm",
                            parseInt(e.target.value || "0")
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Bedrooms</Label>
                      <Input
                        type="number"
                        min="0"
                        value={room.bedrooms ?? 0}
                        onChange={(e) =>
                          updateRoom(
                            idx,
                            "bedrooms",
                            parseInt(e.target.value || "0")
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Bathrooms</Label>
                      <Input
                        type="number"
                        min="0"
                        value={room.bathrooms ?? 1}
                        onChange={(e) =>
                          updateRoom(
                            idx,
                            "bathrooms",
                            parseInt(e.target.value || "0")
                          )
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">
                      Features (comma separated)
                    </Label>
                    <Input
                      value={(room.features || []).join(", ")}
                      onChange={(e) =>
                        updateRoom(
                          idx,
                          "features",
                          e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean)
                        )
                      }
                    />
                    <div className="text-xs text-gray-500">
                      Example: Balcony, City view, Coffee machine.
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Room photos</div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://..."
                          value={room.__newPhoto || ""}
                          onChange={(e) =>
                            updateRoom(idx, "__newPhoto", e.target.value)
                          }
                          className="h-9 w-64"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() =>
                            addRoomPhoto(idx, room.__newPhoto || "")
                          }
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(room.photos || []).map((url: string, i: number) => (
                        <div
                          key={`${url}-${i}`}
                          className="border rounded p-2 flex flex-col gap-2"
                        >
                          <div className="aspect-[4/3] bg-gray-100 overflow-hidden rounded">
                            {url ? (
                              <img
                                src={url}
                                alt="room"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full" />
                            )}
                          </div>
                          <Input
                            value={url}
                            onChange={(e) =>
                              updateRoomPhoto(idx, i, e.target.value)
                            }
                          />
                          <div className="text-xs text-gray-500">
                            Paste an image URL (e.g., https://images...).
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => removeRoomPhoto(idx, i)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      {(!room.photos || room.photos.length === 0) && (
                        <div className="text-sm text-gray-600">
                          No photos yet. Add image URLs above.
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : null;
            })()}
          </div>
        ))}
        {formData.rooms.length === 0 && (
          <div className="text-sm text-gray-600">
            No rooms yet. Click "Add room" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
