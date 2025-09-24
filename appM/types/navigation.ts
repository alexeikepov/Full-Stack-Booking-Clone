// path: src/types/navigation.ts
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  MainTabs: undefined;
  PropertyListScreen: undefined;
  PropertyDetailsScreen: {
    propertyData: {
      propertyName: string;
      dates: string;
      price: string;
      status: string;
      location: string;
      details: {
        confirmationNumber: string;
        pin: string;
        checkIn: string;
        checkOut: string;
        address: string;
        roomType: string;
        includedExtras: string;
        breakfastIncluded: boolean;
        nonRefundable: boolean;
        totalPrice: string;
        shareOptions: string[];
        contactNumber: string;
      };
    };
  };
};

// Props helper for PropertyDetailsScreen
export type PropertyDetailsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "PropertyDetailsScreen">;
  route: RouteProp<RootStackParamList, "PropertyDetailsScreen">;
};
