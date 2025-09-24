import { useState } from "react";
import {
  ImageBackground,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../hooks/ThemeContext";
import AccountItem from "./AccountItem";
import AccountSection from "./AccountSection";
import { itemIcons } from "./itemIcons";
interface Style {
  fullContainer: ViewStyle;
  backgroundImage: ViewStyle;
  overlay: ViewStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  headerText: TextStyle;
  contentContainer: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  footer: ViewStyle;
  listPropertyButton: ViewStyle;
  listPropertyButtonText: TextStyle;
}
export default function ManagePropertySection() {
  const { colors } = useTheme();
  const [showPropertyModal, setShowPropertyModal] = useState(false);

  const styles = StyleSheet.create<Style>({
    fullContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    overlay: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 44, // iOS status bar height
    },
    backgroundImage: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.card,
    },
    backButton: { paddingRight: 10 },
    headerText: { fontSize: 20, fontWeight: "bold", color: colors.text },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      backgroundColor: colors.card,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
      textAlign: "center",
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 24,
    },
    footer: {
      padding: 20,
      backgroundColor: colors.card,
    },
    listPropertyButton: {
      backgroundColor: colors.button,
      borderRadius: 8,
      paddingVertical: 15,
      alignItems: "center",
    },
    listPropertyButtonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
  });

  const items = ["List your property"];
  const PropertyModal = (
    <Modal visible={showPropertyModal} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <ImageBackground
          source={require("../../assets/images/place-holder.jpg")}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={{ flex: 1 }}>
            <View style={styles.header}>
              <Pressable
                onPress={() => setShowPropertyModal(false)}
                style={styles.backButton}
              >
                <Ionicons name="chevron-back" size={24} color={colors.text} />
              </Pressable>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="home-outline"
                  size={20}
                  color={colors.icon}
                  style={{ marginRight: 4 }}
                />
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={colors.icon}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.headerText}>List your property</Text>
              </View>
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.title}>List your place on Booking.com</Text>
              <Text style={styles.subtitle}>
                Homes, hotels, and everything in between – whatever it is, you
                can list it.
              </Text>
            </View>
            <View style={styles.footer}>
              <Pressable
                style={styles.listPropertyButton}
                onPress={async () => {
                  const url =
                    "https://join.booking.com/?aid=392483&lang=en-gb&label=propertysignup-NaxvXgv5_mGacLIhgKeSMQS633895872422:pl:ta:p1:p2:ac:ap:neg:fi:tikwd-298213278415:lp1008006:li:dec:dm:ppccp=UmFuZG9tSVYkc2RlIyh9YQ5jSEdbiwHzcEmz6yTN0U8;ws=&gad_source=1&gad_campaignid=1479165590&gclid=CjwKCAjwz5nGBhBBEiwA-W6XRDbvsAGmQnx8ODrf2ELTVAmxBBFBLSk5SXRDjkRKEPCW68QKjfl0CRoCRJAQAvD_BwE";
                  try {
                    await Linking.openURL(url);
                  } catch (e) {
                    console.warn("Failed to open URL", e);
                  }
                  setShowPropertyModal(false);
                }}
              >
                <Text style={styles.listPropertyButtonText}>
                  List your property on our site
                </Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
  return (
    <>
      <AccountSection title="Manage your property">
        {items.map((title) => (
          <AccountItem
            key={title}
            icon={
              <Ionicons
                name={itemIcons[title] || "home-outline"}
                size={20}
                color={colors.icon}
              />
            }
            title={title}
            onPress={() => setShowPropertyModal(true)}
          />
        ))}
      </AccountSection>
      {PropertyModal}
    </>
  );
}
