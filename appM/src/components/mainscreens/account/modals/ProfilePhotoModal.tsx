import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../../../hooks/ThemeContext";

interface ProfilePhotoModalProps {
  visible: boolean;
  onClose: () => void;
  onPhotoSelection: (option: string, imageUri?: string) => void;
}

export default function ProfilePhotoModal({
  visible,
  onClose,
  onPhotoSelection,
}: ProfilePhotoModalProps) {
  const { colors } = useTheme();

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera permissions to take photos!",
      );
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need media library permissions to choose photos!",
      );
      return false;
    }
    return true;
  };

  const handlePhotoSelection = async (option: string) => {
    if (option === "remove") {
      onPhotoSelection("remove");
      onClose();
      return;
    }

    if (option === "camera") {
      const hasPermission = await requestCameraPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onPhotoSelection("camera", result.assets[0].uri);
        onClose();
      }
    }

    if (option === "gallery") {
      const hasPermission = await requestMediaLibraryPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onPhotoSelection("gallery", result.assets[0].uri);
        onClose();
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.photoModalOverlay}>
        <View style={[styles.photoModalCard, { backgroundColor: colors.card }]}>
          <View style={styles.photoModalHeader}>
            <Text style={[styles.photoModalTitle, { color: colors.text }]}>
              Choose Profile Photo
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.photoOptionsContainer}>
            <TouchableOpacity
              style={[
                styles.photoOptionButton,
                { backgroundColor: colors.blue },
              ]}
              onPress={() => handlePhotoSelection("camera")}
            >
              <Ionicons name="camera" size={24} color="#FFFFFF" />
              <Text style={styles.photoOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.photoOptionButton,
                { backgroundColor: colors.blue },
              ]}
              onPress={() => handlePhotoSelection("gallery")}
            >
              <Ionicons name="images" size={24} color="#FFFFFF" />
              <Text style={styles.photoOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.photoOptionButton,
                { backgroundColor: colors.red },
              ]}
              onPress={() => handlePhotoSelection("remove")}
            >
              <Ionicons name="trash" size={24} color="#FFFFFF" />
              <Text style={styles.photoOptionText}>Remove Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  photoModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  photoModalCard: {
    width: "90%",
    maxWidth: 350,
    borderRadius: 12,
    padding: 24,
  },
  photoModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  photoModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  photoOptionsContainer: {
    gap: 16,
  },
  photoOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  photoOptionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
