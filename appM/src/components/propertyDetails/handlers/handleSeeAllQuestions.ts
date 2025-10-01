import { Animated } from "react-native";

export function handleSeeAllQuestions({
  showAllQuestions,
  setShowAllQuestions,
  animationHeight,
}: any) {
  setShowAllQuestions(!showAllQuestions);

  Animated.timing(animationHeight, {
    toValue: showAllQuestions ? 0 : 1,
    duration: 300,
    useNativeDriver: false,
  }).start();
}
