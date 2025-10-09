export interface FAQItem {
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    question: "What's the Wallet?",
    answer:
      "Your Wallet is a digital space where all your Booking.com rewards, credits, and vouchers are stored and managed for easy use.",
  },
  {
    question: "How does Rewards & Wallet help me?",
    answer:
      "It helps you keep track of your rewards, spend them easily, and get the most out of your bookings.",
  },
  {
    question: "What's the difference between the 4e and Rewards & Wallet?",
    answer:
      "Genius is a loyalty program with exclusive discounts, while Rewards & Wallet is where you manage and spend your earned credits and vouchers.",
  },
  {
    question:
      "In which countries will I be able to enjoy the benefits of Rewards & Wallet?",
    answer:
      "Rewards & Wallet is available in most countries, but availability may vary. Check Booking.com for the latest info.",
  },
  {
    question: "Can I change the currency that my Wallet is based in?",
    answer:
      "No, the Wallet currency is set based on your account and cannot be changed manually.",
  },
  {
    question: "How do I earn Credits or vouchers?",
    answer:
      "You earn credits or vouchers by booking eligible stays, activities, or using special promotions.",
  },
  {
    question: "What's the difference between Travel Credits and Cash Credits?",
    answer:
      "Travel Credits can be used for future bookings, while Cash Credits may be withdrawn or used more flexibly, depending on the offer.",
  },
  {
    question: "How do I use my Credits or vouchers?",
    answer:
      "You can apply your credits or vouchers during the checkout process when making a booking.",
  },
  {
    question: "Do my Credits or vouchers expire?",
    answer:
      "Yes, credits and vouchers typically have an expiration date. Check your Wallet for specific details.",
  },
  {
    question: "Can I combine multiple Credits or vouchers in one booking?",
    answer:
      "Usually, you can only use one credit or voucher per booking. Check the terms for each credit or voucher for specifics.",
  },
];

export interface CardInput {
  cardNumber: string;
  cardHolderName: string;
  expirationDate: string;
  cvv: string;
}
