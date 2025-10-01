import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const FacilitiesSection = ({
  styles,
  property,
  resolveIcon,
  colors,
  facilitiesAnimationHeight,
  showExpandedFacilities,
  handleSeeAllFacilities,
}: any) => (
  <View style={styles.facilitiesSection}>
    <Text style={styles.sectionTitle}>Most Popular Facilities</Text>
    <View style={styles.facilitiesGrid}>
      {property.facilities.slice(0, 6).map((facility: any, index: number) => {
        const resolved = resolveIcon(facility.icon);
        const IconComponent =
          resolved.family === "ion" ? Ionicons : MaterialIcons;
        return (
          <View key={index} style={styles.facilityItem}>
            <IconComponent
              name={resolved.name as any}
              size={20}
              color={colors.text}
            />
            <Text style={styles.facilityText}>{facility.name}</Text>
          </View>
        );
      })}
    </View>
    {property.facilities.length > 6 && (
      <Animated.View
        style={{
          overflow: "hidden",
          maxHeight: facilitiesAnimationHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [
              0,
              Math.ceil((property.facilities.length - 6) / 2) * 50,
            ],
          }),
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <View style={styles.facilitiesGrid}>
            {property.facilities
              .slice(6)
              .map((facility: any, index: number) => {
                const resolved = resolveIcon(facility.icon);
                const IconComponent =
                  resolved.family === "ion" ? Ionicons : MaterialIcons;
                return (
                  <View key={index + 6} style={styles.facilityItem}>
                    <IconComponent
                      name={resolved.name as any}
                      size={20}
                      color={colors.text}
                    />
                    <Text style={styles.facilityText}>{facility.name}</Text>
                  </View>
                );
              })}
          </View>
        </ScrollView>
      </Animated.View>
    )}
    {property.facilities.length > 6 && (
      <TouchableOpacity onPress={handleSeeAllFacilities}>
        <Text style={styles.seeAllFacilitiesText}>
          {showExpandedFacilities
            ? "Show less facilities"
            : "See all facilities"}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

export default FacilitiesSection;
