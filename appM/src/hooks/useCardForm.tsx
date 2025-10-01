import { useState } from "react";

export function useCardForm() {
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardErrors, setCardErrors] = useState<string[]>([]);
  const [cardSubmittedSuccess, setCardSubmittedSuccess] = useState(false);
  const [cardSubmitting, setCardSubmitting] = useState(false);

  const closePaymentModal = (
    setShowPaymentMethodModal: (v: boolean) => void,
  ) => {
    setShowPaymentMethodModal(false);
    setCardErrors([]);
  };

  const handleSubmitCard = async () => {
    setCardSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 2000));
      const errors: string[] = [];
      const cleanNumber = cardNumber.replace(/\s+/g, "").trim();
      if (!/^\d{13,19}$/.test(cleanNumber))
        errors.push("Enter a valid card number");
      const nameParts = cardName.trim().split(/\s+/);
      if (!cardName.trim() || nameParts.length < 2) {
        errors.push("Enter cardholder name with both first and last name");
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry))
        errors.push("Expiry must be MM/YY");
      if (!/^\d{3,4}$/.test(cardCvv)) errors.push("Enter a valid CVV");
      setCardErrors(errors);
      if (errors.length === 0) {
        setShowPaymentDetails(false);
        setCardSubmittedSuccess(true);
      }
    } finally {
      setCardSubmitting(false);
    }
  };

  return {
    showPaymentDetails,
    setShowPaymentDetails,
    cardNumber,
    setCardNumber,
    cardName,
    setCardName,
    cardExpiry,
    setCardExpiry,
    cardCvv,
    setCardCvv,
    cardErrors,
    setCardErrors,
    cardSubmittedSuccess,
    setCardSubmittedSuccess,
    cardSubmitting,
    setCardSubmitting,
    closePaymentModal,
    handleSubmitCard,
  };
}
