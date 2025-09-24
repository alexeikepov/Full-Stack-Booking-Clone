import React, { useState, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getHotelById } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Hotel {
  id: string | number;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  stars?: number;
  shortDescription?: string;
  description?: string;
  location?: { lat: number; lng: number };
  facilities?: { general?: string[] };
  rooms?: any[];
  status?: string;
  media?: Array<string | { url?: string; type?: string }>;
}

interface EditHotelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel | null;
  onSave: (hotel: any) => void;
}

export default function EditHotelDialog({
  isOpen,
  onClose,
  hotel,
  onSave,
}: EditHotelDialogProps) {
  const [activeTab, setActiveTab] = useState("general");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState<any>({
    name: "",
    address: "",
    city: "",
    country: "",
    stars: 0,
    shortDescription: "",
    description: "",
    location: { lat: 0, lng: 0 },
    facilities: { general: [] as string[] },
    rooms: [] as any[],
    status: "active",
    media: [] as string[],
    propertyHighlights: {
      perfectFor: "",
      locationScore: 0,
      locationDescription: "",
      roomsWith: [] as string[],
    },
    houseRules: {
      checkIn: { time: "15:00", note: "", advanceNotice: "" },
      checkOut: { time: "11:00" },
      cancellation: { policy: "", conditions: "" },
      children: { welcome: "", searchNote: "", cotPolicy: { ageRange: "", cotPrice: "", note: "", additionalInfo: "", availability: "", noExtraBeds: "", subjectToAvailability: "" } },
      ageRestriction: { hasRestriction: false, minimumAge: null as number | null, note: "" },
      pets: { allowed: false, note: "" },
      paymentMethods: { methods: [] as string[] },
      parties: { allowed: false, note: "" },
    },
    surroundings: {
      nearbyAttractions: [] as { name: string; distance: string }[],
      restaurantsCafes: [] as { name: string; type: string; distance: string }[],
      publicTransport: [] as { name: string; type: string; distance: string }[],
    },
    overview: {},
    mostPopularFacilities: [] as string[],
    categories: [] as string[],
    travellersQuestions: [] as { question: string; answer: string }[],
    languagesSpoken: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [expandedRooms, setExpandedRooms] = useState<Record<number, boolean>>({});
  const [showAll, setShowAll] = useState(false);

  const initialBlank = () => ({
    name: "",
    address: "",
    city: "",
    country: "",
    stars: 0,
    shortDescription: "",
    description: "",
    location: { lat: 0, lng: 0 },
    facilities: { general: [] as string[] },
    rooms: [] as any[],
    status: "active",
    media: [] as string[],
    propertyHighlights: { perfectFor: "", locationScore: 0, locationDescription: "", roomsWith: [] as string[] },
    houseRules: {
      checkIn: { time: "15:00", note: "", advanceNotice: "" },
      checkOut: { time: "11:00" },
      cancellation: { policy: "", conditions: "" },
      children: { welcome: "", searchNote: "", cotPolicy: { ageRange: "", cotPrice: "", note: "", additionalInfo: "", availability: "", noExtraBeds: "", subjectToAvailability: "" } },
      ageRestriction: { hasRestriction: false, minimumAge: null as number | null, note: "" },
      pets: { allowed: false, note: "" },
      paymentMethods: { methods: [] as string[] },
      parties: { allowed: false, note: "" },
    },
    surroundings: { nearbyAttractions: [], restaurantsCafes: [], publicTransport: [] },
    overview: {},
    mostPopularFacilities: [] as string[],
    categories: [] as string[],
    travellersQuestions: [] as { question: string; answer: string }[],
    languagesSpoken: [] as string[],
  });

  useEffect(() => {
    if (isOpen && !hotel) {
      setFormData(initialBlank());
      setExpandedRooms({});
    }
  }, [isOpen, hotel]);

  useEffect(() => {
    const load = async () => {
      if (!hotel) return;
      setLoading(true);
      try {
        let full = hotel as any;
        try {
          full = await getHotelById(String(hotel.id));
        } catch {}
        const normalizedMedia: string[] = Array.isArray(full.media)
          ? full.media
              .map((m: any) => (typeof m === "string" ? m : m?.url))
              .filter((x: any) => typeof x === "string" && x.length > 0)
          : [];
        const normalizedRooms = Array.isArray(full.rooms)
          ? full.rooms.map((r: any) => {
              const photos: string[] = Array.isArray(r?.photos || r?.media)
                ? (r.photos || r.media)
                    .map((p: any) => (typeof p === "string" ? p : p?.url))
                    .filter((x: any) => typeof x === "string" && x.length > 0)
                : [];
              return {
                ...r,
                photos,
              };
            })
          : [];
      setFormData({
          name: full.name || "",
          address: full.address || "",
          city: full.city || "",
          country: full.country || "",
          stars: Number(full.stars || 0),
          shortDescription: full.shortDescription || "",
          description: full.description || "",
          location: full.location || { lat: 0, lng: 0 },
          facilities: full.facilities || { general: [] },
          rooms: normalizedRooms,
          status: full.status || "active",
          media: normalizedMedia,
          propertyHighlights: full.propertyHighlights || { perfectFor: "", locationScore: 0, locationDescription: "", roomsWith: [] },
          houseRules: full.houseRules || {
            checkIn: { time: "15:00", note: "", advanceNotice: "" },
            checkOut: { time: "11:00" },
            cancellation: { policy: "", conditions: "" },
            children: { welcome: "", searchNote: "", cotPolicy: { ageRange: "", cotPrice: "", note: "", additionalInfo: "", availability: "", noExtraBeds: "", subjectToAvailability: "" } },
            ageRestriction: { hasRestriction: false, minimumAge: null, note: "" },
            pets: { allowed: false, note: "" },
            paymentMethods: { methods: [] },
            parties: { allowed: false, note: "" },
          },
          surroundings: full.surroundings || { nearbyAttractions: [], restaurantsCafes: [], publicTransport: [] },
          overview: full.overview || {},
          mostPopularFacilities: toStringArray(full.mostPopularFacilities),
          categories: toStringArray(full.categories),
          travellersQuestions: Array.isArray(full.travellersQuestions) ? full.travellersQuestions.map((q: any) => ({ question: q.question || "", answer: q.answer || "" })) : [],
          languagesSpoken: toStringArray(full.languagesSpoken),
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [hotel]);

  // Google Places Autocomplete on address input
  useEffect(() => {
    if (!isOpen) return;
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
    if (!apiKey) return;

    let autocomplete: google.maps.places.Autocomplete | null = null;
    // Ensure Google suggestions overlay appears above the dialog
    const styleId = "gmaps-pac-zindex";
    if (!document.getElementById(styleId)) {
      const s = document.createElement("style");
      s.id = styleId;
      s.innerHTML = `.pac-container{z-index:999999!important}`;
      document.head.appendChild(s);
    }

    const init = async () => {
      try {
        const loader = new Loader({ apiKey, version: "weekly", libraries: ["places"] });
        await loader.load();
        if (!addressInputRef.current) return;
        autocomplete = new google.maps.places.Autocomplete(addressInputRef.current as HTMLInputElement, {
          fields: ["geometry", "address_components", "formatted_address"],
          types: ["geocode"],
        });
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete!.getPlace();
          if (!place) return;
          const components = place.address_components || [];
          const getPart = (type: string) => {
            const comp = components.find((c) => (c.types || []).includes(type));
            return comp?.long_name || "";
          };
          const city = getPart("locality") || getPart("administrative_area_level_2") || getPart("administrative_area_level_1");
          const country = getPart("country");
          const address = place.formatted_address || addressInputRef.current!.value || "";
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();

          // Update the input display immediately
          if (addressInputRef.current) addressInputRef.current.value = address;

          setFormData((prev: any) => ({
            ...prev,
            address,
            city: city || prev.city,
            country: country || prev.country,
            location: {
              lat: typeof lat === "number" ? lat : (lat ? lat : prev.location?.lat || 0),
              lng: typeof lng === "number" ? lng : (lng ? lng : prev.location?.lng || 0),
            },
          }));
        });
      } catch {
        // ignore loader errors
      }
    };

    init();

    return () => {
      // Autocomplete cleans up on GC; no explicit dispose in JS API
      autocomplete = null;
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    onSave(hotel ? { id: hotel.id, ...payload } : payload);
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleLocation = (k: "lat" | "lng", value: number) => {
    setFormData((prev: any) => ({ ...prev, location: { ...prev.location, [k]: value } }));
  };

  const updateRoom = (index: number, key: string, value: any) => {
    setFormData((prev: any) => {
      const next = [...prev.rooms];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, rooms: next };
    });
  };

  const addRoom = () => {
    setFormData((prev: any) => {
      const newIndex = (prev.rooms || []).length;
      const newRoom = {
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
        features: [] as string[],
        photos: [] as string[],
      };
      const nextRooms = [...(prev.rooms || []), newRoom];
      // expand the new room for editing
      setExpandedRooms((er) => ({ ...er, [newIndex]: true }));
      return { ...prev, rooms: nextRooms };
    });
  };

  const removeRoom = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      rooms: prev.rooms.filter((_: any, i: number) => i !== index),
    }));
  };

  const addRoomPhoto = (roomIndex: number, url: string) => {
    const v = url.trim();
    if (!v) return;
    setFormData((prev: any) => {
      const next = [...prev.rooms];
      const photos = Array.isArray(next[roomIndex]?.photos) ? next[roomIndex].photos : [];
      next[roomIndex] = { ...next[roomIndex], photos: [...photos, v] };
      return { ...prev, rooms: next };
    });
  };

  const updateRoomPhoto = (roomIndex: number, photoIndex: number, url: string) => {
    setFormData((prev: any) => {
      const next = [...prev.rooms];
      const photos = [...(next[roomIndex].photos || [])];
      photos[photoIndex] = url;
      next[roomIndex] = { ...next[roomIndex], photos };
      return { ...prev, rooms: next };
    });
  };

  const removeRoomPhoto = (roomIndex: number, photoIndex: number) => {
    setFormData((prev: any) => {
      const next = [...prev.rooms];
      const photos = (next[roomIndex].photos || []).filter((_: string, i: number) => i !== photoIndex);
      next[roomIndex] = { ...next[roomIndex], photos };
      return { ...prev, rooms: next };
    });
  };

  const addMediaUrl = () => {
    const url = newMediaUrl.trim();
    if (!url) return;
    setFormData((prev: any) => ({ ...prev, media: [...(prev.media || []), url] }));
    setNewMediaUrl("");
  };

  const removeMediaUrl = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      media: (prev.media || []).filter((_: string, i: number) => i !== index),
    }));
  };

  const generalFacilitiesCsv = (formData.facilities?.general || []).join(", ");

  const onTabChange = (v: string) => {
    setActiveTab(v);
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleRoomExpanded = (idx: number) => {
    setExpandedRooms((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const expandAllRooms = () => {
    const map: Record<number, boolean> = {};
    (formData.rooms || []).forEach((_: any, i: number) => (map[i] = true));
    setExpandedRooms(map);
  };

  // helpers to edit arrays by csv
  const csv = (arr?: string[]) => (Array.isArray(arr) ? arr.join(", ") : "");
  const parseCsv = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
  const toStringArray = (v: any): string[] => (Array.isArray(v) ? v.map((x) => String(x)).filter(Boolean) : typeof v === "string" ? parseCsv(v) : []);
  const csvSafe = (v: any) => toStringArray(v).join(", ");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[980px]">
        <DialogHeader>
          <DialogTitle>{hotel ? "Edit Hotel" : "Add Hotel"}</DialogTitle>
          <DialogDescription>{hotel ? "Update all hotel information" : "Create a new hotel with full details"}</DialogDescription>
        </DialogHeader>

        <div ref={scrollRef} className="max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs>
              <div className="flex items-center justify-between sticky top-0 bg-white z-10 px-2 py-1">
                <TabsList className="grid grid-cols-6 gap-1">
                  <TabsTrigger className="px-2 py-1 text-xs" onClick={() => onTabChange("general")}>General</TabsTrigger>
                  <TabsTrigger className="px-2 py-1 text-xs" onClick={() => onTabChange("location")}>Location</TabsTrigger>
                  <TabsTrigger className="px-2 py-1 text-xs" onClick={() => onTabChange("facilities")}>Facilities</TabsTrigger>
                  <TabsTrigger className="px-2 py-1 text-xs" onClick={() => onTabChange("rooms")}>Rooms</TabsTrigger>
                  <TabsTrigger className="px-2 py-1 text-xs" onClick={() => onTabChange("media")}>Media</TabsTrigger>
                  <TabsTrigger className="px-2 py-1 text-xs" onClick={() => onTabChange("advanced")}>Advanced</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-xs text-gray-600">
                    <input type="checkbox" checked={showAll} onChange={(e) => {
                      const v = e.target.checked;
                      setShowAll(v);
                    }} />
                    Show all
                  </label>
            </div>
          </div>

              {(showAll || activeTab === "general") && (
                <div className="space-y-4">
                  {/* general content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
                      <div className="text-xs text-gray-500">Hotel display name shown to guests.</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="text-xs text-gray-500">Active = visible and bookable, Inactive = hidden.</div>
            </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        ref={addressInputRef}
                        value={formData.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        autoComplete="off"
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); } }}
                        placeholder="Start typing and select from suggestions"
                      />
                      <div className="text-xs text-gray-500">Start typing and choose a suggested address to auto-fill lat/lng.</div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
                      <div className="text-xs text-gray-500">City/town of the property.</div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" value={formData.country} onChange={(e) => handleChange("country", e.target.value)} />
                      <div className="text-xs text-gray-500">Country (e.g., Israel).</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short description</Label>
                    <Input id="shortDescription" value={formData.shortDescription} onChange={(e) => handleChange("shortDescription", e.target.value)} placeholder="A concise marketing sentence" />
                    <div className="text-xs text-gray-500">One short marketing sentence (used in teasers).</div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => handleChange("description", e.target.value)} rows={5} placeholder="Full property description" />
                    <div className="text-xs text-gray-500">Full property description, facilities and highlights.</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stars">Stars</Label>
                      <Input id="stars" type="number" min="1" max="5" step="1" value={formData.stars} onChange={(e) => handleChange("stars", parseInt(e.target.value || "0"))} />
                      <div className="text-xs text-gray-500">Star rating 1–5 (if applicable).</div>
                    </div>
                  </div>
                </div>
              )}

              {(showAll || activeTab === "location") && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lat">Latitude</Label>
                      <Input id="lat" type="number" step="0.000001" value={formData.location?.lat ?? 0} onChange={(e) => handleLocation("lat", parseFloat(e.target.value || "0"))} />
                      <div className="text-xs text-gray-500">Latitude (decimal degrees).</div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lng">Longitude</Label>
                      <Input id="lng" type="number" step="0.000001" value={formData.location?.lng ?? 0} onChange={(e) => handleLocation("lng", parseFloat(e.target.value || "0"))} />
                      <div className="text-xs text-gray-500">Longitude (decimal degrees).</div>
                    </div>
                  </div>
                </div>
              )}

              {(showAll || activeTab === "facilities") && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="generalFacilities">Facilities (comma separated)</Label>
                    <Input id="generalFacilities" value={generalFacilitiesCsv} onChange={(e) => setFormData((prev: any) => ({ ...prev, facilities: { ...(prev.facilities || {}), general: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } }))} />
                    <div className="text-xs text-gray-500">Separate items with commas (e.g., Free WiFi, Terrace, Family rooms).</div>
                  </div>
                </div>
              )}

              {(showAll || activeTab === "rooms") && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Rooms</div>
                    <div className="flex items-center gap-2">
                      <Button type="button" onClick={addRoom} size="sm">Add room</Button>
                      <Button type="button" variant="outline" size="sm" onClick={expandAllRooms}>Expand all</Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {formData.rooms.map((room: any, idx: number) => (
                      <div key={idx} className="rounded border p-3 space-y-3">
                        {/* Summary row */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-4 flex-wrap text-sm">
                            <div>
                              <span className="text-gray-500">Name: </span>
                              <span className="font-medium">{room.name || "Untitled"}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Type: </span>
                              <span className="font-medium">{room.roomType || "STANDARD"}</span>
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
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={room.photos[0]} alt="room" className="w-full h-full object-cover" />
                              </div>
                            )}
                            {(() => {
                              const isOpen = !!expandedRooms[idx];
                              return (
                                <Button type="button" size="sm" variant="outline" onClick={() => toggleRoomExpanded(idx)}>
                                  {isOpen ? "Hide" : "Edit"}
                                </Button>
                              );
                            })()}
                            <Button type="button" variant="destructive" size="sm" onClick={() => removeRoom(idx)}>
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
                                  <Input value={room.name || ""} onChange={(e) => updateRoom(idx, "name", e.target.value)} />
                                </div>
                                <div>
                                  <Label className="text-xs">Type</Label>
                                  <select value={room.roomType || "STANDARD"} onChange={(e) => updateRoom(idx, "roomType", e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                                    <option value="STANDARD">STANDARD</option>
                                    <option value="SUPERIOR">SUPERIOR</option>
                                    <option value="DELUXE">DELUXE</option>
                                    <option value="SUITE">SUITE</option>
                                    <option value="FAMILY">FAMILY</option>
                                  </select>
                                </div>
                                <div>
                                  <Label className="text-xs">Price / night</Label>
                                  <Input type="number" min="0" value={room.pricePerNight ?? 0} onChange={(e) => updateRoom(idx, "pricePerNight", parseFloat(e.target.value || "0"))} />
                                </div>
                                <div>
                                  <Label className="text-xs">Total rooms</Label>
                                  <Input type="number" min="1" value={room.totalRooms ?? 1} onChange={(e) => updateRoom(idx, "totalRooms", parseInt(e.target.value || "1"))} />
                                </div>
                                <div>
                                  <Label className="text-xs">Adults</Label>
                                  <Input type="number" min="0" value={room.maxAdults ?? 0} onChange={(e) => updateRoom(idx, "maxAdults", parseInt(e.target.value || "0"))} />
                                </div>
                                <div>
                                  <Label className="text-xs">Children</Label>
                                  <Input type="number" min="0" value={room.maxChildren ?? 0} onChange={(e) => updateRoom(idx, "maxChildren", parseInt(e.target.value || "0"))} />
                                </div>
                                <div>
                                  <Label className="text-xs">Capacity</Label>
                                  <Input type="number" min="1" value={room.capacity ?? 1} onChange={(e) => updateRoom(idx, "capacity", parseInt(e.target.value || "1"))} />
                                </div>
                                <div>
                                  <Label className="text-xs">Size (sqm)</Label>
                                  <Input type="number" min="0" value={room.sizeSqm ?? 0} onChange={(e) => updateRoom(idx, "sizeSqm", parseInt(e.target.value || "0"))} />
                                </div>
                                <div>
                                  <Label className="text-xs">Bedrooms</Label>
                                  <Input type="number" min="0" value={room.bedrooms ?? 0} onChange={(e) => updateRoom(idx, "bedrooms", parseInt(e.target.value || "0"))} />
                                </div>
                                <div>
                                  <Label className="text-xs">Bathrooms</Label>
                                  <Input type="number" min="0" value={room.bathrooms ?? 1} onChange={(e) => updateRoom(idx, "bathrooms", parseInt(e.target.value || "0"))} />
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs">Features (comma separated)</Label>
                                <Input value={(room.features || []).join(", ")} onChange={(e) => updateRoom(idx, "features", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
                                <div className="text-xs text-gray-500">Example: Balcony, City view, Coffee machine.</div>
            </div>
            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-medium">Room photos</div>
                                  <div className="flex gap-2">
                                    <Input placeholder="https://..." value={room.__newPhoto || ""} onChange={(e) => updateRoom(idx, "__newPhoto", e.target.value)} className="h-9 w-64" />
                                    <Button type="button" size="sm" onClick={() => addRoomPhoto(idx, room.__newPhoto || "")}>Add</Button>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  {(room.photos || []).map((url: string, i: number) => (
                                    <div key={`${url}-${i}`} className="border rounded p-2 flex flex-col gap-2">
                                      <div className="aspect-[4/3] bg-gray-100 overflow-hidden rounded">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        {url ? <img src={url} alt="room" className="w-full h-full object-cover" /> : <div className="w-full h-full" />}
                                      </div>
                                      <Input value={url} onChange={(e) => updateRoomPhoto(idx, i, e.target.value)} />
                                      <div className="text-xs text-gray-500">Paste an image URL (e.g., https://images...).</div>
                                      <Button type="button" variant="destructive" onClick={() => removeRoomPhoto(idx, i)}>
                                        Remove
                                      </Button>
                                    </div>
                                  ))}
                                  {(!room.photos || room.photos.length === 0) && (
                                    <div className="text-sm text-gray-600">No photos yet. Add image URLs above.</div>
                                  )}
                                </div>
                              </div>
                            </>
                          ) : null;
                        })()}
                      </div>
                    ))}
                    {formData.rooms.length === 0 && (
                      <div className="text-sm text-gray-600">No rooms yet. Click "Add room" to create one.</div>
                    )}
                  </div>
                </div>
              )}

              {(showAll || activeTab === "media") && (
                <div className="space-y-4">
            <div className="space-y-2">
                    <Label htmlFor="newMedia">Add image URL</Label>
                    <div className="flex gap-2">
                      <Input id="newMedia" placeholder="https://..." value={newMediaUrl} onChange={(e) => setNewMediaUrl(e.target.value)} />
                      <Button type="button" onClick={addMediaUrl}>Add</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(formData.media || []).map((m: string | { url?: string }, i: number) => {
                      const url = typeof m === "string" ? m : (m?.url || "");
                      return (
                        <div key={`${url}-${i}`} className="border rounded p-2 flex flex-col gap-2">
                          <div className="aspect-[4/3] bg-gray-100 overflow-hidden rounded">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {url ? <img src={url} alt="media" className="w-full h-full object-cover" /> : <div className="w-full h-full" />}
                          </div>
                          <Input value={url} onChange={(e) => {
                            const v = e.target.value;
                            setFormData((prev: any) => {
                              const next = [...(prev.media || [])];
                              next[i] = v;
                              return { ...prev, media: next };
                            });
                          }} />
                          <Button type="button" variant="destructive" onClick={() => removeMediaUrl(i)}>
                            Remove
                          </Button>
                        </div>
                      );
                    })}
                    {(!formData.media || formData.media.length === 0) && (
                      <div className="text-sm text-gray-600">No images yet. Add image URLs above.</div>
                    )}
                  </div>
                </div>
              )}

              {(showAll || activeTab === "advanced") && (
                <div className="space-y-6">
                  {/* Advanced content remains the same as before */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Property highlights</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Perfect for</Label>
                        <Input value={formData.propertyHighlights?.perfectFor || ""} onChange={(e) => setFormData((p: any) => ({ ...p, propertyHighlights: { ...(p.propertyHighlights || {}), perfectFor: e.target.value } }))} />
                      </div>
                      <div>
                        <Label className="text-xs">Location score</Label>
                        <Input type="number" min="0" max="10" step="0.1" value={formData.propertyHighlights?.locationScore ?? 0} onChange={(e) => setFormData((p: any) => ({ ...p, propertyHighlights: { ...(p.propertyHighlights || {}), locationScore: parseFloat(e.target.value || "0") } }))} />
                      </div>
                      <div>
                        <Label className="text-xs">Location description</Label>
                        <Input value={formData.propertyHighlights?.locationDescription || ""} onChange={(e) => setFormData((p: any) => ({ ...p, propertyHighlights: { ...(p.propertyHighlights || {}), locationDescription: e.target.value } }))} />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Rooms with (comma separated)</Label>
                      <Input value={csv(formData.propertyHighlights?.roomsWith)} onChange={(e) => setFormData((p: any) => ({ ...p, propertyHighlights: { ...(p.propertyHighlights || {}), roomsWith: parseCsv(e.target.value) } }))} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium">House rules</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Check-in time</Label>
                        <Input value={formData.houseRules?.checkIn?.time || ""} onChange={(e) => setFormData((p: any) => ({ ...p, houseRules: { ...(p.houseRules || {}), checkIn: { ...(p.houseRules?.checkIn || {}), time: e.target.value } } }))} />
                      </div>
                      <div>
                        <Label className="text-xs">Check-out time</Label>
                        <Input value={formData.houseRules?.checkOut?.time || ""} onChange={(e) => setFormData((p: any) => ({ ...p, houseRules: { ...(p.houseRules || {}), checkOut: { ...(p.houseRules?.checkOut || {}), time: e.target.value } } }))} />
                      </div>
                      <div>
                        <Label className="text-xs">Cancellation policy</Label>
                        <Input value={formData.houseRules?.cancellation?.policy || ""} onChange={(e) => setFormData((p: any) => ({ ...p, houseRules: { ...(p.houseRules || {}), cancellation: { ...(p.houseRules?.cancellation || {}), policy: e.target.value } } }))} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Children welcome</Label>
                        <Input value={formData.houseRules?.children?.welcome || ""} onChange={(e) => setFormData((p: any) => ({ ...p, houseRules: { ...(p.houseRules || {}), children: { ...(p.houseRules?.children || {}), welcome: e.target.value } } }))} />
                      </div>
                      <div>
                        <Label className="text-xs">Pets note</Label>
                        <Input value={formData.houseRules?.pets?.note || ""} onChange={(e) => setFormData((p: any) => ({ ...p, houseRules: { ...(p.houseRules || {}), pets: { ...(p.houseRules?.pets || {}), note: e.target.value } } }))} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium">Surroundings</div>
                    <div>
                      <Label className="text-xs">Nearby attractions (name | distance per line)</Label>
                      <Textarea rows={3} value={(formData.surroundings?.nearbyAttractions || []).map((a: any) => `${a.name} | ${a.distance}`).join("\n")} onChange={(e) => setFormData((p: any) => ({ ...p, surroundings: { ...(p.surroundings || {}), nearbyAttractions: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => { const [name, distance] = l.split("|").map((x) => x.trim()); return { name, distance }; }) } }))} />
                    </div>
                    <div>
                      <Label className="text-xs">Restaurants & Cafes (name | type | distance per line)</Label>
                      <Textarea rows={3} value={(formData.surroundings?.restaurantsCafes || []).map((a: any) => `${a.name} | ${a.type} | ${a.distance}`).join("\n")} onChange={(e) => setFormData((p: any) => ({ ...p, surroundings: { ...(p.surroundings || {}), restaurantsCafes: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => { const [name, type, distance] = l.split("|").map((x) => x.trim()); return { name, type, distance }; }) } }))} />
                    </div>
                    <div>
                      <Label className="text-xs">Public transport (name | type | distance per line)</Label>
                      <Textarea rows={3} value={(formData.surroundings?.publicTransport || []).map((a: any) => `${a.name} | ${a.type} | ${a.distance}`).join("\n")} onChange={(e) => setFormData((p: any) => ({ ...p, surroundings: { ...(p.surroundings || {}), publicTransport: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => { const [name, type, distance] = l.split("|").map((x) => x.trim()); return { name, type, distance }; }) } }))} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium">Overview sections</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-1">
                        <Label className="text-xs">Info & Prices</Label>
                        <Textarea rows={3} value={formData.overview?.infoAndPrices || ""} onChange={(e) => setFormData((p: any) => ({ ...p, overview: { ...(p.overview || {}), infoAndPrices: e.target.value } }))} />
                      </div>
                      <div className="md:col-span-1">
                        <Label className="text-xs">Activity</Label>
                        <Textarea rows={3} value={formData.overview?.activity || ""} onChange={(e) => setFormData((p: any) => ({ ...p, overview: { ...(p.overview || {}), activity: e.target.value } }))} />
                      </div>
                      <div className="md:col-span-1">
                        <Label className="text-xs">Facilities (overview text)</Label>
                        <Textarea rows={3} value={formData.overview?.facilities || ""} onChange={(e) => setFormData((p: any) => ({ ...p, overview: { ...(p.overview || {}), facilities: e.target.value } }))} />
                      </div>
                      <div className="md:col-span-1">
                        <Label className="text-xs">House Rules (overview text)</Label>
                        <Textarea rows={3} value={formData.overview?.houseRules || ""} onChange={(e) => setFormData((p: any) => ({ ...p, overview: { ...(p.overview || {}), houseRules: e.target.value } }))} />
                      </div>
                      <div className="md:col-span-1">
                        <Label className="text-xs">Fine Print</Label>
                        <Textarea rows={3} value={formData.overview?.finePrint || ""} onChange={(e) => setFormData((p: any) => ({ ...p, overview: { ...(p.overview || {}), finePrint: e.target.value } }))} />
                      </div>
                      <div className="md:col-span-1">
                        <Label className="text-xs">Guest Reviews (overview text)</Label>
                        <Textarea rows={3} value={formData.overview?.guestReviews || ""} onChange={(e) => setFormData((p: any) => ({ ...p, overview: { ...(p.overview || {}), guestReviews: e.target.value } }))} />
                      </div>
                      <div className="md:col-span-1">
                        <Label className="text-xs">Travellers Asking</Label>
                        <Textarea rows={3} value={formData.overview?.travellersAsking || ""} onChange={(e) => setFormData((p: any) => ({ ...p, overview: { ...(p.overview || {}), travellersAsking: e.target.value } }))} />
                      </div>
                      <div className="md:col-span-1">
                        <Label className="text-xs">Hotel Surroundings</Label>
                        <Textarea rows={3} value={formData.overview?.hotelSurroundings || ""} onChange={(e) => setFormData((p: any) => ({ ...p, overview: { ...(p.overview || {}), hotelSurroundings: e.target.value } }))} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium">Most popular facilities & Categories</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Most popular facilities (comma separated)</Label>
                        <Input value={csvSafe(formData.mostPopularFacilities)} onChange={(e) => setFormData((p: any) => ({ ...p, mostPopularFacilities: parseCsv(e.target.value) }))} />
                        <div className="text-xs text-gray-500">Comma-separated list of top amenities shown on the card.</div>
                      </div>
                      <div>
                        <Label className="text-xs">Categories (comma separated)</Label>
                        <Input value={csvSafe(formData.categories)} onChange={(e) => setFormData((p: any) => ({ ...p, categories: parseCsv(e.target.value) }))} />
                        <div className="text-xs text-gray-500">Tags (e.g., Family, Business, Beachfront).</div>
                      </div>
            </div>
          </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium">Travellers questions</div>
                    <div className="space-y-2">
                      {(formData.travellersQuestions || []).map((q: any, i: number) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded p-2">
                          <div>
                            <Label className="text-xs">Question</Label>
                            <Input value={q.question} onChange={(e) => setFormData((p: any) => { const list = [...(p.travellersQuestions || [])]; list[i] = { ...list[i], question: e.target.value }; return { ...p, travellersQuestions: list }; })} />
                          </div>
                          <div>
                            <Label className="text-xs">Answer</Label>
                            <Input value={q.answer} onChange={(e) => setFormData((p: any) => { const list = [...(p.travellersQuestions || [])]; list[i] = { ...list[i], answer: e.target.value }; return { ...p, travellersQuestions: list }; })} />
                          </div>
                          <div className="md:col-span-2 flex justify-end">
                            <Button type="button" variant="destructive" size="sm" onClick={() => setFormData((p: any) => ({ ...p, travellersQuestions: (p.travellersQuestions || []).filter((_: any, idx: number) => idx !== i) }))}>Remove</Button>
                          </div>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => setFormData((p: any) => ({ ...p, travellersQuestions: [ ...(p.travellersQuestions || []), { question: "", answer: "" } ] }))}>Add question</Button>
            </div>
          </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium">Languages</div>
                    <div>
                      <Label className="text-xs">Languages spoken (comma separated)</Label>
                      <Input value={csvSafe(formData.languagesSpoken)} onChange={(e) => setFormData((p: any) => ({ ...p, languagesSpoken: parseCsv(e.target.value) }))} />
                      <div className="text-xs text-gray-500">Example: Hebrew, English, Russian.</div>
                    </div>
                  </div>
                </div>
              )}
            </Tabs>

          <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
              <Button type="submit" disabled={loading}>Save Changes</Button>
          </DialogFooter>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
