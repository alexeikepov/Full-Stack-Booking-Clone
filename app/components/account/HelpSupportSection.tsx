import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";
import AccountSection from "./AccountSection";
import AccountItem from "./AccountItem";
import { itemIcons } from "../../app/screens/account";

export default function HelpSupportSection() {
  const items = [
    "Contact Customer Service",
    "Safety resource center",
    "Dispute resolution",
  ];

  return (
    <AccountSection title="Help and support">
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
