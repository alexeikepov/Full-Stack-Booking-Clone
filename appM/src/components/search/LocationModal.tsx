import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ThemeColors = {
  text: string;
  textSecondary: string;
  background: string;
  card: string;
  button: string;
  accent?: string;
  tint?: string;
  icon?: string;
  tabIconDefault?: string;
  tabIconSelected?: string;
  inputBackground?: string;
  gray?: string;
  blue?: string;
  [key: string]: string | undefined;
};

type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
  colors: ThemeColors;
  selectedLocation?: string;
  setSelectedLocation?: (location: string) => void;
};

const LocationModal = ({
  isVisible,
  onClose,
  colors,
  selectedLocation = "Enter your destination",
  setSelectedLocation,
}: ModalProps) => {
  const [searchText, setSearchText] = useState("");

  const styles = StyleSheet.create({
    modalContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.background,
      zIndex: 10,
      paddingTop: 50,
    },
    closeButton: {
      padding: 15,
      color: colors.text,
    },
    modalSearchInput: {
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      padding: 15,
      margin: 15,
      color: colors.text,
      fontSize: 16,
      borderWidth: 2,
      borderColor: "#FFD700",
    },
    modalTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
      marginHorizontal: 15,
      marginTop: 10,
    },
    modalItem: {
      color: colors.text,
      fontSize: 16,
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    modalItemContainer: {
      backgroundColor: colors.card,
    },
    noResults: {
      color: colors.textSecondary,
      fontSize: 16,
      padding: 20,
      textAlign: "center",
      fontStyle: "italic",
    },
    secondaryText: {
      color: colors.textSecondary,
    },
    searchInputText: {
      color: colors.text,
      fontSize: 16,
    },
  });

  const destinations = [
    "Rome, Italy",
    "Paris, France",
    "London, UK",
    "Barcelona, Spain",
    "Amsterdam, Netherlands",
    "Berlin, Germany",
    "Vienna, Austria",
    "Prague, Czech Republic",
    "Budapest, Hungary",
    "Venice, Italy",
    "Florence, Italy",
    "Milan, Italy",
    "Madrid, Spain",
    "Lisbon, Portugal",
    "Athens, Greece",
    "Santorini, Greece",
    "Istanbul, Turkey",
    "Dubai, UAE",
    "Bangkok, Thailand",
    "Tokyo, Japan",
    "Kyoto, Japan",
    "Seoul, South Korea",
    "Singapore",
    "Hong Kong",
    "Bali, Indonesia",
    "Sydney, Australia",
    "Melbourne, Australia",
    "Auckland, New Zealand",
    "Mumbai, India",
    "New Delhi, India",
    "Goa, India",
    "Cairo, Egypt",
    "Marrakech, Morocco",
    "Cape Town, South Africa",
    "New York, USA",
    "Los Angeles, USA",
    "San Francisco, USA",
    "Las Vegas, USA",
    "Miami, USA",
    "Chicago, USA",
    "Toronto, Canada",
    "Vancouver, Canada",
    "Montreal, Canada",
    "Mexico City, Mexico",
    "Cancun, Mexico",
    "Rio de Janeiro, Brazil",
    "São Paulo, Brazil",
    "Buenos Aires, Argentina",
    "Lima, Peru",
    "Bogotá, Colombia",
  ];

  const filteredDestinations = destinations.filter((destination) =>
    destination.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleDestinationPress = (destination: string) => {
    if (setSelectedLocation) {
      setSelectedLocation(destination);
    }
    onClose();
  };

  if (!isVisible) return null;
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer} pointerEvents="box-none">
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <AntDesign
            name="arrow-left"
            size={24}
            color={styles.secondaryText.color}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.modalSearchInput}
          placeholder="Enter destinations"
          placeholderTextColor={styles.searchInputText.color}
          value={searchText}
          onChangeText={setSearchText}
          autoFocus={true}
        />
        <ScrollView>
          <Text style={styles.modalTitle}>
            {searchText ? "Search results" : "Popular destinations"}
          </Text>
          {filteredDestinations.map((destination, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleDestinationPress(destination)}
              style={styles.modalItemContainer}
            >
              <Text style={styles.modalItem}>{destination}</Text>
            </TouchableOpacity>
          ))}
          {filteredDestinations.length === 0 && (
            <Text style={styles.noResults}>No destinations found</Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default LocationModal;
