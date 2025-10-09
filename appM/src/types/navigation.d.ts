// path: src/types/navigation.ts
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs:
    | undefined
    | {
        screen: string;
        params?: object;
      };
  PropertyListScreen: undefined;
  PropertyDetailsScreen: {
    propertyData:
      | {
          propertyName: string;
          dates: string;
          price: string;
          status: string;
          location: string;
          imageSource?: any;
          images?: any[];
          media?: any[];
          rooms?: any[];
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
        }
      | import("../components/shared/modals/PropertyCard").Property;
  };
  PropertyConfirmationScreen: {
    property: any;
    selectedDates: { checkIn: Date | null; checkOut: Date | null };
    selectedGuests: any;
    bookingPriceOverride: number | null;
    bookingAltDateRange: string | null;
  };
};

// Props helper for PropertyDetailsScreen
export type PropertyDetailsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "PropertyDetailsScreen">;
  route: RouteProp<RootStackParamList, "PropertyDetailsScreen">;
};
