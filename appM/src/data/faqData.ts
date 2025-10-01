// FAQ data for the Help Center and Direct Help Center modals
// Used in SearchScreen and related components

export const faqData: {
  [key: string]: { question: string; answer: string }[];
} = {
  Stays: [
    {
      question: "Cancellations",
      answer: "You can cancel anytime before check-in.",
    },
    { question: "Payment", answer: "Payments are secured and encrypted." },
    {
      question: "Booking Details",
      answer: "You can view your bookings in the app.",
    },
    {
      question: "Communications",
      answer: "Communicate with hosts through the app.",
    },
    { question: "Room Types", answer: "Different room types available." },
    {
      question: "Pricing",
      answer: "Prices depend on season and availability.",
    },
  ],
  Flights: [
    {
      question: "Baggage and seats",
      answer: "Check baggage policies before travel.",
    },
    {
      question: "Boarding pass and check-in",
      answer: "You can check in online.",
    },
    {
      question: "Booking a flight",
      answer: "Flights can be booked on the website.",
    },
    {
      question: "Changes and cancellation",
      answer: "Changes depend on airline policy.",
    },
    {
      question: "Flight confirmation",
      answer: "Confirmation sent to your email.",
    },
    {
      question: "My flight booking",
      answer: "Manage your bookings in the app.",
    },
  ],
  "Car rentals": [
    {
      question: "Most popular",
      answer: "Check our most popular car rentals.",
    },
    {
      question: "Driver requirements and responsibilities",
      answer: "Drivers must meet age requirements.",
    },
    {
      question: "Fuel, mileage, and travel plans",
      answer: "Fuel policies vary by rental company.",
    },
    {
      question: "Insurance and protection",
      answer: "Insurance options are available.",
    },
    { question: "Extras", answer: "Additional options can be selected." },
    {
      question: "Payment, fees, and confirmation",
      answer: "Payments are processed securely.",
    },
  ],
  Attractions: [
    {
      question: "Cancellations",
      answer: "Cancellations allowed as per policy.",
    },
    { question: "Payment", answer: "Payment is required at booking." },
    {
      question: "Modifications and changes",
      answer: "Changes may be allowed with fees.",
    },
    {
      question: "Booking details and information",
      answer: "Booking info is in your account.",
    },
    {
      question: "Pricing",
      answer: "Pricing depends on attraction and date.",
    },
    {
      question: "Tickets and check-in",
      answer: "Tickets are digital in most cases.",
    },
  ],
  "Airport taxis": [
    {
      question: "Manage booking",
      answer: "Bookings can be managed in your profile.",
    },
    { question: "Journey", answer: "Track your taxi journey in the app." },
    { question: "Payment info", answer: "Payment info is secured." },
    {
      question: "Accessibility and extras",
      answer: "Accessible options available.",
    },
    { question: "Pricing", answer: "Prices depend on distance and type." },
  ],
  Insurance: [
    {
      question:
        "Room Cancellation Insurance - Claims (excludes U.S. residents)",
      answer: "Claims are processed according to policy.",
    },
    {
      question:
        "Room Cancellation Insurance - Coverage (excludes U.S. residents)",
      answer: "Coverage details are listed in the policy.",
    },
    {
      question:
        "Room Cancellation Insurance - Policy terms (excludes U.S. residents)",
      answer: "Terms must be read carefully.",
    },
    {
      question:
        "Room Cancellation Insurance - General (excludes U.S. residents)",
      answer: "General info available in policy documents.",
    },
  ],
  Other: [
    {
      question: "How can I contact Booking.com?",
      answer: "You can contact through the Help Center.",
    },
    {
      question:
        "Can I get support in my language for accommodation bookings in the EEA?",
      answer: "Yes, multiple languages are supported.",
    },
    {
      question:
        "Can I get customer support in my language for flight bookings in the European Economic Area?",
      answer: "Yes, support is available in several languages.",
    },
    {
      question:
        "Can I get customer support in my language for car rental bookings in the European Economic Area?",
      answer: "Yes, support is available in your language.",
    },
  ],
};
