// src/services/searchHistoryService.ts
import { SearchHistoryModel } from "../models/SearchHistory";

export type SearchFilters = {
  city?: string;
  from?: string | Date;
  to?: string | Date;
  adults?: number;
  children?: number;
  rooms?: number;
};

const toISO = (d?: string | Date) => (d ? new Date(d).toISOString() : undefined);

export async function saveLastSearch(userId: string, filters: SearchFilters) {
  const payload: SearchFilters = {
    city: filters.city,
    from: toISO(filters.from),
    to: toISO(filters.to),
    adults: filters.adults != null ? Number(filters.adults) : undefined,
    children: filters.children != null ? Number(filters.children) : undefined,
    rooms: filters.rooms != null ? Number(filters.rooms) : undefined,
  };
  await SearchHistoryModel.create({ userId, query: JSON.stringify(payload) });
}

export async function getLastSearchForUser(userId: string) {
  const row = await SearchHistoryModel.findOne({ userId }).sort({ createdAt: -1 }).lean();
  if (!row) return null;
  try { return { ...JSON.parse(row.query), createdAt: row.createdAt }; }
  catch { return { raw: row.query, createdAt: row.createdAt }; }
}
