import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  LogIn,
  LogOut,
  Info,
  Baby,
  UserX,
  PawPrint,
  CreditCard,
  PartyPopper,
} from "lucide-react";
import { MdCrib } from "react-icons/md";

import type { Hotel } from "@/types/hotel";

interface HouseRulesProps {
  hotel: Hotel;
}

export default function HouseRules({ hotel }: HouseRulesProps) {
  const navigate = useNavigate();
  const [params] = useSearchParams();

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

  if (!hotel) {
    return null;
  }

  const defaultRules = {
    checkIn: {
      time: "15:00",
      note: "Guests are required to show a photo identification and credit card upon check-in",
      advanceNotice:
        "You'll need to let the property know in advance what time you'll arrive.",
    },
    checkOut: {
      time: "11:00",
    },
    cancellation: {
      policy:
        "Cancellation and prepayment policies vary according to accommodation type.",
      conditions:
        "Please check what conditions may apply to each option when making your selection.",
    },
    children: {
      welcome: "Children of any age are welcome.",
      searchNote:
        "To see correct prices and occupancy information, please add the number of children in your group and their ages to your search.",
      cotPolicy: {
        ageRange: "0 - 2 years",
        cotPrice: "₪70 per child, per night",
        note: "Cot upon request",
        additionalInfo:
          "Prices for cots are not included in the total price, and will have to be paid for separately during your stay.",
        availability:
          "The number of cots allowed is dependent on the option you choose. Please check your selected option for more information.",
        noExtraBeds: "There are no extra beds available at this property.",
        subjectToAvailability: "All cots are subject to availability.",
      },
    },
    ageRestriction: {
      hasRestriction: false,
      minimumAge: null,
      note: "There is no age requirement for check-in",
    },
    pets: {
      allowed: false,
      note: "Pets are not allowed.",
    },
    paymentMethods: {
      methods: [
        "American Express",
        "Visa",
        "MasterCard",
        "JCB",
        "Maestro",
        "Discover",
        "UnionPay",
        "Cash",
      ],
    },
    parties: {
      allowed: false,
      note: "Parties/events are not allowed",
    },
  };

  const rules = hotel?.houseRules || defaultRules;

  return (
    <div id="house-rules" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">House rules</h2>
            <p className="text-sm text-gray-600">
              {hotel?.name || "This property"} takes special requests - add in the next step!
            </p>
          </div>
          <button
            onClick={handleSeeAvailability}
            className="bg-[#003b95] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002d73] transition-colors"
          >
            See availability
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="flex items-start gap-4 p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 w-48 flex-shrink-0">
              <LogIn className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Check-in</h3>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">
                From {rules.checkIn?.time || "15:00"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                {rules.checkIn?.note ||
                  "Guests are required to show a photo identification and credit card upon check-in"}
              </p>
              <p className="text-sm text-gray-600">
                {rules.checkIn?.advanceNotice ||
                  "You'll need to let the property know in advance what time you'll arrive."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 w-48 flex-shrink-0">
              <LogOut className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Check-out</h3>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                Until {rules.checkOut?.time || "11:00"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 w-48 flex-shrink-0">
              <Info className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">
                Cancellation/ prepayment
              </h3>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">
                {rules.cancellation?.policy ||
                  "Cancellation and prepayment policies vary according to accommodation type."}
              </p>
              <p className="text-sm text-gray-600">
                Please check what{" "}
                <span className="text-[#003b95] underline">conditions</span> may
                apply to each option when making your selection.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 w-48 flex-shrink-0">
              <Baby className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Children and beds</h3>
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Child policies
                </h4>
                <p className="text-sm text-gray-600 mb-1">
                  {rules.children?.welcome ||
                    "Children of any age are welcome."}
                </p>
                <p className="text-sm text-gray-600">
                  {rules.children?.searchNote ||
                    "To see correct prices and occupancy information, please add the number of children in your group and their ages to your search."}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Cot and extra bed policies
                </h4>
                <div className="border border-gray-300 rounded-lg p-3 mb-3 bg-gray-100 max-w-md">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    {rules.children?.cotPolicy?.ageRange || "0 - 2 years"}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MdCrib className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">
                        {rules.children?.cotPolicy?.note || "Cot upon request"}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {rules.children?.cotPolicy?.cotPrice ||
                        "₪70 per child, per night"}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    {rules.children?.cotPolicy?.additionalInfo ||
                      "Prices for cots are not included in the total price, and will have to be paid for separately during your stay."}
                  </p>
                  <p className="text-sm text-gray-600">
                    {rules.children?.cotPolicy?.availability ||
                      "The number of cots allowed is dependent on the option you choose. Please check your selected option for more information."}
                  </p>
                  <p className="text-sm text-gray-600">
                    {rules.children?.cotPolicy?.noExtraBeds ||
                      "There are no extra beds available at this property."}
                  </p>
                  <p className="text-sm text-gray-600">
                    {rules.children?.cotPolicy?.subjectToAvailability ||
                      "All cots are subject to availability."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 w-48 flex-shrink-0">
              <UserX className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">
                {rules.ageRestriction?.hasRestriction
                  ? `Age restriction (${rules.ageRestriction?.minimumAge}+)`
                  : "No age restriction"}
              </h3>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                {rules.ageRestriction?.note ||
                  "There is no age requirement for check-in"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 w-48 flex-shrink-0">
              <PawPrint className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Pets</h3>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                {rules.pets?.note || "Pets are not allowed."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 w-48 flex-shrink-0">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">
                Accepted payment methods
              </h3>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2">
                {(
                  rules.paymentMethods?.methods || [
                    "American Express",
                    "Visa",
                    "MasterCard",
                    "JCB",
                    "Maestro",
                    "Discover",
                    "UnionPay",
                    "Cash",
                  ]
                ).map((method: string, index: number) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded text-sm text-gray-700"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4">
            <div className="flex items-center gap-2 w-48 flex-shrink-0">
              <PartyPopper className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Parties</h3>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                {rules.parties?.note || "Parties/events are not allowed"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
