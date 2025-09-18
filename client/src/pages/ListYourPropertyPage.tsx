// src/pages/ListYourPropertyPage.tsx
import { useEffect, useState } from "react";

export default function ListYourPropertyPage() {
  const [ptype, setPtype] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    const id = "join-booking-hero-1to1";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.innerHTML = `
:root{
  --hero-1:#0b3a84;
  --hero-2:#022a64;
  --cta:#0a5ad6;
  --gold:#ffb700;
  --line:#e7e7e7;
  --ink:#111827;
  --sub:#5f6b76;
  --check:#16a34a;
  --check-ring:#cfe8d6;
  --link:#0a5ad6;
}
*{box-sizing:border-box}
html,body,#root{height:100%}
body{margin:0;font-family:Arial,Helvetica,sans-serif;color:var(--ink);background:#fff}
a{color:var(--link);text-decoration:underline}
.container{max-width:1128px;margin:0 auto;padding:0 16px}

/* HERO */
.hero{background:linear-gradient(180deg,var(--hero-1) 0%, var(--hero-2) 100%);color:#fff}
.hero-in{padding:32px 0 44px}
.hero-grid{display:grid;gap:24px;align-items:start}
@media(min-width:992px){.hero-grid{grid-template-columns:1fr 360px}}
.h1{margin:18px 0 8px;font-weight:800;letter-spacing:.2px;font-size:56px;line-height:64px}
.h1 .accent{background:linear-gradient(180deg,#31b4ff 0%, #0a6adf 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.hero-sub{color:rgba(255,255,255,.95);font-size:15px;line-height:22px;max-width:600px}

/* RIGHT CARD */
.card{background:#fff;border-radius:12px;outline:3px solid var(--gold);box-shadow:0 2px 18px rgba(0,0,0,.18)}
.card-b{padding:16px}
.card h3{margin:0 0 4px;font-size:18px;line-height:24px;font-weight:800;color:#111827}
.card small{display:block;color:var(--sub);font-size:12px;margin-bottom:8px}
.tick{display:flex;gap:8px;align-items:flex-start;margin:8px 0}
.tick span{color:#1f2937;font-size:13px}

/* controls */
.select{width:100%;height:40px;border:1px solid var(--line);border-radius:8px;background:#fff;padding:0 10px;font-size:14px;
  appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 20 20'%3E%3Cpath fill='%23666' d='M5.8 7.3 10 11.5l4.2-4.2 1.1 1.1L10 13.7 4.7 8.4z'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 10px center}
.field{margin-top:10px}

/* button + note */
.btn{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:8px;height:40px;font-size:14px;font-weight:800;cursor:pointer}
.btn-cta{background:var(--cta);color:#fff;width:100%;margin-top:12px}
.btn-cta i{margin-left:8px}
.card-note{margin-top:10px;border-top:1px solid var(--line);padding-top:10px}
.card-note small{font-size:12px;color:#1b2430}
.card-note b{font-weight:800}

/* UNDER-HERO SECTION */
.section{padding:44px 0}
.h2{margin:0 0 10px;font-size:34px;line-height:42px;font-weight:800}
.cols3{display:grid;gap:24px}
@media(min-width:992px){.cols3{grid-template-columns:repeat(3,1fr)}}
.col h4{margin:0 0 8px;font-size:16px;line-height:22px;font-weight:800}
.line{display:flex;gap:8px;align-items:flex-start;margin:8px 0;font-size:15px;color:#334155}

/* check icon */
svg{display:block}
    `;
    document.head.appendChild(s);
    return () => document.getElementById(id)?.remove();
  }, []);

  const Check = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="none" stroke="var(--check-ring)" />
      <path d="M6.2 10.3 8.8 13l5-6" fill="none" stroke="var(--check)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <main>
      <section className="hero">
        <div className="container hero-in">
          <div className="hero-grid">
            <div>
              <h1 className="h1">
                List <span className="accent">anything</span>
                <br />on Booking.com
              </h1>
              <p className="hero-sub">
                List on one of the world’s most downloaded travel apps to earn more, faster and expand into new markets.
              </p>
            </div>

            <div className="card">
              <div className="card-b">
                <h3>Register for free</h3>
                <small>45% of hosts get their first booking within a week</small>

                <div className="tick"><Check /><span>Choose instant bookings or <b>Request to Book</b></span></div>
                <div className="tick"><Check /><span>We&apos;ll facilitate payments for you</span></div>

                <div className="field">
                  <select className="select" value={ptype} onChange={e=>setPtype(e.target.value)}>
                    <option value="" disabled>Property type</option>
                    <option value="hotel">Hotel</option>
                    <option value="apartment">Apartment</option>
                    <option value="guesthouse">Guest house</option>
                    <option value="resort">Resort</option>
                    <option value="bnb">B&amp;B</option>
                  </select>
                </div>
                <div className="field">
                  <select className="select" value={country} onChange={e=>setCountry(e.target.value)}>
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

                <button className="btn btn-cta">Start registration <i>→</i></button>

                <div className="card-note">
                  <small><b>Already started a registration?</b> <a href="#">Continue your registration</a></small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="h2">Host worry-free. We’ve got your back</div>
          <div className="cols3">
            <div className="col">
              <h4>Your rental, your rules</h4>
              <div className="line"><Check /><span>Accept or decline bookings with <a href="#">Request to Book</a>.</span></div>
              <div className="line"><Check /><span>Manage your guests’ expectations by setting up clear house rules.</span></div>
              <button className="btn btn-cta" style={{ width:160, marginTop:14 }}>Start registration</button>
              <div style={{ marginTop:10, color:"#6b7280", fontSize:12 }}>*Currently available for guest bookings made via iOS.</div>
            </div>

            <div className="col">
              <h4>Get to know your guests</h4>
              <div className="line"><Check /><span>Chat with your guests before accepting their stay with pre-booking messaging.*</span></div>
              <div className="line"><Check /><span>Access guest travel history insights.</span></div>
            </div>

            <div className="col">
              <h4>Stay protected</h4>
              <div className="line"><Check /><span>Protection against <a href="#">liability claims</a> from guests and neighbours up to €/$/£1,000,000 for every reservation.</span></div>
              <div className="line"><Check /><span>Selection of <a href="#">damage protection</a> options for you to choose.</span></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
