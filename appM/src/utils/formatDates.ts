// Utility to format selected dates for display in the search UI
export function formatDates(selectedDates: {
  checkIn: Date | null;
  checkOut: Date | null;
}): string {
  if (selectedDates.checkIn && selectedDates.checkOut) {
    const checkIn = selectedDates.checkIn.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const checkOut = selectedDates.checkOut.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${checkIn} - ${checkOut}`;
  }
  return "Select dates";
}
