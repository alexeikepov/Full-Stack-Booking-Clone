import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

type ExploreWorldSectionProps = {
  styles: any;
  colors: any;
  handleLocationOnlyPress: (location: string) => void;
};

const ExploreWorldSection: React.FC<ExploreWorldSectionProps> = ({
  styles,
  colors,
  handleLocationOnlyPress,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Explore the World</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 16 }}
    >
      <TouchableOpacity
        onPress={() => handleLocationOnlyPress("Paris, France")}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            width: 160,
            padding: 12,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <Image
            source={require("../../assets/images/paris.png")}
            style={{
              width: 60,
              height: 60,
              borderRadius: 12,
              marginBottom: 8,
            }}
          />
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              color: colors.text,
            }}
          >
            Paris
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              textAlign: "center",
              marginTop: 4,
            }}
          >
            The city of lights and romance
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleLocationOnlyPress("New York, USA")}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            width: 160,
            padding: 12,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <Image
            source={require("../../assets/images/new-york.png")}
            style={{
              width: 60,
              height: 60,
              borderRadius: 12,
              marginBottom: 8,
            }}
          />
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              color: colors.text,
            }}
          >
            New York
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              textAlign: "center",
              marginTop: 4,
            }}
          >
            The Big Apple
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

export default ExploreWorldSection;
