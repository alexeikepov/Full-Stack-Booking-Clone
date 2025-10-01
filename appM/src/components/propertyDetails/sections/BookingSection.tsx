import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const BookingSection = ({
  styles,
  colors,
  selectedDates,
  handleDateChange,
  selectedGuests,
  handleRoomGuestChange,
  property,
  parseAltDateRange,
  openBookingWithOptions,
}: any) => (
  <View style={styles.bookingSection}>
    <View style={styles.dateRow}>
      <View style={styles.dateColumn}>
        <Text style={styles.dateLabel}>Check-in</Text>
        <TouchableOpacity onPress={handleDateChange}>
          <Text style={styles.dateValue}>
            {selectedDates.checkIn
              ? selectedDates.checkIn.toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })
              : "Select date"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dateColumn}>
        <Text style={styles.dateLabel}>Check-out</Text>
        <TouchableOpacity onPress={handleDateChange}>
          <Text style={styles.dateValue}>
            {selectedDates.checkOut
              ? selectedDates.checkOut.toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })
              : "Select date"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={{ paddingLeft: 8, marginTop: 12, alignItems: "flex-start" }}>
      <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
        Guests & rooms
      </Text>
    </View>
    <TouchableOpacity
      style={styles.roomGuestInfo}
      onPress={handleRoomGuestChange}
    >
      <Text style={styles.roomGuestText}>
        {selectedGuests.rooms} room • {selectedGuests.adults} adults •{" "}
        {selectedGuests.children
          ? `${selectedGuests.children} children`
          : "No children"}
      </Text>
    </TouchableOpacity>
    {!property.isAvailable &&
      !selectedDates.checkIn &&
      !selectedDates.checkOut && (
        <View>
          <Text style={styles.noAvailabilityText}>
            No dates selected yet. Here are some options with availability:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.alternativesRow}>
              {property.alternatives?.map((alt: any, idx: number) => {
                const parsed = parseAltDateRange(alt.dateRange);
                const tryParsePrice = (p: any) => {
                  if (!p && p !== 0) return undefined;
                  if (typeof p === "number") return p;
                  if (typeof p === "string") {
                    const cleaned = p
                      .replace(/[^0-9.,]/g, "")
                      .replace(",", ".");
                    const n = Number(cleaned);
                    return isNaN(n) ? undefined : n;
                  }
                  return undefined;
                };
                const parsedPrice = tryParsePrice(
                  alt.price || alt.priceLabel || alt.pricePerNight || undefined,
                );
                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.alternativeOption}
                    onPress={() =>
                      openBookingWithOptions(
                        parsed || null,
                        parsedPrice !== undefined
                          ? parsedPrice
                          : property.price,
                        alt.dateRange,
                      )
                    }
                  >
                    <Text style={styles.alternativeDateRange}>
                      {alt.dateRange}
                    </Text>
                    <Text style={styles.alternativePrice}>{alt.price}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}
  </View>
);

export default BookingSection;
