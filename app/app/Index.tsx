import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../constants/Colors";
import AccountScreen from "./screens/Account";
import BookingsScreen from "./screens/Bookings";
import SavedScreen from "./screens/Saved";
import SearchScreen from "./screens/Search";

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: Colors.dark.card },
          tabBarActiveTintColor: Colors.dark.tabIconSelected,
          tabBarInactiveTintColor: Colors.dark.tabIconDefault,
          tabBarIcon: ({ color, size }) => {
            let iconName: string = "";

            if (route.name === "Account") iconName = "person-outline";
            else if (route.name === "Saved") iconName = "heart-outline";
            else if (route.name === "Bookings") iconName = "calendar-outline";
            else if (route.name === "Search") iconName = "search-outline";

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Account" component={AccountScreen} />
        <Tab.Screen name="Saved" component={SavedScreen} />
        <Tab.Screen name="Bookings" component={BookingsScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
      </Tab.Navigator>
    </QueryClientProvider>
  );
}
