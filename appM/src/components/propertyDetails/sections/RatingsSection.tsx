import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const RatingsSection = ({
  styles,
  property,
  showAllRatings,
  handleShowReviewsSummary,
  handleShowMoreRatings,
  colors,
}: any) => (
  <View style={styles.ratingSection}>
    <View style={styles.overallRating}>
      <View style={styles.ratingScore}>
        <Text style={styles.ratingScoreText}>{property.rating}</Text>
      </View>
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.ratingLabel}>Good</Text>
        <Text style={styles.ratingDetails}>
          See {property.totalReviews.toLocaleString()} detailed reviews
        </Text>
      </View>
      <TouchableOpacity
        style={{ marginLeft: "auto" }}
        onPress={handleShowReviewsSummary}
      >
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
    <View style={styles.ratingBreakdown}>
      {Object.entries(property.ratings)
        .slice(0, showAllRatings ? Object.keys(property.ratings).length : 3)
        .map(([category, rating]) => (
          <View key={category} style={styles.ratingRow}>
            <Text style={styles.ratingCategory}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
            <View style={styles.ratingBar}>
              <View
                style={[
                  styles.ratingBarFill,
                  { width: `${(Number(rating) / 10) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.ratingValue}>{Number(rating)}</Text>
          </View>
        ))}
    </View>
    {Object.keys(property.ratings).length > 3 && (
      <TouchableOpacity
        onPress={handleShowMoreRatings}
        style={styles.showMoreButton}
      >
        <Text style={styles.showMoreText}>
          {showAllRatings ? "Show less" : "Show more"}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

export default RatingsSection;
