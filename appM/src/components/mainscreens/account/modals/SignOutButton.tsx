import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../hooks/ThemeContext";
import { useAuth } from "../../../../hooks/AuthContext";
export default function SignOutButton() {
  const { colors } = useTheme();
  const { logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const styles = StyleSheet.create({
    signOutButton: {
      paddingVertical: 12,
      marginTop: 20,
      marginBottom: 40,
      backgroundColor: colors.card,
      borderRadius: 8,
      alignItems: "center",
    },
    signOutText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#ff6a6a",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 24,
      alignItems: "center",
      width: 280,
    },
    modalText: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 24,
      textAlign: "center",
    },
    modalActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 10,
      marginRight: 8,
      backgroundColor: colors.background,
      borderRadius: 8,
      alignItems: "center",
    },
    confirmButton: {
      flex: 1,
      paddingVertical: 10,
      marginLeft: 8,
      backgroundColor: "#ff6a6a",
      borderRadius: 8,
      alignItems: "center",
    },
    cancelText: {
      color: colors.text,
      fontWeight: "bold",
    },
    confirmText: {
      color: "white",
      fontWeight: "bold",
    },
  });

  const handleSignOut = async () => {
    await logout();
    setModalVisible(false);
  };
  return (
    <>
      <Pressable
        style={styles.signOutButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
      <Modal
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to sign out?
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.confirmButton} onPress={handleSignOut}>
                <Text style={styles.confirmText}>Sign out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
