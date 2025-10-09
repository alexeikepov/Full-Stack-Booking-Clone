import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ManageListModalProps {
  visible: boolean;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
  onShare: () => void;
  colors: any;
  theme: string;
}

const ManageListModal: React.FC<ManageListModalProps> = ({
  visible,
  onClose,
  onRename,
  onDelete,
  onShare,
  colors,
  theme,
}) => {
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    bottomModalView: {
      backgroundColor: colors.background,
      padding: 16,
      width: "100%",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    modalItem: { paddingVertical: 12 },
    modalItemText: { color: colors.text, fontSize: 16 },
    closeButton: { marginTop: 12, alignItems: "center" },
    closeButtonText: { color: colors.text, fontWeight: "bold" },
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.bottomModalView}>
          <TouchableOpacity style={styles.modalItem} onPress={onRename}>
            <Text style={styles.modalItemText}>Rename</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem} onPress={onDelete}>
            <Text style={styles.modalItemText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem} onPress={onShare}>
            <Text style={styles.modalItemText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ManageListModal;
