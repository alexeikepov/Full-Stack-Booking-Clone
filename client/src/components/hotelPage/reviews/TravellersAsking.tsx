import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHotelById } from "@/lib/api";

interface TravellersAskingProps {
  hotelId?: string;
}

export default function TravellersAsking({ hotelId }: TravellersAskingProps) {
  const { data: hotel } = useQuery({
    queryKey: ["hotel", hotelId, "travellers-asking"],
    queryFn: () => getHotelById(String(hotelId)),
    enabled: Boolean(hotelId),
    staleTime: 5 * 60 * 1000,
  });

  type QA = { question: string; answer?: string };
  const allQAs: QA[] = Array.isArray(hotel?.travellersQuestions)
    ? (hotel!.travellersQuestions as QA[])
    : [];

  const midIndex = Math.ceil(allQAs.length / 2);
  const leftColumnQAs = allQAs.slice(0, midIndex);
  const middleColumnQAs = allQAs.slice(midIndex);

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const [showQAmodal, setShowQAmodal] = useState(false);
  const [selectedQA, setSelectedQA] = useState<QA | null>(null);
  const toggleOpen = (key: string) =>
    setOpenMap((m) => ({ ...m, [key]: !m[key] }));

  const handleQuestionClick = (key: string, qa?: QA) => {
    if (qa) {
      setSelectedQA(qa);
      setShowQAmodal(true);
    } else {
      toggleOpen(key);
    }
  };

  const handleSeeAvailability = () => {
    // TODO: Navigate to booking or show availability
    console.log("See availability clicked");
  };

  const handleAskQuestion = () => {
    // TODO: Open question modal or form
    console.log("Ask question clicked");
  };

  const handleSeeOtherQuestions = () => {
    // TODO: Show more questions or navigate to full FAQ
    console.log("See other questions clicked");
  };

  return (
    <div id="travellers-asking" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Travellers are asking
          </h2>
          <button
            onClick={handleSeeAvailability}
            className="bg-[#003b95] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002d73] transition-colors"
          >
            See availability
          </button>
        </div>

        {/* FAQ Questions Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-0">
            {leftColumnQAs.map((qa, index) => (
              <div key={index}>
                <button
                  onClick={() => handleQuestionClick(`L-${index}`, qa)}
                  className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-900 font-medium group-hover:text-[#003b95] transition-colors">
                      {qa.question}
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-[#003b95] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                {openMap[`L-${index}`] && qa.answer && (
                  <div className="px-2 pb-4 text-sm text-gray-700">
                    {qa.answer}
                  </div>
                )}
                {index < leftColumnQAs.length - 1 && (
                  <hr className="border-gray-200" />
                )}
              </div>
            ))}
          </div>

          {/* Middle Column */}
          <div className="space-y-0">
            {middleColumnQAs.map((qa, index) => (
              <div key={index}>
                <button
                  onClick={() => handleQuestionClick(`M-${index}`, qa)}
                  className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-900 font-medium group-hover:text-[#003b95] transition-colors">
                      {qa.question}
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-[#003b95] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                {openMap[`M-${index}`] && qa.answer && (
                  <div className="px-2 pb-4 text-sm text-gray-700">
                    {qa.answer}
                  </div>
                )}
                {index < middleColumnQAs.length - 1 && (
                  <hr className="border-gray-200" />
                )}
              </div>
            ))}
          </div>

          {/* Right Column - Still looking section */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Still looking?
              </h3>
              <button
                onClick={handleAskQuestion}
                className="w-full border-2 border-[#003b95] text-[#003b95] px-4 py-3 rounded-lg font-semibold hover:bg-[#003b95] hover:text-white transition-colors mb-3"
              >
                Ask a question
              </button>
              <p className="text-sm text-gray-600">
                We have an instant answer to most questions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-8">
          <button
            onClick={handleSeeOtherQuestions}
            className="border-2 border-[#003b95] text-[#003b95] px-6 py-3 rounded-lg font-semibold hover:bg-[#003b95] hover:text-white transition-colors"
          >
            See other questions ({allQAs.length})
          </button>
        </div>
      </div>

      {/* Question/Answer Modal */}
      {showQAmodal && selectedQA && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  Your question
                </div>
                {hotel?.name && (
                  <div className="text-sm text-gray-600">
                    About: {hotel.name}
                  </div>
                )}
              </div>
              <button
                aria-label="Close"
                onClick={() => setShowQAmodal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[64vh] space-y-4">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-gray-600 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">
                    {selectedQA.question}
                  </div>
                  {selectedQA.answer ? (
                    <div className="mt-2 text-sm text-gray-700">
                      {selectedQA.answer}
                    </div>
                  ) : (
                    <div className="mt-2 text-sm text-gray-500">
                      No answer available yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="px-4 py-3 border-t bg-white">
              <button
                className="w-full bg-[#0071c2] text-white py-3 rounded-lg font-semibold hover:bg-[#005fa3] transition-colors"
                onClick={() => {
                  // Placeholder: integrate send-to-property when backend endpoint is available
                  setShowQAmodal(false);
                }}
              >
                Send your question to the property
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
