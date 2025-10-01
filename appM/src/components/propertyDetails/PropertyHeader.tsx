import React from "react";
import { Text, View } from "react-native";

interface PropertyHeaderProps {
  styles: any;
  property: any;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  styles,
  property,
}) => (
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
    <View style={styles.ratingRowHeader}>
      {[...Array(3)].map((_, index) => (
        <View key={index} style={styles.starBadge} />
      ))}
      <View style={styles.ratingScore}>
        <Text style={styles.ratingScoreText}>{property.rating}</Text>
      </View>
    </View>
  </View>
);

export default PropertyHeader;
