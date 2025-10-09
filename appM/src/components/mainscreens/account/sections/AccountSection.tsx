import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../../../hooks/ThemeContext";
interface AccountSectionProps {
  title: string;
  children: React.ReactNode;
}
export default function AccountSection({
  title,
  children,
}: AccountSectionProps) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 16,
          fontWeight: "bold",
          marginBottom: 8,
          paddingHorizontal: 16,
        }}
      >
        {title}
      </Text>
      <View>{children}</View>
    </View>
  );
}
