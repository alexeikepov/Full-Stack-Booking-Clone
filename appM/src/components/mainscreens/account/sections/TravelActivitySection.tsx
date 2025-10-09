import { useNavigation } from "@react-navigation/native";
import { JSX, useEffect, useState } from "react";
import {
  BackHandler,
  Modal,
  Platform,
  Pressable,
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
import { Colors } from "../../../ui/Colors";
import { useTheme } from "../../../../hooks/ThemeContext";
import AccountItem from "../sections/AccountItem";
import AccountSection from "./AccountSection";
interface Style {
  fullPage: ViewStyle;
  header: ViewStyle;
  headerText: TextStyle;
  backButton: ViewStyle;
  container: ViewStyle;
  mainText: TextStyle;
  subText: TextStyle;
}
const createStyles = (colors: typeof Colors.light): Style => ({
  fullPage: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
  },
  backButton: {
    paddingRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
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
    color: colors.text,
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
export default function TravelActivitySection(): JSX.Element {
  const { colors } = useTheme();
  const styles = createStyles(colors);
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
  const items = [
    {
      title: "Saved lists",
      icon: <Ionicons name="heart-outline" size={20} color={colors.icon} />,
    },
    {
      title: "My reviews",
      icon: (
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={20}
          color={colors.icon}
        />
      ),
    },
    {
      title: "My questions to properties",
      icon: (
        <Ionicons name="document-text-outline" size={20} color={colors.icon} />
      ),
    },
  ];
  const getModalContent = () => {
    switch (showModal) {
      case "My reviews":
        return (
          <View style={styles.container}>
            <Ionicons
              name="person-outline"
              size={60}
              color={colors.textSecondary}
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
            <Text style={styles.mainText}>Your questions:</Text>
            <Text style={styles.subText}>currently you have none</Text>
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
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerText}>{getModalHeaderTitle()}</Text>
        </View>
        {getModalContent()}
      </SafeAreaView>
    </Modal>
  );
  return (
    <AccountSection title="Travel activity">
      {items.map((item) => (
        <AccountItem
          key={item.title}
          icon={item.icon}
          title={item.title}
          onPress={() => handleItemPress(item.title)}
        />
      ))}
      {ModalComponent}
    </AccountSection>
  );
}
