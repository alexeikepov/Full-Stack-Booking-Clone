import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ReviewsSection = ({
  styles,
  property,
  reviewsAnimationHeight,
  showExpandedReviews,
  handleShowAllReviews,
}: any) => (
  <View style={styles.reviewsSection}>
    <Text style={styles.sectionTitle}>Guests who stayed here loved</Text>
    {property.reviews.slice(0, 2).map((review: any) => (
      <View key={review.id} style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewerInitial}>
            <Text style={styles.reviewerInitialText}>
              {review.reviewerInitial}
            </Text>
          </View>
          <View>
            <Text style={styles.reviewerName}>{review.reviewerName}</Text>
            <Text style={styles.reviewerCountry}>
              {review.country === "Australia" && "🇦🇺"}
              {review.country === "Italy" && "🇮🇹"}
              {review.country === "Germany" && "🇩🇪"}
              {review.country === "United Kingdom" && "🇬🇧"}
              {review.country === "France" && "🇫🇷"} {review.country}
            </Text>
          </View>
        </View>
        <Text style={styles.reviewText}>{review.text}</Text>
      </View>
    ))}
    {property.reviews.length > 2 && (
      <Animated.View
        style={{
          overflow: "hidden",
          maxHeight: reviewsAnimationHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, (property.reviews.length - 2) * 200],
          }),
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {property.reviews.slice(2).map((review: any) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInitial}>
                  <Text style={styles.reviewerInitialText}>
                    {review.reviewerInitial}
                  </Text>
                </View>
                <View>
                  <Text style={styles.reviewerName}>{review.reviewerName}</Text>
                  <Text style={styles.reviewerCountry}>
                    {review.country === "Australia" && "🇦🇺"}
                    {review.country === "Italy" && "🇮🇹"}
                    {review.country === "Germany" && "🇩🇪"}
                    {review.country === "United Kingdom" && "🇬🇧"}
                    {review.country === "France" && "🇫🇷"} {review.country}
                  </Text>
                </View>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    )}
    <TouchableOpacity
      onPress={handleShowAllReviews}
      style={styles.showMoreButton}
    >
      <Text style={styles.showMoreText}>
        {showExpandedReviews ? "Show less reviews" : "See detailed reviews"}
      </Text>
    </TouchableOpacity>
  </View>
);

export default ReviewsSection;
