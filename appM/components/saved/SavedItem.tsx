import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../hooks/ThemeContext";

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
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.textContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="heart" size={20} color={colors.red} />
          <Text style={[styles.title, { marginLeft: 8 }]}>{title}</Text>
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity onPress={onDotsPress} style={styles.dotsButton}>
        <Ionicons name="ellipsis-vertical" size={24} color={colors.icon} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 8,
      justifyContent: "space-between",
    },
    textContainer: {
      flex: 1,
    },
    title: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "bold",
    },
    subtitle: {
      color: colors.icon,
      fontSize: 14,
    },
    dotsButton: {
      paddingLeft: 10,
    },
  });
