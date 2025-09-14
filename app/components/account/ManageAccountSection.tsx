import React, { JSX, useEffect, useState } from "react";
import {
  BackHandler,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";
import AccountItem from "./AccountItem";
import AccountSection from "./AccountSection";
import { itemIcons } from "./itemIcons";

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

const styles = StyleSheet.create<Style>({
  fullPage: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.dark.card,
  },
  backButton: {
    paddingRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.dark.text,
  },
  section: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark.text,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.separator,
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.separator,
  },
  sectionItemText: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  sectionItemSubText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  addTravelerButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: "auto",
    marginBottom: 20,
  },
  travelerFormContainer: {
    padding: 16,
  },
  travelerFormInfo: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    color: Colors.dark.text,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  genderInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  genderText: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 30,
  },
});

export default function ManageAccountSection(): JSX.Element {
  const [showModal, setShowModal] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

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
              <Pressable style={styles.sectionItem}>
                <View>
                  <Text style={styles.sectionItemText}>Name</Text>
                  <Text style={styles.sectionItemSubText}>
                    Crazy That Random
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.dark.icon}
                />
              </Pressable>
              <Pressable style={styles.sectionItem}>
                <View>
                  <Text style={styles.sectionItemText}>Gender</Text>
                  <Text style={styles.sectionItemSubText}>
                    Select your gender
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.dark.icon}
                />
              </Pressable>
              <Pressable style={[styles.sectionItem, { borderBottomWidth: 0 }]}>
                <View>
                  <Text style={styles.sectionItemText}>Date of birth</Text>
                  <Text style={styles.sectionItemSubText}>
                    Enter your date of birth
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.dark.icon}
                />
              </Pressable>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact details</Text>
              <Text
                style={[
                  styles.sectionItemSubText,
                  { paddingHorizontal: 16, paddingTop: 8 },
                ]}
              >
                Properties or providers you book with will use this info if they
                need to contact you.
              </Text>
              <Pressable style={styles.sectionItem}>
                <View>
                  <Text style={styles.sectionItemText}>Email address</Text>
                  <Text style={styles.sectionItemSubText}>
                    adress@gmail.com
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.dark.icon}
                />
              </Pressable>
              <Pressable style={[styles.sectionItem, { borderBottomWidth: 0 }]}>
                <View>
                  <Text style={styles.sectionItemText}>Phone number</Text>
                  <Text style={styles.sectionItemSubText}>+972123123</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.dark.icon}
                />
              </Pressable>
            </View>
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
              <Pressable style={styles.sectionItem}>
                <View>
                  <Text style={styles.sectionItemText}>Passkeys</Text>
                  <Text style={styles.sectionItemSubText}>
                    You can now easily sign in to your account using your face,
                    fingerprint, or PIN.
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.dark.icon}
                />
              </Pressable>
              <Pressable style={styles.sectionItem}>
                <View>
                  <Text style={styles.sectionItemText}>
                    Two-factor authentication
                  </Text>
                  <Text style={styles.sectionItemSubText}>
                    Increase your accounts security by setting up two-factor
                    authentication. This can also be used as an alternative
                    sign-in method in case there is an issue with your email.
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.dark.icon}
                />
              </Pressable>
              <Pressable style={[styles.sectionItem, { borderBottomWidth: 0 }]}>
                <View>
                  <Text style={styles.sectionItemText}>Active sessions</Text>
                  <Text style={styles.sectionItemSubText}>
                    Sign out from all the active sessions
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.dark.icon}
                />
              </Pressable>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Linked social accounts</Text>
              <Pressable style={[styles.sectionItem, { borderBottomWidth: 0 }]}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="logo-google"
                    size={20}
                    color={Colors.dark.text}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.sectionItemText}>Google</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.dark.icon}
                />
              </Pressable>
            </View>
            <Pressable
              style={[
                styles.addTravelerButton,
                { backgroundColor: Colors.dark.red, marginTop: 40 },
              ]}
            >
              <Text style={[styles.sectionItemText, { color: "white" }]}>
                Delete account
              </Text>
            </Pressable>
          </ScrollView>
        );
      case "Other travelers":
        return (
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 30,
              }}
            >
              <Text style={[styles.sectionItemText, { textAlign: "center" }]}>
                Add or edit info about the people you are traveling with.
              </Text>
            </View>
            <Pressable
              style={styles.addTravelerButton}
              onPress={() => setShowModal("Add new traveler")}
            >
              <Text style={[styles.sectionItemText, { color: "white" }]}>
                Add new traveler
              </Text>
            </Pressable>
          </View>
        );
      case "Add new traveler":
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
              <TextInput style={styles.input} />
              <Text style={styles.label}>Last name*</Text>
              <TextInput style={styles.input} />
              <Text style={styles.label}>Date of birth*</Text>
              <Pressable style={styles.genderInput}>
                <Text style={styles.genderText}></Text>
                <Ionicons
                  name="chevron-down"
                  size={24}
                  color={Colors.dark.icon}
                />
              </Pressable>
              <Text style={styles.label}>Gender</Text>
              <Pressable style={styles.genderInput}>
                <Text style={styles.genderText}></Text>
                <Ionicons
                  name="chevron-down"
                  size={24}
                  color={Colors.dark.icon}
                />
              </Pressable>
              <Pressable style={styles.saveButton}>
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
            </View>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  const getModalHeaderTitle = () => {
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
            <Ionicons name="chevron-back" size={24} color={Colors.dark.text} />
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
            <Ionicons
              name={itemIcons[title]}
              size={20}
              color={Colors.dark.icon}
            />
          }
          title={title}
          onPress={() => setShowModal(title)}
        />
      ))}
      {ModalComponent}
    </AccountSection>
  );
}
