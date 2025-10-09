import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface RenameModalProps {
  visible: boolean;
  onClose: () => void;
  newListName: string;
  setNewListName: (name: string) => void;
  onSave: () => void;
  colors: any;
  theme: string;
}

const RenameModal: React.FC<RenameModalProps> = ({
  visible,
  onClose,
  newListName,
  setNewListName,
  onSave,
  colors,
  theme,
}) => {
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      paddingTop: "60%",
    },
    modalView: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 24,
      width: "85%",
      maxWidth: 400,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? colors.icon : "#E5E5E5",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: theme === "dark" ? colors.icon : "#D1D5DB",
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      marginBottom: 8,
      backgroundColor: theme === "dark" ? colors.card : "#F9FAFB",
    },
    charCount: {
      textAlign: "right",
      color: colors.icon,
      marginBottom: 20,
      fontSize: 12,
    },
    actionButton: {
      backgroundColor: theme === "light" ? colors.blue : colors.button,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginTop: 8,
    },
    buttonText: {
      color: theme === "dark" ? "#fff" : colors.background,
      fontWeight: "600",
      fontSize: 16,
    },
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Rename</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="List name"
            placeholderTextColor={colors.icon}
            value={newListName}
            onChangeText={setNewListName}
            maxLength={40}
          />
          <Text style={styles.charCount}>{newListName.length} / 40</Text>
          <TouchableOpacity style={styles.actionButton} onPress={onSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RenameModal;
