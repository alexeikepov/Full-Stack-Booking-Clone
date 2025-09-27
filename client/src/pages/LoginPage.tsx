import { useState, useMemo } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";

const emailSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "At least 6 characters"),
});
const phoneSchema = z.object({
  phone: z.string().min(6, "Enter phone"),
  code: z.string().length(6, "6-digit code").optional(),
});

type EmailLoginValues = z.infer<typeof emailSchema>;
type UserRole = "OWNER" | "HOTEL_ADMIN" | "USER";

type LoginResponse = {
  user: { id: string; name: string; email: string; role: UserRole };
  token: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { signIn } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [otpSent, setOtpSent] = useState(false);
  const [phoneValues, setPhoneValues] = useState<{ phone: string; code: string }>({ phone: "", code: "" });
  const [sending, setSending] = useState(false);

  // Normalize local numbers (e.g., 0522226889) to E.164 (+972522226889 by default)
  const normalizePhone = (raw: string) => {
    const s = raw.replace(/\D/g, "");
    // If already starts with country code (e.g., 972...), add +
    if (raw.trim().startsWith("+")) return `+${s}`;
    // Israel default: 05XXXXXXXX -> +9725XXXXXXXX (drop leading 0)
    if (/^0\d{8,10}$/.test(s)) return `+972${s.substring(1)}`;
    // Fallback: if 9-15 digits, prefix +
    if (/^\d{6,15}$/.test(s)) return `+${s}`;
    return raw.trim();
  };

  const form = useForm<EmailLoginValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: EmailLoginValues) => {
    setServerError(null);
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await fetch(`${base}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || err?.message || "Login failed");
      }

      const data: LoginResponse = await res.json();

      localStorage.setItem("auth_token", data.token);
      signIn(data.user);

      const redirect = params.get("redirect");
      if (redirect) {
        navigate(redirect, { replace: true });
        return;
      }

      const dest = data.user.role === "OWNER" ? "/owner" : "/";
      navigate(dest, { replace: true });
    } catch (e: any) {
      setServerError(e?.message || "Login failed");
    }
  };

  const canSend = useMemo(() => {
    const n = normalizePhone(phoneValues.phone);
    return /^\+[0-9]{6,15}$/i.test(n);
  }, [phoneValues.phone]);

  const requestOtp = async () => {
    try {
      setServerError(null);
      if (!canSend) throw new Error("Enter a valid phone number");
      setSending(true);
      const base = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await fetch(`${base}/api/auth/otp/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone: normalizePhone(phoneValues.phone) }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to send code");
      }
      setOtpSent(true);
    } catch (e: any) {
      setServerError(e?.message || "Failed to send code");
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setServerError(null);
      const parsed = phoneSchema.safeParse({ phone: phoneValues.phone.trim(), code: phoneValues.code.trim() });
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "Invalid input");
      const base = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await fetch(`${base}/api/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone: normalizePhone(phoneValues.phone), code: phoneValues.code.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Invalid code");
      }
      const data: LoginResponse = await res.json();
      localStorage.setItem("auth_token", data.token);
      signIn(data.user);
      const redirect = params.get("redirect");
      if (redirect) return navigate(redirect, { replace: true });
      const dest = data.user.role === "OWNER" ? "/owner" : "/";
      navigate(dest, { replace: true });
    } catch (e: any) {
      setServerError(e?.message || "Verification failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Sign in</h1>
        <div className="mb-4 inline-flex rounded border">
          <button
            className={`px-3 py-1 text-sm ${mode === "email" ? "bg-[#0071c2] text-white" : ""}`}
            type="button"
            onClick={() => setMode("email")}
          >
            Email & Password
          </button>
          <button
            className={`px-3 py-1 text-sm ${mode === "phone" ? "bg-[#0071c2] text-white" : ""}`}
            type="button"
            onClick={() => setMode("phone")}
          >
            Phone (OTP)
          </button>
        </div>

        {mode === "email" ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {serverError && <p className="text-sm text-red-600">{serverError}</p>}

            <Button type="submit" className="w-full bg-[#0071c2] hover:bg-[#005999]">
              Sign in
            </Button>
          </form>
        </Form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Phone (international format)</label>
              <Input
                placeholder="e.g. +972501234567"
                value={phoneValues.phone}
                onChange={(e) => setPhoneValues((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
            {!otpSent ? (
              <Button disabled={!canSend || sending} onClick={requestOtp} className="w-full bg-[#0071c2] hover:bg-[#005999]">
                {sending ? "Sending..." : "Send code"}
              </Button>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium">Enter 6-digit code</label>
                  <Input
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    value={phoneValues.code}
                    onChange={(e) => setPhoneValues((p) => ({ ...p, code: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={verifyOtp} className="flex-1 bg-[#0071c2] hover:bg-[#005999]">Verify & Sign in</Button>
                  <Button variant="outline" onClick={requestOtp} disabled={sending}>Resend</Button>
                </div>
              </>
            )}

            {serverError && <p className="text-sm text-red-600">{serverError}</p>}
          </div>
        )}

        <p className="text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#0071c2] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
