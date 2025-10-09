import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { createStyles } from "../../../../screens/propertyBookingScreens/propertyList/PropertyListScreen.styles";
import { RootStackParamList } from "../../../../types/navigation";
import { PropertyCard, Property } from "../../../../components/shared";

interface PropertyListSectionProps {
  colors: any;
  filteredApartments: Property[];
  apartments: Property[];
  noMatches: boolean;
  handleShowAll: () => void;
  selectedDates: { checkIn: Date | null; checkOut: Date | null };
  selectedGuests: any;
  handleOutsidePress: () => void;
  isLoading: boolean;
}

const PropertyListSection: React.FC<PropertyListSectionProps> = ({
  colors,
  filteredApartments,
  apartments,
  noMatches,
  handleShowAll,
  selectedDates,
  selectedGuests,
  handleOutsidePress,
  isLoading,
}) => {
  const styles = createStyles(colors);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView style={styles.listContainer} onTouchStart={handleOutsidePress}>
      <View>
        {isLoading && filteredApartments.length === 0 && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 50,
            }}
          >
            <ActivityIndicator size="large" color={colors.tint} />
          </View>
        )}

        {noMatches && (
          <View style={styles.noMatchBanner}>
            <View style={styles.noMatchLeft}>
              <AntDesign name="warning" size={28} color={"red"} />
            </View>
            <View style={styles.noMatchBody}>
              <Text style={styles.noMatchTitle} numberOfLines={2}>
                Sorry, we couldn&apos;t find a hotel in that location.
              </Text>
              <Text style={styles.noMatchSubtitle} numberOfLines={2}>
                Here are some other great properties you might like.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.noMatchAction}
              onPress={handleShowAll}
            >
              <Text style={styles.noMatchActionText}>Show all</Text>
            </TouchableOpacity>
          </View>
        )}

        {(filteredApartments && filteredApartments.length > 0
          ? filteredApartments
          : apartments
        )
          .slice(1)
          .map((apt, index) => (
            <PropertyCard
              key={apt.id ? `${String(apt.id)}-${index}` : `apartment-${index}`}
              property={{
                ...apt,
                guestReviews: apt.guestReviews,
                propertyHighlights: apt.propertyHighlights,
                mostPopularFacilities: apt.mostPopularFacilities,
                categories: apt.categories,
                surroundings: apt.surroundings,
                overview: apt.overview,
                houseRules: apt.houseRules,
              }}
              onPress={() => {
                (navigation as any).navigate("PropertyDetailsScreen", {
                  propertyData: {
                    id: apt.id,
                    propertyName: apt.title,
                    title: apt.title,
                    rating: apt.rating,
                    reviewCount: apt.reviewCount,
                    price: apt.price,
                    pricePerNight: apt.price,
                    location: apt.location,
                    description: apt.description,
                    imageSource: apt.imageSource,
                    deal: apt.deal,
                    oldPrice: apt.oldPrice,
                    taxesIncluded: apt.taxesIncluded,
                    // Pass through server image data
                    media: apt.media || [],
                    rooms: apt.rooms || [],
                    distance: apt.distance,
                    details: apt.details,
                    coordinates: apt.coordinates,
                    dates: {
                      checkIn: selectedDates.checkIn
                        ? selectedDates.checkIn.toISOString()
                        : null,
                      checkOut: selectedDates.checkOut
                        ? selectedDates.checkOut.toISOString()
                        : null,
                    },
                    guests: selectedGuests,
                    guestReviews: apt.guestReviews,
                    propertyHighlights: apt.propertyHighlights,
                    mostPopularFacilities: apt.mostPopularFacilities,
                    categories: apt.categories,
                    houseRules: apt.houseRules,
                    overview: apt.overview,
                    surroundings: apt.surroundings,
                  },
                });
              }}
            />
          ))}
      </View>
    </ScrollView>
  );
};

export default PropertyListSection;
