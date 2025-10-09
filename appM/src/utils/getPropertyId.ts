import { Property } from "../components/shared/modals/PropertyCard";

export const getPropertyId = (
  property: Property | { id?: string; title?: string; name?: string },
) => {
  return String(property?.id ?? property?.title ?? (property as any)?.name);
};
