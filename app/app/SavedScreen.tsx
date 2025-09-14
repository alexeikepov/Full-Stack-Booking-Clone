import React, { useState } from "react";
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
import { Colors } from "../constants/Colors";

// Define the type for a single list item
type List = {
  id: string;
  title: string;
  subtitle: string;
};

const { width } = Dimensions.get("window");
// Local components to manage screen transitions without React Navigation
const StartYourListPageLocal = ({ onBack, onFindProperties }) => (
  <View style={localStyles.container}>
    <View style={localStyles.header}>
      <TouchableOpacity onPress={onBack} style={localStyles.backButton}>
        <Text style={localStyles.backText}>Back</Text>
      </TouchableOpacity>
      <Text style={localStyles.headerTitle}>My next trip</Text>
      <TouchableOpacity style={localStyles.shareButton}>
        <Text style={localStyles.shareText}>Share</Text>
      </TouchableOpacity>
    </View>
    <View style={localStyles.content}>
      <Image
        source={require("../assets/images/place-holder.jpg")}
        style={localStyles.illustration}
      />
      <Text style={localStyles.title}>Start your list</Text>
      <Text style={localStyles.subtitle}>
        When you find a property you like, tap the{"\n"}heart icon to save it.
      </Text>
      <TouchableOpacity
        style={localStyles.findPropertiesButton}
        onPress={onFindProperties}
      >
        <Text style={localStyles.buttonText}>Find properties</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const SearchScreenLocal = ({ onBack }: { onBack: () => void }) => (
  <View style={localStyles.container}>
    <View style={localStyles.header}>
      <TouchableOpacity onPress={onBack} style={localStyles.backButton}>
        <Text style={localStyles.backText}>Back</Text>
      </TouchableOpacity>
      <Text style={localStyles.headerTitle}>Search</Text>
      <View style={{ width: 60 }} />
    </View>
    <View style={localStyles.content}>
      <Text style={localStyles.title}>This is the Search Screen</Text>
    </View>
  </View>
);

export default function SavedScreen() {
  const [activeTab, setActiveTab] = useState("Lists");
  const [savedLists, setSavedLists] = useState<List[]>([
    { id: "1", title: "my trip", subtitle: "0 saved items" },
    { id: "2", title: "My next trip", subtitle: "0 saved items" },
  ]);
  const [createListModalVisible, setCreateListModalVisible] = useState(false);
  const [manageListModalVisible, setManageListModalVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [currentList, setCurrentList] = useState<List | null>(null);
  const [newListName, setNewListName] = useState("");
  const [currentPage, setCurrentPage] = useState("SavedScreen");

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
            source={require("../assets/images/plane.jpg")}
            style={styles.illustration}
          />
          <Text style={styles.titleText}>You have no saved price alerts</Text>
          <Text style={styles.subtitleText}>
            Get price alerts for select flights searches —{"\n"}only for Genius
            members
          </Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setCurrentPage("SearchScreen")}
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
              <Ionicons name="close" size={24} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={modalStyles.input}
            placeholder="List name"
            placeholderTextColor={Colors.dark.icon}
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
              if (currentList) {
                setNewListName(currentList.title);
              }
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
              <Ionicons name="close" size={24} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={modalStyles.input}
            placeholder="List name"
            placeholderTextColor={Colors.dark.icon}
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

  if (currentPage === "StartYourListPage") {
    return (
      <StartYourListPageLocal
        onBack={() => setCurrentPage("SavedScreen")}
        onFindProperties={() => setCurrentPage("SearchScreen")}
      />
    );
  }

  if (currentPage === "SearchScreen") {
    return (
      <SearchScreenLocal onBack={() => setCurrentPage("StartYourListPage")} />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerTitleRow}>
        <Text style={styles.savedTitle}>Saved</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={styles.plusIconContainer}
          onPress={() => setCreateListModalVisible(true)}
        >
          <Ionicons name="add-outline" size={24} color={Colors.dark.text} />
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
              activeTab === "Lists" ? Colors.dark.background : Colors.dark.text
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "Lists" && { color: Colors.dark.background },
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
              activeTab === "Alerts" ? Colors.dark.background : Colors.dark.text
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "Alerts" && { color: Colors.dark.background },
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  headerTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  savedTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  plusIconContainer: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.dark.background,
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
    borderWidth: 1,
    borderColor: Colors.dark.text,
  },
  activeTab: {
    backgroundColor: Colors.dark.text,
  },
  tabText: {
    color: Colors.dark.text,
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
    paddingHorizontal: 32,
  },
  illustration: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: "contain",
    marginBottom: 20,
  },
  titleText: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitleText: {
    color: Colors.dark.icon,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors.dark.background,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  bottomModalView: {
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.dark.text,
  },
  input: {
    width: "100%",
    backgroundColor: "#2e2e2e",
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  charCount: {
    alignSelf: "flex-end",
    color: Colors.dark.icon,
    fontSize: 12,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    width: "100%",
  },
  modalItemText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
  },
});

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  shareButton: {
    padding: 8,
  },
  shareText: {
    color: "#007AFF",
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  illustration: {
    width: 200,
    height: 150,
    resizeMode: "contain",
    marginBottom: 24,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.dark.icon,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  findPropertiesButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
