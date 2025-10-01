import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ThemeColors = {
  text: string;
  textSecondary: string;
  background: string;
  card: string;
  button: string;
  accent?: string;
  tint?: string;
  icon?: string;
  tabIconDefault?: string;
  tabIconSelected?: string;
  inputBackground?: string;
  separator?: string;
  red?: string;
  yellow?: string;
  green?: string;
  blue?: string;
  purple?: string;
  pink?: string;
  teal?: string;
  gray?: string;
  border?: string;
  primary?: string;
};

interface AgeSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectAge: (age: number) => void;
  colors: ThemeColors;
  childNumber: number;
}

const AgeSelectionModal: React.FC<AgeSelectionModalProps> = ({
  isVisible,
  onClose,
  onSelectAge,
  colors,
  childNumber,
}) => {
  const handleAgeSelect = (age: number) => {
    onSelectAge(age);
    onClose();
  };

  if (!isVisible) return null;

  const styles = StyleSheet.create({
    ageModalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    ageModalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    ageModalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
    },
    ageList: {
      flex: 1,
      padding: 16,
    },
    ageItem: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    ageItemText: {
      fontSize: 16,
      color: colors.text,
    },
    applyButton: {
      backgroundColor: colors.primary,
      padding: 16,
      alignItems: "center",
      margin: 16,
      borderRadius: 8,
    },
    applyButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.ageModalContainer}>
        <View style={styles.ageModalHeader}>
          <Text style={styles.ageModalTitle}>Child {childNumber}</Text>
        </View>

        <ScrollView style={styles.ageList}>
          <TouchableOpacity
            style={styles.ageItem}
            onPress={() => handleAgeSelect(-1)}
          >
            <Text style={styles.ageItemText}>Select age</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ageItem}
            onPress={() => handleAgeSelect(0)}
          >
            <Text style={styles.ageItemText}>{"< 1 year old"}</Text>
          </TouchableOpacity>
          {Array.from({ length: 17 }, (_, i) => i + 1).map((age) => (
            <TouchableOpacity
              key={age}
              style={styles.ageItem}
              onPress={() => handleAgeSelect(age)}
            >
              <Text style={styles.ageItemText}>
                {age} year{age === 1 ? "" : "s"} old
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity onPress={onClose} style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default AgeSelectionModal;
