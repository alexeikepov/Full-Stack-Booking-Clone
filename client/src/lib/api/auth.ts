import type { AuthResponse, User } from './types';
import { api } from './instance';

export type { AuthResponse, User };

export async function registerUser(params: { name: string; email: string; phone: string; password: string }): Promise<AuthResponse> {
  const res = await api.post("/api/users/register", params);
  return res.data as AuthResponse;
}

export async function loginUser(params: { email: string; password: string }): Promise<AuthResponse> {
  const res = await api.post("/api/users/login", params);
  return res.data as AuthResponse;
}

export async function getMe() {
  try {
    const res = await api.get("/api/me");
    return res.data as {
      id: string;
      name: string;
      email: string;
      phone?: string;
      role?: string;
      ownerApplicationStatus?: "none" | "pending" | "approved" | "rejected";
      genius?: { level: number; completedLast24Months: number; nextThreshold: number | null; remaining: number };
    };
  } catch (err: any) {
    if (err?.response?.status === 404) {
      const raw = localStorage.getItem("user");
      if (raw) {
        try {
          const u = JSON.parse(raw) as { id?: string; name?: string; email?: string; role?: string };
          return {
            id: String(u.id || ""),
            name: u.name || "",
            email: u.email || "",
            role: u.role,
            ownerApplicationStatus: undefined,
            genius: undefined,
          } as any;
        } catch {}
      }
    }
    throw err;
  }
}

export async function getAdminApplications(params?: { status?: "pending" | "approved" | "rejected" }) {
  const res = await api.get("/api/users/admin-applications", { params });
  return res.data as { items: Array<{ _id: string; name: string; email: string; phone: string; ownerApplicationStatus: string; role: string; requestedOwner: boolean; createdAt: string }> };
}

export async function approveAdminApplication(userId: string) {
  const res = await api.patch(`/api/users/${userId}/admin-approve`, { action: "approve" });
  return res.data as { id: string; role: string; ownerApplicationStatus: string };
}

export async function rejectAdminApplication(userId: string) {
  const res = await api.patch(`/api/users/${userId}/admin-approve`, { action: "reject" });
  return res.data as { id: string; role: string; ownerApplicationStatus: string };
}

export async function requestAdminRole() {
  const res = await api.post("/api/users/request-admin");
  return res.data as { ok: true; ownerApplicationStatus: string };
}

export async function searchUsers(query: string): Promise<User[]> {
  console.log("API: Searching users with query:", query);
  const res = await api.get("/api/friend-requests/search", { params: { q: query } });
  console.log("API: Search response:", res.data);
  return res.data;
}
