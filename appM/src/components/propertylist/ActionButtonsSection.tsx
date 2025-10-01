import { AntDesign, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { createStyles } from "../../screens/propertyList/PropertyListScreen.styles";

interface ActionButtonsSectionProps {
  colors: any;
  selectedSortOption: string;
  selectedFilters: Set<string>;
  setModalType: (type: ModalType) => void;
  handleOutsidePress: () => void;
}

type ModalType =
  | "location"
  | "dates"
  | "guests"
  | "sort"
  | "filter"
  | "map"
  | null;

const ActionButtonsSection: React.FC<ActionButtonsSectionProps> = ({
  colors,
  selectedSortOption,
  selectedFilters,
  setModalType,
  handleOutsidePress,
}) => {
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleOutsidePress}
      style={styles.actionButtons}
    >
      <TouchableOpacity
        onPress={() => setModalType("sort")}
        style={styles.actionButton}
      >
        <View style={styles.actionButtonContent}>
          {selectedSortOption !== "Top Picks for Groups" &&
            selectedSortOption !== "None" && (
              <View style={styles.redIndicator} />
            )}
          <AntDesign
            name="swap"
            size={24}
            color={styles.actionText.color}
            style={styles.actionIcon}
          />
          <Text style={styles.actionText}>Sort</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setModalType("filter")}
        style={styles.actionButton}
      >
        <View style={styles.actionButtonContent}>
          {selectedFilters.size > 0 && <View style={styles.redIndicator} />}
          <Ionicons
            name="options-outline"
            size={24}
            color={styles.actionText.color}
            style={styles.actionIcon}
          />
          <Text style={styles.actionText}>Filter</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setModalType("map")}
        style={styles.actionButton}
      >
        <Ionicons
          name="location-outline"
          size={24}
          color={styles.actionText.color}
          style={styles.actionIcon}
        />
        <Text style={styles.actionText}>Map</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ActionButtonsSection;
