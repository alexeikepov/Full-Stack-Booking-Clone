import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SurroundingsSection from "@/components/ui/SurroundingsSection";
import FacilitiesSection from "@/components/ui/FacilitiesSection";
import type { TabProps } from "./types";

export default function AdvancedTab({ formData, setFormData }: TabProps) {
  const csv = (arr?: string[]) => (Array.isArray(arr) ? arr.join(", ") : "");
  const parseCsv = (s: string) =>
    s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="text-sm font-medium">Property highlights</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">Perfect for</Label>
            <Input
              value={formData.propertyHighlights?.perfectFor || ""}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  propertyHighlights: {
                    ...(p.propertyHighlights || {}),
                    perfectFor: e.target.value,
                  },
                }))
              }
            />
          </div>
          <div>
            <Label className="text-xs">Location score</Label>
            <Input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={formData.propertyHighlights?.locationScore ?? 0}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  propertyHighlights: {
                    ...(p.propertyHighlights || {}),
                    locationScore: parseFloat(e.target.value || "0"),
                  },
                }))
              }
            />
          </div>
          <div>
            <Label className="text-xs">Location description</Label>
            <Input
              value={formData.propertyHighlights?.locationDescription || ""}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  propertyHighlights: {
                    ...(p.propertyHighlights || {}),
                    locationDescription: e.target.value,
                  },
                }))
              }
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">Rooms with (comma separated)</Label>
          <Input
            value={csv(formData.propertyHighlights?.roomsWith)}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                propertyHighlights: {
                  ...(p.propertyHighlights || {}),
                  roomsWith: parseCsv(e.target.value),
                },
              }))
            }
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium">House rules</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">Check-in time</Label>
            <Input
              value={formData.houseRules?.checkIn?.time || ""}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  houseRules: {
                    ...(p.houseRules || {}),
                    checkIn: {
                      ...(p.houseRules?.checkIn || {}),
                      time: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>
          <div>
            <Label className="text-xs">Check-out time</Label>
            <Input
              value={formData.houseRules?.checkOut?.time || ""}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  houseRules: {
                    ...(p.houseRules || {}),
                    checkOut: {
                      ...(p.houseRules?.checkOut || {}),
                      time: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>
          <div>
            <Label className="text-xs">Cancellation policy</Label>
            <Input
              value={formData.houseRules?.cancellation?.policy || ""}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  houseRules: {
                    ...(p.houseRules || {}),
                    cancellation: {
                      ...(p.houseRules?.cancellation || {}),
                      policy: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Children welcome</Label>
            <Input
              value={formData.houseRules?.children?.welcome || ""}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  houseRules: {
                    ...(p.houseRules || {}),
                    children: {
                      ...(p.houseRules?.children || {}),
                      welcome: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>
          <div>
            <Label className="text-xs">Pets note</Label>
            <Input
              value={formData.houseRules?.pets?.note || ""}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  houseRules: {
                    ...(p.houseRules || {}),
                    pets: {
                      ...(p.houseRules?.pets || {}),
                      note: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="text-sm font-medium">Surroundings</div>
        <div className="space-y-6">
          <SurroundingsSection
            title="What's nearby"
            items={formData.surroundings?.nearbyAttractions || []}
            onUpdate={(items) =>
              setFormData((p) => ({
                ...p,
                surroundings: {
                  ...(p.surroundings || {}),
                  nearbyAttractions: items,
                },
              }))
            }
            hasType={false}
          />

          <SurroundingsSection
            title="Top attractions"
            items={formData.surroundings?.topAttractions || []}
            onUpdate={(items) =>
              setFormData((p) => ({
                ...p,
                surroundings: {
                  ...(p.surroundings || {}),
                  topAttractions: items,
                },
              }))
            }
            hasType={false}
          />

          <SurroundingsSection
            title="Restaurants & Cafes"
            items={formData.surroundings?.restaurantsCafes || []}
            onUpdate={(items) =>
              setFormData((p) => ({
                ...p,
                surroundings: {
                  ...(p.surroundings || {}),
                  restaurantsCafes: items.map((item) => ({
                    name: item.name,
                    distance: item.distance,
                    type: item.type || "",
                  })),
                },
              }))
            }
            hasType={true}
          />

          <SurroundingsSection
            title="Natural beauty"
            items={formData.surroundings?.naturalBeauty || []}
            onUpdate={(items) =>
              setFormData((p) => ({
                ...p,
                surroundings: {
                  ...(p.surroundings || {}),
                  naturalBeauty: items.map((item) => ({
                    name: item.name,
                    distance: item.distance,
                    type: item.type || "",
                  })),
                },
              }))
            }
            hasType={true}
          />

          <SurroundingsSection
            title="Public transport"
            items={formData.surroundings?.publicTransport || []}
            onUpdate={(items) =>
              setFormData((p) => ({
                ...p,
                surroundings: {
                  ...(p.surroundings || {}),
                  publicTransport: items.map((item) => ({
                    name: item.name,
                    distance: item.distance,
                    type: item.type || "",
                  })),
                },
              }))
            }
            hasType={true}
          />

          <SurroundingsSection
            title="Closest airports"
            items={formData.surroundings?.closestAirports || []}
            onUpdate={(items) =>
              setFormData((p) => ({
                ...p,
                surroundings: {
                  ...(p.surroundings || {}),
                  closestAirports: items,
                },
              }))
            }
            hasType={false}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium">Overview sections</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-1">
            <Label className="text-xs">Info & Prices</Label>
            <Textarea
              rows={3}
              value={String(formData.overview?.infoAndPrices || "")}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  overview: {
                    ...(p.overview || {}),
                    infoAndPrices: e.target.value,
                  },
                }))
              }
            />
          </div>
          <div className="md:col-span-1">
            <Label className="text-xs">Activity</Label>
            <Textarea
              rows={3}
              value={String(formData.overview?.activity || "")}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  overview: {
                    ...(p.overview || {}),
                    activity: e.target.value,
                  },
                }))
              }
            />
          </div>
          <div className="md:col-span-1">
            <Label className="text-xs">Facilities (overview text)</Label>
            <Textarea
              rows={3}
              value={String(formData.overview?.facilities || "")}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  overview: {
                    ...(p.overview || {}),
                    facilities: e.target.value,
                  },
                }))
              }
            />
          </div>
          <div className="md:col-span-1">
            <Label className="text-xs">House Rules (overview text)</Label>
            <Textarea
              rows={3}
              value={String(formData.overview?.houseRules || "")}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  overview: {
                    ...(p.overview || {}),
                    houseRules: e.target.value,
                  },
                }))
              }
            />
          </div>
          <div className="md:col-span-1">
            <Label className="text-xs">Fine Print</Label>
            <Textarea
              rows={3}
              value={String(formData.overview?.finePrint || "")}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  overview: {
                    ...(p.overview || {}),
                    finePrint: e.target.value,
                  },
                }))
              }
            />
          </div>
          <div className="md:col-span-1">
            <Label className="text-xs">Guest Reviews (overview text)</Label>
            <Textarea
              rows={3}
              value={String(formData.overview?.guestReviews || "")}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  overview: {
                    ...(p.overview || {}),
                    guestReviews: e.target.value,
                  },
                }))
              }
            />
          </div>
          <div className="md:col-span-1">
            <Label className="text-xs">Travellers Asking</Label>
            <Textarea
              rows={3}
              value={String(formData.overview?.travellersAsking || "")}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  overview: {
                    ...(p.overview || {}),
                    travellersAsking: e.target.value,
                  },
                }))
              }
            />
          </div>
          <div className="md:col-span-1">
            <Label className="text-xs">Hotel Surroundings</Label>
            <Textarea
              rows={3}
              value={String(formData.overview?.hotelSurroundings || "")}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  overview: {
                    ...(p.overview || {}),
                    hotelSurroundings: e.target.value,
                  },
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="text-sm font-medium">Most popular facilities</div>
        <FacilitiesSection
          title="Most Popular Facilities"
          items={(formData.mostPopularFacilities || []).map((item) => ({
            name: item.name,
            available: true,
            note: item.distance || "",
            distance: item.distance || "",
            type: item.type || "",
          }))}
          onUpdate={(items) =>
            setFormData((p) => ({
              ...p,
              mostPopularFacilities: items.map((item) => ({
                name: item.name,
                distance: "",
                type: "",
              })),
            }))
          }
        />
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium">Travellers questions</div>
        <div className="space-y-2">
          {(formData.travellersQuestions || []).map((q, i: number) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded p-2"
            >
              <div>
                <Label className="text-xs">Question</Label>
                <Input
                  value={q.question}
                  onChange={(e) =>
                    setFormData((p) => {
                      const list = [...(p.travellersQuestions || [])];
                      list[i] = {
                        ...list[i],
                        question: e.target.value,
                      };
                      return { ...p, travellersQuestions: list };
                    })
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Answer</Label>
                <Input
                  value={q.answer}
                  onChange={(e) =>
                    setFormData((p) => {
                      const list = [...(p.travellersQuestions || [])];
                      list[i] = {
                        ...list[i],
                        answer: e.target.value,
                      };
                      return { ...p, travellersQuestions: list };
                    })
                  }
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      travellersQuestions: (p.travellersQuestions || []).filter(
                        (_, idx: number) => idx !== i
                      ),
                    }))
                  }
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData((p) => ({
                ...p,
                travellersQuestions: [
                  ...(p.travellersQuestions || []),
                  { question: "", answer: "" },
                ],
              }))
            }
          >
            Add question
          </Button>
        </div>
      </div>
    </div>
  );
}
