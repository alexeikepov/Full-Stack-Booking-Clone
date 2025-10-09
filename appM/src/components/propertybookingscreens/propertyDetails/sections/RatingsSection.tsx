import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const RatingsSection = ({
  styles,
  property,
  showAllRatings,
  handleShowReviewsSummary,
  handleShowMoreRatings,
  colors,
}: any) => {
  // Get rating text based on rating value
  const getRatingText = (rating: number): string => {
    if (rating >= 9) return "Exceptional";
    if (rating >= 8) return "Very Good";
    if (rating >= 7) return "Good";
    if (rating >= 6) return "Pleasant";
    return "Fair";
  };

  // Safe access to rating data with fallbacks
  const rating = property?.rating || 0;
  const ratings = property?.ratings || {};

  return (
    <View style={styles.ratingSection}>
      <View style={styles.overallRating}>
        <View style={styles.ratingScore}>
          <Text style={styles.ratingScoreText}>
            {typeof rating === "number" ? rating.toFixed(1) : rating}
          </Text>
        </View>
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.ratingLabel}>
            {getRatingText(Number(rating))}
            {Number(rating) >= 9 ? " - A visitor says..." : ""}
          </Text>
          <Text style={styles.ratingDetails}>
            See all the rest of the detailed reviews
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
        {Object.entries(ratings)
          .slice(0, showAllRatings ? Object.keys(ratings).length : 3)
          .map(([category, rating]) => (
            <View key={category} style={styles.ratingRow}>
              <Text style={styles.ratingCategory}>
                {category.charAt(0).toUpperCase() +
                  category.slice(1).replace(/([A-Z])/g, " $1")}
              </Text>
              <View style={styles.ratingBar}>
                <View
                  style={[
                    styles.ratingBarFill,
                    { width: `${(Number(rating) / 10) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.ratingValue}>
                {Number(rating).toFixed(1)}
              </Text>
            </View>
          ))}
      </View>
      {Object.keys(ratings).length > 3 && (
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
};

export default RatingsSection;
