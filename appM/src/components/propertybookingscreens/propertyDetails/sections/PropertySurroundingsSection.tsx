import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import { useState, useRef } from "react";

export default function PropertySurroundingsSection({
  surroundings,
  styles,
  colors,
}: any) {
  const [showAll, setShowAll] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  // Animate open/close
  const handleShowAll = () => {
    setShowAll(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };
  const handleHideAll = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 250,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: false,
    }).start(() => setShowAll(false));
  };

  if (!surroundings) return null;

  const {
    nearbyAttractions = [],
    restaurantsCafes = [],
    closestAirports = [],
  } = surroundings;

  return (
    <View
      style={[
        styles.section,
        {
          marginBottom: 24,
          backgroundColor: colors.sectionBackground || "transparent",
        },
      ]}
    >
      <Text
        style={[
          styles.sectionTitle,
          {
            fontWeight: "bold",
            fontSize: 20,
            marginBottom: 8,
            color: colors.textPrimary || colors.text || "#fff",
          },
        ]}
      >
        Surroundings
      </Text>
      {!showAll && (
        <TouchableOpacity
          style={{ marginBottom: 8, marginLeft: 8, alignSelf: "flex-start" }}
          onPress={handleShowAll}
        >
          <Text
            style={{
              color:
                colors.blue ||
                (colors.theme === "dark" ? "#006ce4" : "#003399"),
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            See all surroundings
          </Text>
        </TouchableOpacity>
      )}
      {showAll && (
        <Animated.View
          style={{
            overflow: "hidden",
            maxHeight: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1000], // Large enough to fit all content
            }),
            opacity: animation,
            marginBottom: 8,
          }}
        >
          {nearbyAttractions.length > 0 && (
            <View style={{ marginBottom: 8 }}>
              <Text
                style={[
                  styles.surroundingsSubtitle,
                  {
                    fontWeight: "bold",
                    fontSize: 16,
                    color: colors.textPrimary || colors.text || "#fff",
                  },
                ]}
              >
                Nearby Attractions:
              </Text>
              {nearbyAttractions.map((item: any, i: number) => (
                <Text
                  key={i}
                  style={[
                    styles.surroundingsItem,
                    {
                      fontSize: 15,
                      color: colors.textSecondary || colors.text || "#ccc",
                    },
                  ]}
                >
                  {item.name} ({item.distance})
                </Text>
              ))}
            </View>
          )}
          {restaurantsCafes.length > 0 && (
            <View style={{ marginBottom: 8 }}>
              <Text
                style={[
                  styles.surroundingsSubtitle,
                  {
                    fontWeight: "bold",
                    fontSize: 16,
                    color: colors.textPrimary || colors.text || "#fff",
                  },
                ]}
              >
                Restaurants & Cafes:
              </Text>
              {restaurantsCafes.map((item: any, i: number) => (
                <Text
                  key={i}
                  style={[
                    styles.surroundingsItem,
                    {
                      fontSize: 15,
                      color: colors.textSecondary || colors.text || "#ccc",
                    },
                  ]}
                >
                  {item.name} ({item.type}, {item.distance})
                </Text>
              ))}
            </View>
          )}
          {closestAirports.length > 0 && (
            <View style={{ marginBottom: 8 }}>
              <Text
                style={[
                  styles.surroundingsSubtitle,
                  {
                    fontWeight: "bold",
                    fontSize: 16,
                    color: colors.textPrimary || colors.text || "#fff",
                  },
                ]}
              >
                Closest Airports:
              </Text>
              {closestAirports.map((item: any, i: number) => (
                <Text
                  key={i}
                  style={[
                    styles.surroundingsItem,
                    {
                      fontSize: 15,
                      color: colors.textSecondary || colors.text || "#ccc",
                    },
                  ]}
                >
                  {item.name} ({item.distance})
                </Text>
              ))}
            </View>
          )}
          <TouchableOpacity
            style={{ alignSelf: "flex-start", marginTop: 8 }}
            onPress={handleHideAll}
          >
            <Text
              style={{
                color:
                  colors.blue ||
                  (colors.theme === "dark" ? "#006ce4" : "#003399"),
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Hide surroundings
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}
