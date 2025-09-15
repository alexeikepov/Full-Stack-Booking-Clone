import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";

interface SearchBarProps {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  iconName?: string;
}

export default function SearchBar({
  placeholder,
  value,
  onChangeText,
  iconName,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      {iconName && (
        <Ionicons
          name={iconName}
          size={20}
          color={Colors.dark.icon}
          style={styles.icon}
        />
      )}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.dark.textSecondary}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.inputBackground,
    minHeight: 44,
    marginTop: 0,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
  },
});
