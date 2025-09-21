// src/pages/PartnerRegisterPage.tsx
import { useEffect, useState } from "react";

export default function PartnerRegisterPage() {
  const [email, setEmail] = useState("");
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const id = "bk-partner-register-styles";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.innerHTML = `
:root{
  --blue:#003580;
  --light-blue:#0a6cff;
  --ink:#262626;
  --ink-2:#4b4b4b;
  --line:#e6e6e6;
  --bg:#ffffff;
}
*{box-sizing:border-box}
html,body,#root{height:100%}
body{margin:0;font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji", "Segoe UI Symbol"; color:var(--ink); background:var(--bg);}

/* Top bar */
.topbar{background:var(--blue); color:#fff; height:56px; display:flex; align-items:center;}
.topbar-in{max-width:1128px; margin:0 auto; padding:0 24px; width:100%; display:flex; align-items:center; justify-content:space-between;}
.brand{font-weight:800; letter-spacing:.2px;}
.top-actions{display:flex; align-items:center; gap:16px; opacity:.95}

/* Page container */
.wrap{max-width:640px; margin:32px auto 48px; padding:0 24px}

/* Info notice */
.notice{border:1px solid var(--line); border-radius:8px; padding:16px; display:flex; gap:12px; align-items:flex-start; background:#fff;}
.notice svg{flex:0 0 20px}

/* Card/form */
.card{border:1px solid var(--line); border-radius:8px; padding:24px; margin-top:16px; background:#fff;}
.h1{font-size:28px; font-weight:800; margin:8px 0}
.p{color:var(--ink-2); margin:0 0 16px; line-height:1.5}

.label{display:block; font-size:14px; margin:8px 0 6px;}
.input{width:100%; height:44px; border:1px solid var(--line); border-radius:6px; padding:0 12px; font-size:16px; outline:none;}
.input:focus{border-color:#9cc0ff; box-shadow:0 0 0 3px rgba(10,108,255,.15);}

.btn{height:44px; display:inline-flex; align-items:center; justify-content:center; padding:0 16px; border-radius:6px; border:0; cursor:pointer; font-weight:700; font-size:16px;}
.btn-primary{background:var(--light-blue); color:#fff;}
.btn-primary:disabled{opacity:.5; cursor:not-allowed;}
.btn-outline{background:#fff; border:1px solid var(--line); color:var(--ink); font-weight:600;}

.hr{height:1px; background:var(--line); margin:20px 0;}
.link{color:var(--light-blue); text-decoration:none; font-weight:600;}
.link:hover{text-decoration:underline;}
.small{font-size:12px; color:var(--ink-2); line-height:1.5;}

/* Footer copy */
.copy{margin-top:24px; text-align:center; font-size:12px; color:var(--ink-2);}

/* Flag bubble */
.flag{display:inline-flex; width:28px; height:20px; border-radius:3px; overflow:hidden; box-shadow:0 0 0 1px rgba(255,255,255,.3) inset;}
.flag-uk{background:
  linear-gradient(0deg,#00247d 0 100%);
  position:relative;
}
.flag-uk:before,
.flag-uk:after{content:""; position:absolute; inset:0; background:
  linear-gradient(#fff 0 0) 0 45%/100% 10%,
  linear-gradient(90deg,#fff 0 0) 45% 0/10% 100%,
  linear-gradient(#cf142b 0 0) 0 47.5%/100% 5%,
  linear-gradient(90deg,#cf142b 0 0) 47.5% 0/5% 100%;
  background-repeat:no-repeat;}
`;
    document.head.appendChild(s);
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);

  return (
    <>
      <div className="topbar">
        <div className="topbar-in">
          <div className="brand">Booking.com</div>
          <div className="top-actions">
            <span className="flag flag-uk flag-24" />
            <span aria-hidden>❓</span>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="notice" role="status" aria-live="polite">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#b7b7b7"/>
            <path d="M7 12.5l3 3 7-7" stroke="#3fb950" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="p">
            We’ve completed the signup form using your account information as you’re logged in to your Booking.com account.
          </div>
        </div>

        <div className="card">
          <h1 className="h1">Create your partner account</h1>
          <p className="p">Create an account to list and manage your property.</p>

          <label className="label" htmlFor="email">Email address</label>
          <input
            id="email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
          />

          <div style={{ marginTop: 16 }}>
            <button className="btn btn-primary" disabled={!emailValid}>
              Continue
            </button>
          </div>

          <div className="hr" />

          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn-outline" style={{ width: "100%" }}>
              Sign in
            </button>
          </div>

          <p className="small" style={{ marginTop: 16 }}>
            Do you have questions about your property or the extranet? Visit <a className="link" href="#">Partner Help</a>.
          </p>

          <p className="small" style={{ marginTop: 16 }}>
            By signing in or creating an account, you agree with our <a className="link" href="#">Terms &amp; conditions</a> and <a className="link" href="#">Privacy statement</a>.
          </p>
          <p className="copy">All rights reserved.<br/>Copyright (2006 – 2025) – Booking.com™</p>
        </div>
      </div>
    </>
  );
}
