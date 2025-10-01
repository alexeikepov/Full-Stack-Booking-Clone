// Utility to parse a date string like "26–28 Sep" or "15–18 Oct" into check-in and check-out Date objects
export function parseDateString(dateString: string): {
  checkIn: Date;
  checkOut: Date;
} {
  const parts = dateString.split(", ")[0]; // Remove ", 2 adults" part
  const [dateRange, monthStr] = parts.split(" ");
  const [startDay, endDay] = dateRange.split("–");

  const currentYear = new Date().getFullYear();
  const monthMap: { [key: string]: number } = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const month = monthMap[monthStr];
  const checkIn = new Date(currentYear, month, parseInt(startDay));
  const checkOut = new Date(currentYear, month, parseInt(endDay));

  return { checkIn, checkOut };
}
