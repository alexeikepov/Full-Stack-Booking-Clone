// src/pages/PartnerRegisterPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

type Step = "email" | "contact" | "password";

export default function PartnerRegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("ofir071002@gmail.com");
  const [firstName, setFirstName] = useState("Ofir");
  const [lastName, setLastName] = useState("Avisror");
  const [phone, setPhone] = useState("522226889");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showBanner, setShowBanner] = useState(true);
  const [step, setStep] = useState<Step>("email");
  const [isLeaving, setIsLeaving] = useState(false);

  const [pwFocused, setPwFocused] = useState(false);
  const [pwTouched, setPwTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  useEffect(() => {
    const id = "partner-register-styles";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.innerHTML = `
.page-header{background:#003b95;color:#fff;height:56px;display:flex;align-items:center}
.wrap{max-width:1128px;margin:0 auto;padding:0 24px;width:100%}
.header-in{display:flex;justify-content:space-between;align-items:center}
.logo{font-size:18px;font-weight:600;color:#fff;text-decoration:none}
.header-right{display:flex;align-items:center;gap:16px;color:#ffffffcc}
.flag{width:16px;height:16px;border-radius:2px;display:block}
.help-btn{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border:1px solid #fff;border-radius:9999px;line-height:1;color:#fff;font-size:12px}
.help-btn:hover{background:rgba(255,255,255,.14)}
.input{height:36px;width:100%;border:1px solid #a6a6a6;border-radius:2px;padding:0 12px;font-size:14px;outline:none;background:#fff}
.input:focus{border-color:#0071c2;box-shadow:0 0 0 1px #0071c2}
.input.error{border-color:#dc2626;box-shadow:0 0 0 1px #dc2626}
.btn-primary{height:40px;width:100%;border-radius:2px;background:#0071c2;color:#fff;font-weight:600;font-size:14px}
.btn-primary:hover{background:#0062a9}
.btn-primary[disabled]{opacity:.55;cursor:not-allowed;background:#7fb6e3}
.hr{margin:20px 0;height:1px;background:#e6e6e6}
.terms{text-align:center;font-size:12px;line-height:1.6;color:#4b5563}
.footer-copy{margin-top:24px;text-align:center;font-size:11px;line-height:1.6;color:#000}
.stage{position:relative;min-height:360px}
.panel{position:relative}
.entering{animation:enter .22s ease-out both}
.leaving{animation:leave .18s ease-in both}
@keyframes enter{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes leave{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-6px)}}
.help-list{font-size:12px;color:#4b5563;margin-top:8px}
.help-list .ok{color:#008009}
.help-list .bad{color:#dc2626}
`;
    document.head.appendChild(s);
  }, []);

  const animateTo = (next: Step) => {
    setIsLeaving(true);
    setTimeout(() => {
      setStep(next);
      setIsLeaving(false);
    }, 160);
  };

  const emailName = useMemo(
    () => (email.includes("@") ? email.split("@")[0].toLowerCase() : ""),
    [email]
  );

  const passwordSchema = useMemo(
    () =>
      z
        .object({
          password: z
            .string()
            .min(10, "At least 10 characters")
            .regex(/[A-Z]/, "Contains an uppercase letter")
            .regex(/[a-z]/, "Contains a lowercase letter")
            .regex(/[0-9]/, "Contains a number")
            .refine((val) => !val.toLowerCase().includes(emailName), {
              message: "Does not contain your email name",
            }),
          confirm: z.string(),
        })
        .refine((data) => data.confirm === data.password, {
          path: ["confirm"],
          message: "Passwords match",
        }),
    [emailName]
  );

  const pwParse = passwordSchema.safeParse({ password, confirm });
  const passwordValid = pwParse.success;

  const rulesState = {
    length: password.length >= 10,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    notEmail: password.length > 0 && !password.toLowerCase().includes(emailName),
    match: confirm.length > 0 && confirm === password,
  };

  const showChecklist =
    pwFocused || pwTouched || confirmTouched || password.length > 0 || confirm.length > 0;

  const handleCreateAccount = () => {
    setPwTouched(true);
    setConfirmTouched(true);
    const res = passwordSchema.safeParse({ password, confirm });
    if (!res.success) return;
    navigate("/AdminHotel");
  };

  return (
    <div className="min-h-screen bg-white text-[#1f2937] antialiased">
      <header className="page-header">
        <div className="wrap header-in">
          <a className="logo" href="#">Booking.com</a>
          <div className="header-right">
            <div className="flex items-center gap-1.5">
              <img
                className="flag"
                alt="GB"
                src="https://flagicons.lipis.dev/flags/4x3/gb.svg"
              />
              <span style={{ fontSize: 13 }}>GB</span>
            </div>
            <button aria-label="Help" className="help-btn">?</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[620px] px-6 py-10">
        {showBanner && (
          <div className="mx-auto mb-6 w-full max-w-[400px] rounded-[10px] border border-[#e6e6e6] bg-[#f7f7f7] p-3">
            <div className="flex items-start gap-3 text-[13.5px] leading-6 text-[#2d2d2d]">
              <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10.5" fill="none" stroke="#a6a6a6" />
                  <path d="M12 7v7" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="16.5" r="1.25" fill="#6b7280" />
                </svg>
              </span>
              <span>
                We’ve completed the signup form using your account information as you’re
                logged in to your Booking.com account.
              </span>
              <button
                aria-label="close"
                onClick={() => setShowBanner(false)}
                className="ml-auto grid h-6 w-6 place-items-center rounded text-[#6b7280] hover:bg-[#ebebeb] hover:text-[#111827]"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="mx-auto w-full max-w-[400px] stage">
          {step === "email" && (
            <section className={isLeaving ? "panel leaving" : "panel entering"}>
              <h1 className="text-[21px] font-bold text-[#1f2937]">
                Create your partner account
              </h1>
              <p className="mt-2 text-[13.5px] leading-6 text-[#4b5563]">
                Create an account to list and manage your property.
              </p>

              <label className="mt-6 block text-[12px] font-bold tracking-wide text-[#000]">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input mt-1"
              />

              <button className="btn-primary mt-4" onClick={() => animateTo("contact")}>
                Continue
              </button>

              <div className="hr" />

              <p className="text-[12px] leading-6 text-[#4b5563]">
                Do you have questions about your property or the extranet? Visit{" "}
                <a
                  href="https://partner.booking.com/en-gb?utm_source=extranet_login_page"
                  className="text-[#0071c2] underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Partner Help
                </a>
                .
              </p>

              <div className="hr" />

              {/* Fixed: route to our admin sign-in page */}
              <Link
                to="/admin/sign-in"
                className="inline-flex h-[52px] w-full items-center justify-center rounded-[8px] border-2 border-[#0071c2] bg-white text-[18px] font-semibold text-[#0071c2] hover:bg-[#eaf3ff] active:bg-[#d7e8ff] focus:outline-none focus:ring-2 focus:ring-[#99c2e8]"
              >
                Sign in
              </Link>

              <div className="hr" />

              <div className="terms">
                By signing in or creating an account, you agree with our{" "}
                <a
                  href="https://www.booking.com/general.en-gb.html?tmpl=docs/terms_of_use"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0071c2] underline"
                >
                  Terms &amp; conditions
                </a>{" "}
                and{" "}
                <a
                  href="https://admin.booking.com/hotel/hoteladmin/privacy.html?lang=en-gb"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0071c2] underline"
                >
                  Privacy statement
                </a>
                .
              </div>

              <div className="footer-copy">
                All rights reserved.
                <br />
                Copyright (2006 – 2025) – Booking.com™
              </div>
            </section>
          )}

          {step === "contact" && (
            <section className={isLeaving ? "panel leaving" : "panel entering"}>
              <h1 className="text-[21px] font-bold text-[#1f2937]">Contact details</h1>
              <p className="mt-2 text-[13.5px] leading-6 text-[#4b5563]">
                Your full name and phone number are needed to ensure the security of your Booking.com account.
              </p>

              <label className="mt-6 block text-[12px] font-semibold tracking-wide text-[#374151]">First name</label>
              <input className="input mt-1" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />

              <label className="mt-4 block text-[12px] font-semibold tracking-wide text-[#374151]">Last name</label>
              <input className="input mt-1" value={lastName} onChange={(e)=>setLastName(e.target.value)} />

              <label className="mt-4 block text-[12px] font-semibold tracking-wide text-[#374151]">Phone number</label>
              <div className="mt-1 flex gap-2">
                <div className="flex h-[36px] items-center rounded-[2px] border border-[#a6a6a6] px-2 shrink-0">
                  <img className="h-4 w-6 rounded-[2px]" src="https://flagicons.lipis.dev/flags/4x3/il.svg" alt="IL" />
                  <span className="ml-2 text-[13px] text-[#374151]">+972</span>
                </div>
                <input className="input flex-1" value={phone} onChange={(e)=>setPhone(e.target.value)} />
              </div>

              <p className="mt-2 text-[11px] text-[#6b7280]">
                We’ll text a two-factor authentication code to this number when you sign in.
              </p>

              <button className="btn-primary mt-4" onClick={() => animateTo("password")}>
                Next
              </button>

              <div className="hr" />

              <div className="terms">
                By signing in or creating an account, you agree with our{" "}
                <a
                  href="https://www.booking.com/general.en-gb.html?tmpl=docs/terms_of_use"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0071c2] underline"
                >
                  Terms &amp; conditions
                </a>{" "}
                and{" "}
                <a
                  href="https://admin.booking.com/hotel/hoteladmin/privacy.html?lang=en-gb"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0071c2] underline"
                >
                  Privacy statement
                </a>
                .
              </div>

              <div className="footer-copy">
                All rights reserved.
                <br />
                Copyright (2006 – 2025) – Booking.com™
              </div>
            </section>
          )}

          {step === "password" && (
            <section className={isLeaving ? "panel leaving" : "panel entering"}>
              <h1 className="text-[21px] font-bold text-[#1f2937]">Create password</h1>
              <p className="mt-2 text-[13.5px] leading-6 text-[#4b5563]">
                Use a minimum of 10 characters, including uppercase letters, lowercase letters and numbers.
              </p>

              <label className="mt-6 block text-[12px] font-semibold tracking-wide text-[#374151]">Password</label>
              <input
                className={`input mt-1 ${pwTouched && !passwordValid ? "error" : ""}`}
                type="password"
                value={password}
                onFocus={() => setPwFocused(true)}
                onChange={(e)=>setPassword(e.target.value)}
                onBlur={()=>setPwTouched(true)}
                placeholder="Enter a password"
              />

              <label className="mt-4 block text-[12px] font-semibold tracking-wide text-[#374151]">Confirm password</label>
              <input
                className={`input mt-1 ${confirmTouched && !rulesState.match ? "error" : ""}`}
                type="password"
                value={confirm}
                onChange={(e)=>setConfirm(e.target.value)}
                onBlur={()=>setConfirmTouched(true)}
                placeholder="Confirm your password"
              />

              {showChecklist && (
                <ul className="help-list">
                  <li className={rulesState.length ? "ok" : "bad"}>At least 10 characters</li>
                  <li className={rulesState.upper ? "ok" : "bad"}>Contains an uppercase letter</li>
                  <li className={rulesState.lower ? "ok" : "bad"}>Contains a lowercase letter</li>
                  <li className={rulesState.number ? "ok" : "bad"}>Contains a number</li>
                  <li className={rulesState.notEmail ? "ok" : "bad"}>Does not contain your email name</li>
                  <li className={rulesState.match ? "ok" : "bad"}>Passwords match</li>
                </ul>
              )}

              <button
                className="btn-primary mt-2"
                onClick={handleCreateAccount}
                disabled={!passwordValid}
              >
                Create account
              </button>

              <div className="hr" />

              <div className="terms">
                By signing in or creating an account, you agree with our{" "}
                <a
                  href="https://www.booking.com/general.en-gb.html?tmpl=docs/terms_of_use"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0071c2] underline"
                >
                  Terms &amp; conditions
                </a>{" "}
                and{" "}
                <a
                  href="https://admin.booking.com/hotel/hoteladmin/privacy.html?lang=en-gb"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0071c2] underline"
                >
                  Privacy statement
                </a>
                .
              </div>

              <div className="footer-copy">
                All rights reserved.
                <br />
                Copyright (2006 – 2025) – Booking.com™
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
