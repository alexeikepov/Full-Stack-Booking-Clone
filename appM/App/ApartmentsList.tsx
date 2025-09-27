import { AntDesign, Fontisto, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Define ModalType for modal switching
type ModalType =
  | "location"
  | "dates"
  | "guests"
  | "sort"
  | "filter"
  | "map"
  | null;

// Placeholder components for modals
type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const LocationModal = ({ isVisible, onClose }: ModalProps) => {
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
          {/* Add more placeholder locations */}
        </ScrollView>
      </View>
    </Modal>
  );
};

const DatesModal = ({ isVisible, onClose }: ModalProps) => {
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
          <AntDesign name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.datesHeader}>
          <Text style={styles.datesHeaderText}>Select dates</Text>
        </View>
        <ScrollView style={{ paddingHorizontal: 15 }}>
          <Text style={styles.monthHeader}>September 2025</Text>
          <View style={styles.calendarGrid}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <Text key={day} style={styles.calendarDayHeader}>
                {day}
              </Text>
            ))}
            {[...Array(30).keys()].map((day) => (
              <TouchableOpacity key={day} style={styles.calendarDay}>
                <Text style={styles.calendarDayText}>{day + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.monthHeader}>October 2025</Text>
          <View style={styles.calendarGrid}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <Text key={day} style={styles.calendarDayHeader}>
                {day}
              </Text>
            ))}
            {[...Array(31).keys()].map((day) => (
              <TouchableOpacity key={day} style={styles.calendarDay}>
                <Text style={styles.calendarDayText}>{day + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity onPress={onClose} style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Select dates</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const GuestsModal = ({ isVisible, onClose }: ModalProps) => {
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
          <AntDesign name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.modalHeaderTitle}>Select rooms and guests</Text>

        <View style={styles.guestRow}>
          <Text style={styles.guestLabel}>Rooms</Text>
          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepperButton}>
              <AntDesign name="minus" size={18} color="white" />
            </TouchableOpacity>
            <Text style={styles.stepperText}>1</Text>
            <TouchableOpacity style={styles.stepperButton}>
              <AntDesign name="plus" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.guestRow}>
          <Text style={styles.guestLabel}>Adults</Text>
          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepperButton}>
              <AntDesign name="minus" size={18} color="white" />
            </TouchableOpacity>
            <Text style={styles.stepperText}>4</Text>
            <TouchableOpacity style={styles.stepperButton}>
              <AntDesign name="plus" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.guestRow}>
          <Text style={styles.guestLabel}>Children</Text>
          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepperButton}>
              <AntDesign name="minus" size={18} color="white" />
            </TouchableOpacity>
            <Text style={styles.stepperText}>0</Text>
            <TouchableOpacity style={styles.stepperButton}>
              <AntDesign name="plus" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const MapModal = ({ isVisible, onClose }: ModalProps) => {
  if (!isVisible) return null;
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer} pointerEvents="box-none">
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

const FilterModal = ({ isVisible, onClose }: ModalProps) => {
  if (!isVisible) return null;
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer} pointerEvents="box-none">
        <View style={styles.filterHeader}>
          <TouchableOpacity onPress={onClose} style={styles.filterCloseButton}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.filterTitle}>Filter by</Text>
          <TouchableOpacity>
            <Text style={styles.filterReset}>Reset</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ paddingHorizontal: 15 }}>
          <Text style={styles.sectionHeader}>Your budget (for 4 nights)</Text>
          <Text style={styles.budgetValue}>€ 200 - € 3,000 +</Text>
          <View style={styles.priceGraphContainer}>
            <Image
              source={{ uri: "https://i.ibb.co/3s8xL8Q/graph.jpg" }}
              style={styles.priceGraph}
            />
          </View>
          <Text style={styles.sectionHeader}>Popular Filters</Text>
          <View style={styles.filterItem}>
            <Text style={styles.filterItemText}>Hotels (275)</Text>
            <View style={styles.checkbox} />
          </View>
          <View style={styles.filterItem}>
            <Text style={styles.filterItemText}>Very Good: 8+ (731)</Text>
            <View style={styles.checkbox} />
          </View>
          <View style={styles.filterItem}>
            <Text style={styles.filterItemText}>Free cancellation (295)</Text>
            <View style={styles.checkbox} />
          </View>
          <View style={styles.filterItem}>
            <Text style={styles.filterItemText}>Breakfast included (284)</Text>
            <View style={styles.checkbox} />
          </View>
          <View style={styles.filterItem}>
            <Text style={styles.filterItemText}>Rome City Center (479)</Text>
            <View style={styles.checkbox} />
          </View>
          <View style={styles.filterItem}>
            <Text style={styles.filterItemText}>Apartments (575)</Text>
            <View style={styles.checkbox} />
          </View>
          <View style={styles.filterItem}>
            <Text style={styles.filterItemText}>All-inclusive (1)</Text>
            <View style={styles.checkbox} />
          </View>
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

const SortModal = ({ isVisible, onClose }: ModalProps) => {
  if (!isVisible) return null;
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer} pointerEvents="box-none">
        <View style={styles.sortHeader}>
          <TouchableOpacity onPress={onClose}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.sortTitle}>Sort by</Text>
        </View>
        <ScrollView>
          <View style={styles.sortItem}>
            <Text style={styles.sortItemText}>
              Entire homes & apartments first
            </Text>
            <View style={styles.radio} />
          </View>
          <View style={styles.sortItem}>
            <Text style={styles.sortItemText}>Top Picks for Groups</Text>
            <View style={[styles.radio, styles.radioSelected]} />
          </View>
          <View style={styles.sortItem}>
            <Text style={styles.sortItemText}>Distance From Downtown</Text>
            <View style={styles.radio} />
          </View>
          <View style={styles.sortItem}>
            <Text style={styles.sortItemText}>Property rating (5 to 0)</Text>
            <View style={styles.radio} />
          </View>
          <View style={styles.sortItem}>
            <Text style={styles.sortItemText}>Property rating (0 to 5)</Text>
            <View style={styles.radio} />
          </View>
          <View style={styles.sortItem}>
            <Text style={styles.sortItemText}>Genius</Text>
            <View style={styles.radio} />
          </View>
          <View style={styles.sortItem}>
            <Text style={styles.sortItemText}>Best reviewed first</Text>
            <View style={styles.radio} />
          </View>
          <View style={styles.sortItem}>
            <Text style={styles.sortItemText}>Price (lowest first)</Text>
            <View style={styles.radio} />
          </View>
          <View style={styles.sortItem}>
            <Text style={styles.sortItemText}>Price (highest first)</Text>
            <View style={styles.radio} />
          </View>
          <View style={styles.sortItem}>
            <Text style={styles.sortItemText}>Saved properties first</Text>
            <View style={styles.radio} />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

type ApartmentCardProps = {
  title: string;
  rating: number;
  description: string;
  price: number;
  imageSource: any;
};

const ApartmentCard = ({
  title,
  rating,
  description,
  price,
  imageSource,
}: ApartmentCardProps) => (
  <View style={styles.cardContainer}>
    <Image source={{ uri: imageSource }} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <AntDesign name="heart" size={24} color="#555" />
      </View>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{rating}</Text>
        <Text style={styles.ratingLabel}>Exceptional</Text>
        <Text style={styles.reviews}>• 68 reviews</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.price}>
        <Text style={styles.oldPrice}>€3,042</Text> €{price}
      </Text>
    </View>
  </View>
);

export default function AppartmentList() {
  const [modalType, setModalType] = useState<ModalType>(null);

  const apartments = [
    {
      title: "Fidia Palace Marco",
      rating: "9.6",
      description: "Entire apartment - 130 m²",
      price: "2,190",
      imageSource: "https://i.ibb.co/y52cT3P/apartment1.jpg",
    },
    {
      title: "Hotel Pantheon",
      rating: "8.3",
      description: "Hotel room: 3 beds",
      price: "1,785",
      imageSource: "https://i.ibb.co/b3yJ0fF/hotel1.jpg",
    },
    {
      title: "Aurelio’s apartment Colosseo",
      rating: "9.1",
      description: "Entire apartment - 80 m²",
      price: "1,500",
      imageSource: "https://i.ibb.co/y6k9k0G/apartment2.jpg",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Search Bar */}
      <View style={styles.searchBar}>
        <TouchableOpacity
          onPress={() => setModalType("location" as ModalType)}
          style={styles.searchInput}
        >
          <AntDesign
            name="search"
            size={18}
            color="#999"
            style={styles.searchIcon}
          />
          <Text style={styles.searchInputText}>Rome</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalType("dates" as ModalType)}
          style={styles.searchInput}
        >
          <Fontisto
            name="calendar"
            size={18}
            color="#999"
            style={styles.searchIcon}
          />
          <Text style={styles.searchInputText}>Thu, 18 Sep - Mon, 22 Sep</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalType("guests" as ModalType)}
          style={styles.searchInput}
        >
          <Ionicons
            name="person-outline"
            size={18}
            color="#999"
            style={styles.searchIcon}
          />
          <Text style={styles.searchInputText}>
            1 room • 4 adults • No children
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => setModalType("sort" as ModalType)}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>Sort</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalType("filter" as ModalType)}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalType("map" as ModalType)}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>Map</Text>
        </TouchableOpacity>
      </View>

      {/* Apartments List */}
      <ScrollView style={styles.listContainer}>
        {apartments.map((apt, index) => (
          <ApartmentCard
            key={index}
            title={apt.title}
            rating={Number(apt.rating)}
            description={apt.description}
            price={Number(apt.price)}
            imageSource={apt.imageSource}
          />
        ))}
      </ScrollView>

      {/* Modals */}
      <LocationModal
        isVisible={modalType === "location"}
        onClose={() => setModalType(null)}
      />
      <DatesModal
        isVisible={modalType === "dates"}
        onClose={() => setModalType(null)}
      />
      <GuestsModal
        isVisible={modalType === "guests"}
        onClose={() => setModalType(null)}
      />
      <SortModal
        isVisible={modalType === "sort"}
        onClose={() => setModalType(null)}
      />
      <FilterModal
        isVisible={modalType === "filter"}
        onClose={() => setModalType(null)}
      />
      <MapModal
        isVisible={modalType === "map"}
        onClose={() => setModalType(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchBar: {
    backgroundColor: "#2c2c2e",
    padding: 15,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInputText: {
    color: "#fff",
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  actionText: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#f2f2f7",
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 15,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#003580",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 5,
  },
  ratingLabel: {
    fontSize: 14,
    color: "#003580",
    fontWeight: "bold",
    marginRight: 5,
  },
  reviews: {
    fontSize: 12,
    color: "#555",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d9534f",
    marginTop: 10,
  },
  oldPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    color: "#999",
    marginRight: 5,
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    zIndex: 10,
    paddingTop: 50,
  },
  closeButton: {
    padding: 15,
  },
  modalSearchInput: {
    backgroundColor: "#2c2c2e",
    borderRadius: 8,
    padding: 15,
    margin: 15,
    color: "#fff",
    fontSize: 16,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginTop: 10,
  },
  modalItem: {
    color: "#fff",
    fontSize: 16,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  datesHeader: {
    alignItems: "center",
    paddingVertical: 15,
  },
  datesHeaderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  monthHeader: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  calendarDayHeader: {
    width: "14%",
    textAlign: "center",
    color: "#999",
    marginBottom: 10,
  },
  calendarDay: {
    width: "14%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  calendarDayText: {
    color: "#fff",
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    margin: 15,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalHeaderTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    padding: 15,
  },
  guestRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  guestLabel: {
    color: "#fff",
    fontSize: 18,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepperButton: {
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 50,
  },
  stepperText: {
    color: "#fff",
    fontSize: 18,
    marginHorizontal: 20,
  },
  mapCloseButton: {
    position: "absolute",
    top: 50,
    left: 15,
    zIndex: 20,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 5,
  },
  mapContainer: {
    flex: 1,
  },
  mapImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  mapHeader: {
    position: "absolute",
    top: 50,
    left: 60,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  mapHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  mapActions: {
    position: "absolute",
    bottom: 50,
    right: 15,
    flexDirection: "column",
    alignItems: "center",
  },
  mapActionButton: {
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 12,
    marginVertical: 5,
    elevation: 5,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  filterCloseButton: {
    padding: 5,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  filterReset: {
    fontSize: 16,
    color: "#007bff",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
  },
  budgetValue: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  priceGraphContainer: {
    height: 80,
    marginBottom: 20,
  },
  priceGraph: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  filterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  filterItemText: {
    color: "#fff",
    fontSize: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#999",
  },
  filterFooter: {
    backgroundColor: "#fff",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  matchCount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subMatchCount: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  showResultsButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  showResultsText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sortHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  sortTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },
  sortItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  sortItemText: {
    fontSize: 16,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  radioSelected: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
});
