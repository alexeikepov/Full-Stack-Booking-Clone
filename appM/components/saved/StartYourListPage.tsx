import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { useTheme } from "../../hooks/ThemeContext";
type RootStackParamList = {
  SearchScreen: undefined;
  // add other screens here if needed
};
export default function StartYourListPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My next trip</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Image
          source={require("../../assets/images/hotel7.png")} // Use a placeholder for the illustration
          style={styles.illustration}
        />
        <Text style={styles.title}>Start your list</Text>
        <Text style={styles.subtitle}>
          When you find a property you like, tap the{"\n"}heart icon to save it.
        </Text>
        <TouchableOpacity
          style={styles.findPropertiesButton}
          onPress={() => navigation.navigate("SearchScreen")} // Adjust the navigation target as needed
        >
          <Text style={styles.buttonText}>Find properties</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  shareButton: {
    padding: 8,
  },
  shareText: {
    color: "#007AFF",
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  illustration: {
    width: 200, // Adjust size as needed
    height: 150, // Adjust size as needed
    resizeMode: "contain",
    marginBottom: 24,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.dark.icon,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  findPropertiesButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
