import { useRef, useState } from "react";
import { PanResponder, Text, View } from "react-native";

type StyleProp = {
  priceSliderContainer: any;
  priceGraphContainer: any;
  priceGraph: any;
  priceBar: any;
  priceRangeDisplay: any;
  priceRangeText: any;
  sliderTrackContainer: any;
  sliderTrack: any;
  sliderActiveRange: any;
  sliderThumb: any;
  sliderThumbInner: any;
  sliderThumbActive: any;
};

const PriceSlider = ({
  minValue = 30,
  maxValue = 400,
  onValueChange,
  styles,
}: {
  minValue?: number;
  maxValue?: number;
  onValueChange: (min: number, max: number) => void;
  styles: StyleProp;
}) => {
  const [currentMin, setCurrentMin] = useState(minValue);
  const [currentMax, setCurrentMax] = useState(maxValue);
  const [sliderWidth, setSliderWidth] = useState(300);
  const [, setIsDragging] = useState(false);
  const [activeThumb, setActiveThumb] = useState<"min" | "max" | null>(null);

  // Refs to track gesture state
  const gestureState = useRef({
    isMinThumbActive: false,
    isMaxThumbActive: false,
    startValue: 0,
    initialPosition: 0,
  });

  const generatePriceData = () => {
    const data = [];
    for (let i = 0; i < 50; i++) {
      const height = Math.random() * 80 + 20;
      data.push(height);
    }
    return data;
  };

  const [priceData] = useState(generatePriceData());

  // Create pan responders for draggable thumbs
  const createPanResponder = (isMinThumb: boolean) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsDragging(true);
        setActiveThumb(isMinThumb ? "min" : "max");
        gestureState.current.isMinThumbActive = isMinThumb;
        gestureState.current.isMaxThumbActive = !isMinThumb;
        gestureState.current.startValue = isMinThumb ? currentMin : currentMax;
        gestureState.current.initialPosition =
          ((gestureState.current.startValue - minValue) /
            (maxValue - minValue)) *
          sliderWidth;
      },
      onPanResponderMove: (evt, panGestureState) => {
        const { dx } = panGestureState;
        const initialPos = gestureState.current.initialPosition;

        let newPosition = initialPos + dx;
        newPosition = Math.max(0, Math.min(sliderWidth, newPosition));

        const newValue =
          (newPosition / sliderWidth) * (maxValue - minValue) + minValue;
        const roundedValue = Math.round(newValue / 5) * 5; // Round to nearest 5

        if (isMinThumb) {
          const constrainedMin = Math.max(
            minValue,
            Math.min(roundedValue, currentMax - 10),
          );
          if (constrainedMin !== currentMin) {
            setCurrentMin(constrainedMin);
            onValueChange(constrainedMin, currentMax);
          }
        } else {
          const constrainedMax = Math.min(
            maxValue,
            Math.max(roundedValue, currentMin + 10),
          );
          if (constrainedMax !== currentMax) {
            setCurrentMax(constrainedMax);
            onValueChange(currentMin, constrainedMax);
          }
        }
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        setActiveThumb(null);
        gestureState.current.isMinThumbActive = false;
        gestureState.current.isMaxThumbActive = false;
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        setActiveThumb(null);
        gestureState.current.isMinThumbActive = false;
        gestureState.current.isMaxThumbActive = false;
      },
    });
  };

  const minThumbPanResponder = createPanResponder(true);
  const maxThumbPanResponder = createPanResponder(false);

  const minPercentage = ((currentMin - minValue) / (maxValue - minValue)) * 100;
  const maxPercentage = ((currentMax - minValue) / (maxValue - minValue)) * 100;

  // Calculate thumb positions (accounting for larger thumb size)
  const minThumbLeft =
    ((currentMin - minValue) / (maxValue - minValue)) * sliderWidth - 15;
  const maxThumbLeft =
    ((currentMax - minValue) / (maxValue - minValue)) * sliderWidth - 15;
  const activeRangeWidth =
    ((currentMax - currentMin) / (maxValue - minValue)) * sliderWidth;
  const activeRangeLeft =
    ((currentMin - minValue) / (maxValue - minValue)) * sliderWidth;

  return (
    <View style={styles.priceSliderContainer}>
      <View style={styles.priceGraphContainer}>
        <View style={styles.priceGraph}>
          {priceData.map((height, index) => {
            const barPercentage = (index / (priceData.length - 1)) * 100;
            const isInRange =
              barPercentage >= minPercentage && barPercentage <= maxPercentage;
            return (
              <View
                key={index}
                style={[
                  styles.priceBar,
                  {
                    height: height,
                    backgroundColor: isInRange ? "#007BFF" : "#E0E0E0",
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Price range display */}
        <View style={styles.priceRangeDisplay}>
          <Text style={styles.priceRangeText}>
            €{currentMin} - €{currentMax}
          </Text>
        </View>

        {/* Draggable slider track */}
        <View
          style={styles.sliderTrackContainer}
          onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
        >
          <View style={styles.sliderTrack}>
            {/* Active range highlight */}
            <View
              style={[
                styles.sliderActiveRange,
                {
                  left: activeRangeLeft,
                  width: activeRangeWidth,
                },
              ]}
            />

            {/* Min thumb */}
            <View
              style={[
                styles.sliderThumb,
                {
                  left: minThumbLeft,
                  backgroundColor:
                    activeThumb === "min"
                      ? "rgba(0, 123, 255, 0.2)"
                      : "transparent",
                },
              ]}
              {...minThumbPanResponder.panHandlers}
            >
              <View
                style={[
                  styles.sliderThumbInner,
                  activeThumb === "min" && styles.sliderThumbActive,
                ]}
              />
            </View>

            {/* Max thumb */}
            <View
              style={[
                styles.sliderThumb,
                {
                  left: maxThumbLeft,
                  backgroundColor:
                    activeThumb === "max"
                      ? "rgba(0, 123, 255, 0.2)"
                      : "transparent",
                },
              ]}
              {...maxThumbPanResponder.panHandlers}
            >
              <View
                style={[
                  styles.sliderThumbInner,
                  activeThumb === "max" && styles.sliderThumbActive,
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PriceSlider;
