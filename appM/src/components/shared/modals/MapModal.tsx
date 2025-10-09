import {
  Modal,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Text,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import MapView, { Marker, Region } from "react-native-maps";
import { useState, useEffect } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useTheme } from "../../../hooks/ThemeContext";
import { demoApartments } from "../../../data/demoApartmentsData";
import { AppProperty } from "../../../types/api.types";

const cities = [
  "Paris, France",
  "London, United Kingdom",
  "New York City, USA",
  "Tokyo, Japan",
  "Dubai, UAE",
  "Rome, Italy",
  "Bangkok, Thailand",
  "Istanbul, Turkey",
  "Barcelona, Spain",
  "Singapore",
  "Los Angeles, USA",
  "Hong Kong",
  "Amsterdam, Netherlands",
  "Kuala Lumpur, Malaysia",
  "Seoul, South Korea",
  "Sydney, Australia",
  "Las Vegas, USA",
  "Prague, Czech Republic",
  "Milan, Italy",
  "San Francisco, USA",
];

type MarkerItem = {
  id?: string | number;
  coordinate: { latitude: number; longitude: number };
  title?: string;
  description?: string;
  price?: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  region?: Region | null;
  markers?: MarkerItem[];
  properties?: AppProperty[];
  onApply?: (property: AppProperty) => void;
  buttonText?: string;
};

export default function MapModal({
  visible,
  onClose,
  region,
  markers,
  properties: externalProperties,
  onApply,
  buttonText = "Select Property",
}: Props) {
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [properties, setProperties] = useState<AppProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<AppProperty | null>(
    null,
  );
  const [isFetching, setIsFetching] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState<
    string | number | null
  >(null);

  useEffect(() => {
    if (!visible) return;

    if (externalProperties) {
      setProperties(externalProperties);
      setIsFetching(false);
    } else if (onApply) {
      const filteredProperties = cities.flatMap((city) =>
        demoApartments.filter((p) =>
          p.location?.toLowerCase().includes(city.split(",")[0].toLowerCase()),
        ),
      );
      setProperties(filteredProperties);
      setIsFetching(false);
      console.log(
        "Loaded properties from demo data:",
        filteredProperties.length,
      );
    }
  }, [visible, onApply, externalProperties]);

  const propertyMarkers: MarkerItem[] = properties
    .filter((p) => p.coordinates)
    .map((p) => ({
      id: p.id,
      coordinate: p.coordinates!,
      title: p.title,
      price: p.price,
    }));

  const displayMarkers: MarkerItem[] = onApply
    ? propertyMarkers
    : markers || [];

  if (!visible) return null;

  // sensible default (Rome)
  const defaultRegion: Region = region ?? {
    latitude: 41.9028,
    longitude: 12.4964,
    latitudeDelta: 0.02,
    longitudeDelta: 0.01,
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView
        edges={["bottom", "left", "right"]}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <View
          style={{
            height: 56 + (Platform.OS === "android" ? 0 : insets.top),
            paddingTop: Platform.OS === "android" ? 0 : insets.top,
            paddingHorizontal: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
            <AntDesign
              name="arrow-left"
              size={24}
              color={theme === "light" ? colors.text : "white"}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>

        {isFetching && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={colors.blue} />
            <Text style={{ marginTop: 8, color: colors.text }}>
              Loading properties...
            </Text>
          </View>
        )}

        {!isFetching && (
          <MapView
            style={{ flex: 1, width: "100%" }}
            initialRegion={defaultRegion}
          >
            {displayMarkers.map((m) => {
              const property = properties.find((p) => p.id === m.id);
              return m.price ? (
                <Marker
                  key={String(
                    m.id ??
                      `${m.coordinate.latitude}-${m.coordinate.longitude}`,
                  )}
                  coordinate={m.coordinate}
                  anchor={{ x: 0.5, y: 1 }}
                  onPress={
                    onApply
                      ? () => {
                          setSelectedProperty(property || null);
                          setSelectedMarkerId(m.id ?? null);
                        }
                      : undefined
                  }
                >
                  <View style={{ alignItems: "center" }}>
                    <View
                      style={{
                        backgroundColor: colors.blue,
                        borderWidth: 2,
                        borderColor: "#FFFFFF",
                        width: Platform.OS === "android" ? 35 : 50,
                        height: Platform.OS === "android" ? 25 : 30,
                        justifyContent: "center",
                        alignItems: "center",
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: selectedMarkerId === m.id ? 9 : 12,
                        }}
                        numberOfLines={1}
                      >
                        {selectedMarkerId === m.id
                          ? m.title && m.title.length > 8
                            ? m.title.substring(0, 8) + "..."
                            : m.title
                          : m.price}
                      </Text>
                    </View>
                    <View
                      style={{ position: "relative", alignItems: "center" }}
                    >
                      <View
                        style={{
                          width: 0,
                          height: 0,
                          borderLeftWidth: Platform.OS === "android" ? 12 : 14,
                          borderRightWidth: Platform.OS === "android" ? 12 : 14,
                          borderTopWidth: Platform.OS === "android" ? 12 : 14,
                          borderLeftColor: "transparent",
                          borderRightColor: "transparent",
                          borderTopColor: "#FFFFFF",
                        }}
                      />
                      <View
                        style={{
                          position: "absolute",
                          top: 2,
                          width: 0,
                          height: 0,
                          borderLeftWidth: Platform.OS === "android" ? 10 : 12,
                          borderRightWidth: Platform.OS === "android" ? 10 : 12,
                          borderTopWidth: Platform.OS === "android" ? 10 : 12,
                          borderLeftColor: "transparent",
                          borderRightColor: "transparent",
                          borderTopColor: "#FFFFFF",
                        }}
                      />
                    </View>
                  </View>
                </Marker>
              ) : (
                <Marker
                  key={String(
                    m.id ??
                      `${m.coordinate.latitude}-${m.coordinate.longitude}`,
                  )}
                  coordinate={m.coordinate}
                  title={m.title}
                  description={m.description}
                  onPress={
                    onApply
                      ? () => {
                          setSelectedProperty(property || null);
                          setSelectedMarkerId(m.id ?? null);
                        }
                      : undefined
                  }
                />
              );
            })}
          </MapView>
        )}

        {selectedProperty && onApply && (
          <View style={{ padding: 8, backgroundColor: colors.background }}>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}
            >
              {selectedProperty.title}
            </Text>
          </View>
        )}

        {onApply && (
          <View style={{ padding: 16, backgroundColor: colors.background }}>
            <TouchableOpacity
              onPress={() => {
                if (selectedProperty) {
                  onApply(selectedProperty);
                  onClose();
                }
              }}
              style={{
                backgroundColor: selectedProperty ? "#007BFF" : "#ccc",
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
              }}
              disabled={!selectedProperty}
            >
              <AntDesign name="check" size={20} color="white" />
              <Text style={{ color: "white", marginLeft: 8 }}>
                {selectedProperty ? buttonText : "Choose Property"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}
