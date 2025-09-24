import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../constants/Colors";
import { SavedPropertiesProvider } from "../hooks/SavedPropertiesContext";
import { ThemeProvider, useTheme } from "../hooks/ThemeContext";
import type { RootStackParamList } from "../types/navigation";
import Account from "./AccountScreen";
import BookingsScreen from "./BookingsScreen";
import PropertyDetailsScreen from "./PropertyDetailsScreen";
import PropertyListScreen from "./PropertyListScreen";
import SavedScreen from "./SavedScreen";
import SearchScreen from "./SearchScreen";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();
function TabNavigator() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="Search"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.separator,
        },
        tabBarActiveTintColor: colors.button,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarIcon: ({ color, size }) => {
          let iconName = "";
          if (route.name === "Account") iconName = "person-outline";
          else if (route.name === "Saved") iconName = "heart-outline";
          else if (route.name === "Bookings") iconName = "calendar-outline";
          else if (route.name === "Search") iconName = "search-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: "700",
        },
      })}
    >
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  );
}
export default function App() {
  return (
    <ThemeProvider>
      <SavedPropertiesProvider>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <AppContent />
            </NavigationContainer>
          </QueryClientProvider>
        </SafeAreaProvider>
      </SavedPropertiesProvider>
    </ThemeProvider>
  );
}
function AppContent() {
  const { theme } = useTheme();
  const statusBarBg =
    theme === "dark" ? Colors.dark.background : Colors.light.blue;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: statusBarBg }}>
      <StatusBar backgroundColor={statusBarBg} translucent={false} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen
          name="PropertyListScreen"
          component={PropertyListScreen}
        />
        <Stack.Screen
          name="PropertyDetailsScreen"
          component={PropertyDetailsScreen}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
