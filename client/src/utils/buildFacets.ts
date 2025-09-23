import type { Hotel } from "@/types/hotel";

export type FacetItem = { id: string; label: string; count: number };
export type FacetGroup = { key: string; title: string; items: FacetItem[]; showAllLabel?: string };

const asNum = (v: unknown): number | null => (Number.isFinite(Number(v)) ? Number(v) : null);
const asStr = (v: unknown): string => (v == null ? "" : String(v));
const asArr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

export function buildFacets(hotels: Hotel[]): FacetGroup[] {
  const mapCount = new Map<string, number>();
  const bump = (key: string, n = 1) => mapCount.set(key, (mapCount.get(key) ?? 0) + n);

  for (const h of hotels) {
    const rating = asNum((h as any).averageRating) ?? 0;
    if (rating >= 9) bump("review_9");
    if (rating >= 8) bump("review_8");
    if (rating >= 7) bump("review_7");
    if (rating >= 6) bump("review_6");

    const stars = asNum((h as any).stars);
    if (stars) bump(`stars_${stars}`);

    const ptype = asStr((h as any).propertyType ?? (h as any).type).toLowerCase();
    if (ptype) bump(`ptype_${ptype}`);

    const amenities = asArr<string>((h as any).amenityIds ?? (h as any).amenities);
    for (const a of amenities) bump(`amen_${a}`);

    const meals = new Set(
      asArr<string>((h as any).meals).map((s) => s.toLowerCase())
    );
    if (meals.has("breakfast included")) bump("meal_breakfast");
    if (meals.has("all-inclusive") || meals.has("all inclusive")) bump("meal_all");

    const pay = (h as any).paymentOptions ?? {};
    if ((h as any).freeCancellation || pay.freeCancellation) bump("pay_free_cxl");
    if ((h as any).noPrepayment || pay.noPrepayment) bump("pay_no_prepay");
    if (
      (h as any).acceptsOnlinePayments ||
      pay.acceptsOnlinePayments ||
      pay.onlinePayments
    )
      bump("pay_online");

    const d =
      asNum((h as any).distanceKm) ??
      asNum((h as any).distance_km) ??
      asNum((h as any).distanceFromCenterKm);
    if (d != null) {
      if (d < 1) bump("dist_<1");
      if (d < 3) bump("dist_<3");
      if (d < 5) bump("dist_<5");
    }

    const brand = asStr((h as any).brand ?? (h as any).chain).toLowerCase();
    if (brand) bump(`brand_${brand}`);

    const hood = asStr((h as any).neighborhood ?? (h as any).area).toLowerCase();
    if (hood) bump(`hood_${hood}`);
  }

  const val = (k: string) => mapCount.get(k) ?? 0;

  const PT_LABEL: Record<string, string> = {
    hotel: "Hotels",
    apartment: "Apartments",
    "guest house": "Guest houses",
    villa: "Villas",
    hostel: "Hostels",
    "holiday home": "Holiday homes",
    homestay: "Homestays",
    motel: "Motels",
    "bed and breakfast": "Bed and breakfasts",
    "b&b": "Bed and breakfasts",
    campsite: "Campsites",
    "entire home": "Entire homes & apartments",
  };

  const FAC_LABEL: Record<string, string> = {
    PARKING: "Parking",
    RESTAURANT: "Restaurant",
    ROOM_SERVICE: "Room service",
    FRONT_DESK_24H: "24-hour front desk",
    FITNESS: "Fitness centre",
    NON_SMOKING: "Non-smoking rooms",
    AIRPORT_SHUTTLE: "Airport shuttle",
    FAMILY_ROOMS: "Family rooms",
    SPA: "Spa and wellness centre",
    HOT_TUB: "Hot tub/Jacuzzi",
    WIFI: "Free WiFi",
    EV_CHARGER: "Electric vehicle charging station",
    WHEELCHAIR: "Wheelchair accessible",
    POOL: "Swimming Pool",
  };

  const groups: FacetGroup[] = [
    {
      key: "popular",
      title: "Popular filters",
      items: [
        { id: "popular_breakfast", label: "Breakfast included", count: val("meal_breakfast") },
        { id: "popular_hotels", label: "Hotels", count: Object.entries(PT_LABEL).some(([k]) => k.includes("hotel")) ? val("ptype_hotel") : 0 },
        { id: "popular_parking", label: "Parking", count: val("amen_PARKING") },
        { id: "popular_review8", label: "Very good: 8+", count: val("review_8") },
        { id: "popular_apartments", label: "Apartments", count: val("ptype_apartment") },
        { id: "popular_hostels", label: "Hostels", count: val("ptype_hostel") },
        { id: "popular_review9", label: "Superb: 9+", count: val("review_9") },
      ],
    },
    {
      key: "review",
      title: "Review score",
      items: [
        { id: "rv_9", label: "Superb: 9+", count: val("review_9") },
        { id: "rv_8", label: "Very good: 8+", count: val("review_8") },
        { id: "rv_7", label: "Good: 7+", count: val("review_7") },
        { id: "rv_6", label: "Pleasant: 6+", count: val("review_6") },
      ],
    },
    {
      key: "ptype",
      title: "Property type",
      items: Object.entries(PT_LABEL).map(([k, label]) => ({
        id: `pt_${k}`,
        label,
        count: val(`ptype_${k}`),
      })),
      showAllLabel: "Show all",
    },
    {
      key: "meals",
      title: "Meals",
      items: [
        { id: "meal_breakfast", label: "Breakfast included", count: val("meal_breakfast") },
        { id: "meal_all", label: "All meals included", count: val("meal_all") },
      ],
    },
    {
      key: "payment",
      title: "Payment terms",
      items: [
        { id: "pay_free_cxl", label: "Free cancellation", count: val("pay_free_cxl") },
        { id: "pay_no_prepay", label: "No prepayment", count: val("pay_no_prepay") },
        { id: "pay_online", label: "Accepts online payments", count: val("pay_online") },
      ],
    },
    {
      key: "facilities",
      title: "Property facilities",
      items: Object.entries(FAC_LABEL).map(([id, label]) => ({
        id: `amen_${id}`,
        label,
        count: val(`amen_${id}`),
      })),
      showAllLabel: "Show all 14",
    },
    {
      key: "stars",
      title: "Property rating",
      items: [2, 3, 4, 5].map((s) => ({
        id: `stars_${s}`,
        label: `${s} stars`,
        count: val(`stars_${s}`),
      })),
    },
    {
      key: "distance",
      title: "Distance from centre",
      items: [
        { id: "dist_<1", label: "Less than 1 km", count: val("dist_<1") },
        { id: "dist_<3", label: "Less than 3 km", count: val("dist_<3") },
        { id: "dist_<5", label: "Less than 5 km", count: val("dist_<5") },
      ],
    },
    {
      key: "neighborhood",
      title: "Neighbourhood",
      items: [...mapCount.keys()]
        .filter((k) => k.startsWith("hood_"))
        .map((k) => ({
          id: k,
          label: k.replace(/^hood_/, "").replace(/\b\w/g, (c) => c.toUpperCase()),
          count: val(k),
        })),
      showAllLabel: "Show all",
    },
    {
      key: "brands",
      title: "Brands",
      items: [...mapCount.keys()]
        .filter((k) => k.startsWith("brand_"))
        .map((k) => ({
          id: k,
          label: k.replace(/^brand_/, ""),
          count: val(k),
        })),
    },
  ];

  return groups.filter((g) => g.items.some((i) => i.count > 0));
}
