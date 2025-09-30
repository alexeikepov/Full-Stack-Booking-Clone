import { Modal, SafeAreaView, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useTheme } from "../../hooks/ThemeContext";

type MarkerItem = {
  id?: string | number;
  coordinate: { latitude: number; longitude: number };
  title?: string;
  description?: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  region?: Region | null;
  markers?: MarkerItem[];
};

export default function MapModal({ visible, onClose, region, markers }: Props) {
  const { colors, theme } = useTheme();

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
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            height: 56,
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

        <MapView
          style={{ flex: 1, width: "100%" }}
          initialRegion={defaultRegion}
        >
          {(markers ?? []).map((m) => (
            <Marker
              key={String(
                m.id ?? `${m.coordinate.latitude}-${m.coordinate.longitude}`,
              )}
              coordinate={m.coordinate}
              title={m.title}
              description={m.description}
            />
          ))}
        </MapView>
      </SafeAreaView>
    </Modal>
  );
}
