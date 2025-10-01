export function isPropertyCardType(
  obj: any,
): obj is import("../../shared/PropertyCard").Property {
  return obj && typeof obj.title === "string";
}
