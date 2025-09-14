export interface FAQItem {
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    question: "What is Rewards & Wallet?",
    answer:
      "Rewards & Wallet is a feature that allows you to manage your rewards points and wallet balance in one place.",
  },
  {
    question: "How can I add funds to my wallet?",
    answer:
      "You can add funds to your wallet by linking a payment method and transferring money from your bank account.",
  },
  // Add more FAQ items as needed
];

export interface CardInput {
  cardNumber: string;
  cardHolderName: string;
  expirationDate: string;
  cvv: string;
}
