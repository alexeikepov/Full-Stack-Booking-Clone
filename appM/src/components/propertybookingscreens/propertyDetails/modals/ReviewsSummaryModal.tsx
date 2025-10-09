import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const ReviewsSummaryModal = ({
  visible,
  onClose,
  styles,
  colors,
  property,
}: any) => {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView
        edges={["bottom", "left", "right"]}
        style={styles.reviewsSummaryModalContainer}
      >
        <View
          style={{ height: insets.top, backgroundColor: colors.background }}
        />
        <View style={styles.reviewsSummaryHeader}>
          <TouchableOpacity
            style={styles.reviewsSummaryCloseButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.reviewsSummaryTitle}>Guest Reviews</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.reviewsSummaryStats}>
          <Text style={styles.reviewsSummaryRating}>{property.rating}</Text>
          <Text style={styles.reviewsSummaryRatingText}>
            &quot;extraordinary&quot;
          </Text>
          <Text style={styles.reviewsSummaryRatingText}>
            the previous visitor says
          </Text>
          <Text style={styles.reviewsSummaryCount}>
            {property.totalReviews.toLocaleString()} reviews
          </Text>
          <View style={styles.reviewsSummaryBars}>
            {Object.entries(property.ratings).map(([category, rating]) => (
              <View key={category} style={styles.reviewsSummaryBarRow}>
                <Text style={styles.reviewsSummaryBarLabel}>
                  {category === "valueForMoney"
                    ? "Value for Money"
                    : category.charAt(0).toUpperCase() +
                      category.slice(1).replace(/([A-Z])/g, " $1")}
                </Text>
                <View style={styles.reviewsSummaryBar}>
                  <View
                    style={[
                      styles.reviewsSummaryBarFill,
                      { width: `${(Number(rating) / 10) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.reviewsSummaryBarValue}>
                  {Number(rating)}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <ScrollView style={styles.reviewsSummaryContent}>
          <Text style={styles.reviewsSummaryListTitle}>Recent Reviews</Text>
          {property.reviews.map((review: any) => (
            <View key={review.id} style={styles.reviewsSummaryCard}>
              <View style={styles.reviewsSummaryCardHeader}>
                <View style={styles.reviewsSummaryAvatar}>
                  <Text style={styles.reviewsSummaryAvatarText}>
                    {review.reviewerInitial}
                  </Text>
                </View>
                <View style={styles.reviewsSummaryReviewerInfo}>
                  <Text style={styles.reviewsSummaryReviewerName}>
                    {review.reviewerName}
                  </Text>
                  <Text style={styles.reviewsSummaryReviewerCountry}>
                    {review.country === "Australia" && "🇦🇺"}
                    {review.country === "Italy" && "🇮🇹"}
                    {review.country === "Germany" && "🇩🇪"}
                    {review.country === "United Kingdom" && "🇬🇧"}
                    {review.country === "France" && "🇫🇷"} {review.country}
                  </Text>
                </View>
              </View>
              <Text style={styles.reviewsSummaryReviewText}>{review.text}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default ReviewsSummaryModal;
