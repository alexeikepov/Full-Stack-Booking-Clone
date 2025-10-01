import { Animated } from "react-native";

export function handleReadMore({
  showExpandedDescription,
  setShowExpandedDescription,
  descriptionAnimationHeight,
}: any) {
  setShowExpandedDescription(!showExpandedDescription);

  Animated.timing(descriptionAnimationHeight, {
    toValue: showExpandedDescription ? 0 : 1,
    duration: 300,
    useNativeDriver: false,
  }).start();
}
