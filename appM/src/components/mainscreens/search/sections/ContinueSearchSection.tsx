import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../../hooks/ThemeContext";

interface ContinueSearchSectionProps {
  onCardPress: (
    location: string,
    dateString: string,
    guestString: string,
  ) => void;
  onLocationOnlyPress: (location: string) => void;
}

const ContinueSearchSection: React.FC<ContinueSearchSectionProps> = ({
  onCardPress,
  onLocationOnlyPress,
}) => {
  const { colors } = useTheme();

  const cardData = [
    {
      location: "Rome, Italy",
      dateString: "26–28 Sep, 2 adults",
      guestString: "2 adults",
      image: require("../../../../assets/images/rome.png"),
    },
    {
      location: "Dubai, UAE",
      dateString: "26–28 Sep, 2 adults",
      guestString: "2 adults",
      image: require("../../../../assets/images/dubai.png"),
    },
    {
      location: "Paris, France",
      dateString: "15–18 Oct, 2 adults",
      guestString: "2 adults",
      image: require("../../../../assets/images/paris.png"),
    },
    {
      location: "London, UK",
      dateString: "22–25 Oct, 2 adults",
      guestString: "2 adults",
      image: require("../../../../assets/images/london.png"),
    },
    {
      location: "Barcelona, Spain",
      dateString: "5–8 Nov, 2 adults",
      guestString: "2 adults",
      image: require("../../../../assets/images/barcelona.png"),
    },
    {
      location: "Amsterdam, Netherlands",
      dateString: "12–15 Nov, 2 adults",
      guestString: "2 adults",
      image: require("../../../../assets/images/amsterdam.png"),
    },
    {
      location: "Tokyo, Japan",
      dateString: "20–24 Nov, 2 adults",
      guestString: "2 adults",
      image: require("../../../../assets/images/tokyo.png"),
    },
    {
      location: "New York, USA",
      dateString: "1–5 Dec, 2 adults",
      guestString: "2 adults",
      image: require("../../../../assets/images/new-york.png"),
    },
  ];

  const renderCard = (item: (typeof cardData)[0], index: number) => (
    <TouchableOpacity
      key={index}
      onPress={() =>
        onCardPress(item.location, item.dateString, item.guestString)
      }
      style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        width: 320,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Image
        source={item.image}
        style={{
          width: 50,
          height: 50,
          borderRadius: 8,
          marginRight: 16,
        }}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: colors.text,
            marginBottom: 4,
          }}
        >
          {item.location.split(", ")[0]}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: colors.textSecondary,
          }}
        >
          {item.dateString}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 4,
          padding: 4,
          marginLeft: 8,
          borderWidth: 1,
          borderColor: "#007AFF",
        }}
      >
        <Ionicons name="bed-outline" size={16} color="#007AFF" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Continue your search
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16, gap: 16 }}
      >
        <View style={{ flexDirection: "column", gap: 12 }}>
          {cardData.slice(0, 2).map(renderCard)}
        </View>
        <View style={{ flexDirection: "column", gap: 12 }}>
          {cardData
            .slice(2, 4)
            .map((item, index) => renderCard(item, index + 2))}
        </View>
        <View style={{ flexDirection: "column", gap: 12 }}>
          {cardData
            .slice(4, 6)
            .map((item, index) => renderCard(item, index + 4))}
        </View>
        <View style={{ flexDirection: "column", gap: 12 }}>
          {cardData
            .slice(6, 8)
            .map((item, index) => renderCard(item, index + 6))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ContinueSearchSection;
