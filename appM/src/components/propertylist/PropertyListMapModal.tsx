import MapModal from "../shared/MapModal";

type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
  styles: any;
  selectedLocation?: string;
  setSelectedLocation?: (location: string) => void;
  selectedDates?: { checkIn: Date | null; checkOut: Date | null };
  setSelectedDates?: (dates: {
    checkIn: Date | null;
    checkOut: Date | null;
  }) => void;
  selectedSortOption?: string;
  setSelectedSortOption?: (option: string) => void;
  selectedFilters?: Set<string>;
  setSelectedFilters?: (filters: Set<string>) => void;
  onOpenFilterModal?: () => void;
};

const MapModalWrapper = ({ isVisible, onClose }: ModalProps) => {
  if (!isVisible) return null;

  const propertyMarkers = [
    {
      id: 1,
      coordinate: { latitude: 41.9028, longitude: 12.4964 },
      title: "Hotel de Russie",
    },
    {
      id: 2,
      coordinate: { latitude: 41.9109, longitude: 12.4818 },
      title: "Hotel Artemide",
    },
    {
      id: 3,
      coordinate: { latitude: 41.8986, longitude: 12.4769 },
      title: "The First Roma Arte",
    },
  ];

  const region = {
    latitude: propertyMarkers[0].coordinate.latitude,
    longitude: propertyMarkers[0].coordinate.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <MapModal
      visible={isVisible}
      onClose={onClose}
      region={region}
      markers={propertyMarkers}
    />
  );
};

export default MapModalWrapper;
