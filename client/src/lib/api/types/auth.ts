export type AuthResponse = {
  user: { id: string; name: string; email: string; phone?: string; role?: string };
  token: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  role?: string;
};
