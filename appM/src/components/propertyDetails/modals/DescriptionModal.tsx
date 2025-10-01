import { Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const DescriptionModal = ({
  visible,
  onClose,
  styles,
  colors,
  theme,
  openBookingWithOptions,
  property,
}: any) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent={true}
    onRequestClose={onClose}
  >
    <SafeAreaView style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Property Description</Text>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Ionicons
              name="close"
              size={24}
              color={theme === "light" ? colors.text : "white"}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.datesModalTitle}>Select Dates</Text>
        <View style={styles.datesPlaceholder}>
          <Ionicons
            name="calendar-outline"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={styles.datesPlaceholderTitle}>Date Selection</Text>
          <Text style={styles.datesPlaceholderText}>
            Tap to open full calendar functionality
          </Text>
          <TouchableOpacity
            style={styles.tempDateButton}
            onPress={() => {
              const today = new Date();
              const tomorrow = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + 1,
              );
              const dayAfter = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + 2,
              );
              // Open booking summary with these sample dates and use property's price
              openBookingWithOptions(
                { checkIn: tomorrow, checkOut: dayAfter },
                property.price,
                `${tomorrow.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })} - ${dayAfter.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}`,
              );
            }}
          >
            <Text style={styles.tempDateButtonText}>Select Sample Dates</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  </Modal>
);

export default DescriptionModal;
