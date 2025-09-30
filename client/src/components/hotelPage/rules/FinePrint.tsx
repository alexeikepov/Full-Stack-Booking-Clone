import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface FinePrintProps {
  hotelName?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function FinePrint({
  hotelName = "Villa Albi - Machne Yehuda Hotel",
}: FinePrintProps) {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleSeeAvailability = () => {
    const sp = new URLSearchParams();
    const from = params.get("from");
    const to = params.get("to");
    const adults = params.get("adults");
    const children = params.get("children");
    const rooms = params.get("rooms");
    if (from) sp.set("from", from);
    if (to) sp.set("to", to);
    if (adults) sp.set("adults", adults);
    if (children) sp.set("children", children);
    if (rooms) sp.set("rooms", rooms);
    const qs = sp.toString();
    const target = document.getElementById("info");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(`?${qs}`);
    }
  };

  const faqs: FAQ[] = [
    {
      question: `What type of room can I book at ${hotelName}?`,
      answer: `Room options at ${hotelName} include: • Suite • Double`,
    },
    {
      question: `How much does it cost to stay at ${hotelName}?`,
      answer: `The prices at ${hotelName} may vary depending on your stay (e.g. dates you select, hotel's policy etc.). See the prices by entering your dates.`,
    },
    {
      question: `What are the check-in and check-out times at ${hotelName}?`,
      answer: `Check-in at ${hotelName} is from 15:00, and check-out is until 11:00.`,
    },
    {
      question: `How far is ${hotelName} from the centre of the city?`,
      answer: `${hotelName} is 1.1 km from the centre of the city.`,
    },
  ];

  return (
    <div id="fine-print" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* The fine print section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                The fine print
              </h2>
              <p className="text-gray-600">
                Need-to-know information for guests at this property
              </p>
            </div>
            <button
              onClick={handleSeeAvailability}
              className="bg-[#003b95] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002d73] transition-colors"
            >
              See availability
            </button>
          </div>

          <div className="border border-gray-300 rounded-lg p-6 space-y-4 text-gray-700">
            <p className="text-sm">
              Based on local tax laws, guests with a tourist visa to Israel are
              exempted from paying VAT for their reservation. Israeli citizens
              and residents ("non tourists" as defined in the VAT law) must pay
              VAT. This tax is automatically calculated in the total cost of the
              reservation for domestic customers. For guests booking from
              outside of Israel, the tax is <em>not</em> included in the total
              price.
            </p>

            <p className="text-sm">
              Breakfast is served in the Café next to the hotel.
            </p>

            <p className="text-sm">
              Guests are required to show a photo identification and credit card
              upon check-in. Please note that all Special Requests are subject
              to availability and additional charges may apply.
            </p>

            <p className="text-sm">
              Please inform {hotelName} in advance of your expected arrival
              time. You can use the Special Requests box when booking, or
              contact the property directly with the contact details provided in
              your confirmation.
            </p>

            <p className="text-sm">
              This property will not accommodate hen, stag or similar parties.
            </p>
          </div>
        </div>

        {/* FAQs section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            FAQs about {hotelName}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  {expandedFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>

                {expandedFAQ === index && (
                  <div className="px-6 pb-4 border-t border-gray-200">
                    <p className="text-gray-700 text-sm leading-relaxed pt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
