export function isOwnerOrAdmin(role?: string): boolean {
  return role === "OWNER" || role === "HOTEL_ADMIN";
}
