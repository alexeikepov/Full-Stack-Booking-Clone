import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  CreateListModal,
  ManageListModal,
  RenameModal,
  StartYourListPageLocal,
} from "../../components/saved";
import SavedItem from "../../components/saved/SavedItem";
import { useSavedProperties } from "../../hooks/SavedPropertiesContext";
import { useTheme } from "../../hooks/ThemeContext";
import { createStyles } from "./SavedScreen.styles";

const planeLightImage = require("../../assets/images/plane-light.png");
const planeImage = require("../../assets/images/plane.jpg");
// Define the type for a single list item
type List = {
  id: string;
  title: string;
  subtitle: string;
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
          : item
      )
    );
  }, [savedProperties.length]);
  const [createListModalVisible, setCreateListModalVisible] = useState(false);
  const [manageListModalVisible, setManageListModalVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [currentList, setCurrentList] = useState<List | null>(null);
  const [newListName, setNewListName] = useState("");
  const [currentPage, setCurrentPage] = useState("SavedScreen");
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);
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
              savedLists.filter((item) => item.id !== currentList.id)
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
      "This feature is currently unavailable."
    );
    setManageListModalVisible(false);
  };
  const handleRenameList = () => {
    if (newListName.trim().length > 0 && currentList) {
      setSavedLists(
        savedLists.map((item) =>
          item.id === currentList.id ? { ...item, title: newListName } : item
        )
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
      <CreateListModal
        visible={createListModalVisible}
        onClose={() => setCreateListModalVisible(false)}
        onCreate={handleCreateList}
        newListName={newListName}
        setNewListName={setNewListName}
        colors={colors}
        theme={theme}
      />
      <ManageListModal
        visible={manageListModalVisible}
        onClose={() => setManageListModalVisible(false)}
        onRename={() => {
          setManageListModalVisible(false);
          setRenameModalVisible(true);
          if (currentList) setNewListName(currentList.title);
        }}
        onDelete={handleDeleteList}
        onShare={handleShareList}
        colors={colors}
        theme={theme}
      />
      <RenameModal
        visible={renameModalVisible}
        onClose={() => setRenameModalVisible(false)}
        onSave={handleRenameList}
        newListName={newListName}
        setNewListName={setNewListName}
        colors={colors}
        theme={theme}
      />
    </View>
  );
}
