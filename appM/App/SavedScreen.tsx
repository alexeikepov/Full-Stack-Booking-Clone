import { useNavigation } from "@react-navigation/native";
import { useMemo, useState } from "react";
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
import SavedItem from "../components/saved/SavedItem";
import { useSavedProperties } from "../hooks/SavedPropertiesContext";
import { useTheme } from "../hooks/ThemeContext";
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
  return (
    <View style={localStyles.container}>
      <View style={localStyles.header}>
        <TouchableOpacity onPress={onBack} style={localStyles.backButton}>
          <Text style={localStyles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={localStyles.headerTitle}>My next trip</Text>
        <TouchableOpacity style={localStyles.shareButton} onPress={handleShare}>
          <Text style={localStyles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>
      <View style={localStyles.content}>
        <Image
          source={
            theme === "light"
              ? require("../assets/images/saved-light.jpg")
              : require("../assets/images/saved-property.png")
          }
          style={localStyles.illustration}
        />
        <Text style={localStyles.title}>Start your list</Text>
        <Text style={localStyles.subtitle}>
          When you find a property you like, tap the{"\n"}heart icon to save it.
        </Text>
        <TouchableOpacity
          style={localStyles.findPropertiesButton}
          onPress={() => (navigation as any).navigate("Search")}
        >
          <Text style={localStyles.buttonText}>Find properties</Text>
        </TouchableOpacity>
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
    { id: "2", title: "My next trip", subtitle: "0 saved items" },
  ]);
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
            source={
              theme === "light"
                ? require("../assets/images/plane-light.png")
                : require("../assets/images/plane.jpg")
            }
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
            size={24}
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
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
      backgroundColor: colors.background,
      borderRadius: 10,
      padding: 16,
      width: "90%",
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
      marginBottom: 12,
    },
    modalTitle: { fontSize: 18, fontWeight: "bold", color: colors.text },
    input: {
      borderWidth: 1,
      borderColor: colors.icon,
      borderRadius: 8,
      padding: 8,
      color: colors.text,
      marginBottom: 8,
    },
    charCount: { textAlign: "right", color: colors.icon, marginBottom: 8 },
    actionButton: {
      backgroundColor: theme === "light" ? colors.blue : colors.text,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
    },
    buttonText: {
      color: colors.background,
      fontWeight: "bold",
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
    },
    buttonText: {
      color: colors.background,
      fontWeight: "bold",
      fontSize: 16,
    },
  });
