import { Alert, Share } from "react-native";

/**
 * Shares property details using the native share dialog.
 * @param property The property object to share (should have name and address fields)
 */
export async function handleShare(property?: {
  name?: string;
  address?: string;
}) {
  try {
    const message = property
      ? `Check out this property: ${property.name || ""}\n${property.address || ""}`
      : "Check out this property!";
    await Share.share({
      message,
    });
  } catch (error: any) {
    Alert.alert("Share failed", error.message || "Could not share property.");
  }
}
