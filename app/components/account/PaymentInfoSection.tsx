import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";
import AccountSection from "./AccountSection";
import AccountItem from "./AccountItem";
import { itemIcons } from "../../app/screens/Account";

export default function PaymentInfoSection() {
  const items = ["Rewards & Wallet", "Payment methods"];

  return (
    <AccountSection title="Payment info">
      {items.map((title) => (
        <AccountItem
          key={title}
          icon={
            <Ionicons
              name={itemIcons[title]}
              size={20}
              color={Colors.dark.icon}
            />
          }
          title={title}
        />
      ))}
    </AccountSection>
  );
}
