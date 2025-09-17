import React from "react";

interface TravellersAskingProps {
  hotelId?: string;
}

export default function TravellersAsking({ hotelId }: TravellersAskingProps) {
  const leftColumnQuestions = [
    "Do they serve breakfast?",
    "Is there a swimming pool?",
    "Is there a spa?",
    "Is there an airport shuttle service?",
    "Is there a restaurant?",
  ];

  const middleColumnQuestions = [
    "Can I park there?",
    "What are the check-in and check-out times?",
    "What restaurants, attractions, and public transport options are nearby?",
    "Are there rooms with a private bathroom?",
    "Are there rooms with a hot tub?",
  ];

  const handleQuestionClick = (question: string) => {
    // TODO: Implement question expansion or navigation
    console.log("Question clicked:", question);
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
            {leftColumnQuestions.map((question, index) => (
              <div key={index}>
                <button
                  onClick={() => handleQuestionClick(question)}
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
                      {question}
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
                {index < leftColumnQuestions.length - 1 && (
                  <hr className="border-gray-200" />
                )}
              </div>
            ))}
          </div>

          {/* Middle Column */}
          <div className="space-y-0">
            {middleColumnQuestions.map((question, index) => (
              <div key={index}>
                <button
                  onClick={() => handleQuestionClick(question)}
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
                      {question}
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
                {index < middleColumnQuestions.length - 1 && (
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
            See other questions (20)
          </button>
        </div>
      </div>
    </div>
  );
}
