import React, { JSX, useState } from "react";
import { Linking, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AccountItem from "./AccountItem";
import AccountSection from "./AccountSection";
import { UnifiedHelpCenterModal } from "../../../../components/shared";
import { useTheme } from "../../../../hooks/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface HelpSupportSectionProps {
  onBack?: () => void;
}

export default function HelpSupportSection({
  onBack,
}: HelpSupportSectionProps): JSX.Element {
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [showModal, setShowModal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Stays");
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(
    null,
  );

  const handleItemPress = (title: string) => {
    if (title === "Safety resource center") {
      Linking.openURL(
        "https://www.booking.com/trust-and-safety/travellers.en-us.html?utm_source=hamb_menu&utm_medium=iOS_app",
      );
    } else {
      setShowModal(title);
    }
  };

  // Create dynamic items with theme-aware colors
  const dynamicItems = [
    {
      title: "Contact Customer Service",
      icon: (
        <Ionicons name="help-circle-outline" size={20} color={colors.icon} />
      ),
    },
    {
      title: "Dispute resolution",
      icon: <Ionicons name="help-buoy-outline" size={20} color={colors.icon} />,
    },
    {
      title: "Safety resource center",
      icon: <Ionicons name="help-buoy-outline" size={20} color={colors.icon} />,
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <AccountSection title="Help center">
        {dynamicItems.map((item) => (
          <AccountItem
            key={item.title}
            icon={item.icon}
            title={item.title}
            onPress={() => handleItemPress(item.title)}
          />
        ))}
      </AccountSection>

      <UnifiedHelpCenterModal
        visible={!!showModal}
        onClose={() => {
          setShowModal(null);
          onBack?.();
        }}
        colors={colors}
        insets={insets}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openQuestionIndex={openQuestionIndex}
        setOpenQuestionIndex={setOpenQuestionIndex}
        title={
          showModal === "Contact Customer Service"
            ? "Help Center"
            : showModal === "Dispute resolution"
              ? "Dispute Resolution"
              : "Help Center"
        }
        theme={theme}
      />
    </View>
  );
}
