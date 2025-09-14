import React, { useState } from "react";
import {
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";
import AccountItem from "./AccountItem";
import AccountSection from "./AccountSection";
import { itemIcons } from "./itemIcons";

interface Style {
  fullContainer: ViewStyle;
  backgroundImage: ViewStyle;
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

const styles = StyleSheet.create<Style>({
  fullContainer: {
    flex: 1,
    backgroundColor: "transparent",
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
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  backButton: { paddingRight: 10 },
  headerText: { fontSize: 20, fontWeight: "bold", color: "white" },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  listPropertyButton: {
    backgroundColor: "#007AFF",
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

export default function ManagePropertySection() {
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const items = ["List your property"];

  const PropertyModal = (
    <Modal
      visible={showPropertyModal}
      animationType="slide"
      transparent={false}
    >
      <ImageBackground
        source={{
          uri: "https://r-xx.bstatic.com/xdata/images/xphoto/full/156972046.jpeg?k=33611833772297926b48505e60d5b43a9a838575510de1633593333e6659c00b&o=",
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.fullContainer}>
          <View style={styles.header}>
            <Pressable
              onPress={() => setShowPropertyModal(false)}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color={"white"} />
            </Pressable>
            <Text style={styles.headerText}>List your property</Text>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>List your place on Booking.com</Text>
            <Text style={styles.subtitle}>
              Homes, hotels, and everything in between – whatever it is, you can
              list it.
            </Text>
          </View>
          <View style={styles.footer}>
            <Pressable
              style={styles.listPropertyButton}
              onPress={() => {
                console.log("List property pressed");
                setShowPropertyModal(false);
              }}
            >
              <Text style={styles.listPropertyButtonText}>
                List your property on our site
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </ImageBackground>
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
                name={itemIcons[title]}
                size={20}
                color={Colors.dark.icon}
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
