import { MapModal } from "../../../../components/shared";

type MapModalWrapperProps = {
  isVisible: boolean;
  onClose: () => void;
  styles: any;
  properties?: any[];
  onApply?: (property: any) => void;
};

const MapModalWrapper = ({
  isVisible,
  onClose,
  styles,
  properties = [],
  onApply,
}: MapModalWrapperProps) => {
  if (!isVisible) return null;

  const propertiesWithCoordinates = properties.filter((p) => p.coordinates);

  const propertyMarkers = propertiesWithCoordinates.map((p) => ({
    id: p.id,
    coordinate: p.coordinates,
    title: p.title,
  }));

  const region =
    propertiesWithCoordinates.length > 0
      ? {
          latitude: propertiesWithCoordinates[0].coordinates.latitude,
          longitude: propertiesWithCoordinates[0].coordinates.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }
      : {
          latitude: 41.9028,
          longitude: 12.4964,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

  return (
    <MapModal
      visible={isVisible}
      onClose={onClose}
      region={region}
      markers={propertyMarkers}
      properties={properties}
      onApply={onApply}
    />
  );
};

export default MapModalWrapper;
