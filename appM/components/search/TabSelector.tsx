import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../hooks/ThemeContext";
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
  const { colors, theme } = useTheme();
  const firstRow = ["Stays", "Flights"];
  const secondRow = ["Car rental", "Taxi", "Attractions"];
  const renderRow = (rowTabs: string[], rowKey: string) => (
    <View style={styles.row} key={rowKey}>
      {rowTabs.map((tab) => {
        const isActive = tab === activeTab;
        // Use dark background for all tabs in dark mode, even when selected
        const tabBackground = theme === "dark" ? colors.background : "#003399";
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabChange(tab)}
            style={[
              styles.tab,
              {
                backgroundColor: tabBackground,
                borderWidth: isActive ? 1 : 0,
                borderColor: isActive ? "#fff" : "transparent",
                flex: 1 / rowTabs.length,
              },
            ]}
          >
            {icons[tab] && (
              <Ionicons
                name={icons[tab]}
                size={tab === "Attractions" ? 22 : 24}
                color={"#fff"}
              />
            )}
            <Text
              style={[
                styles.tabText,
                {
                  color: "#fff",
                  fontSize: tab === "Attractions" ? 13 : 14,
                },
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
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    gap: 6,
    flex: 1,
    marginHorizontal: 4,
    minWidth: 0, // allow shrinking
  },
  tabText: {
    fontWeight: "bold",
    fontSize: 14,
  },
});
