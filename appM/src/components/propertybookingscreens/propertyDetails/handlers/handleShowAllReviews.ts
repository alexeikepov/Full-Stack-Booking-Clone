import { Animated } from "react-native";

export function handleShowAllReviews({
  showExpandedReviews,
  setShowExpandedReviews,
  reviewsAnimationHeight,
}: any) {
  setShowExpandedReviews(!showExpandedReviews);

  Animated.timing(reviewsAnimationHeight, {
    toValue: showExpandedReviews ? 0 : 1,
    duration: 300,
    useNativeDriver: false,
  }).start();
}
