import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";

type SavedItemProps = {
  title: string;
  subtitle: string;
  onPress: () => void;
  onDotsPress: () => void;
};

export default function SavedItem({
  title,
  subtitle,
  onPress,
  onDotsPress,
}: SavedItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.textContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="heart-outline" size={20} color={Colors.dark.red} />
          <Text style={[styles.title, { marginLeft: 8 }]}>{title}</Text>
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity onPress={onDotsPress} style={styles.dotsButton}>
        <Ionicons
          name="ellipsis-horizontal"
          size={24}
          color={Colors.dark.icon}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    color: Colors.dark.icon,
    fontSize: 14,
  },
  dotsButton: {
    paddingLeft: 10,
  },
});
