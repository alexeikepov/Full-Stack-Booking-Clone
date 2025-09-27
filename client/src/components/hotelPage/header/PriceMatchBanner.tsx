import { useState } from "react";
import PriceMatchModal from "@/components/ui/PriceMatchModal";

export default function PriceMatchBanner() {
  const [isPriceMatchModalOpen, setIsPriceMatchModalOpen] = useState(false);

  const handlePriceMatchClick = () => {
    setIsPriceMatchModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-2 text-blue-600">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        <span
          onClick={handlePriceMatchClick}
          className="text-sm font-medium hover:bg-blue-50 rounded px-2 py-1 cursor-pointer transition-colors"
        >
          We Price Match
        </span>
      </div>

      {/* Price Match Modal */}
      <PriceMatchModal
        isOpen={isPriceMatchModalOpen}
        onClose={() => setIsPriceMatchModalOpen(false)}
      />
    </>
  );
}
