// src/pages/ListYourPropertyPage.tsx
import { useEffect, useState } from "react";

export default function ListYourPropertyPage() {
  const [email, setEmail] = useState("");
  const [ptype, setPtype] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (document.getElementById("bk-join-hero-match")) return;
    const s = document.createElement("style");
    s.id = "bk-join-hero-match";
    s.innerHTML = `
:root{
  --bk-blue:#003580;
  --bk-blue2:#00224D;
  --bk-cta:#0071c2;
  --bk-link:#0a5ad6;
  --bk-ink:#1a1a1a;
  --bk-sub:#586470;
  --bk-line:#e7e7e7;
  --bk-slab:#f2f2f2;
  --bk-gold:#ffb700;
  --bk-dark:#0c1422;
  --bk-accent:#2aa5ff;
}
*{box-sizing:border-box}
html,body,#root{height:100%}
body{margin:0;background:#fff;color:var(--bk-ink);font-family:Arial,Helvetica,sans-serif}
a{color:var(--bk-link);text-decoration:underline}
.wrap{max-width:1064px;margin:0 auto;padding:0 24px}
.h1{margin:16px 0 10px;font-size:56px;line-height:64px;font-weight:800;letter-spacing:.2px}
.h1 .accent{color:var(--bk-accent)}
.h2{margin:0 0 10px;font-size:34px;line-height:42px;font-weight:800}
.sub{color:var(--bk-sub);font-size:15px;line-height:22px}

/* HERO */
.hero{background:linear-gradient(180deg,var(--bk-blue) 0%, var(--bk-blue2) 100%);color:#fff}
.hero-in{padding:40px 0 48px}
.hero-top{display:flex;justify-content:space-between;align-items:center;font-size:13px;opacity:.96}
.brand{background:#0f367a;border:1px solid rgba(255,255,255,.24);color:#fff;border-radius:6px;padding:8px 12px;font-weight:800}
.join-pill{display:inline-flex;align-items:center;gap:8px;background:#1fa347;color:#fff;border-radius:6px;padding:6px 10px;margin-top:10px;font-size:12px;font-weight:700}
.join-pill .dot{width:8px;height:8px;border-radius:999px;background:#fff;opacity:.95}

/* hero layout */
.hero-grid{display:grid;gap:24px;align-items:start}
@media(min-width:992px){.hero-grid{grid-template-columns:1fr 360px}}
.meta{display:flex;gap:18px;margin-top:12px;opacity:.95;font-size:13px}

/* register card */
.card{background:#fff;border-radius:12px;box-shadow:0 2px 16px rgba(0,0,0,.18);outline:3px solid var(--bk-gold)}
.card-b{padding:16px}
.card h3{margin:0 0 4px;font-size:18px;line-height:24px;font-weight:800;color:#1a1a1a}
.card small{display:block;margin:0 0 8px;color:#6b6f76;font-size:12px}
.tick{display:flex;gap:8px;align-items:flex-start;margin:8px 0}
.tick svg{flex:0 0 16px}
.tick span{color:#1e293b;font-size:13px}
.input,.select{width:100%;height:40px;border:1px solid var(--bk-line);border-radius:8px;padding:0 10px;font-size:14px;background:#fff}
.select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 20 20'%3E%3Cpath fill='%23666' d='M5.8 7.3 10 11.5l4.2-4.2 1.1 1.1L10 13.7 4.7 8.4z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center}
.field{margin-top:12px}
.btn{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:8px;height:40px;padding:0 14px;font-size:14px;font-weight:800;cursor:pointer}
.btn-cta{background:#0a5ad6;color:#fff;width:100%;margin-top:12px}
.btn-cta .arrow{margin-left:8px;display:inline-block;transform:translateY(1px)}
.card-note{margin-top:10px;border-top:1px solid var(--bk-line);padding-top:10px}
.card-note b{color:#111827}

/* section “Host worry-free” */
.section{padding:48px 0}
.icons-row{display:grid;gap:20px}
@media(min-width:992px){.icons-row{grid-template-columns:repeat(3,1fr)}}
.icon-col h4{margin:0 0 8px;font-size:16px;line-height:22px;font-weight:800;color:#1a1a1a}
.icon-col .line{display:flex;gap:8px;align-items:flex-start;margin:8px 0;color:#334155;font-size:15px}
.icon-col .line svg{flex:0 0 18px}
.note{margin-top:10px;color:#6b7280;font-size:12px}
.link-inline{color:#0a5ad6}
.btn-inline{margin-top:14px}

/* helpers */
svg{display:block}
    `;
    document.head.appendChild(s);
    return () => document.getElementById("bk-join-hero-match")?.remove();
  }, []);

  const Tick = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="none" stroke="#c9e6d0" />
      <path d="M6.2 10.3 8.8 13l5-6" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div>
      <header className="hero">
        <div className="wrap hero-in">
          <div className="hero-top">
            <div className="brand">Booking.com</div>
            <div style={{ display: "flex", gap: 12 }}>
              <a href="#">Already a partner?</a>
              <a href="#">Sign in</a>
              <a href="#">Help</a>
            </div>
          </div>

          <div className="join-pill"><span className="dot" />Join 29,279,209 other listings already on Booking.com</div>

          <div className="hero-grid" style={{ marginTop: 18 }}>
            <div>
              <h1 className="h1">
                List your <span className="accent">apartment</span>
                <br />on Booking.com
              </h1>
              <p className="sub" style={{ color: "rgba(255,255,255,.95)", maxWidth: 580 }}>
                List on one of the world’s most downloaded travel apps to earn more, faster and expand into new markets.
              </p>
            </div>

            <div className="card">
              <div className="card-b">
                <h3>Register for free</h3>
                <small>45% of hosts get their first booking within a week</small>

                <div className="tick">
                  <Tick />
                  <span>Choose instant bookings or <b>Request to Book</b></span>
                </div>
                <div className="tick">
                  <Tick />
                  <span>We&apos;ll facilitate payments for you</span>
                </div>

                <div className="field">
                  <input
                    className="input"
                    type="email"
                    placeholder="Work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="field">
                  <select className="select" value={ptype} onChange={(e) => setPtype(e.target.value)}>
                    <option value="" disabled>Property type</option>
                    <option value="hotel">Hotel</option>
                    <option value="apartment">Apartment</option>
                    <option value="guesthouse">Guest house</option>
                    <option value="resort">Resort</option>
                    <option value="bnb">B&amp;B</option>
                  </select>
                </div>
                <div className="field">
                  <select className="select" value={country} onChange={(e) => setCountry(e.target.value)}>
                    <option value="" disabled>Country/region</option>
                    <option value="israel">Israel</option>
                    <option value="usa">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="germany">Germany</option>
                    <option value="italy">Italy</option>
                    <option value="spain">Spain</option>
                    <option value="france">France</option>
                  </select>
                </div>

                <button className="btn btn-cta">
                  Start registration <span className="arrow">→</span>
                </button>

                <div className="card-note">
                  <small>
                    <b>Already started a registration?</b>{" "}
                    <a href="#">Continue your registration</a>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="wrap">
          <div className="h2">Host worry-free. We’ve got your back</div>

          <div className="icons-row">
            <div className="icon-col">
              <h4>Your rental, your rules</h4>
              <div className="line"><Tick size={18} /><span>Accept or decline bookings with <a className="link-inline" href="#">Request to Book</a>.</span></div>
              <div className="line"><Tick size={18} /><span>Manage your guests’ expectations by setting up clear house rules.</span></div>
              <button className="btn btn-cta btn-inline">Start registration</button>
              <div className="note">*Currently available for guest bookings made via iOS.</div>
            </div>

            <div className="icon-col">
              <h4>Get to know your guests</h4>
              <div className="line"><Tick size={18} /><span>Chat with your guests before accepting their stay with pre-booking messaging.*</span></div>
              <div className="line"><Tick size={18} /><span>Access guest travel history insights.</span></div>
            </div>

            <div className="icon-col">
              <h4>Stay protected</h4>
              <div className="line"><Tick size={18} /><span>Protection against <a className="link-inline" href="#">liability claims</a> from guests and neighbours up to €/$/£1,000,000 for every reservation.</span></div>
              <div className="line"><Tick size={18} /><span>Selection of <a className="link-inline" href="#">damage protection</a> options for you to choose.</span></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
