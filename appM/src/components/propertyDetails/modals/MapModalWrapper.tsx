import MapModal from "../../../components/shared/MapModal";

const MapModalWrapper = ({ visible, onClose, region, markers }: any) => (
  <MapModal
    visible={visible}
    onClose={onClose}
    region={region}
    markers={markers}
  />
);

export default MapModalWrapper;
