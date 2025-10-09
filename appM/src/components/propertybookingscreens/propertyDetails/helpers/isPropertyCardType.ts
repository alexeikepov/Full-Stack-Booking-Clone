export function isPropertyCardType(
  obj: any,
): obj is import("../../../shared/modals/PropertyCard").Property {
  return obj && typeof obj.title === "string";
}
