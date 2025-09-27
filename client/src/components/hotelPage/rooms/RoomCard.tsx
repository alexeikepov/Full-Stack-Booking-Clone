export type Room = {
  _id: string;
  id?: string;
  name: string;
  roomType: string;
  roomCategory: string;
  capacity: number;
  maxAdults: number;
  maxChildren: number;
  pricePerNight: number;
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  totalRooms: number;
  roomsLeft: number;
  photos: string[];
  amenities: string[];
  facilities: string[];
  categories: string[];
  features: string[];
  description?: string;
  specialFeatures?: {
    hasPrivateBathroom?: boolean;
    hasTV?: boolean;
    hasMiniFridge?: boolean;
    hasFreeWifi?: boolean;
    hasCityView?: boolean;
    hasSeaView?: boolean;
    hasBalcony?: boolean;
    hasPoolView?: boolean;
    hasSmartTV?: boolean;
    hasEspresso?: boolean;
    hasNespresso?: boolean;
    hasSofaBed?: boolean;
    hasRainShower?: boolean;
    hasBath?: boolean;
    hasQueenBeds?: boolean;
    hasKitchenette?: boolean;
    hasTwoBedrooms?: boolean;
    hasMicrowave?: boolean;
    hasLivingArea?: boolean;
    hasDiningTable?: boolean;
    hasKingBed?: boolean;
    hasKettle?: boolean;
    hasDesk?: boolean;
    hasTwinBeds?: boolean;
    hasAccessibleBathroom?: boolean;
    hasStepFreeAccess?: boolean;
    hasPrivateTerrace?: boolean;
    hasOutdoorSeating?: boolean;
    hasJacuzzi?: boolean;
    hasSpaAccess?: boolean;
    hasPanoramicView?: boolean;
    hasTwoTerraces?: boolean;
  };
  pricing?: {
    basePrice: number;
    currency: string;
    includesBreakfast?: boolean;
    freeCancellation: boolean;
    noPrepayment: boolean;
    priceMatch: boolean;
  };
  policies?: {
    freeCancellation?: boolean;
    noPrepayment?: boolean;
    priceMatch?: boolean;
    cancellationDeadline?: Date;
    cancellationPolicy?: string;
  };
  available?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

interface RoomCardProps {
  room: Room;
  onSelect?: (room: Room) => void;
  selected?: boolean;
}

export default function RoomCard({ room, onSelect, selected }: RoomCardProps) {
  const formatPrice = (price: number, currency: string = "₪") => {
    return `${currency}${price.toLocaleString()}`;
  };

  const getRoomTypeColor = (roomType: string) => {
    const colors: Record<string, string> = {
      STANDARD: "bg-gray-100 text-gray-800",
      SUPERIOR: "bg-blue-100 text-blue-800",
      DELUXE: "bg-purple-100 text-purple-800",
      SUITE: "bg-gold-100 text-gold-800",
      FAMILY: "bg-green-100 text-green-800",
      BUSINESS: "bg-indigo-100 text-indigo-800",
      ACCESSIBLE: "bg-orange-100 text-orange-800",
      PREMIUM: "bg-pink-100 text-pink-800",
    };
    return colors[roomType] || "bg-gray-100 text-gray-800";
  };

  const getSpecialFeatures = () => {
    const features: string[] = [];
    if (room.specialFeatures) {
      Object.entries(room.specialFeatures).forEach(([key, value]) => {
        if (value) {
          const featureName = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
          features.push(featureName);
        }
      });
    }
    return features.slice(0, 6); // Show only first 6 features
  };

  return (
    <div
      className={`border rounded-lg p-6 cursor-pointer transition-all duration-200 ${
        selected
          ? "border-blue-500 bg-blue-50 shadow-lg"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
      onClick={() => onSelect?.(room)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getRoomTypeColor(
                room.roomType
              )}`}
            >
              {room.roomType}
            </span>
          </div>

          <div className="text-sm text-gray-600 mb-2">
            <span className="font-medium">{room.roomCategory}</span>
            {room.sizeSqm && <span className="ml-2">• {room.sizeSqm}m²</span>}
            {room.bedrooms > 1 && (
              <span className="ml-2">• {room.bedrooms} bedrooms</span>
            )}
            {room.bathrooms > 1 && (
              <span className="ml-2">• {room.bathrooms} bathrooms</span>
            )}
          </div>

          <div className="text-sm text-gray-600 mb-3">
            <span>Sleeps {room.capacity} • </span>
            <span>{room.maxAdults} adults</span>
            {room.maxChildren > 0 && <span>, {room.maxChildren} children</span>}
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(room.pricePerNight, room.pricing?.currency)}
          </div>
          <div className="text-sm text-gray-600">per night</div>
        </div>
      </div>

      {room.features && room.features.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {room.features.slice(0, 4).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {feature}
              </span>
            ))}
            {room.features.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                +{room.features.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {getSpecialFeatures().length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {getSpecialFeatures().map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {room.pricing && (
        <div className="mb-4 text-sm text-gray-600">
          {room.pricing.includesBreakfast && (
            <div className="flex items-center space-x-1">
              <span className="text-green-600">✓</span>
              <span>Breakfast included</span>
            </div>
          )}
          {room.pricing.freeCancellation && (
            <div className="flex items-center space-x-1">
              <span className="text-green-600">✓</span>
              <span>Free cancellation</span>
            </div>
          )}
          {room.pricing.noPrepayment && (
            <div className="flex items-center space-x-1">
              <span className="text-green-600">✓</span>
              <span>No prepayment required</span>
            </div>
          )}
        </div>
      )}

      {/* Availability */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {room.roomsLeft > 0 ? (
            <span className="text-green-600 font-medium">
              {room.roomsLeft} rooms left
            </span>
          ) : (
            <span className="text-red-600 font-medium">Sold out</span>
          )}
        </div>

        {onSelect && (
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selected
                ? "bg-blue-600 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(room);
            }}
          >
            {selected ? "Selected" : "Select Room"}
          </button>
        )}
      </div>
    </div>
  );
}
