import { useNavigation } from "@react-navigation/native";
import { JSX, useEffect, useState } from "react";
import {
  BackHandler,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
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
import { useTheme } from "../../hooks/ThemeContext"; // ✅ added
interface Style {
  container: ViewStyle;
  content: ViewStyle;
  textContainer: ViewStyle;
  mainText: TextStyle;
  subText: TextStyle;
  separator: ViewStyle;
  progressText: TextStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  headerText: TextStyle;
  pageSection: ViewStyle;
  pageSectionTitle: TextStyle;
  pageItemContainer: ViewStyle;
  pageItemIcon: ViewStyle;
  pageItemTextContainer: ViewStyle;
  pageItemMainText: TextStyle;
  pageItemSubText: TextStyle;
  findStayButton: ViewStyle;
  findStayButtonText: TextStyle;
  fullContainer: ViewStyle;
}
const styles = StyleSheet.create<Style>({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  content: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  textContainer: { flex: 1, marginLeft: 12 },
  mainText: { fontSize: 16, fontWeight: "bold", color: Colors.dark.text },
  subText: { fontSize: 14, color: Colors.dark.textSecondary },
  separator: { height: 1, backgroundColor: "#333", marginVertical: 16 },
  progressText: { fontSize: 14, color: Colors.dark.text },
  fullContainer: {
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
  backButton: { paddingRight: 10 },
  headerText: { fontSize: 20, fontWeight: "bold", color: Colors.dark.text },
  pageSection: { marginTop: 20, marginHorizontal: 16 },
  pageSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginBottom: 10,
  },
  pageItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  pageItemIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#333",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  pageItemTextContainer: { flex: 1, marginLeft: 16 },
  pageItemMainText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark.text,
  },
  pageItemSubText: { fontSize: 14, color: Colors.dark.textSecondary },
  findStayButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 20,
  },
  findStayButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark.card,
  },
});
export default function GeniusRewardsBanner(): JSX.Element {
  const [showFullPage, setShowFullPage] = useState(false);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, theme } = useTheme();
  // Block Android hardware back when full page is open
  useEffect(() => {
    if (!showFullPage) return;
    const handler = () => true; // consume back action
    let subscription: { remove: () => void } | undefined;
    if (Platform.OS === "android") {
      subscription = BackHandler.addEventListener("hardwareBackPress", handler);
    }
    return () => {
      if (subscription) subscription.remove();
    };
  }, [showFullPage]);
  // Small banner shown inside Account page
  const Banner = (
    <Pressable
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={() => setShowFullPage(true)}
    >
      <View style={styles.content}>
        <Image
          source={
            theme === "light"
              ? require("../../assets/images/genius-light.jpg")
              : require("../../assets/images/genius-present.png")
          }
          style={{ width: 40, height: 40 }}
        />
        <View style={styles.textContainer}>
          <Text
            style={[styles.mainText, { flexShrink: 1, color: colors.text }]}
            numberOfLines={1}
          >
            You have 2 Genius rewards
          </Text>
          <Text
            style={[
              styles.subText,
              { flexShrink: 1, color: colors.textSecondary },
            ]}
            numberOfLines={1}
          >
            10% discounts and so much more!
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.icon} />
      </View>
      <View
        style={[styles.separator, { backgroundColor: colors.textSecondary }]}
      />
      <Text
        style={[styles.progressText, { flexShrink: 1, color: colors.text }]}
        numberOfLines={1}
      >
        You are 3 bookings away from Genius Level 2
      </Text>
    </Pressable>
  );
  // Full page content (renders inside Modal, covers whole screen)
  const FullPage = (
    <Modal
      visible={showFullPage}
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      onRequestClose={() => {
        /* prevent closing with hardware back; handled by BackHandler */
      }}
    >
      <SafeAreaView
        style={[
          styles.fullContainer,
          { paddingTop: insets.top, backgroundColor: colors.background },
        ]}
      >
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <Pressable
            onPress={() => setShowFullPage(false)}
            style={styles.backButton}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerText, { color: colors.text }]}>
            My rewards
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: Math.max(24, insets.bottom + 16),
          }}
        >
          <View style={[styles.pageSection, { marginTop: 0 }]}>
            <View style={[styles.container, { backgroundColor: colors.card }]}>
              <Text style={[styles.mainText, { color: colors.text }]}>
                Hi Crazy, check out your rewards
              </Text>
              <Text style={[styles.subText, { color: colors.textSecondary }]}>
                Explore rewards you can use on your upcoming trip, or enjoy the
                ones you have earned for life as a Genius Level 1 member.
              </Text>
            </View>
          </View>
          <View style={styles.pageSection}>
            <Text style={[styles.pageSectionTitle, { color: colors.text }]}>
              Genius Level 1 rewards
            </Text>
            <View
              style={[
                styles.pageItemContainer,
                { backgroundColor: colors.card },
              ]}
            >
              <View style={styles.pageItemIcon}>
                <Text>🏠</Text>
              </View>
              <View style={styles.pageItemTextContainer}>
                <Text style={[styles.pageItemMainText, { color: colors.text }]}>
                  10% off select stays
                </Text>
                <Text
                  style={[
                    styles.pageItemSubText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Enjoy savings at 390,000 participating properties worldwide.
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.pageItemContainer,
                { backgroundColor: colors.card },
              ]}
            >
              <View style={styles.pageItemIcon}>
                <Text>🚗</Text>
              </View>
              <View style={styles.pageItemTextContainer}>
                <Text style={[styles.pageItemMainText, { color: colors.text }]}>
                  10% off rental cars
                </Text>
                <Text
                  style={[
                    styles.pageItemSubText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Hit the road for less with discounts on select options.
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.pageItemContainer,
                { backgroundColor: colors.card },
              ]}
            >
              <View
                style={[styles.pageItemIcon, { backgroundColor: "#FFD700" }]}
              >
                <Text>🏆</Text>
              </View>
              <View style={styles.pageItemTextContainer}>
                <Text style={[styles.pageItemMainText, { color: colors.text }]}>
                  You are 3 bookings away from Genius Level 2.
                </Text>
                <Text
                  style={[
                    styles.pageItemSubText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Every booking counts toward your progress!
                </Text>
              </View>
            </View>
          </View>
          <Pressable
            style={[
              styles.findStayButton,
              { marginBottom: Math.max(24, insets.bottom + 16) },
            ]}
            onPress={() => {
              setShowFullPage(false); // close modal
              navigation.navigate("Search" as never); // go to Search screen
            }}
          >
            <Text style={[styles.findStayButtonText, { color: colors.card }]}>
              Find your next stay
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
  return showFullPage ? FullPage : Banner;
}
