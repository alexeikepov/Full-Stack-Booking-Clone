export function isBookingCardType(obj: any): obj is {
  propertyName: string;
  price?: any;
  location?: any;
  details?: any;
} {
  return !!(obj && typeof obj.propertyName === "string");
}
