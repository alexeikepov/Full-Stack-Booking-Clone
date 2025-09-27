import { useCallback } from "react";
import type { Hotel } from "@/types/hotel";

interface ImageViewerProps {
  isOpen: boolean;
  currentIndex: number;
  images: string[];
  hotel: Hotel;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ImageViewer({
  isOpen,
  currentIndex,
  images,
  hotel,
  onClose,
  onNext,
  onPrev,
}: ImageViewerProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    },
    [onClose, onNext, onPrev]
  );

  if (typeof window !== "undefined" && isOpen) {
    window.onkeydown = handleKeyDown;
  } else if (typeof window !== "undefined") {
    window.onkeydown = null;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-4 text-white/90 hover:text-white text-3xl leading-none"
      >
        ×
      </button>
      <button
        aria-label="Previous"
        onClick={onPrev}
        className="absolute left-4 md:left-8 text-white/90 hover:text-white text-3xl"
      >
        ‹
      </button>
      <img
        src={images[currentIndex]}
        alt={`${hotel.name} photo ${currentIndex + 1}`}
        className="max-h-[80vh] max-w-[90vw] object-contain select-none"
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          if (target.src !== "/placeholder-hotel.svg") {
            target.src = "/placeholder-hotel.svg";
          }
        }}
      />
      <button
        aria-label="Next"
        onClick={onNext}
        className="absolute right-4 md:right-8 text-white/90 hover:text-white text-3xl"
      >
        ›
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
