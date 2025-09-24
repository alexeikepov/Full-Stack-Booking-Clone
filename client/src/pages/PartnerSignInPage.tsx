// src/pages/AdminSignInPage.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMe, loginUser } from "@/lib/api";

type Step = "username" | "password";

export default function AdminSignInPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<Step>("username");

  useEffect(() => {
    const id = "admin-signin-styles";
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

.container{max-width:600px;margin:0 auto;padding:40px 24px}
.form{max-width:380px;margin:0 auto}
.h1{font-size:21px;font-weight:700;color:#1f2937;margin:0 0 12px}
.subtle{font-size:12px;line-height:1.5;color:#4b5563}
.input{height:36px;width:100%;border:1px solid #a6a6a6;border-radius:2px;padding:0 12px;font-size:14px;background:#fff;outline:none}
.input:focus{border-color:#0071c2;box-shadow:0 0 0 1px #0071c2}
.label{display:block;margin-top:18px;margin-bottom:6px;font-size:12px;font-weight:600;color:#374151}
.btn-primary{display:inline-flex;align-items:center;justify-content:center;height:40px;width:100%;border-radius:2px;background:#0071c2;color:#fff;font-weight:600;font-size:14px;border:0}
.btn-primary:hover{background:#0062a9}
.btn-primary[disabled]{opacity:.55;cursor:not-allowed;background:#7fb6e3}

.hr{height:1px;background:#e6e6e6;border:0;margin:20px 0}
.center-link{margin:14px 0;text-align:center}
.center-link.trouble{margin:24px 0 36px}
.outline-btn{display:inline-flex;align-items:center;justify-content:center;height:52px;width:100%;border-radius:8px;border:2px solid #0071c2;background:#fff;color:#0071c2;font-size:18px;font-weight:600}
.outline-btn:hover{background:#eaf3ff}
.terms{text-align:center;font-size:12px;line-height:1.6;color:#4b5563;margin-top:16px}
.copy{margin-top:18px;text-align:center;font-size:11px;line-height:1.6;color:#000}
.banner{max-width:380px;margin:0 auto 16px;border:1px solid #e6e6e6;background:#f7f7f7;border-radius:10px;padding:12px;display:flex;gap:12px;align-items:flex-start;color:#2d2d2d;font-size:13.5px;line-height:1.5}
.banner .icon{display:inline-flex;width:20px;height:20px}
.banner .close{margin-left:auto;display:grid;place-items:center;width:24px;height:24px;border-radius:6px;color:#6b7280}
.banner .close:hover{background:#ebebeb;color:#111827}
    `;
    document.head.appendChild(s);
  }, []);

  const [showBanner, setShowBanner] = useState(false);

  const onNext = async () => {
    if (step === "username") {
      if (!username.trim()) return;
      setStep("password");
      return;
    }
    if (!password.trim()) return;
    try {
      const auth = await loginUser({ email: username, password });
      localStorage.setItem("auth_token", auth.token);
      localStorage.setItem("user", JSON.stringify(auth.user));
      const me = await getMe();
      if (me.role === "HOTEL_ADMIN") {
        navigate("/AdminHotel");
      } else if (me.ownerApplicationStatus === "pending") {
        navigate("/owner/waiting-approval");
      } else {
        navigate("/partner-register");
      }
    } catch (e) {
      alert("Sign in failed");
    }
  };

  const isNextDisabled =
    (step === "username" && !username.trim()) ||
    (step === "password" && !password.trim());

  return (
    <div className="min-h-screen bg-white antialiased">
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

      <main className="container">
        {showBanner && (
          <div className="banner">
            <span className="icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10.5" fill="none" stroke="#a6a6a6" />
                <path d="M12 7v7" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16.5" r="1.25" fill="#6b7280" />
              </svg>
            </span>
            <span>
              We’ve completed the signup form using your account information as you’re
              logged in to your Booking.com account.
            </span>
            <button className="close" onClick={() => setShowBanner(false)} aria-label="Close">
              ✕
            </button>
          </div>
        )}

        <div className="form">
          <h1 className="h1">Sign in to manage your property</h1>

          {step === "username" && (
            <>
              <label className="label">Username or email</label>
              <input
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username or email"
              />
            </>
          )}

          {step === "password" && (
            <>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </>
          )}

          <button
            className="btn-primary"
            style={{ marginTop: 12 }}
            disabled={isNextDisabled}
            onClick={onNext}
          >
            Next
          </button>

          <div className="center-link trouble">
            <a href="#" className="text-[#0071c2] underline">Having trouble signing in?</a>
          </div>

          <hr className="hr" />

          <p className="subtle">
            Do you have questions about your property or the extranet? Visit{" "}
            <a
              href="https://partner.booking.com/en-gb?utm_source=extranet_login_page"
              className="text-[#0071c2] underline"
              target="_blank"
              rel="noreferrer"
            >
              Partner Help
            </a>.
          </p>

          <div style={{ height: 12 }} />

          <Link to="/partner-register" className="outline-btn">
            Create your partner account
          </Link>

          <hr className="hr" style={{ marginTop: 16 }} />

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

          <div className="copy">
            All rights reserved.
            <br />
            Copyright (2006 – 2025) – Booking.com™
          </div>
        </div>
      </main>
    </div>
  );
}
