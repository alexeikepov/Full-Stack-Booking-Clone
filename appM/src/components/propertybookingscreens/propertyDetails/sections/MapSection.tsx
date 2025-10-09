import { Text, TouchableOpacity, View, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Ionicons from "react-native-vector-icons/Ionicons";

const MapSection = ({ styles, colors, property, handleMapPress }: any) => {
  // Default to Rome if coordinates are not available
  const defaultLatitude = 41.9028;
  const defaultLongitude = 12.4964;

  const latitude = property.coordinates?.latitude ?? defaultLatitude;
  const longitude = property.coordinates?.longitude ?? defaultLongitude;

  return (
    <TouchableOpacity style={styles.mapSection} onPress={handleMapPress}>
      <MapView
        style={styles.mapView}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        pointerEvents="none"
      >
        <Marker
          coordinate={{
            latitude,
            longitude,
          }}
          anchor={{ x: 0.5, y: 1 }}
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
              <Text style={{ color: "#FFFFFF", fontSize: 12 }}>
                {property.price}
              </Text>
            </View>
            <View style={{ position: "relative", alignItems: "center" }}>
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
      </MapView>
      <View style={styles.mapOverlay}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="location-outline" size={16} color={colors.text} />
          <Text style={styles.addressText}>{property.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MapSection;
