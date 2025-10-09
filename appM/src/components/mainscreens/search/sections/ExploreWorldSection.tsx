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
            source={require("../../../../assets/images/paris.png")}
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
            source={require("../../../../assets/images/new-york.png")}
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
            The Big Apple of our the world
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleLocationOnlyPress("London, UK")}>
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
            source={require("../../../../assets/images/london.png")}
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
            London
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              textAlign: "center",
              marginTop: 4,
            }}
          >
            Historic charm and modern culture
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleLocationOnlyPress("Tokyo, Japan")}>
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
            source={require("../../../../assets/images/tokyo.png")}
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
            Tokyo
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              textAlign: "center",
              marginTop: 4,
            }}
          >
            Where tradition meets innovation
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleLocationOnlyPress("Dubai, UAE")}>
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
            source={require("../../../../assets/images/dubai.png")}
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
            Dubai
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              textAlign: "center",
              marginTop: 4,
            }}
          >
            Luxury and desert adventures
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleLocationOnlyPress("Rome, Italy")}>
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
            source={require("../../../../assets/images/rome.png")}
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
            Rome
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              textAlign: "center",
              marginTop: 4,
            }}
          >
            The eternal city of history
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleLocationOnlyPress("Barcelona, Spain")}
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
            source={require("../../../../assets/images/barcelona.png")}
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
            Barcelona
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              textAlign: "center",
              marginTop: 4,
            }}
          >
            Art, architecture, and beaches
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleLocationOnlyPress("Amsterdam, Netherlands")}
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
            source={require("../../../../assets/images/amsterdam.png")}
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
            Amsterdam
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              textAlign: "center",
              marginTop: 4,
            }}
          >
            Canals, culture, and cycling
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

export default ExploreWorldSection;
