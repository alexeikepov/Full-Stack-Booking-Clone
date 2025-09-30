import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import SavedItem from "../../components/saved/SavedItem";
import PropertyCard from "../../components/shared/PropertyCard";
import { useSavedProperties } from "../../hooks/SavedPropertiesContext";
import { useTheme } from "../../hooks/ThemeContext";

const savedLightImage = require("../../assets/images/saved-light.jpg");
const savedPropertyImage = require("../../assets/images/saved-property.png");
const planeLightImage = require("../../assets/images/plane-light.png");
const planeImage = require("../../assets/images/plane.jpg");
// Define the type for a single list item
type List = {
  id: string;
  title: string;
  subtitle: string;
};
const { width } = Dimensions.get("window");
// Local components to manage screen transitions without React Navigation
const StartYourListPageLocal = ({ onBack }: { onBack: () => void }) => {
  const navigation = useNavigation();
  const { colors, theme } = useTheme();
  const localStyles = useMemo(
    () => createLocalStyles(colors, theme),
    [colors, theme],
  );
  const handleShare = async () => {
    // Use Alert as fallback for Expo Go, since Share is not available
    Alert.alert("Share", "Check out your next trip list on Booking.com!");
  };
  const { savedProperties } = useSavedProperties();
  // Styles for empty state and property card list
  const startListStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      paddingTop: 150,
    },
    image: {
      width: width * 0.9,
      height: width * 0.6,
      resizeMode: "contain",
      marginBottom: 16,
    },
    title: localStyles.title,
    subtitle: localStyles.subtitle,
    findPropertiesButton: localStyles.findPropertiesButton,
    buttonText: localStyles.buttonText,
  });
  const propertyCardListStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
      paddingTop: 24,
    },
    scrollView: {
      marginHorizontal: -8,
    },
  });

  return (
    <View style={localStyles.container}>
      <View style={localStyles.header}>
        <TouchableOpacity onPress={onBack} style={localStyles.backButton}>
          <Text style={localStyles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={localStyles.headerTitle}>My trip</Text>
        <TouchableOpacity style={localStyles.shareButton} onPress={handleShare}>
          <Text style={localStyles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        {savedProperties.length === 0 ? (
          <View style={startListStyles.container}>
            <Image
              source={theme === "light" ? savedLightImage : savedPropertyImage}
              style={startListStyles.image}
            />
            <Text style={startListStyles.title}>Start your list</Text>
            <Text style={startListStyles.subtitle}>
              When you find a property you like, tap the{"\n"}heart icon to save
              it.
            </Text>
            <TouchableOpacity
              style={startListStyles.findPropertiesButton}
              onPress={() => (navigation as any).navigate("Search")}
            >
              <Text style={startListStyles.buttonText}>Find properties</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={propertyCardListStyles.container}>
            <ScrollView style={propertyCardListStyles.scrollView}>
              {savedProperties.map((property) => (
                <PropertyCard
                  key={property.id || property.title}
                  property={property}
                  onPress={() =>
                    (navigation as any).navigate("PropertyDetailsScreen", {
                      propertyData: {
                        // Ensure pricePerNight is provided; fall back to price if needed
                        ...(property || {}),
                        // property may be a simplified shape; cast to any to access optional fields
                        pricePerNight:
                          (property as any).pricePerNight ??
                          (property as any).price ??
                          undefined,
                      },
                    })
                  }
                />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};
export default function SavedScreen() {
  const navigation = useNavigation();
  const { colors, theme } = useTheme();
  const { savedProperties } = useSavedProperties();
  const [activeTab, setActiveTab] = useState("Lists");
  const [savedLists, setSavedLists] = useState<List[]>([
    {
      id: "1",
      title: "my trip",
      subtitle: `${savedProperties.length} saved items`,
    },
  ]);

  // Keep the default list's subtitle in sync with the number of saved properties
  useEffect(() => {
    setSavedLists((prev) =>
      prev.map((item) =>
        // Update the default list (id === "1") to reflect current savedProperties count
        item.id === "1"
          ? { ...item, subtitle: `${savedProperties.length} saved items` }
          : item,
      ),
    );
  }, [savedProperties.length]);
  const [createListModalVisible, setCreateListModalVisible] = useState(false);
  const [manageListModalVisible, setManageListModalVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [currentList, setCurrentList] = useState<List | null>(null);
  const [newListName, setNewListName] = useState("");
  const [currentPage, setCurrentPage] = useState("SavedScreen");
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);
  const modalStyles = useMemo(
    () => createModalStyles(colors, theme),
    [colors, theme],
  );
  const handleCreateList = () => {
    if (newListName.trim().length > 0) {
      const newList: List = {
        id: (savedLists.length + 1).toString(),
        title: newListName,
        subtitle: "0 saved items",
      };
      setSavedLists([...savedLists, newList]);
      setNewListName("");
      setCreateListModalVisible(false);
    }
  };
  const handleDeleteList = () => {
    Alert.alert("Delete list", "Are you sure you want to delete this list?", [
      {
        text: "Cancel",
        onPress: () => console.log("Deletion canceled"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          if (currentList) {
            setSavedLists(
              savedLists.filter((item) => item.id !== currentList.id),
            );
            setManageListModalVisible(false);
            setCurrentList(null);
          }
        },
      },
    ]);
  };
  const handleShareList = () => {
    Alert.alert(
      "Sharing not possible now.",
      "This feature is currently unavailable.",
    );
    setManageListModalVisible(false);
  };
  const handleRenameList = () => {
    if (newListName.trim().length > 0 && currentList) {
      setSavedLists(
        savedLists.map((item) =>
          item.id === currentList.id ? { ...item, title: newListName } : item,
        ),
      );
      setNewListName("");
      setRenameModalVisible(false);
      setManageListModalVisible(false);
      setCurrentList(null);
    }
  };
  const renderContent = () => {
    if (activeTab === "Lists") {
      return (
        <ScrollView style={styles.contentContainer}>
          {savedLists.map((item) => (
            <SavedItem
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              onPress={() => setCurrentPage("StartYourListPage")}
              onDotsPress={() => {
                setCurrentList(item);
                setManageListModalVisible(true);
              }}
            />
          ))}
        </ScrollView>
      );
    } else {
      return (
        <View style={styles.emptyAlertsContainer}>
          <Image
            source={theme === "light" ? planeLightImage : planeImage}
            style={styles.illustration}
          />
          <Text style={styles.titleText}>You have no saved price alerts</Text>
          <Text style={styles.subtitleText}>
            Get price alerts for select flights searches —{"\n"}only for Genius
            members
          </Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => (navigation as any).navigate("Search")}
          >
            <Text style={styles.buttonText}>Start searching for flights</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };
  const renderCreateListModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={createListModalVisible}
      onRequestClose={() => setCreateListModalVisible(false)}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalTitle}>Create a new list</Text>
            <TouchableOpacity onPress={() => setCreateListModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={modalStyles.input}
            placeholder="List name"
            placeholderTextColor={colors.icon}
            value={newListName}
            onChangeText={setNewListName}
            maxLength={40}
          />
          <Text style={modalStyles.charCount}>{newListName.length} / 40</Text>
          <TouchableOpacity
            style={modalStyles.actionButton}
            onPress={handleCreateList}
          >
            <Text style={modalStyles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  const renderManageListModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={manageListModalVisible}
      onRequestClose={() => setManageListModalVisible(false)}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.bottomModalView}>
          <TouchableOpacity
            style={modalStyles.modalItem}
            onPress={() => {
              setManageListModalVisible(false);
              setRenameModalVisible(true);
              if (currentList) setNewListName(currentList.title);
            }}
          >
            <Text style={modalStyles.modalItemText}>Rename</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={modalStyles.modalItem}
            onPress={handleDeleteList}
          >
            <Text style={modalStyles.modalItemText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={modalStyles.modalItem}
            onPress={handleShareList}
          >
            <Text style={modalStyles.modalItemText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={modalStyles.closeButton}
            onPress={() => setManageListModalVisible(false)}
          >
            <Text style={modalStyles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  const renderRenameModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={renameModalVisible}
      onRequestClose={() => setRenameModalVisible(false)}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalTitle}>Rename</Text>
            <TouchableOpacity onPress={() => setRenameModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={modalStyles.input}
            placeholder="List name"
            placeholderTextColor={colors.icon}
            value={newListName}
            onChangeText={setNewListName}
            maxLength={40}
          />
          <Text style={modalStyles.charCount}>{newListName.length} / 40</Text>
          <TouchableOpacity
            style={modalStyles.actionButton}
            onPress={handleRenameList}
          >
            <Text style={modalStyles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  // RENDER REAL SCREENS
  if (currentPage === "StartYourListPage") {
    return (
      <StartYourListPageLocal onBack={() => setCurrentPage("SavedScreen")} />
    );
  }
  // Removed local SearchScreen render logic; navigation now handles it.
  return (
    <View style={styles.container}>
      <View style={styles.headerTitleRow}>
        <Text style={styles.savedTitle}>Saved</Text>
        <TouchableOpacity
          style={styles.plusIconContainer}
          onPress={() => setCreateListModalVisible(true)}
        >
          <Ionicons
            name="add-outline"
            size={35}
            color={theme === "dark" ? colors.text : colors.background}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Lists" && styles.activeTab]}
          onPress={() => setActiveTab("Lists")}
        >
          <Ionicons
            name="heart-outline"
            size={18}
            color={
              activeTab === "Lists"
                ? theme === "dark"
                  ? colors.text
                  : colors.background
                : theme === "dark"
                  ? colors.text
                  : colors.blue
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "Lists" && {
                color: theme === "dark" ? colors.text : colors.background,
              },
            ]}
          >
            Lists
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Alerts" && styles.activeTab]}
          onPress={() => setActiveTab("Alerts")}
        >
          <Ionicons
            name="paper-plane-outline"
            size={18}
            color={
              activeTab === "Alerts"
                ? theme === "dark"
                  ? colors.text
                  : colors.background
                : theme === "dark"
                  ? colors.text
                  : colors.blue
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "Alerts" && {
                color: theme === "dark" ? colors.text : colors.background,
              },
            ]}
          >
            Alerts
          </Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
      {renderCreateListModal()}
      {renderManageListModal()}
      {renderRenameModal()}
    </View>
  );
}
const createStyles = (
  colors: {
    text: any;
    textSecondary?: string;
    background: any;
    card?: string;
    button?: string;
    accent?: string;
    tint?: string;
    icon: any;
    tabIconDefault?: string;
    tabIconSelected?: string;
    inputBackground?: string;
    separator?: string;
    red?: string;
    yellow?: string;
    green?: string;
    blue?: string;
    purple?: string;
    pink?: string;
    teal?: string;
    gray?: string;
  },
  theme: string,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
      backgroundColor: theme === "dark" ? colors.background : colors.blue,
      marginBottom: 12,
      position: "relative",
    },
    savedTitle: {
      color: theme === "dark" ? colors.text : colors.background,
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      flex: 1,
    },
    plusIconContainer: {
      padding: 8,
      position: "absolute",
      right: 16,
    },
    tabsContainer: {
      flexDirection: "row",
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingBottom: 16,
      gap: 8,
    },
    tab: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: theme === "dark" ? 0 : 1,
      borderColor: theme === "dark" ? colors.text : colors.blue,
    },
    activeTab: {
      backgroundColor: theme === "dark" ? colors.background : colors.blue,
      borderWidth: theme === "dark" ? 1 : 0,
      borderColor: theme === "dark" ? colors.text : "transparent",
    },
    tabText: {
      color: theme === "dark" ? colors.text : colors.blue,
      marginLeft: 6,
      fontWeight: "bold",
    },
    contentContainer: {
      paddingHorizontal: 16,
    },
    emptyAlertsContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
    },
    illustration: {
      width: width * 0.6,
      height: width * 0.4,
      resizeMode: "contain",
      marginBottom: 16,
    },
    titleText: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    subtitleText: {
      fontSize: 14,
      color: colors.icon,
      textAlign: "center",
      marginBottom: 16,
    },
    searchButton: {
      backgroundColor: "#007AFF",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    buttonText: {
      color: colors.background,
      fontWeight: "bold",
      fontSize: 16,
    },
  });
// Dummy modalStyles
const createModalStyles = (
  colors: {
    text: any;
    textSecondary?: string;
    background: any;
    card?: string;
    button?: string;
    accent?: string;
    tint?: string;
    icon: any;
    tabIconDefault?: string;
    tabIconSelected?: string;
    inputBackground?: string;
    separator?: string;
    red?: string;
    yellow?: string;
    green?: string;
    blue?: string;
    purple?: string;
    pink?: string;
    teal?: string;
    gray?: string;
  },
  theme: string,
) =>
  StyleSheet.create({
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
    bottomModalView: {
      backgroundColor: colors.background,
      padding: 16,
      width: "100%",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
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
      backgroundColor: theme === "light" ? colors.blue : colors.text,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginTop: 8,
    },
    buttonText: {
      color: colors.background,
      fontWeight: "600",
      fontSize: 16,
    },
    modalItem: { paddingVertical: 12 },
    modalItemText: { color: colors.text, fontSize: 16 },
    closeButton: { marginTop: 12, alignItems: "center" },
    closeButtonText: { color: colors.text, fontWeight: "bold" },
  });
// Local styles for StartYourListPageLocal
const createLocalStyles = (
  colors: {
    text: any;
    textSecondary?: string;
    background: any;
    card?: string;
    button?: string;
    accent?: string;
    tint?: string;
    icon: any;
    tabIconDefault?: string;
    tabIconSelected?: string;
    inputBackground?: string;
    separator?: string;
    red?: string;
    yellow?: string;
    green?: string;
    blue?: string;
    purple?: string;
    pink?: string;
    teal?: string;
    gray?: string;
  },
  theme: string,
) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: theme === "light" ? colors.blue : colors.background,
    },
    backButton: { padding: 8 },
    backText: {
      color: theme === "light" ? colors.background : colors.text,
      fontSize: 16,
    },
    headerTitle: {
      color: theme === "light" ? colors.background : colors.text,
      fontSize: 20,
      fontWeight: "bold",
    },
    shareButton: { padding: 8 },
    shareText: { color: theme === "light" ? colors.background : colors.text },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      marginHorizontal: 0,
    },
    illustration: {
      width: width * 0.7,
      height: width * 0.4,
      resizeMode: "contain",
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 14,
      color: colors.icon,
      textAlign: "center",
      marginBottom: 16,
    },
    findPropertiesButton: {
      backgroundColor: colors.blue,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignSelf: "center",
    },
    buttonText: {
      color: colors.background,
      fontWeight: "bold",
      fontSize: 16,
    },
  });
