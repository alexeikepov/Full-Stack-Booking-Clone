import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { createStyles } from "../../screens/propertyList/PropertyListScreen.styles";
import { RootStackParamList } from "../../types/navigation";
import PropertyCard, { Property } from "../shared/PropertyCard";

interface PropertyListSectionProps {
  colors: any;
  filteredApartments: Property[];
  apartments: Property[];
  noMatches: boolean;
  handleShowAll: () => void;
  selectedDates: { checkIn: Date | null; checkOut: Date | null };
  selectedGuests: any;
  handleOutsidePress: () => void;
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
}) => {
  const styles = createStyles(colors);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView style={styles.listContainer} onTouchStart={handleOutsidePress}>
      <View>
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
        ).map((apt, index) => (
          <PropertyCard
            key={apt.id ? `${String(apt.id)}-${index}` : `apartment-${index}`}
            property={apt}
            onPress={() =>
              (navigation as any).navigate("PropertyDetailsScreen", {
                propertyData: {
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
                  distance: apt.distance,
                  details: apt.details,
                  dates: selectedDates,
                  guests: selectedGuests,
                },
              })
            }
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default PropertyListSection;
