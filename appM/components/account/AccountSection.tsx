import React from "react";
import { View, Text } from "react-native";
import { Colors } from "../../constants/Colors";

interface AccountSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function AccountSection({
  title,
  children,
}: AccountSectionProps) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          color: Colors.dark.text,
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
