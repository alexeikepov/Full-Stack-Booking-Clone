import { Image, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../hooks/ThemeContext";
interface ContinueSearchCardProps {
  title: string;
  subtitle: string;
  image?: any;
  onPress?: () => void;
  titleStyle?: object;
  subtitleStyle?: object;
}
export default function ContinueSearchCard({
  title,
  subtitle,
  image,
  onPress,
  titleStyle,
  subtitleStyle,
}: ContinueSearchCardProps) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 12,
        marginRight: 12,
        alignItems: "center",
        width: 250,
      }}
    >
      <Image
        source={image || require("../../assets/images/hotel7.png")}
        style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={[{ color: colors.text, fontWeight: "bold" }, titleStyle]}>
          {title}
        </Text>
        <Text
          style={[{ color: colors.textSecondary, fontSize: 12 }, subtitleStyle]}
        >
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
