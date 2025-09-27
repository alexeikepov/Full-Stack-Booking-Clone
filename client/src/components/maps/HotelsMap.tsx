import HotelsMapWithPins from "./HotelsMapWithPins";

export default function HotelsMap({ hotels }: { hotels?: any[] }) {
  return <HotelsMapWithPins hotels={hotels} />;
}
