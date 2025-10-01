import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AgeSelectionModal from "./AgeSelectionModal";

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
  gray?: string;
  blue?: string;
  [key: string]: string | undefined;
};

export type GuestData = {
  rooms: number;
  adults: number;
  children: number;
  childAges: number[];
  pets: boolean;
};

type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
  colors: ThemeColors;
  selectedGuests?: GuestData;
  setSelectedGuests?: (guests: GuestData) => void;
};

const GuestsModal = ({
  isVisible,
  onClose,
  colors,
  selectedGuests = {
    rooms: 1,
    adults: 2,
    children: 0,
    childAges: [],
    pets: false,
  },
  setSelectedGuests,
}: ModalProps) => {
  const [rooms, setRooms] = useState(selectedGuests.rooms);
  const [adults, setAdults] = useState(selectedGuests.adults);
  const [children, setChildren] = useState(selectedGuests.children);
  const [childAges, setChildAges] = useState(selectedGuests.childAges);
  const [pets, setPets] = useState(selectedGuests.pets);
  const [ageModalVisible, setAgeModalVisible] = useState(false);
  const [selectedChildIndex, setSelectedChildIndex] = useState<number>(0);

  const styles = StyleSheet.create({
    modalContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.background,
      zIndex: 10,
      paddingTop: 50,
    },
    closeButton: {
      padding: 15,
      color: colors.text,
    },
    modalHeaderTitle: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "bold",
      padding: 15,
    },
    guestRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    guestLabel: {
      color: colors.text,
      fontSize: 18,
    },
    stepper: {
      flexDirection: "row",
      alignItems: "center",
    },
    stepperButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.button,
      padding: 8,
      borderRadius: 4,
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
    },
    stepperButtonDisabled: {
      borderColor: colors.separator,
      backgroundColor: colors.card,
    },
    stepperButtonText: {
      color: colors.button,
    },
    stepperButtonTextDisabled: {
      color: colors.separator,
    },
    stepperText: {
      color: colors.text,
      fontSize: 18,
      marginHorizontal: 20,
      minWidth: 30,
      textAlign: "center",
    },
    guestLabelContainer: {
      flex: 1,
    },
    guestSubLabel: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 2,
    },
    toggleSwitch: {
      width: 50,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.separator,
      padding: 2,
      justifyContent: "center",
    },
    toggleSwitchActive: {
      backgroundColor: colors.button,
    },
    toggleHandle: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: colors.background,
      alignSelf: "flex-start",
    },
    toggleHandleActive: {
      alignSelf: "flex-end",
    },
    childAgesSection: {
      marginTop: 20,
      paddingHorizontal: 15,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: colors.separator,
    },
    childAgesSectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    childAgesSectionSubtitle: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 20,
      lineHeight: 20,
    },
    childAgeRow: {
      marginBottom: 20,
    },
    childAgeLabel: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 10,
    },
    required: {
      color: colors.accent,
    },
    ageDropdownContainer: {
      borderWidth: 1,
      borderColor: colors.separator,
      borderRadius: 8,
      padding: 15,
      backgroundColor: colors.card,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    ageDropdownText: {
      color: colors.textSecondary,
      fontSize: 16,
      marginBottom: 10,
    },
    ageDropdownArrow: {
      color: colors.textSecondary,
    },
    applyButton: {
      backgroundColor: colors.button,
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      margin: 15,
    },
    applyButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: "bold",
    },
    secondaryText: {
      color: colors.textSecondary,
    },
  });

  const handleRoomsChange = (increment: boolean) => {
    const newValue = increment ? rooms + 1 : Math.max(1, rooms - 1);
    setRooms(newValue);
  };

  const handleAdultsChange = (increment: boolean) => {
    const newValue = increment ? adults + 1 : Math.max(1, adults - 1);
    setAdults(newValue);
  };

  const handleChildrenChange = (increment: boolean) => {
    const newValue = increment ? children + 1 : Math.max(0, children - 1);
    setChildren(newValue);

    // Update child ages array
    if (increment) {
      setChildAges([...childAges, 0]);
    } else if (newValue < children) {
      setChildAges(childAges.slice(0, newValue));
    }
  };

  const handleChildAgeChange = (index: number, age: number) => {
    const newAges = [...childAges];
    newAges[index] = age;
    setChildAges(newAges);
  };

  const openAgeModal = (childIndex: number) => {
    setSelectedChildIndex(childIndex);
    setAgeModalVisible(true);
  };

  const handleAgeSelect = (age: number) => {
    if (age === -1) return; // "Select" option, do nothing
    handleChildAgeChange(selectedChildIndex, age);
  };

  const getAgeDisplayText = (age: number | undefined) => {
    if (age === undefined) return "Select age";
    if (age === 0) return "< 1 year old";
    return `${age} year${age === 1 ? "" : "s"} old`;
  };

  const handleApply = () => {
    if (setSelectedGuests) {
      setSelectedGuests({
        rooms,
        adults,
        children,
        childAges,
        pets,
      });
    }
    onClose();
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <AntDesign
            name="close"
            size={24}
            color={styles.secondaryText.color}
          />
        </TouchableOpacity>

        <ScrollView>
          <Text style={styles.modalHeaderTitle}>Select rooms and guests</Text>

          {/* Rooms */}
          <View style={styles.guestRow}>
            <Text style={styles.guestLabel}>Rooms</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={[
                  styles.stepperButton,
                  rooms <= 1 && styles.stepperButtonDisabled,
                ]}
                onPress={() => handleRoomsChange(false)}
                disabled={rooms <= 1}
              >
                <AntDesign
                  name="minus"
                  size={16}
                  color={
                    rooms <= 1
                      ? styles.stepperButtonTextDisabled.color
                      : styles.stepperButtonText.color
                  }
                />
              </TouchableOpacity>
              <Text style={styles.stepperText}>{rooms}</Text>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => handleRoomsChange(true)}
              >
                <AntDesign
                  name="plus"
                  size={16}
                  color={styles.stepperButtonText.color}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Adults */}
          <View style={styles.guestRow}>
            <Text style={styles.guestLabel}>Adults</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={[
                  styles.stepperButton,
                  adults <= 1 && styles.stepperButtonDisabled,
                ]}
                onPress={() => handleAdultsChange(false)}
                disabled={adults <= 1}
              >
                <AntDesign
                  name="minus"
                  size={16}
                  color={
                    adults <= 1
                      ? styles.stepperButtonTextDisabled.color
                      : styles.stepperButtonText.color
                  }
                />
              </TouchableOpacity>
              <Text style={styles.stepperText}>{adults}</Text>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => handleAdultsChange(true)}
              >
                <AntDesign
                  name="plus"
                  size={16}
                  color={styles.stepperButtonText.color}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Children */}
          <View style={styles.guestRow}>
            <View style={styles.guestLabelContainer}>
              <Text style={styles.guestLabel}>Children</Text>
              <Text style={styles.guestSubLabel}>0 – 17 years old</Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={[
                  styles.stepperButton,
                  children <= 0 && styles.stepperButtonDisabled,
                ]}
                onPress={() => handleChildrenChange(false)}
                disabled={children <= 0}
              >
                <AntDesign
                  name="minus"
                  size={16}
                  color={
                    children <= 0
                      ? styles.stepperButtonTextDisabled.color
                      : styles.stepperButtonText.color
                  }
                />
              </TouchableOpacity>
              <Text style={styles.stepperText}>{children}</Text>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => handleChildrenChange(true)}
              >
                <AntDesign
                  name="plus"
                  size={16}
                  color={styles.stepperButtonText.color}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.guestRow}>
            <Text style={styles.guestLabel}>Traveling with pets?</Text>
            <TouchableOpacity
              style={[styles.toggleSwitch, pets && styles.toggleSwitchActive]}
              onPress={() => setPets(!pets)}
            >
              <View
                style={[styles.toggleHandle, pets && styles.toggleHandleActive]}
              />
            </TouchableOpacity>
          </View>

          {children > 0 && (
            <View style={styles.childAgesSection}>
              <Text style={styles.childAgesSectionTitle}>
                Age of children at check-out
              </Text>
              <Text style={styles.childAgesSectionSubtitle}>
                Add the age of each child to get the best match for beds, room
                size, and special prices.
              </Text>

              {Array.from({ length: children }, (_, index) => (
                <View key={index} style={styles.childAgeRow}>
                  <Text style={styles.childAgeLabel}>
                    Child {index + 1}
                    <Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.ageDropdownContainer}
                    onPress={() => openAgeModal(index)}
                  >
                    <Text style={styles.ageDropdownText}>
                      {getAgeDisplayText(childAges[index])}
                    </Text>
                    <AntDesign
                      name="down"
                      size={16}
                      color={styles.ageDropdownArrow.color}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>

        <AgeSelectionModal
          isVisible={ageModalVisible}
          onClose={() => setAgeModalVisible(false)}
          onSelectAge={handleAgeSelect}
          colors={colors}
          childNumber={selectedChildIndex + 1}
        />
      </View>
    </Modal>
  );
};

export default GuestsModal;
