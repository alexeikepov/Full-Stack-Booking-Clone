import { useNavigation } from "@react-navigation/native";
import React, { JSX, useEffect, useState } from "react";
import {
  BackHandler,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
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
  fullPage: ViewStyle;
  header: ViewStyle;
  headerText: TextStyle;
  backButton: ViewStyle;
  container: ViewStyle;
  mainText: TextStyle;
  subText: TextStyle;
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  mainText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.dark.text,
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: "center",
  },
});

export default function TravelActivitySection(): JSX.Element {
  const [showModal, setShowModal] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

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

  const items = ["Saved lists", "My reviews", "My questions to properties"];

  const getModalContent = () => {
    switch (showModal) {
      case "My reviews":
        return (
          <View style={styles.container}>
            <Ionicons
              name="person-outline"
              size={60}
              color={Colors.dark.textSecondary}
              style={{ marginBottom: 20 }}
            />
            <Text style={styles.mainText}>You do not have any reviews</Text>
            <Text style={styles.subText}>
              After you stay at a property, you will be invited to write a
              review. This makes sure our reviews come from real guests, like
              you.
            </Text>
          </View>
        );
      case "My questions to properties":
        return (
          <View style={styles.container}>
            <Text style={styles.mainText}>OLD TOWN SPIRIT</Text>
            <Text style={styles.subText}>
              what is the latest hour you can check in
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  const getModalHeaderTitle = () => {
    switch (showModal) {
      case "My reviews":
        return "Your reviews";
      case "My questions to properties":
        return "Questions to properties";
      default:
        return "";
    }
  };

  const handleItemPress = (title: string) => {
    if (title === "Saved lists") {
      navigation.navigate("Saved" as never);
    } else {
      setShowModal(title);
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
    <AccountSection title="Travel activity">
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
          onPress={() => handleItemPress(title)}
        />
      ))}
      {ModalComponent}
    </AccountSection>
  );
}
