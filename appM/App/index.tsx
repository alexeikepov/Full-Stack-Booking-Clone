import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";

import Account from "./AccountScreen";
import BookingsScreen from "./BookingsScreen";
import SavedScreen from "./SavedScreen";
import SearchScreen from "./SearchScreen";

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark.card }}>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: { backgroundColor: Colors.dark.card },
                tabBarActiveTintColor: Colors.dark.tabIconSelected,
                tabBarInactiveTintColor: Colors.dark.tabIconDefault,
                tabBarIcon: ({ color, size }) => {
                  let iconName = "";
                  if (route.name === "Account") iconName = "person-outline";
                  else if (route.name === "Saved") iconName = "heart-outline";
                  else if (route.name === "Bookings")
                    iconName = "calendar-outline";
                  else if (route.name === "Search") iconName = "search-outline";
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
              })}
            >
              <Tab.Screen name="Account" component={Account} />
              <Tab.Screen name="Saved" component={SavedScreen} />
              <Tab.Screen name="Bookings" component={BookingsScreen} />
              <Tab.Screen name="Search" component={SearchScreen} />
            </Tab.Navigator>
          </SafeAreaView>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
