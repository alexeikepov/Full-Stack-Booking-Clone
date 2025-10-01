import { Alert } from "react-native";

export function handleSave({
  property,
  isSaved,
  saveProperty,
  removeProperty,
}: any) {
  // Compute id from the currently displayed property
  const currentId = String(property?.id ?? property?.title);
  const currentlySaved = isSaved(currentId);
  console.log("PropertyDetailsScreen: handleSave ->", {
    currentId,
    currentlySaved,
  });

  if (currentlySaved) {
    removeProperty(currentId);
    Alert.alert("Property removed", "Property removed from saved list.");
  } else {
    // Ensure saved object always has a `title` property so Saved list can render it
    saveProperty({
      ...property,
      id: currentId,
      title: property?.title ?? property?.name ?? String(property?.id ?? ""),
    });
    Alert.alert("Property saved!", "You can view it in the Saved List screen.");
  }
}
