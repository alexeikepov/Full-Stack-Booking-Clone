import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "At least 6 characters"),
  phone: z.string().min(8, "Enter a valid phone"),
});

type RegisterValues = z.infer<typeof schema>;

type RegisterResponse = {
  user: { id: string; name: string; email: string };
  token: string;
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [sending, setSending] = useState(false);

  // Normalize local numbers (e.g., 0522226889) to E.164 (+972522226889 default)
  const normalizePhone = (raw: string) => {
    const s = raw.replace(/\D/g, "");
    if (raw.trim().startsWith("+")) return `+${s}`;
    if (/^0\d{8,10}$/.test(s)) return `+972${s.substring(1)}`;
    if (/^\d{6,15}$/.test(s)) return `+${s}`;
    return raw.trim();
  };

  const form = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", phone: "" },
  });

  const onSubmit = async (values: RegisterValues) => {
    setServerError(null);
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:3000";

      // Step 1: ensure OTP has been sent
      if (!otpSent) {
        setSending(true);
        const resReq = await fetch(`${base}/api/auth/otp/request`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ phone: normalizePhone(values.phone) }),
        });
        setSending(false);
        if (!resReq.ok) {
          const err = await resReq.json().catch(() => ({}));
          throw new Error(err?.error || "Failed to send verification code");
        }
        setOtpSent(true);
        return; // ask user to enter the code
      }

      // Step 2: verify code before registering
      if (!otpCode || otpCode.replace(/\D/g, "").length !== 6) {
        throw new Error("Enter the 6-digit verification code");
      }
      const resVer = await fetch(`${base}/api/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone: normalizePhone(values.phone), code: otpCode.trim() }),
      });
      if (!resVer.ok) {
        const err = await resVer.json().catch(() => ({}));
        throw new Error(err?.error || "Invalid verification code");
      }

      const res = await fetch(`${base}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Registration failed");
      }

      const data: RegisterResponse = await res.json();
      localStorage.setItem("auth_token", data.token);
      signIn(data.user);
      navigate("/");
    } catch (e: any) {
      setServerError(e?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Create an account</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <Input type="password" placeholder="Min 6 characters" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="+972..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {otpSent && (
              <div>
                <FormLabel>Enter 6-digit code</FormLabel>
                <Input
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                />
              </div>
            )}

            {serverError && <p className="text-sm text-red-600">{serverError}</p>}

            <div className="flex gap-2">
              {!otpSent ? (
                <Button type="submit" disabled={sending} className="flex-1 bg-[#0071c2] hover:bg-[#005999]">
                  {sending ? "Sending..." : "Send code"}
                </Button>
              ) : (
                <Button type="submit" className="flex-1 bg-[#0071c2] hover:bg-[#005999]">
                  Verify & Register
                </Button>
              )}
            </div>
          </form>
        </Form>

        <p className="text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#0071c2] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
