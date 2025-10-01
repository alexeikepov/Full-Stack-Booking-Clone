import { Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Ionicons from "react-native-vector-icons/Ionicons";

const MapSection = ({ styles, colors, property, handleMapPress }: any) => (
  <TouchableOpacity style={styles.mapSection} onPress={handleMapPress}>
    <MapView
      style={styles.mapView}
      initialRegion={{
        latitude: property.coordinates.latitude,
        longitude: property.coordinates.longitude,
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
          latitude: property.coordinates.latitude,
          longitude: property.coordinates.longitude,
        }}
        title={property.name}
        description={property.address}
      />
    </MapView>
    <View style={styles.mapOverlay}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="location-outline" size={16} color={colors.text} />
        <Text style={styles.addressText}>{property.address}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default MapSection;
