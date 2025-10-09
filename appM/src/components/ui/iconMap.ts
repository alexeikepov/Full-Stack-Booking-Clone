// Icon mapping for property facilities and features
// Used by PropertyDetailsScreen and related components

export const ICON_MAP: Record<
  string,
  { family: "ion" | "material"; name: string }
> = {
  // Problematic / non-ionicons names -> Material icon equivalents
  "ban-smoking": { family: "material", name: "smoke-free" },
  café: { family: "material", name: "local-cafe" },
  checkroom: { family: "material", name: "checkroom" },
  "local-laundry-service": {
    family: "material",
    name: "local-laundry-service",
  },
  spa: { family: "material", name: "spa" },
  // Fallbacks for other names that are likely material icons
  restaurant: { family: "material", name: "restaurant" },
  car: { family: "material", name: "directions-car" },
  airplane: { family: "material", name: "flight" },
  wifi: { family: "material", name: "wifi" },
  people: { family: "material", name: "people" },
  wine: { family: "material", name: "local-bar" },
  fitness: { family: "material", name: "fitness-center" },
  water: { family: "material", name: "pool" },
  paw: { family: "material", name: "pets" },
  snow: { family: "material", name: "ac-unit" },
  tv: { family: "material", name: "tv" },
};

export function resolveIcon(iconName: string) {
  const mapped = ICON_MAP[iconName];
  if (mapped) return mapped;
  // If the name looks like an Ionicons name (simple words), prefer Ionicons
  // otherwise fall back to MaterialIcons using the same name.
  const ionLike = /^[a-z0-9-]+$/i.test(iconName);
  return ionLike
    ? { family: "ion", name: iconName }
    : { family: "material", name: iconName };
}
