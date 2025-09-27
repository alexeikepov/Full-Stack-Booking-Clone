import type { LastSearch } from './types';
import { api } from './instance';

export type { LastSearch };

export async function getMyLastSearch(): Promise<LastSearch | null> {
  try {
    const res = await api.get("/api/me/last-search");
    return res.data as LastSearch;
  } catch (err: any) {
    if (err?.response?.status === 404) return null;
    throw err;
  }
}

export async function saveMyLastSearch(filters: {
  city?: string;
  from?: string | Date;
  to?: string | Date;
  adults?: number;
  children?: number;
  rooms?: number;
}): Promise<void> {
  await api.post("/api/me/last-search", filters);
}
