import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ThemeColors = {
  text: string;
  textSecondary: string;
  background: string;
  card: string;
  button: string;
  accent?: string;
  tint?: string;
  icon?: string;
  tabIconDefault?: string;
  tabIconSelected?: string;
  inputBackground?: string;
  gray?: string;
  blue?: string;
  [key: string]: string | undefined;
};

type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
  colors: ThemeColors;
  selectedDates?: { checkIn: Date | null; checkOut: Date | null };
  setSelectedDates?: (dates: {
    checkIn: Date | null;
    checkOut: Date | null;
  }) => void;
};

const DatesModal = ({
  isVisible,
  onClose,
  colors,
  selectedDates,
  setSelectedDates,
}: ModalProps) => {
  const [activeTab, setActiveTab] = useState<"calendar" | "flexible">(
    "calendar",
  );
  const [checkInDate, setCheckInDate] = useState<Date | null>(
    selectedDates?.checkIn || null,
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(
    selectedDates?.checkOut || null,
  );
  const [flexibleDuration, setFlexibleDuration] = useState<
    "weekend" | "week" | "month" | "other"
  >("weekend");
  const [flexibleMonth, setFlexibleMonth] = useState<string>("Oct");

  const styles = StyleSheet.create({
    modalContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.background,
      zIndex: 10,
      paddingTop: 50,
    },
    closeButton: {
      padding: 15,
      color: colors.text,
    },
    datesHeader: {
      alignItems: "center",
      paddingVertical: 15,
    },
    datesHeaderText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
    },
    tabContainer: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
      marginHorizontal: 15,
    },
    tab: {
      flex: 1,
      paddingVertical: 15,
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    activeTab: {
      borderBottomColor: colors.button,
    },
    tabText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    activeTabText: {
      color: colors.button,
      fontWeight: "bold",
    },
    monthHeader: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "bold",
      marginVertical: 15,
    },
    calendarGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    calendarDayHeader: {
      width: "14%",
      textAlign: "center",
      color: colors.textSecondary,
      marginBottom: 10,
      fontSize: 14,
      fontWeight: "600",
    },
    calendarDay: {
      width: "14%",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
      minHeight: 40,
      borderRadius: 20,
    },
    calendarDayText: {
      color: colors.text,
      fontSize: 16,
    },
    selectedDay: {
      backgroundColor: colors.button,
    },
    selectedDayText: {
      color: colors.background,
      fontWeight: "bold",
    },
    rangeDay: {
      backgroundColor: `${colors.button}20`,
    },
    rangeDayText: {
      color: colors.button,
    },
    selectedDatesInfo: {
      backgroundColor: colors.card,
      padding: 15,
      marginHorizontal: 15,
      marginBottom: 15,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.button,
    },
    selectedDatesText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    flexibleSectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginTop: 25,
      marginBottom: 15,
    },
    flexibleSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 15,
    },
    durationRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 20,
    },
    durationButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: colors.separator,
      backgroundColor: colors.card,
    },
    durationButtonActive: {
      borderColor: colors.button,
      backgroundColor: colors.button,
    },
    durationButtonText: {
      color: colors.text,
      fontSize: 16,
    },
    durationButtonTextActive: {
      color: colors.background,
      fontWeight: "bold",
    },
    monthsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 15,
      marginBottom: 30,
    },
    monthButton: {
      flex: 1,
      minWidth: "22%",
      aspectRatio: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.separator,
      alignItems: "center",
      justifyContent: "center",
      padding: 15,
    },
    monthButtonActive: {
      borderColor: colors.button,
      backgroundColor: colors.button,
    },
    monthButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "bold",
      marginTop: 5,
    },
    monthButtonTextActive: {
      color: colors.background,
    },
    monthButtonYear: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 2,
    },
    flexibleResult: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 12,
      alignItems: "center",
      marginBottom: 30,
    },
    flexibleResultText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
    },
    applyButton: {
      backgroundColor: colors.button,
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      margin: 15,
    },
    applyButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: "bold",
    },
    secondaryText: {
      color: colors.textSecondary,
    },
  });

  const generateCalendarMonths = () => {
    const months = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
        1,
      );
      const monthName = monthDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      const daysInMonth = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0,
      ).getDate();
      const firstDayOfMonth = monthDate.getDay();

      months.push({
        name: monthName,
        year: monthDate.getFullYear(),
        month: monthDate.getMonth(),
        daysInMonth,
        firstDayOfMonth,
      });
    }
    return months;
  };

  const months = generateCalendarMonths();

  const handleDatePress = (year: number, month: number, day: number) => {
    const selectedDate = new Date(year, month, day);

    if (!checkInDate || (checkInDate && checkOutDate)) {
      // Start new selection
      setCheckInDate(selectedDate);
      setCheckOutDate(null);
    } else if (checkInDate && !checkOutDate) {
      // Set check-out date
      if (selectedDate > checkInDate) {
        setCheckOutDate(selectedDate);
      } else {
        // If selected date is before check-in, make it new check-in
        setCheckInDate(selectedDate);
        setCheckOutDate(null);
      }
    }
  };

  const isDateInRange = (year: number, month: number, day: number) => {
    if (!checkInDate || !checkOutDate) return false;
    const date = new Date(year, month, day);
    return date >= checkInDate && date <= checkOutDate;
  };

  const isDateSelected = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    return (
      (checkInDate && date.getTime() === checkInDate.getTime()) ||
      (checkOutDate && date.getTime() === checkOutDate.getTime())
    );
  };

  const handleApply = () => {
    if (
      activeTab === "calendar" &&
      checkInDate &&
      checkOutDate &&
      setSelectedDates
    ) {
      setSelectedDates({ checkIn: checkInDate, checkOut: checkOutDate });
    } else if (activeTab === "flexible" && setSelectedDates) {
      // For flexible dates, we'll set some example dates
      const startDate = new Date(2025, 9, 1); // October 1st
      const endDate = new Date(2025, 9, 7); // October 7th
      setSelectedDates({ checkIn: startDate, checkOut: endDate });
    }
    onClose();
  };

  const renderCalendarView = () => (
    <ScrollView style={{ flex: 1, paddingHorizontal: 15 }}>
      {months.map((monthData, monthIndex) => (
        <View key={monthIndex} style={{ marginBottom: 30 }}>
          <Text style={styles.monthHeader}>{monthData.name}</Text>
          <View style={styles.calendarGrid}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <Text key={day} style={styles.calendarDayHeader}>
                {day}
              </Text>
            ))}
            {/* Empty cells for days before the first day of the month */}
            {Array.from({ length: monthData.firstDayOfMonth }, (_, index) => (
              <View key={`empty-${index}`} style={styles.calendarDay} />
            ))}
            {/* Days of the month */}
            {Array.from({ length: monthData.daysInMonth }, (_, index) => {
              const day = index + 1;
              const isSelected = isDateSelected(
                monthData.year,
                monthData.month,
                day,
              );
              const inRange = isDateInRange(
                monthData.year,
                monthData.month,
                day,
              );

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.calendarDay,
                    isSelected && styles.selectedDay,
                    inRange && !isSelected && styles.rangeDay,
                  ]}
                  onPress={() =>
                    handleDatePress(monthData.year, monthData.month, day)
                  }
                >
                  <Text
                    style={[
                      styles.calendarDayText,
                      isSelected && styles.selectedDayText,
                      inRange && !isSelected && styles.rangeDayText,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderFlexibleView = () => (
    <ScrollView style={{ flex: 1, paddingHorizontal: 15 }}>
      <Text style={styles.flexibleSectionTitle}>
        How long do you want to stay?
      </Text>
      <View style={styles.durationRow}>
        {[
          { key: "weekend", label: "Weekend" },
          { key: "week", label: "Week" },
          { key: "month", label: "Month" },
          { key: "other", label: "Other" },
        ].map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.durationButton,
              flexibleDuration === option.key && styles.durationButtonActive,
            ]}
            onPress={() => setFlexibleDuration(option.key as any)}
          >
            <Text
              style={[
                styles.durationButtonText,
                flexibleDuration === option.key &&
                  styles.durationButtonTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.flexibleSectionTitle}>When do you want to go?</Text>
      <Text style={styles.flexibleSubtitle}>Select up to 3 months</Text>

      <View style={styles.monthsRow}>
        {["Sep", "Oct", "Nov", "Dec"].map((month) => (
          <TouchableOpacity
            key={month}
            style={[
              styles.monthButton,
              flexibleMonth === month && styles.monthButtonActive,
            ]}
            onPress={() => setFlexibleMonth(month)}
          >
            <AntDesign
              name="calendar"
              size={24}
              color={
                flexibleMonth === month
                  ? styles.monthButtonTextActive.color
                  : styles.monthButtonText.color
              }
            />
            <Text
              style={[
                styles.monthButtonText,
                flexibleMonth === month && styles.monthButtonTextActive,
              ]}
            >
              {month}
            </Text>
            <Text
              style={[
                styles.monthButtonYear,
                flexibleMonth === month && styles.monthButtonTextActive,
              ]}
            >
              2025
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.flexibleResult}>
        <Text style={styles.flexibleResultText}>
          {flexibleDuration.charAt(0).toUpperCase() + flexibleDuration.slice(1)}{" "}
          in {flexibleMonth}
        </Text>
      </View>
    </ScrollView>
  );

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <AntDesign
            name="arrow-left"
            size={24}
            color={styles.secondaryText.color}
          />
        </TouchableOpacity>

        <View style={styles.datesHeader}>
          <Text style={styles.datesHeaderText}>Select dates</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "calendar" && styles.activeTab]}
            onPress={() => setActiveTab("calendar")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "calendar" && styles.activeTabText,
              ]}
            >
              Calendar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "flexible" && styles.activeTab]}
            onPress={() => setActiveTab("flexible")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "flexible" && styles.activeTabText,
              ]}
            >
              I am flexible
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "calendar" ? renderCalendarView() : renderFlexibleView()}

        {checkInDate && checkOutDate && activeTab === "calendar" && (
          <View style={styles.selectedDatesInfo}>
            <Text style={styles.selectedDatesText}>
              {checkInDate.toDateString()} - {checkOutDate.toDateString()}
            </Text>
          </View>
        )}

        <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Select dates</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default DatesModal;
