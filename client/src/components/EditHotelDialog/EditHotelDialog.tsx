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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getHotelById } from "@/lib/api";
import GeneralTab from "./GeneralTab";
import LocationTab from "./LocationTab";
import FacilitiesTab from "./FacilitiesTab";
import RoomsTab from "./RoomsTab";
import MediaTab from "./MediaTab";
import AdvancedTab from "./AdvancedTab";
import type { EditHotelDialogProps, FormData } from "./types";

export default function EditHotelDialog({
  isOpen,
  onClose,
  hotel,
  onSave,
}: EditHotelDialogProps) {
  const [activeTab, setActiveTab] = useState("general");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    city: "",
    country: "",
    stars: 0,
    shortDescription: "",
    description: "",
    location: { lat: 0, lng: 0 },
    facilities: {
      general: [],
      greatForStay: [],
      bathroom: [],
      bedroom: [],
      view: [],
      outdoors: [],
      kitchen: [],
      roomAmenities: [],
      livingArea: [],
      mediaTechnology: [],
      foodDrink: [],
      internet: "",
      parking: "",
      receptionServices: [],
      safetySecurity: [],
      generalFacilities: [],
    },
    rooms: [],
    status: "active",
    media: [],
    propertyHighlights: {
      perfectFor: "",
      locationScore: 0,
      locationDescription: "",
      roomsWith: [],
    },
    houseRules: {
      checkIn: { time: "15:00", note: "", advanceNotice: "" },
      checkOut: { time: "11:00" },
      cancellation: { policy: "", conditions: "" },
      children: {
        welcome: "",
        searchNote: "",
        cotPolicy: {
          ageRange: "",
          cotPrice: "",
          note: "",
          additionalInfo: "",
          availability: "",
          noExtraBeds: "",
          subjectToAvailability: "",
        },
      },
      ageRestriction: {
        hasRestriction: false,
        minimumAge: null,
        note: "",
      },
      pets: { allowed: false, note: "" },
      paymentMethods: { methods: [] },
      parties: { allowed: false, note: "" },
    },
    surroundings: {
      nearbyAttractions: [],
      topAttractions: [],
      restaurantsCafes: [],
      naturalBeauty: [],
      publicTransport: [],
      closestAirports: [],
    },
    overview: {},
    mostPopularFacilities: [],
    travellersQuestions: [],
  });
  const [loading, setLoading] = useState(false);
  const [expandedRooms, setExpandedRooms] = useState<Record<number, boolean>>(
    {}
  );
  const [showAll, setShowAll] = useState(false);

  const initialBlank = (): FormData => ({
    name: "",
    address: "",
    city: "",
    country: "",
    stars: 0,
    shortDescription: "",
    description: "",
    location: { lat: 0, lng: 0 },
    facilities: {
      general: [],
      greatForStay: [],
      bathroom: [],
      bedroom: [],
      view: [],
      outdoors: [],
      kitchen: [],
      roomAmenities: [],
      livingArea: [],
      mediaTechnology: [],
      foodDrink: [],
      internet: "",
      parking: "",
      receptionServices: [],
      safetySecurity: [],
      generalFacilities: [],
    },
    rooms: [],
    status: "active",
    media: [],
    propertyHighlights: {
      perfectFor: "",
      locationScore: 0,
      locationDescription: "",
      roomsWith: [],
    },
    houseRules: {
      checkIn: { time: "15:00", note: "", advanceNotice: "" },
      checkOut: { time: "11:00" },
      cancellation: { policy: "", conditions: "" },
      children: {
        welcome: "",
        searchNote: "",
        cotPolicy: {
          ageRange: "",
          cotPrice: "",
          note: "",
          additionalInfo: "",
          availability: "",
          noExtraBeds: "",
          subjectToAvailability: "",
        },
      },
      ageRestriction: {
        hasRestriction: false,
        minimumAge: null,
        note: "",
      },
      pets: { allowed: false, note: "" },
      paymentMethods: { methods: [] },
      parties: { allowed: false, note: "" },
    },
    surroundings: {
      nearbyAttractions: [],
      topAttractions: [],
      restaurantsCafes: [],
      naturalBeauty: [],
      publicTransport: [],
      closestAirports: [],
    },
    overview: {},
    mostPopularFacilities: [],
    travellersQuestions: [],
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
        let full = hotel;
        try {
          full = await getHotelById(String(hotel.id));
        } catch {}
        const normalizedMedia: string[] = Array.isArray(full.media)
          ? full.media
              .map((m) => (typeof m === "string" ? m : m?.url))
              .filter((x): x is string => typeof x === "string" && x.length > 0)
          : [];

        const convertServerToUIFormat = (
          facilities: Record<string, unknown>
        ) => {
          const converted: Record<string, unknown> = {};

          Object.keys(facilities || {}).forEach((key) => {
            const value = facilities[key];

            if (Array.isArray(value)) {
              converted[key] = value.map((item) => {
                if (typeof item === "string") {
                  const match = item.match(/^(.+?)(?:\s*\((.+)\))?$/);
                  if (match) {
                    return {
                      name: match[1].trim(),
                      available: true,
                      note: match[2] ? match[2].trim() : "",
                    };
                  }
                  return {
                    name: item.trim(),
                    available: true,
                    note: "",
                  };
                }
                return item;
              });
            } else if (typeof value === "string") {
              converted[key] = value;
            }
          });

          return converted;
        };
        const normalizedRooms = Array.isArray(full.rooms)
          ? full.rooms.map((r) => {
              const photos: string[] = Array.isArray(r?.photos || r?.media)
                ? (r.photos || r.media)
                    .map((p) =>
                      typeof p === "string" ? p : (p as { url?: string })?.url
                    )
                    .filter(
                      (x): x is string => typeof x === "string" && x.length > 0
                    )
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
          facilities: {
            general: [],
            greatForStay: [],
            bathroom: [],
            bedroom: [],
            view: [],
            outdoors: [],
            kitchen: [],
            roomAmenities: [],
            livingArea: [],
            mediaTechnology: [],
            foodDrink: [],
            internet: "",
            parking: "",
            receptionServices: [],
            safetySecurity: [],
            generalFacilities: [],
            languagesSpoken: [],
            ...convertServerToUIFormat(full.facilities || {}),
          },
          rooms: normalizedRooms,
          status: full.status || "active",
          media: normalizedMedia,
          propertyHighlights: full.propertyHighlights || {
            perfectFor: "",
            locationScore: 0,
            locationDescription: "",
            roomsWith: [],
          },
          houseRules: full.houseRules || {
            checkIn: { time: "15:00", note: "", advanceNotice: "" },
            checkOut: { time: "11:00" },
            cancellation: { policy: "", conditions: "" },
            children: {
              welcome: "",
              searchNote: "",
              cotPolicy: {
                ageRange: "",
                cotPrice: "",
                note: "",
                additionalInfo: "",
                availability: "",
                noExtraBeds: "",
                subjectToAvailability: "",
              },
            },
            ageRestriction: {
              hasRestriction: false,
              minimumAge: null,
              note: "",
            },
            pets: { allowed: false, note: "" },
            paymentMethods: { methods: [] },
            parties: { allowed: false, note: "" },
          },
          surroundings: full.surroundings || {
            nearbyAttractions: [],
            topAttractions: [],
            restaurantsCafes: [],
            naturalBeauty: [],
            publicTransport: [],
            closestAirports: [],
          },
          overview: full.overview || {},
          mostPopularFacilities: Array.isArray(full.mostPopularFacilities)
            ? full.mostPopularFacilities.map((item) =>
                typeof item === "string"
                  ? { name: item, distance: "", type: "" }
                  : {
                      name: item.name || "",
                      distance: item.distance || "",
                      type: item.type || "",
                    }
              )
            : [],
          travellersQuestions: Array.isArray(full.travellersQuestions)
            ? full.travellersQuestions.map((q) => ({
                question: q.question || "",
                answer: q.answer || "",
              }))
            : [],
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [hotel]);

  useEffect(() => {
    if (!isOpen) return;
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
      | string
      | undefined;
    if (!apiKey) return;

    let autocomplete: google.maps.places.Autocomplete | null = null;
    const styleId = "gmaps-pac-zindex";
    if (!document.getElementById(styleId)) {
      const s = document.createElement("style");
      s.id = styleId;
      s.innerHTML = `.pac-container{z-index:999999!important}`;
      document.head.appendChild(s);
    }

    const init = async () => {
      try {
        console.log("Initializing Google Places Autocomplete...");
        const loader = new Loader({
          apiKey,
          version: "weekly",
          libraries: ["places"],
        });
        await loader.load();
        console.log("Google Maps API loaded successfully");

        await new Promise((resolve) => setTimeout(resolve, 100));

        if (!addressInputRef.current) {
          console.log("Address input ref not found");
          return;
        }

        console.log("Creating autocomplete instance");
        autocomplete = new google.maps.places.Autocomplete(
          addressInputRef.current as HTMLInputElement,
          {
            fields: ["geometry", "address_components", "formatted_address"],
            types: ["geocode"],
          }
        );
        console.log("Autocomplete created successfully");
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete!.getPlace();
          if (!place || !place.geometry) return;

          const components = place.address_components || [];
          const getPart = (type: string) => {
            const comp = components.find((c) => (c.types || []).includes(type));
            return comp?.long_name || "";
          };

          const city =
            getPart("locality") ||
            getPart("administrative_area_level_2") ||
            getPart("administrative_area_level_1");
          const country = getPart("country");
          const address = place.formatted_address || "";

          const location = place.geometry.location;
          const lat = location?.lat();
          const lng = location?.lng();

          console.log("Google Places result:", {
            address,
            city,
            country,
            lat,
            lng,
          });

          if (addressInputRef.current) {
            addressInputRef.current.value = address;
          }

          setFormData((prev: any) => ({
            ...prev,
            address,
            city: city || prev.city,
            country: country || prev.country,
            location: {
              lat: typeof lat === "number" ? lat : prev.location?.lat || 0,
              lng: typeof lng === "number" ? lng : prev.location?.lng || 0,
            },
          }));
        });
      } catch (error) {
        console.error("Error initializing Google Places Autocomplete:", error);
      }
    };

    init();

    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
        autocomplete = null;
      }
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      mostPopularFacilities: formData.mostPopularFacilities
        .map((item: any) => item.name)
        .filter((name: string) => name.trim()),
    };
    onSave(hotel ? { id: hotel.id, ...payload } : payload);
    onClose();
  };

  const onTabChange = (v: string) => {
    setActiveTab(v);
    if (scrollRef.current)
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[980px]">
        <DialogHeader>
          <DialogTitle>{hotel ? "Edit Hotel" : "Add Hotel"}</DialogTitle>
          <DialogDescription>
            {hotel
              ? "Update all hotel information"
              : "Create a new hotel with full details"}
          </DialogDescription>
        </DialogHeader>

        <div
          ref={scrollRef}
          className="max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs>
              <div className="flex items-center justify-between sticky top-0 bg-white z-10 px-2 py-1">
                <TabsList className="grid grid-cols-6 gap-1">
                  <TabsTrigger
                    className="px-2 py-1 text-xs"
                    onClick={() => onTabChange("general")}
                  >
                    General
                  </TabsTrigger>
                  <TabsTrigger
                    className="px-2 py-1 text-xs"
                    onClick={() => onTabChange("location")}
                  >
                    Location
                  </TabsTrigger>
                  <TabsTrigger
                    className="px-2 py-1 text-xs"
                    onClick={() => onTabChange("facilities")}
                  >
                    Facilities
                  </TabsTrigger>
                  <TabsTrigger
                    className="px-2 py-1 text-xs"
                    onClick={() => onTabChange("rooms")}
                  >
                    Rooms
                  </TabsTrigger>
                  <TabsTrigger
                    className="px-2 py-1 text-xs"
                    onClick={() => onTabChange("media")}
                  >
                    Media
                  </TabsTrigger>
                  <TabsTrigger
                    className="px-2 py-1 text-xs"
                    onClick={() => onTabChange("advanced")}
                  >
                    Advanced
                  </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={showAll}
                      onChange={(e) => {
                        const v = e.target.checked;
                        setShowAll(v);
                      }}
                    />
                    Show all
                  </label>
                </div>
              </div>

              {(showAll || activeTab === "general") && (
                <GeneralTab
                  formData={formData}
                  setFormData={setFormData}
                  showAll={showAll}
                  addressInputRef={addressInputRef}
                />
              )}

              {(showAll || activeTab === "location") && (
                <LocationTab
                  formData={formData}
                  setFormData={setFormData}
                  showAll={showAll}
                />
              )}

              {(showAll || activeTab === "facilities") && (
                <FacilitiesTab
                  formData={formData}
                  setFormData={setFormData}
                  showAll={showAll}
                />
              )}

              {(showAll || activeTab === "rooms") && (
                <RoomsTab
                  formData={formData}
                  setFormData={setFormData}
                  showAll={showAll}
                  expandedRooms={expandedRooms}
                  setExpandedRooms={setExpandedRooms}
                />
              )}

              {(showAll || activeTab === "media") && (
                <MediaTab
                  formData={formData}
                  setFormData={setFormData}
                  showAll={showAll}
                />
              )}

              {(showAll || activeTab === "advanced") && (
                <AdvancedTab
                  formData={formData}
                  setFormData={setFormData}
                  showAll={showAll}
                />
              )}
            </Tabs>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
