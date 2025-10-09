import { MapModal } from "../../../../components/shared";

const MapModalWrapper = ({
  visible,
  onClose,
  region,
  markers,
  onApply,
  buttonText,
  properties,
}: any) => (
  <MapModal
    visible={visible}
    onClose={onClose}
    region={region}
    markers={markers}
    onApply={onApply}
    buttonText={buttonText}
    properties={properties}
  />
);

export default MapModalWrapper;
