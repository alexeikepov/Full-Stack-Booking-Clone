import { Alert } from "react-native";
import { getPropertyId } from "../../../../utils/getPropertyId";

export function handleSave({
  property,
  isSaved,
  saveProperty,
  removeProperty,
}: any) {
  // Use consistent property ID normalization
  const currentId = getPropertyId(property);
  const currentlySaved = isSaved(currentId);

  // Use the same toggle approach as PropertyCard for consistency
  // Ensure saved object has consistent structure with PropertyCard expectations
  const propertyToSave = {
    ...property,
    id: currentId,
    title: property?.title ?? property?.name ?? String(property?.id ?? ""),
    // Keep the name field as well for consistency
    name: property?.name ?? property?.title ?? String(property?.id ?? ""),
  };

  // Call saveProperty which handles the toggle logic internally
  saveProperty(propertyToSave);

  // Show appropriate message based on current state
  if (currentlySaved) {
    Alert.alert("Property removed", "Property removed from saved list.");
  } else {
    Alert.alert("Property saved!", "You can view it in the Saved List screen.");
  }
}
