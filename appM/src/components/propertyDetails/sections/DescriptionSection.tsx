import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DescriptionSection = ({
  styles,
  property,
  descriptionAnimationHeight,
  showExpandedDescription,
  handleReadMore,
}: any) => (
  <View style={styles.descriptionSection}>
    <Text style={styles.sectionTitle}>Description</Text>
    <Text style={styles.descriptionText}>{property.shortDescription}</Text>
    <Animated.View
      style={{
        overflow: "hidden",
        maxHeight: descriptionAnimationHeight.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 400],
        }),
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <Text style={[styles.descriptionText, { marginTop: 16 }]}>
          {property.description.replace(property.shortDescription, "").trim()}
        </Text>
      </ScrollView>
    </Animated.View>
    <TouchableOpacity onPress={handleReadMore} style={styles.readMoreButton}>
      <Text style={styles.readMoreText}>
        {showExpandedDescription ? "Show less" : "Read more"}
      </Text>
    </TouchableOpacity>
    {property.deal && (
      <Text style={styles.priceLabel}>
        Deal: <Text style={styles.priceValue}>{property.deal}</Text>
      </Text>
    )}
    {property.oldPrice && (
      <Text style={styles.priceLabel}>
        Old Price: <Text style={styles.priceValue}>{property.oldPrice}</Text>
      </Text>
    )}
    {property.taxesIncluded !== undefined && (
      <Text style={styles.priceLabel}>
        Taxes Included:{" "}
        <Text style={styles.priceValue}>
          {property.taxesIncluded ? "Yes" : "No"}
        </Text>
      </Text>
    )}
    {property.distance && (
      <Text style={styles.priceLabel}>
        Distance: <Text style={styles.priceValue}>{property.distance}</Text>
      </Text>
    )}
  </View>
);

export default DescriptionSection;
