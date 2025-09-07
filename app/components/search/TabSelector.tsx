import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";

interface TabSelectorProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  icons?: Record<string, string>;
}

export default function TabSelector({
  tabs,
  activeTab,
  onTabChange,
  icons = {},
}: TabSelectorProps) {
  // Hardcode the two rows as per the requirement
  const firstRow = ["Stays", "Flights"];
  const secondRow = ["Car rental", "Taxi", "Attractions"];

  const renderRow = (rowTabs: string[], rowKey: string) => (
    <View style={styles.row} key={rowKey}>
      {rowTabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabChange(tab)}
            style={[
              styles.tab,
              {
                backgroundColor: isActive ? Colors.dark.text : Colors.dark.card,
                flex: 1 / rowTabs.length,
              },
            ]}
          >
            {icons[tab] && (
              <Ionicons
                name={icons[tab]}
                size={24}
                color={isActive ? Colors.dark.background : Colors.dark.text}
              />
            )}
            <Text
              style={[
                styles.tabText,
                { color: isActive ? Colors.dark.background : Colors.dark.text },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderRow(firstRow, "row1")}
      {renderRow(secondRow, "row2")}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    // Add negative margin to compensate for tab spacing
    marginHorizontal: -4,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    flex: 1,
    marginHorizontal: 4,
    minWidth: 0, // allow shrinking
  },
  tabText: {
    fontWeight: "bold",
    fontSize: 14,
  },
});
