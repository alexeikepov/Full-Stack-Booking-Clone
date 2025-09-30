import { AntDesign, Fontisto, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors"; // optional: use consistent colors

type ModalType =
  | "location"
  | "dates"
  | "guests"
  | "sort"
  | "filter"
  | "map"
  | null;

// Modal props
type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

// Location Modal
const LocationModal = ({ isVisible, onClose }: ModalProps) => {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: "#000" }]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <AntDesign name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <TextInput
          style={styles.modalSearchInput}
          placeholder="Search destinations"
          placeholderTextColor="#999"
        />
        <ScrollView>
          <Text style={styles.modalTitle}>Popular destinations</Text>
          <Text style={styles.modalItem}>Rome, Italy</Text>
          <Text style={styles.modalItem}>Paris, France</Text>
          <Text style={styles.modalItem}>London, UK</Text>
        </ScrollView>
      </View>
    </Modal>
  );
};

// Dates Modal
const DatesModal = ({ isVisible, onClose }: ModalProps) => {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: "#000" }]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <AntDesign name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.datesHeader}>
          <Text style={styles.datesHeaderText}>Select dates</Text>
        </View>
        <ScrollView
          style={{ paddingHorizontal: 15 }}
          keyboardShouldPersistTaps="handled"
        >
          {["September 2025", "October 2025"].map((month, i) => (
            <View key={i}>
              <Text style={styles.monthHeader}>{month}</Text>
              <View style={styles.calendarGrid}>
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <Text key={day} style={styles.calendarDayHeader}>
                    {day}
                  </Text>
                ))}
                {[...Array(month === "September 2025" ? 30 : 31).keys()].map(
                  (day) => (
                    <TouchableOpacity key={day} style={styles.calendarDay}>
                      <Text style={styles.calendarDayText}>{day + 1}</Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity onPress={onClose} style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Select dates</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

// Guests Modal
const GuestsModal = ({ isVisible, onClose }: ModalProps) => {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: "#000" }]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <AntDesign name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.modalHeaderTitle}>Select rooms and guests</Text>

        {[
          { label: "Rooms", value: 1 },
          { label: "Adults", value: 4 },
          { label: "Children", value: 0 },
        ].map((item) => (
          <View key={item.label} style={styles.guestRow}>
            <Text style={styles.guestLabel}>{item.label}</Text>
            <View style={styles.stepper}>
              <TouchableOpacity style={styles.stepperButton}>
                <AntDesign name="minus" size={18} color="white" />
              </TouchableOpacity>
              <Text style={styles.stepperText}>{item.value}</Text>
              <TouchableOpacity style={styles.stepperButton}>
                <AntDesign name="plus" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <TouchableOpacity onPress={onClose} style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

// Map Modal
const MapModal = ({ isVisible, onClose }: ModalProps) => {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity onPress={onClose} style={styles.mapCloseButton}>
          <AntDesign name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.mapContainer}>
          <Image
            source={{ uri: "https://i.ibb.co/L5Vb40p/map.jpg" }}
            style={styles.mapImage}
          />
          <View style={styles.mapHeader}>
            <Text style={styles.mapHeaderText}>Rome 18 Sep - 22 Sep</Text>
          </View>
          <View style={styles.mapActions}>
            <TouchableOpacity style={styles.mapActionButton}>
              <Fontisto name="filter" size={16} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapActionButton}>
              <AntDesign name="compass" size={18} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Filter Modal
const FilterModal = ({ isVisible, onClose }: ModalProps) => {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: "#fff" }]}>
        <View style={styles.filterHeader}>
          <TouchableOpacity onPress={onClose} style={styles.filterCloseButton}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.filterTitle}>Filter by</Text>
          <TouchableOpacity>
            <Text style={styles.filterReset}>Reset</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{ paddingHorizontal: 15 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionHeader}>Your budget (for 4 nights)</Text>
          <Text style={styles.budgetValue}>€ 200 - € 3,000 +</Text>
          <View style={styles.priceGraphContainer}>
            <Image
              source={{ uri: "https://i.ibb.co/3s8xL8Q/graph.jpg" }}
              style={styles.priceGraph}
            />
          </View>
          <Text style={styles.sectionHeader}>Popular Filters</Text>
          {[
            "Hotels (275)",
            "Very Good: 8+ (731)",
            "Free cancellation (295)",
            "Breakfast included (284)",
            "Rome City Center (479)",
            "Apartments (575)",
            "All-inclusive (1)",
          ].map((filter) => (
            <View key={filter} style={styles.filterItem}>
              <Text style={styles.filterItemText}>{filter}</Text>
              <View style={styles.checkbox} />
            </View>
          ))}
        </ScrollView>
        <View style={styles.filterFooter}>
          <Text style={styles.matchCount}>1,136 matching properties</Text>
          <Text style={styles.subMatchCount}>+ 325 properties around Rome</Text>
          <TouchableOpacity onPress={onClose} style={styles.showResultsButton}>
            <Text style={styles.showResultsText}>Show results</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Sort Modal
const SortModal = ({ isVisible, onClose }: ModalProps) => {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: "#fff" }]}>
        <View style={styles.sortHeader}>
          <TouchableOpacity onPress={onClose}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.sortTitle}>Sort by</Text>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled">
          {[
            "Entire homes & apartments first",
            "Top Picks for Groups",
            "Distance From Downtown",
            "Property rating (5 to 0)",
            "Property rating (0 to 5)",
            "Genius",
            "Best reviewed first",
            "Price (lowest first)",
            "Price (highest first)",
            "Saved properties first",
          ].map((item, i) => (
            <View key={i} style={styles.sortItem}>
              <Text style={styles.sortItemText}>{item}</Text>
              <View
                style={[styles.radio, i === 1 ? styles.radioSelected : {}]}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

// Apartment Card
type ApartmentCardProps = {
  title: string;
  rating: number;
  description: string;
  price: number;
  imageSource: string | ImageSourcePropType;
};

const ApartmentCard = ({
  title,
  rating,
  description,
  price,
  imageSource,
}: ApartmentCardProps) => (
  <View style={styles.cardContainer}>
    <Image
      source={
        typeof imageSource === "string" ? { uri: imageSource } : imageSource
      }
      style={styles.cardImage}
    />
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.cardRating}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.cardRatingText}>{rating.toFixed(1)}</Text>
        </View>
      </View>
      <Text style={styles.cardDescription}>{description}</Text>
      <Text style={styles.cardPrice}>€ {price} / night</Text>
    </View>
  </View>
);

// Main Apartment List Component
export default function AppartmentList() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = (type: ModalType) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  const sampleApartments: ApartmentCardProps[] = [
    {
      title: "Cozy Apartment in Rome",
      rating: 4.7,
      description: "2 guests · 1 bedroom · 1 bed · 1 bath",
      price: 120,
      imageSource: "https://i.ibb.co/Ydy0z5c/room1.jpg",
    },
    {
      title: "Modern Flat in City Center",
      rating: 4.9,
      description: "4 guests · 2 bedrooms · 2 beds · 1 bath",
      price: 180,
      imageSource: "https://i.ibb.co/tL3GdZG/room2.jpg",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.filterBar}>
          {["location", "dates", "guests", "sort", "filter", "map"].map(
            (type) => (
              <TouchableOpacity
                key={type}
                style={styles.filterButton}
                onPress={() => openModal(type as ModalType)}
              >
                <Text style={styles.filterButtonText}>
                  {type.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>

        {sampleApartments.map((apt, index) => (
          <ApartmentCard key={index} {...apt} />
        ))}
      </ScrollView>

      {/* Modals */}
      <LocationModal
        isVisible={activeModal === "location"}
        onClose={closeModal}
      />
      <DatesModal isVisible={activeModal === "dates"} onClose={closeModal} />
      <GuestsModal isVisible={activeModal === "guests"} onClose={closeModal} />
      <SortModal isVisible={activeModal === "sort"} onClose={closeModal} />
      <FilterModal isVisible={activeModal === "filter"} onClose={closeModal} />
      <MapModal isVisible={activeModal === "map"} onClose={closeModal} />
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  filterButton: { padding: 8, backgroundColor: "#eee", borderRadius: 5 },
  filterButtonText: { fontWeight: "bold", fontSize: 12 },
  modalContainer: { flex: 1, paddingTop: 50 },
  closeButton: { position: "absolute", top: 50, left: 15, zIndex: 10 },
  modalSearchInput: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    margin: 15,
    borderRadius: 8,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 15,
  },
  modalItem: { color: "#fff", fontSize: 16, padding: 10, marginHorizontal: 15 },
  datesHeader: { padding: 15 },
  datesHeaderText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  monthHeader: { color: "#fff", fontSize: 16, marginTop: 15 },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap" },
  calendarDayHeader: {
    width: `${100 / 7}%`,
    color: "#999",
    textAlign: "center",
  },
  calendarDay: { width: `${100 / 7}%`, padding: 10, alignItems: "center" },
  calendarDayText: { color: "#fff" },
  applyButton: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: { color: "#fff", fontWeight: "bold" },
  modalHeaderTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    margin: 15,
  },
  guestRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 15,
  },
  guestLabel: { color: "#fff", fontSize: 16 },
  stepper: { flexDirection: "row", alignItems: "center" },
  stepperButton: { padding: 5 },
  stepperText: { color: "#fff", fontSize: 16, marginHorizontal: 10 },
  cardContainer: {
    margin: 15,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
  },
  cardImage: { width: "100%", height: 200 },
  cardContent: { padding: 10 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardRating: { flexDirection: "row", alignItems: "center" },
  cardRatingText: { marginLeft: 4 },
  cardDescription: { color: "#555", marginVertical: 5 },
  cardPrice: { fontWeight: "bold", fontSize: 16 },
  mapContainer: { flex: 1 },
  mapImage: { width: "100%", height: "100%" },
  mapHeader: { position: "absolute", top: 50, left: 15 },
  mapHeaderText: { color: "#fff", fontWeight: "bold" },
  mapActions: {
    position: "absolute",
    top: 50,
    right: 15,
    flexDirection: "row",
  },
  mapActionButton: { marginLeft: 15 },
  mapCloseButton: { position: "absolute", top: 50, left: 15 },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
  },
  filterCloseButton: {},
  filterTitle: { fontWeight: "bold", fontSize: 18 },
  filterReset: { color: Colors.light.tint },
  sectionHeader: { fontWeight: "bold", marginVertical: 10 },
  budgetValue: { fontSize: 16 },
  priceGraphContainer: { marginVertical: 10 },
  priceGraph: { width: "100%", height: 100, resizeMode: "cover" },
  filterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  filterItemText: { fontSize: 14 },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 3,
  },
  filterFooter: { padding: 15 },
  matchCount: { fontWeight: "bold", fontSize: 16 },
  subMatchCount: { color: "#555", marginVertical: 5 },
  showResultsButton: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  showResultsText: { color: "#fff", fontWeight: "bold" },
  sortHeader: { flexDirection: "row", alignItems: "center", padding: 15 },
  sortTitle: { fontWeight: "bold", fontSize: 18, marginLeft: 15 },
  sortItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
  },
  sortItemText: { fontSize: 14 },
  radio: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
  },
  radioSelected: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
});
