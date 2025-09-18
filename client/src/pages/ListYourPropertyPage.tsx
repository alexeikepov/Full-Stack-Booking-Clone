// src/pages/ListYourPropertyPage.tsx
import { useEffect } from "react";

export default function ListYourPropertyPage() {
  useEffect(() => {
    const id = "join-booking-hero-exact";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.innerHTML = `
:root{
  --hero-a:#0b3a84; --hero-b:#022a64;
  --ink:#111827; --sub:#586470; --line:#e7e7e7;
  --cta:#0a5ad6; --gold:#ffb700; --link:#0a5ad6;
  --tick:#16a34a; --tick-ring:#cfe8d6;
}
*{box-sizing:border-box}
html,body,#root{height:100%}
body{margin:0;font-family:Arial,Helvetica,sans-serif;color:var(--ink);background:#fff}
a{color:var(--link);text-decoration:underline}

.wrap{max-width:1128px;margin:0 auto;padding:0 16px}

/* HERO */
.hero{background:linear-gradient(180deg,var(--hero-a) 0%,var(--hero-b) 100%);color:#fff}
.hero-in{padding:32px 0 44px}
.grid{display:grid;gap:24px;align-items:start}
@media(min-width:992px){.grid{grid-template-columns:1fr 420px}}
.h1{margin:18px 0 8px;font-weight:800;letter-spacing:.2px;font-size:56px;line-height:64px}
.h1 .accent{background:linear-gradient(180deg,#31b4ff 0%,#0a6adf 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.subt{color:rgba(255,255,255,.95);font-size:15px;line-height:22px;max-width:600px}

/* Card */
.card{background:#fff;border-radius:12px;outline:3px solid var(--gold);box-shadow:0 2px 18px rgba(0,0,0,.18)}
.card-b{padding:16px}
.card h3{margin:0 0 4px;font-size:18px;line-height:24px;font-weight:800;color:#111827}
.card small{display:block;color:#5f6b76;font-size:12px;margin-bottom:8px}
.row{display:flex;gap:8px;align-items:flex-start;margin:10px 0 0}
.row span{font-size:13px;line-height:18px;color:#1f2937}
.btn{margin-top:12px;display:inline-flex;align-items:center;justify-content:center;width:100%;height:44px;border:0;border-radius:8px;background:var(--cta);color:#fff;font-weight:800;font-size:14px}
.note{margin-top:12px;border-top:1px solid var(--line);padding-top:10px;font-size:12px;color:#1b2430}
.note b{font-weight:800}

/* Section under hero */
.section{padding:44px 0}
.h2{margin:0 0 10px;font-size:34px;line-height:42px;font-weight:800}
.cols{display:grid;gap:24px}
@media(min-width:992px){.cols{grid-template-columns:repeat(3,1fr)}}
.col h4{margin:0 0 8px;font-size:16px;line-height:22px;font-weight:800}
.line{display:flex;gap:8px;align-items:flex-start;margin:8px 0;font-size:15px;line-height:22px;color:#334155}

svg{display:block}
`;
    document.head.appendChild(s);
    return () => document.getElementById(id)?.remove();
  }, []);

  const Tick = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="none" stroke="var(--tick-ring)" />
      <path d="M6.2 10.3 8.8 13l5-6" fill="none" stroke="var(--tick)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <main>
      <section className="hero">
        <div className="wrap hero-in">
          <div className="grid">
            <div>
              <h1 className="h1">
                List your <span className="accent">apartment</span>
                <br />on Booking.com
              </h1>
              <p className="subt">
                List on one of the world’s most downloaded travel apps to earn more, faster and expand into new markets.
              </p>
            </div>

            <div className="card">
              <div className="card-b">
                <h3>Register for free</h3>
                <small>45% of hosts get their first booking within a week</small>

                <div className="row"><Tick /><span>Choose instant bookings or <b>Request to Book</b></span></div>
                <div className="row"><Tick /><span>We’ll facilitate payments for you</span></div>

                <button className="btn">Start registration →</button>

                <div className="note">
                  <b>Already started a registration?</b> <a href="#">Continue your registration</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="h2">Host worry-free. We’ve got your back</div>

          <div className="cols">
            <div className="col">
              <h4>Your rental, your rules</h4>
              <div className="line"><Tick /><span>Accept or decline bookings with <a href="#">Request to Book</a>.</span></div>
              <div className="line"><Tick /><span>Manage your guests’ expectations by setting up clear house rules.</span></div>
              <button className="btn" style={{ width: 160, marginTop: 14 }}>Start registration</button>
              <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>*Currently available for guest bookings made via iOS.</div>
            </div>

            <div className="col">
              <h4>Get to know your guests</h4>
              <div className="line"><Tick /><span>Chat with your guests before accepting their stay with pre-booking messaging.*</span></div>
              <div className="line"><Tick /><span>Access guest travel history insights.</span></div>
            </div>

            <div className="col">
              <h4>Stay protected</h4>
              <div className="line"><Tick /><span>Protection against <a href="#">liability claims</a> from guests and neighbours up to €/$/£1,000,000 for every reservation.</span></div>
              <div className="line"><Tick /><span>Selection of <a href="#">damage protection</a> options for you to choose.</span></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
