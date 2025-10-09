import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

type StyleProp = any;

type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
  styles: StyleProp;
  selectedSortOption?: string;
  setSelectedSortOption?: (option: string) => void;
  onApply?: () => void;
};

const SortModal = ({
  isVisible,
  onClose,
  styles,
  selectedSortOption = "Top Picks for Groups",
  setSelectedSortOption,
  onApply,
}: ModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const sortOptions = [
    "None",
    "Entire homes & apartments first",
    "Top Picks for Groups",
    "Distance From Downtown",
    "Property rating (5 to 0)",
    "Property rating (0 to 5)",
    "Genius",
    "Best reviewed first",
    "Price (lowest first)",
    "Price (highest first)",
    "Saved properties first",
    "Newest properties first",
    "Oldest properties first",
    "Most popular",
    "Guest rating and price",
    "Star rating (5 to 1)",
    "Star rating (1 to 5)",
    "Distance to city center",
    "Distance to beach",
    "Distance to airport",
    "Free WiFi",
    "Free breakfast",
    "Free cancellation",
    "Pet-friendly properties",
    "Family-friendly",
    "Business travel",
    "Romantic getaways",
    "Solo travelers",
    "Group bookings",
    "Luxury properties",
    "Budget-friendly",
    "Mid-range properties",
    "Boutique hotels",
    "Chain hotels",
    "Vacation rentals",
    "Bed & Breakfasts",
    "Hostels",
    "Resorts",
    "Villas",
    "Apartments",
    "Guest houses",
    "Recently renovated",
    "Eco-friendly properties",
    "Accessible properties",
    "Pool available",
    "Spa & wellness",
    "Fitness center",
    "Restaurant on-site",
    "Room service",
    "Parking available",
    "24-hour reception",
  ];

  const handleOptionSelect = (option: string) => {
    setIsLoading(true);
    if (setSelectedSortOption) {
      setSelectedSortOption(option);
    }
    onApply?.();
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer} pointerEvents="box-none">
        <View style={styles.sortHeader}>
          <TouchableOpacity onPress={onClose}>
            <AntDesign
              name="close"
              size={24}
              color={styles.sortHeaderIcon.color}
            />
          </TouchableOpacity>
          <Text style={styles.sortTitle}>Sort by</Text>
        </View>
        {isLoading && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={{ marginTop: 10 }}>Sorting...</Text>
          </View>
        )}
        {!isLoading && (
          <ScrollView>
            {sortOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.sortItem}
                onPress={() => handleOptionSelect(option)}
              >
                <Text style={styles.sortItemText}>{option}</Text>
                <View
                  style={[
                    styles.radio,
                    selectedSortOption === option && styles.radioSelected,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

export default SortModal;
