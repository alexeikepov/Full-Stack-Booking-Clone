import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../../../hooks/ThemeContext";

interface PropertyHeaderProps {
  styles: any;
  property: any;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  styles,
  property,
}) => {
  const { colors } = useTheme();
  // const getCalculatedRating = () => {
  //   const stars = property.stars || 3;
  //   if (stars >= 5) return "9.5";
  //   if (stars >= 4) return "8.5";
  //   if (stars >= 3) return "7.5";
  //   return "6.5";
  // };

  // const getRatingText = (rating: number) => {
  //   if (rating >= 9) return "Exceptional";
  //   if (rating >= 8.5) return "Very Good";
  //   if (rating >= 7.5) return "Good";
  //   if (rating >= 6.5) return "Pleasant";
  //   return "Fair";
  // };

  // const renderStars = () => {
  //   const starCount =
  //     property.stars ||
  //     (() => {
  //       const rating = parseFloat(getCalculatedRating());

  //       // For ratings 8.5+ show 4-5 stars, for 7-8.4 show 3-4 stars, etc.
  //       return rating >= 9 ? 5 : rating >= 8.5 ? 4 : rating >= 7 ? 3 : 2;
  //     })();

  //   return (
  //     <View style={{ flexDirection: "row", marginBottom: 4 }}>
  //       {[...Array(5)].map((_, index) => (
  //         <AntDesign
  //           key={index}
  //           name="star"
  //           size={14}
  //           color={index < starCount ? "#FFD700" : colors.gray}
  //         />
  //       ))}
  //     </View>
  //   );
  // };

  return (
    <View style={styles.propertyHeader}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.propertyName}>{property.name}</Text>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <View
          style={{
            backgroundColor: colors.blue,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            marginRight: 8,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            certified genius
          </Text>
        </View>
        <Text style={{ color: "white", fontSize: 14 }}>
          • {property.reviewCount || "1698"} reviews
        </Text>
      </View>
    </View>
  );
};

export default PropertyHeader;
