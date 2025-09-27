import type { Hotel } from "@/types/hotel";

interface ImageGridProps {
  hotel: Hotel;
  mainImage: string;
  sideImages: string[];
  thumbnailImages: string[];
  hasRealImages: boolean;
  onImageClick: (index: number) => void;
}

export default function ImageGrid({
  hotel,
  mainImage,
  sideImages,
  thumbnailImages,
  hasRealImages,
  onImageClick,
}: ImageGridProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget as HTMLImageElement;
    if (target.src !== "/placeholder-hotel.svg") {
      target.src = "/placeholder-hotel.svg";
    }
  };

  return (
    <div className="space-y-2 md:space-y-3">
      {hasRealImages ? (
        <div className="grid grid-cols-3 grid-rows-2 gap-1 h-80 bg-white p-1 rounded-lg overflow-hidden">
          <div className="col-span-2 row-span-2 overflow-hidden rounded-l-lg">
            <img
              src={mainImage}
              alt={hotel.name}
              className="block w-full h-full object-cover object-center cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => onImageClick(0)}
              onError={handleImageError}
            />
          </div>

          {sideImages.length > 0 && (
            <div className="col-span-1 row-span-2 grid grid-rows-2 gap-1">
              <div className="row-span-1 overflow-hidden rounded-tr-lg">
                <img
                  src={sideImages[0]}
                  alt={`${hotel.name} photo 2`}
                  className="block w-full h-full object-cover object-center cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => onImageClick(1)}
                  onError={handleImageError}
                />
              </div>

              {sideImages.length > 1 && (
                <div className="row-span-1 overflow-hidden rounded-br-lg">
                  <img
                    src={sideImages[1]}
                    alt={`${hotel.name} photo 3`}
                    className="block w-full h-full object-cover object-center cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => onImageClick(2)}
                    onError={handleImageError}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="h-80 bg-white p-1 rounded-lg overflow-hidden">
          <img
            src="/placeholder-hotel.svg"
            alt={hotel.name}
            className="block w-full h-full object-cover object-center"
          />
        </div>
      )}

      {hasRealImages && thumbnailImages.length > 0 && (
        <div className="grid grid-cols-5 gap-1 h-20 bg-white p-1 rounded-lg -mt-1.5 md:-mt-4">
          {[0, 1, 2, 3, 4].map((index) => {
            const hasImage = index < thumbnailImages.length;

            return (
              <div key={index} className="relative overflow-hidden rounded">
                {hasImage ? (
                  <img
                    src={thumbnailImages[index]}
                    alt={`${hotel.name} photo ${index + 4}`}
                    className="block w-full h-full object-cover object-center cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => onImageClick(index + 3)}
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100"></div>
                )}
                {index === 4 && thumbnailImages.length > 5 && (
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity rounded"
                    onClick={() => onImageClick(5)}
                  >
                    <div className="text-white text-center bg-black bg-opacity-30 px-2 py-1 rounded">
                      <div className="text-sm font-bold underline">
                        +{Math.max(0, thumbnailImages.length - 5)} photos
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
