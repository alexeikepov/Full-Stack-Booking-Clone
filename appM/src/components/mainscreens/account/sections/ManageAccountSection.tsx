// path: src/components/account/ManageAccountSection.tsx
import { JSX, useEffect, useState } from "react";
import {
  BackHandler,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
  Alert,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { Colors } from "../../../ui/Colors";
import { useTheme } from "../../../../hooks/ThemeContext";
import { useAuth } from "../../../../hooks/AuthContext";
import AccountItem from "../sections/AccountItem";
import AccountSection from "./AccountSection";
import { itemIcons } from "../../../../utils/itemIcons";

interface Style {
  buttonText?: TextStyle;
  fullPage: ViewStyle;
  header: ViewStyle;
  headerText: TextStyle;
  backButton: ViewStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  sectionItem: ViewStyle;
  sectionItemText: TextStyle;
  sectionItemSubText: TextStyle;
  addTravelerButton: ViewStyle;
  travelerFormContainer: ViewStyle;
  travelerFormInfo: TextStyle;
  input: ViewStyle;
  label: TextStyle;
  genderInput: ViewStyle;
  genderText: TextStyle;
  saveButton: ViewStyle;
}

const createStyles = (colors: typeof Colors.light): Style => ({
  fullPage: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
  },
  backButton: { paddingRight: 10 },
  headerText: { fontSize: 20, fontWeight: "bold", color: colors.text },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  sectionItemText: { fontSize: 16, color: colors.text },
  sectionItemSubText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  addTravelerButton: {
    backgroundColor: colors.blue,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: "auto",
    marginBottom: 20,
  },
  travelerFormContainer: { padding: 16 },
  travelerFormInfo: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
  label: { fontSize: 14, color: colors.textSecondary, marginBottom: 8 },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    color: colors.text,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  } as TextStyle,
  genderInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  genderText: { fontSize: 16, color: colors.text },
  saveButton: {
    backgroundColor: colors.blue,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 30,
  },
});

export default function ManageAccountSection(): JSX.Element {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const styles = createStyles(colors);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Personal details
  const [name, setName] = useState("guest");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("adress@gmail.com");
  const [phone, setPhone] = useState("+972123123");

  // Security
  const [passkeys, setPasskeys] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [activeSessions] = useState(1);

  // Travelers
  const [travelers, setTravelers] = useState<
    { first: string; last: string; dob: string; gender: string }[]
  >([]);
  const [editingTravelerIndex, setEditingTravelerIndex] = useState<
    number | null
  >(null);
  const [travelerFirst, setTravelerFirst] = useState("");
  const [travelerLast, setTravelerLast] = useState("");
  const [travelerDob, setTravelerDob] = useState("");
  const [travelerGender, setTravelerGender] = useState("");

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  const handleDeleteAccount = async () => {
    if (!user || user.id === "guest-id" || user.id === "demo-id") {
      Alert.alert("Error", "Cannot delete account for guest or demo users");
      setShowModal(null);
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`/api/users/${user.id}`);
      await logout();
      setShowModal(null);
    } catch (error) {
      console.error("Failed to delete account:", error);
      // You might want to show an error message to the user here
      setShowModal(null);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!showModal) return;
    const handler = () => true;
    let subscription: { remove: () => void } | undefined;
    if (Platform.OS === "android") {
      subscription = BackHandler.addEventListener("hardwareBackPress", handler);
    }
    return () => {
      if (subscription) subscription.remove();
    };
  }, [showModal]);

  const items = ["Personal details", "Security settings", "Other travelers"];

  const openTravelerModal = (index?: number) => {
    if (index !== undefined) {
      setEditingTravelerIndex(index);
      const t = travelers[index];
      setTravelerFirst(t.first);
      setTravelerLast(t.last);
      setTravelerDob(t.dob);
      setTravelerGender(t.gender);
      setShowModal("Edit traveler");
    } else {
      setEditingTravelerIndex(null);
      setTravelerFirst("");
      setTravelerLast("");
      setTravelerDob("");
      setTravelerGender("");
      setShowModal("Add new traveler");
    }
  };

  const saveTraveler = () => {
    if (editingTravelerIndex !== null) {
      const updated = [...travelers];
      updated[editingTravelerIndex] = {
        first: travelerFirst,
        last: travelerLast,
        dob: travelerDob,
        gender: travelerGender,
      };
      setTravelers(updated);
    } else {
      setTravelers([
        ...travelers,
        {
          first: travelerFirst,
          last: travelerLast,
          dob: travelerDob,
          gender: travelerGender,
        },
      ]);
    }
    setShowModal(null);
  };

  const getModalContent = () => {
    switch (showModal) {
      case "Personal details":
        return (
          <ScrollView
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          >
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { borderBottomWidth: 0 }]}>
                We will remember this info to make it faster when you book.
              </Text>
              <View style={styles.sectionItem}>
                <View>
                  <Text style={styles.sectionItemText}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>
              <View style={styles.sectionItem}>
                <View>
                  <Text style={styles.sectionItemText}>Gender</Text>
                  <TextInput
                    style={styles.input}
                    value={gender}
                    onChangeText={setGender}
                    placeholder="Select your gender"
                  />
                </View>
              </View>
              <View style={[styles.sectionItem, { borderBottomWidth: 0 }]}>
                <View>
                  <Text style={styles.sectionItemText}>Date of birth</Text>
                  <TextInput
                    style={styles.input}
                    value={dob}
                    onChangeText={setDob}
                    placeholder="Enter your date of birth"
                  />
                </View>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact details</Text>
              <View style={styles.sectionItem}>
                <View>
                  <Text style={styles.sectionItemText}>Email address</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>
              <View style={[styles.sectionItem, { borderBottomWidth: 0 }]}>
                <View>
                  <Text style={styles.sectionItemText}>Phone number</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
              </View>
            </View>
            <Pressable
              style={styles.saveButton}
              onPress={() => setShowModal(null)}
            >
              <Text style={[styles.sectionItemText, { color: "white" }]}>
                Save
              </Text>
            </Pressable>
          </ScrollView>
        );

      case "Security settings":
        return (
          <ScrollView
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          >
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { borderBottomWidth: 0 }]}>
                Change your security settings, set up secure authentication, or
                delete your account.
              </Text>
              <View style={styles.sectionItem}>
                <Text style={styles.sectionItemText}>Passkeys</Text>
                <Pressable onPress={() => setPasskeys(!passkeys)}>
                  <Text style={styles.sectionItemSubText}>
                    {passkeys ? "Enabled" : "Disabled"}
                  </Text>
                </Pressable>
              </View>
              <View style={styles.sectionItem}>
                <Text style={styles.sectionItemText}>
                  Two-factor authentication
                </Text>
                <Pressable onPress={() => setTwoFactor(!twoFactor)}>
                  <Text style={styles.sectionItemSubText}>
                    {twoFactor ? "Enabled" : "Disabled"}
                  </Text>
                </Pressable>
              </View>
              <View style={[styles.sectionItem, { borderBottomWidth: 0 }]}>
                <Text style={styles.sectionItemText}>Active sessions</Text>
                <Text style={styles.sectionItemSubText}>
                  {activeSessions} active
                </Text>
              </View>
            </View>
            <Pressable
              style={[
                styles.addTravelerButton,
                { backgroundColor: colors.red, marginTop: 40 },
              ]}
              onPress={() => setShowModal("Delete account confirm")}
            >
              <Text style={[styles.sectionItemText, { color: "white" }]}>
                Delete account
              </Text>
            </Pressable>
          </ScrollView>
        );

      case "Other travelers":
        return (
          <ScrollView
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          >
            {travelers.map((t, idx) => (
              <View key={idx} style={styles.sectionItem}>
                <View>
                  <Text style={styles.sectionItemText}>
                    {t.first} {t.last}
                  </Text>
                  <Text style={styles.sectionItemSubText}>
                    {t.dob} | {t.gender}
                  </Text>
                </View>
                <Pressable onPress={() => openTravelerModal(idx)}>
                  <Ionicons
                    name="create-outline"
                    size={20}
                    color={colors.icon}
                  />
                </Pressable>
              </View>
            ))}
            <Pressable
              style={styles.addTravelerButton}
              onPress={() => openTravelerModal()}
            >
              <Text style={[styles.sectionItemText, { color: "white" }]}>
                Add new traveler
              </Text>
            </Pressable>
          </ScrollView>
        );

      case "Add new traveler":
      case "Edit traveler":
        return (
          <ScrollView
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          >
            <View style={{ padding: 16 }}>
              <Text style={styles.travelerFormInfo}>
                Get permission from your fellow travelers before entering their
                personal details.
              </Text>
              <Text style={styles.label}>First name*</Text>
              <TextInput
                style={styles.input}
                value={travelerFirst}
                onChangeText={setTravelerFirst}
              />
              <Text style={styles.label}>Last name*</Text>
              <TextInput
                style={styles.input}
                value={travelerLast}
                onChangeText={setTravelerLast}
              />
              <Text style={styles.label}>Date of birth*</Text>
              <TextInput
                style={styles.input}
                value={travelerDob}
                onChangeText={setTravelerDob}
                placeholder="YYYY-MM-DD"
              />
              <Text style={styles.label}>Gender</Text>
              <TextInput
                style={styles.input}
                value={travelerGender}
                onChangeText={setTravelerGender}
                placeholder="Gender"
              />
              <Pressable style={styles.saveButton} onPress={saveTraveler}>
                <Text style={[styles.sectionItemText, { color: "white" }]}>
                  Save
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        );

      case "Delete account confirm":
        return (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 32,
            }}
          >
            <Text
              style={[
                styles.sectionItemText,
                { fontSize: 20, textAlign: "center", marginBottom: 24 },
              ]}
            >
              Are you sure you want to delete your account? This action cannot
              be undone.
            </Text>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <Pressable
                style={[
                  styles.addTravelerButton,
                  { backgroundColor: colors.red, flex: 1 },
                ]}
                onPress={handleDeleteAccount}
                disabled={isDeleting}
              >
                <Text style={[styles.sectionItemText, { color: "white" }]}>
                  {isDeleting ? "Deleting..." : "Yes, delete"}
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.addTravelerButton,
                  { backgroundColor: colors.card, flex: 1 },
                ]}
                onPress={() => setShowModal(null)}
              >
                <Text style={[styles.sectionItemText, { color: colors.text }]}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const getModalHeaderTitle = () => {
    if (showModal === "Edit traveler") return "Edit traveler";
    switch (showModal) {
      case "Personal details":
        return "Personal details";
      case "Security settings":
        return "Security";
      case "Other travelers":
        return "Other travelers";
      case "Add new traveler":
        return "Add new traveler";
      default:
        return "";
    }
  };

  const ModalComponent = (
    <Modal
      visible={!!showModal}
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      onRequestClose={() => setShowModal(null)}
    >
      <SafeAreaView style={[styles.fullPage, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => setShowModal(null)}
            style={styles.backButton}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerText}>{getModalHeaderTitle()}</Text>
        </View>
        {getModalContent()}
      </SafeAreaView>
    </Modal>
  );

  return (
    <AccountSection title="Manage account">
      {items.map((title) => (
        <AccountItem
          key={title}
          icon={
            <Ionicons name={itemIcons[title]} size={20} color={colors.icon} />
          }
          title={title}
          onPress={() => setShowModal(title)}
        />
      ))}
      {ModalComponent}
    </AccountSection>
  );
}
