import React from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

type MessagesModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  onHelpPress: () => void;
  colors: any;
  insets: any;
  theme: string;
  manWhiteImage: any;
  messagesManImage: any;
  styles: any;
};

const MessagesModal: React.FC<MessagesModalProps> = ({
  visible,
  onRequestClose,
  onHelpPress,
  colors,
  insets,
  theme,
  manWhiteImage,
  messagesManImage,
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
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.modalHeaderText}>Messages</Text>
        <TouchableOpacity onPress={onHelpPress}>
          <Ionicons name="help-circle-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.modalContent}>
        <Image
          source={theme === "light" ? manWhiteImage : messagesManImage}
          style={styles.messageImage}
        />
        <Text style={styles.modalTitle}>No messages</Text>
        <Text style={styles.modalSubtitle}>
          You can start exchanging messages when you have upcoming bookings.
        </Text>
      </View>
      <View style={styles.modalFooter}>
        <TouchableOpacity style={styles.searchButton} onPress={onRequestClose}>
          <Text style={styles.buttonText}>Book now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  </Modal>
);

export default MessagesModal;
