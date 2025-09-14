import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";

interface RebookButtonProps {
  onPress: () => void;
}

export default function RebookButton({ onPress }: RebookButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons
        name="refresh-outline"
        size={20}
        color={Colors.dark.text}
        style={{ marginRight: 8 }}
      />
      <Text style={[styles.text, { flexShrink: 1 }]} numberOfLines={1}>
        Rebook this property
      </Text>
      <Ionicons
        name="arrow-forward-outline"
        size={20}
        color={Colors.dark.text}
        style={{ marginLeft: 4 }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.cardSecondary,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  text: {
    color: Colors.dark.text,
    fontWeight: "bold",
  },
});
