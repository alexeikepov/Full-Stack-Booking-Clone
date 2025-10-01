import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

type NotificationsModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  colors: any;
  insets: any;
  styles: any;
};

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  visible,
  onRequestClose,
  colors,
  insets,
  styles,
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent={false}
    onRequestClose={onRequestClose}
  >
    <SafeAreaView style={[styles.modalContainer, { paddingTop: insets.top }]}>
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={onRequestClose} style={styles.closeButton}>
          <Text style={styles.modalHeaderText}>Close</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.modalContent}>
        <Ionicons name="notifications-outline" size={80} color={colors.text} />
        <Text style={styles.modalTitle}>
          You do not have any notifications.
        </Text>
        <Text style={styles.modalSubtitle}>
          Notifications let you quickly take action on upcoming or current
          bookings.
        </Text>
      </View>
    </SafeAreaView>
  </Modal>
);

export default NotificationsModal;
