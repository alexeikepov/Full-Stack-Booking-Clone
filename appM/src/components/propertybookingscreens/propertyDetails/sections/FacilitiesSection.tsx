import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const FacilitiesSection = ({
  styles,
  property,
  resolveIcon,
  colors,
  facilitiesAnimationHeight,
  showExpandedFacilities,
  handleSeeAllFacilities,
}: any) => {
  // Extract amenities/facilities using the actual property structure
  let facilitiesList: string[] = [];
  if (property.details) {
    if (
      Array.isArray(property.details.amenities) &&
      property.details.amenities.length > 0
    ) {
      facilitiesList = property.details.amenities;
    } else if (
      Array.isArray(property.details.facilities) &&
      property.details.facilities.length > 0
    ) {
      facilitiesList = property.details.facilities;
    }
  }
  // If property.facilities is an array of objects with 'name', map to string[]
  if (
    facilitiesList.length === 0 &&
    Array.isArray(property.facilities) &&
    property.facilities.length > 0 &&
    property.facilities[0] &&
    typeof property.facilities[0] === "object" &&
    "name" in property.facilities[0]
  ) {
    facilitiesList = property.facilities
      .map((f: any) => f.name)
      .filter(Boolean);
  }
  if (
    facilitiesList.length === 0 &&
    Array.isArray(property.mostPopularFacilities) &&
    property.mostPopularFacilities.length > 0
  ) {
    facilitiesList = property.mostPopularFacilities;
  }
  if (
    facilitiesList.length === 0 &&
    property.facilities &&
    Array.isArray(property.facilities.general) &&
    property.facilities.general.length > 0
  ) {
    facilitiesList = property.facilities.general;
  }

  // Function to get appropriate icon for each facility
  const getFacilityIcon = (facility: string) => {
    const lower = facility.toLowerCase();
    if (lower.includes("wifi") || lower.includes("internet")) return "wifi";
    if (lower.includes("pool") || lower.includes("swimming")) return "pool";
    if (lower.includes("parking")) return "local-parking";
    if (
      lower.includes("gym") ||
      lower.includes("fitness") ||
      lower.includes("exercise")
    )
      return "fitness-center";
    if (lower.includes("spa") || lower.includes("wellness")) return "spa";
    if (
      lower.includes("restaurant") ||
      lower.includes("dining") ||
      lower.includes("breakfast")
    )
      return "restaurant";
    if (lower.includes("bar") || lower.includes("lounge")) return "local-bar";
    if (lower.includes("elevator") || lower.includes("lift")) return "elevator";
    if (lower.includes("air conditioning") || lower.includes("ac"))
      return "ac-unit";
    if (lower.includes("heating")) return "whatshot";
    if (lower.includes("tv") || lower.includes("television")) return "tv";
    if (lower.includes("kitchen") || lower.includes("cooking"))
      return "kitchen";
    if (lower.includes("laundry") || lower.includes("washing"))
      return "local-laundry-service";
    if (lower.includes("pet") || lower.includes("animal")) return "pets";
    if (lower.includes("smoking") || lower.includes("cigarette"))
      return "smoking-rooms";
    if (lower.includes("balcony") || lower.includes("terrace"))
      return "balcony";
    if (lower.includes("garden") || lower.includes("outdoor")) return "nature";
    if (lower.includes("beach") || lower.includes("sea")) return "beach-access";
    if (lower.includes("sauna")) return "hot-tub";
    if (lower.includes("jacuzzi") || lower.includes("hot tub"))
      return "hot-tub";
    if (lower.includes("conference") || lower.includes("meeting"))
      return "meeting-room";
    if (lower.includes("business") || lower.includes("work"))
      return "business-center";
    if (lower.includes("concierge")) return "room-service";
    if (lower.includes("room service")) return "room-service";
    if (lower.includes("24-hour")) return "schedule";
    if (lower.includes("security") || lower.includes("safe")) return "security";
    // Add more mappings as needed
    return "check-circle"; // Default icon
  };

  return (
    <View style={styles.facilitiesSection}>
      <Text style={styles.sectionTitle}>Most Popular Facilities</Text>
      <View style={styles.facilitiesGrid}>
        {facilitiesList.length === 0 ? (
          <Text style={styles.facilityText}>No facilities listed.</Text>
        ) : (
          facilitiesList.slice(0, 6).map((facility: string, index: number) => (
            <View key={index} style={styles.facilityItem}>
              <MaterialIcons
                name={getFacilityIcon(facility)}
                size={20}
                color={colors.text}
              />
              <Text style={styles.facilityText}>{facility}</Text>
            </View>
          ))
        )}
      </View>
      {facilitiesList.length > 6 && (
        <>
          <Animated.View
            style={{
              overflow: "hidden",
              maxHeight: facilitiesAnimationHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  0,
                  Math.ceil((facilitiesList.length - 6) / 2) * 50,
                ],
              }),
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              <View style={styles.facilitiesGrid}>
                {facilitiesList
                  .slice(6)
                  .map((facility: string, index: number) => (
                    <View key={index + 6} style={styles.facilityItem}>
                      <MaterialIcons
                        name={getFacilityIcon(facility)}
                        size={20}
                        color={colors.text}
                      />
                      <Text style={styles.facilityText}>{facility}</Text>
                    </View>
                  ))}
              </View>
            </ScrollView>
          </Animated.View>
          <TouchableOpacity
            onPress={handleSeeAllFacilities}
            style={{ marginLeft: 8, alignSelf: "flex-start" }}
          >
            <Text style={styles.seeAllFacilitiesText}>
              {showExpandedFacilities
                ? "Show less facilities"
                : "See all facilities"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default FacilitiesSection;
