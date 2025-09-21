// src/pages/ListYourPropertyPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "@/components/AdminHeader";

import importPropertyDetailsImg from "../img/ListYourPropertyPageImg/Import your property details.png";
import startFastImg from "../img/ListYourPropertyPageImg/Start fast with review scores.png";
import standOutImg from "../img/ListYourPropertyPageImg/Stand out in the market.png";
import parleyRoseImg from "../img/ListYourPropertyPageImg/Parely Rose.png";
import martinFieldmanImg from "../img/ListYourPropertyPageImg/Martin Fieldman.png";
import michelAsjaImg from "../img/ListYourPropertyPageImg/Michel and Asja.png";
import louisGonzalezImg from "../img/ListYourPropertyPageImg/Louis Gonzalez.png";
import zoeyBerghoffImg from "../img/ListYourPropertyPageImg/Zoey Berghoff.png";
import shawnRitzenthalerImg from "../img/ListYourPropertyPageImg/Shawn Ritzenthaler.png";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  imgSrc: string;
}

export default function ListYourPropertyPage() {
  useEffect(() => {
    const id = "join-booking-clone-styles";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.innerHTML = `
:root{
  --blue-darker:#003b95;
  --blue-dark:#003b95;
  --blue:#006ce4;
  --ink-black:#262626;
  --ink-grey:#595959;
  --line-grey:#e0e0e0;
  --gold:#ffb700;
  --green:#008009;
  --tick-ring:#D9D9D9;
  --body-bg:#fff;
}
*{box-sizing:border-box}
html,body,#root{height:100%}
body{margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:var(--ink-black);background:var(--body-bg)}
a{color:var(--blue);text-decoration:none}
a:hover{text-decoration:underline}
b,strong{font-weight:700}

.wrap{max-width:1128px;margin:0 auto;padding:0 24px}
.btn{display:inline-flex;align-items:center;justify-content:center;height:40px;padding:0 24px;border:0;border-radius:4px;background:var(--blue);color:#fff;font-weight:500;font-size:16px;cursor:pointer;text-decoration:none}
.btn:hover{background:#0059bc}

/* HEADER - стили перенесены в AdminHeader компонент */

/* HERO */
.hero-section{background:var(--blue-dark);color:#fff;padding:32px 0 64px}
.hero-join-banner{display:inline-flex;align-items:center;gap:8px;background:var(--green);color:#fff;padding:4px 10px;border-radius:4px;font-size:14px;font-weight:500;margin-bottom:24px}
.hero-grid{display:grid;gap:32px;align-items:start}
@media(min-width:992px){.hero-grid{grid-template-columns:1fr 400px}}
.h1{margin:0 0 8px;font-weight:700;letter-spacing:-.5px;font-size:52px;line-height:1.1}
.h1 .accent{display:inline;background:linear-gradient(180deg,#31b4ff 0%,#0a6adf 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.subt{color:rgba(255,255,255,.9);font-size:18px;line-height:1.5;max-width:550px;margin:0}

/* CARD */
.card{background:#fff;border-radius:8px;border:4px solid var(--gold);box-shadow:0 4px 16px rgba(0,0,0,.15)}
.card-b{padding:20px}
.card h3{margin:0 0 4px;font-size:20px;font-weight:700;color:var(--ink-black)}
.card small{display:block;color:var(--ink-grey);font-size:14px;margin-bottom:12px}
.card-row{display:flex;gap:12px;align-items:center;margin:12px 0}
.card-row span{font-size:14px;line-height:1.4;color:var(--ink-black)}
.card .btn{margin-top:16px;width:100%;font-size:16px;font-weight:bold;height:44px}
.card-note{margin-top:16px;border-top:1px solid var(--line-grey);padding-top:16px;font-size:14px;color:var(--ink-black)}
.card-note a{font-weight:700}

/* SECTIONS */
.section{padding:56px 0}
.h2{font-size:32px;line-height:1.2;font-weight:700;margin:0 0 24px;text-align:left}
.cols{display:grid;gap:48px}
@media(min-width:768px){.cols-3{grid-template-columns:repeat(3,1fr)}}
@media(min-width:768px){.cols-2{grid-template-columns:repeat(2,1fr)}}
.col h4{margin:0 0 12px;font-size:18px;line-height:1.4;font-weight:700}
.feature-line{display:flex;gap:12px;align-items:flex-start;margin:12px 0;font-size:16px;line-height:1.5;color:var(--ink-grey)}

/* LEFT-START */
.left-start{text-align:left}
.left-start .image-col{text-align:left}
.left-start .image-col img{margin:0 0 16px 0}

/* IMAGE TRIO */
.image-col{text-align:center}
.image-col img{margin:0 auto 16px;height:64px}
.image-col h4{font-size:16px;font-weight:bold}
.image-col p{font-size:14px;color:var(--ink-grey);line-height:1.5;max-width:300px;margin:0 auto}

/* GLOBAL STATS (transparent bg) */
.global-section{background-color:transparent;text-align:left}
.global-grid{display:grid;gap:32px;align-items:center}
@media(min-width:768px){.global-grid{grid-template-columns:repeat(3,1fr)}}
.stat-num{font-size:48px;font-weight:700;margin:0 0 8px;color:var(--blue-darker)}
.stat-desc{font-size:16px;line-height:1.5;color:var(--ink-grey)}

/* TESTIMONIALS (grey bg) */
.testimonials-section{background-color:#f5f5f5}
.testimonials-grid{column-count:2;column-gap:24px}
@media(max-width:767px){.testimonials-grid{column-count:1}}
.testimonial-card{background:#fff;border:1px solid var(--gold);border-radius:8px;padding:24px;margin-bottom:24px;break-inside:avoid}
.testimonial-quote{font-size:16px;line-height:1.6;color:var(--ink-grey);margin:0 0 16px}
.testimonial-author{display:flex;align-items:center;gap:12px}
.testimonial-author img{width:48px;height:48px;border-radius:50%}
.testimonial-author .author-info{font-size:14px}
.author-info .name{font-weight:700;color:var(--ink-black)}
.author-info .role{color:var(--ink-grey)}

/* FAQ */
.faq-grid{display:grid;gap:24px;max-width:1128px;margin:0 auto}
@media(min-width:768px){.faq-grid{grid-template-columns:repeat(2,1fr)}}
.faq-item{border:1px solid var(--line-grey);border-radius:8px;padding:16px 24px;background:#fff}
button.faq-question{display:flex;justify-content:space-between;align-items:center;font-size:16px;font-weight:700;cursor:pointer;width:100%;background:transparent;border:0;padding:0;color:var(--ink-black)}
.faq-answer{color:var(--ink-grey);font-size:16px;line-height:1.6;margin-top:12px;max-height:0;overflow:hidden;transition:max-height .3s ease}
.faq-item.open .faq-answer{max-height:500px}
.faq-divider{height:1px;background:var(--line-grey);margin:16px 0}
.chev{transition:transform .2s ease}
.faq-item.open .chev{transform:rotate(180deg)}

/* FOOTER */
.footer{background:var(--blue-darker);color:#fff;padding:72px 0 0}
.footer a{color:#fff;text-decoration:underline}
.footer .wrap{max-width:1200px}

.footer-top{display:grid;gap:48px;align-items:center}
@media(min-width:992px){.footer-top{grid-template-columns:1fr 380px}}

.footer-cta h2{font-size:44px;line-height:1.1;margin:0}

.reg-card{background:#fff;border:4px solid var(--gold);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.15)}
.reg-card-b{padding:20px}
.reg-card h3{margin:0 0 12px;color:#000;font-size:20px;font-weight:700}
.reg-list{margin:0 0 16px;padding:0;list-style:none;display:grid;gap:10px}
.reg-line{display:flex;align-items:center;gap:10px;color:#262626;font-size:14px}
.reg-btn{display:flex;align-items:center;justify-content:center;height:40px;width:100%;border-radius:4px;background:var(--blue);color:#fff;text-decoration:none;font-weight:600;border:0}
.reg-btn:hover{background:#0059bc}
.reg-btn span{margin-left:8px}

.footer-divider{border-top:1px solid rgba(255,255,255,.35);margin:56px 0 32px}

.footer-links-row{display:grid;gap:32px}
@media(min-width:992px){.footer-links-row{grid-template-columns:repeat(3,1fr)}}
.footer-col h4{margin:0 0 12px;font-size:16px;font-weight:700}
.footer-col ul{margin:0;padding:0;list-style:none}
.footer-col li{margin:0 0 8px}
.footer-col a{font-size:14px}

.footer-meta{display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;margin-top:24px;padding:16px 0}
.footer-bottom-links{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.footer-bottom-links .sep{opacity:.6}
.copyright{margin:0;color:rgba(255,255,255,.85);font-size:12px}
`;
    document.head.appendChild(s);
    return () => {
      const styleEl = document.getElementById(id);
      if (styleEl) styleEl.remove();
    };
  }, []);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What happens if my property is damaged by a guest?",
      a: "Property owners can request damage deposits from guests. Deposits help cover any potential damage caused by a guest, offering some reassurance that your property will be treated respectfully. If anything goes wrong, it can be reported to our team through our misconduct reporting feature.",
    },
    {
      q: "When will my property go online?",
      a: "Once you've finished creating your listing, you can open your property for bookings on our site. We may ask you to verify your property before you can start accepting bookings, but you can use this time to get familiar with our extranet and get prepared for your first guests.",
    },
  ];

  const TestimonialCard = ({
    quote,
    name,
    role,
    imgSrc,
  }: TestimonialCardProps) => (
    <div className="testimonial-card">
      <p className="testimonial-quote">"{quote}"</p>
      <div className="testimonial-author">
        <img src={imgSrc} alt={name} />
        <div className="author-info">
          <div className="name">{name}</div>
          <div className="role">{role}</div>
        </div>
      </div>
    </div>
  );

  const Tick = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11.5" fill="none" stroke="var(--tick-ring)" />
      <path
        d="M7 12.1579L10.0588 15L17 8"
        stroke="var(--ink-black)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const ChevronDown = ({ className = "" }: { className?: string }) => (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
        fill="currentColor"
      />
    </svg>
  );

  return (
    <>
      <AdminHeader />

      <main>
        <section className="hero-section">
          <div className="wrap">
            <div className="hero-join-banner">
              Join 29,278,209 other listings already on Booking.com
            </div>
            <div className="hero-grid">
              <div>
                <h1 className="h1">
                  List your <span className="accent">apartment</span>
                  <br />
                  on Booking.com
                </h1>
                <p className="subt">
                  List on one of the world’s most downloaded travel apps to earn
                  more, faster and expand into new markets.
                </p>
              </div>

              <div className="card">
                <div className="card-b">
                  <h3>Register for free</h3>
                  <small>
                    45% of hosts get their first booking within a week
                  </small>
                  <div className="card-row">
                    <Tick />
                    <span>
                      Choose instant bookings or <b>Request to Book</b>
                    </span>
                  </div>
                  <div className="card-row">
                    <Tick />
                    <span>We’ll facilitate payments for you</span>
                  </div>
                  <Link to="/partner-register" className="btn">
                    Start registration →
                  </Link>
                  <div className="card-note">
                    Already started a registration?{" "}
                    <Link to="/partner-register">
                      Continue your registration
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <h2 className="h2">Host worry-free. We’ve got your back</h2>
            <div className="cols cols-3">
              <div className="col">
                <h4>Your rental, your rules</h4>
                <div className="feature-line">
                  <Tick />
                  <span>
                    Accept or decline bookings with{" "}
                    <a href="#">Request to Book</a>.
                  </span>
                </div>
                <div className="feature-line">
                  <Tick />
                  <span>
                    Manage your guests’ expectations by setting up clear house
                    rules.
                  </span>
                </div>
                <div style={{ marginTop: "24px" }}>
                  <Link to="/partner-register" className="btn">
                    Start registration
                  </Link>
                </div>
                <div style={{ marginTop: 12, color: "#6b7280", fontSize: 12 }}>
                  *Currently available for guest bookings made via iOS.
                </div>
              </div>
              <div className="col">
                <h4>Get to know your guests</h4>
                <div className="feature-line">
                  <Tick />
                  <span>
                    Chat with your guests before accepting their stay with
                    pre-booking messaging.*
                  </span>
                </div>
                <div className="feature-line">
                  <Tick />
                  <span>Access guest travel history insights.</span>
                </div>
              </div>
              <div className="col">
                <h4>Stay protected</h4>
                <div className="feature-line">
                  <Tick />
                  <span>
                    Protection against <a href="#">liability claims</a> from
                    guests and neighbours up to €/$/£1,000,000 for every
                    reservation.
                  </span>
                </div>
                <div className="feature-line">
                  <Tick />
                  <span>
                    Selection of <a href="#">damage protection</a> options for
                    you to choose.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="wrap">
            <h2 className="h2">
              Take control of your finances with Payments by Booking.com
            </h2>
            <div className="cols cols-2">
              <div className="col">
                <div className="feature-line">
                  <Tick />
                  <span>
                    <b>Payments made easy</b>
                    <br />
                    We facilitate the payment process for you, freeing up your
                    time to grow your business.
                  </span>
                </div>
                <div className="feature-line">
                  <Tick />
                  <span>
                    <b>Greater revenue security</b>
                    <br />
                    Whenever guests complete prepaid reservations at your
                    property and pay online, you are guaranteed payment.
                  </span>
                </div>
                <div className="feature-line">
                  <Tick />
                  <span>
                    <b>More control over your cash flow</b>
                    <br />
                    Choose your payout method and timing based on regional
                    availability.
                  </span>
                </div>
              </div>
              <div className="col">
                <div className="feature-line">
                  <Tick />
                  <span>
                    <b>Daily payouts in select markets</b>
                    <br />
                    Get payouts faster! We’ll send your payouts 24 hours after
                    guest checkout.
                  </span>
                </div>
                <div className="feature-line">
                  <Tick />
                  <span>
                    <b>One-stop solution for multiple listings</b>
                    <br />
                    Save time managing finances with group invoicing and
                    reconciliation.
                  </span>
                </div>
                <div className="feature-line">
                  <Tick />
                  <span>
                    <b>Reduced risk</b>
                    <br />
                    We help you stay compliant with regulatory changes and
                    reduce the risk of fraud and chargebacks.
                  </span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "24px", textAlign: "left" }}>
              <Link to="/partner-register" className="btn">
                Start registration
              </Link>
            </div>
          </div>
        </section>

        <section className="section left-start">
          <div className="wrap">
            <h2 className="h2">Simple to begin and stay ahead</h2>
            <div className="cols cols-3">
              <div className="image-col">
                <img
                  src={importPropertyDetailsImg}
                  alt="Import property details icon"
                />
                <h4>Import your property details</h4>
                <p>
                  Seamlessly import your property information from other travel
                  websites and avoid overbooking with calendar sync.
                </p>
              </div>
              <div className="image-col">
                <img
                  src={startFastImg}
                  alt="Start fast with review scores icon"
                />
                <h4>Start fast with review scores</h4>
                <p>
                  Your review scores on other travel websites are converted and
                  displayed on your property page before your first Booking.com
                  guests leave their reviews.
                </p>
              </div>
              <div className="image-col">
                <img src={standOutImg} alt="Stand out in the market icon" />
                <h4>Stand out in the market</h4>
                <p>
                  The "New to Booking.com" label helps you stand out in our
                  search results.
                </p>
              </div>
            </div>
            <div style={{ marginTop: "32px" }}>
              <Link to="/partner-register" className="btn">
                Start registration
              </Link>
            </div>
          </div>
        </section>

        <section className="section global-section">
          <div className="wrap">
            <h2 className="h2">Reach a unique global customer base</h2>

            <div className="global-grid">
              <div>
                <div className="stat-num">1.8+ billion</div>
                <div className="stat-desc">
                  holiday rental guests since 2010.
                </div>
              </div>
              <div>
                <div className="stat-num">1 in every 3</div>
                <div className="stat-desc">
                  room nights booked in 2024 was a holiday rental.
                </div>
              </div>
              <div>
                <div className="stat-num">48% of nights</div>
                <div className="stat-desc">
                  booked were for international stays at the end of 2023.
                </div>
              </div>
            </div>

            <div style={{ textAlign: "left", marginTop: 32 }}>
              <Link to="/partner-register" className="btn">
                Start registration
              </Link>
            </div>
          </div>
        </section>

        <section className="section testimonials-section">
          <div className="wrap">
            <h2 className="h2">What hosts like you say</h2>
            <div className="testimonials-grid">
              <TestimonialCard
                quote="I was able to list within 15 minutes, and no more than two hours later, I had my first booking!"
                name="Parley Rose"
                role="UK-based host"
                imgSrc={parleyRoseImg}
              />
              <TestimonialCard
                quote="Booking.com is the most straightforward [OTA] to work with. Everything is clear. It's easy..."
                name="Martin Fieldman"
                role="Managing Director, Abodebed"
                imgSrc={martinFieldmanImg}
              />
              <TestimonialCard
                quote="Booking.com accounts for our largest share of guests and has helped get us where we are today."
                name="Michel and Asja"
                role="Owners of La Maison de Souhey"
                imgSrc={michelAsjaImg}
              />
              <TestimonialCard
                quote="Travellers come to Charming Lofts from all over the world..."
                name="Louis Gonzalez"
                role="Charming Lofts, Los Angeles"
                imgSrc={louisGonzalezImg}
              />
              <TestimonialCard
                quote="After joining Booking.com and setting up the listing..."
                name="Zoey Berghoff"
                role="US-based host"
                imgSrc={zoeyBerghoffImg}
              />
              <TestimonialCard
                quote="Getting started with Booking.com was super simple and took no time at all."
                name="Shawn Ritzenthaler"
                role="Owner of The Hollywood Hills Mansion"
                imgSrc={shawnRitzenthalerImg}
              />
            </div>

            <div style={{ textAlign: "left", marginTop: "32px" }}>
              <Link to="/partner-register" className="btn">
                Start registration
              </Link>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <h2 className="h2">Your questions answered</h2>

            <div className="faq-grid">
              {faqs.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i} className={`faq-item ${isOpen ? "open" : ""}`}>
                    <button
                      className="faq-question"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                    >
                      <span>{item.q}</span>
                      <ChevronDown className="chev" />
                    </button>

                    <div className="faq-divider" />

                    <div id={`faq-panel-${i}`} className="faq-answer">
                      {item.a}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="faq-note" style={{ textAlign: "left" }}>
              Still have questions? Find answers to all your questions on our{" "}
              <a href="#">FAQ</a>.
            </p>

            <div style={{ textAlign: "left", marginTop: "16px" }}>
              <Link to="/partner-register" className="btn">
                Start registration
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-top">
            <div className="footer-cta">
              <h2>
                Sign up and start
                <br />
                welcoming guests today!
              </h2>
            </div>

            <div className="reg-card">
              <div className="reg-card-b">
                <h3>Register for free</h3>
                <ul className="reg-list">
                  <li className="reg-line">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 12.9l2.7 2.7L17 9.3"
                        fill="none"
                        stroke="#008009"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    45% of hosts get their first booking within a week
                  </li>
                  <li className="reg-line">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 12.9l2.7 2.7L17 9.3"
                        fill="none"
                        stroke="#008009"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Choose instant bookings or Request to Book
                  </li>
                  <li className="reg-line">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 12.9l2.7 2.7L17 9.3"
                        fill="none"
                        stroke="#008009"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    We’ll facilitate payments for you
                  </li>
                </ul>
                <Link to="/partner-register" className="reg-btn">
                  Start registration <span>→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="footer-divider" />

          <div className="footer-links-row">
            <div className="footer-col">
              <h4>Discover</h4>
              <ul>
                <li>
                  <a href="#">Trust and Safety</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Useful links</h4>
              <ul>
                <li>
                  <a href="#">Extranet</a>
                </li>
                <li>
                  <a href="#">Pulse for Android</a>
                </li>
                <li>
                  <a href="#">Pulse for iOS</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Help and communities</h4>
              <ul>
                <li>
                  <a href="#">Partner Help</a>
                </li>
                <li>
                  <a href="#">Partner Community</a>
                </li>
                <li>
                  <a href="#">How-to videos</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-meta">
            <div className="footer-bottom-links">
              <a href="#">About Us</a>
              <span className="sep">|</span>
              <a href="#">Privacy and Cookie Statement</a>
            </div>
            <p className="copyright">© Copyright Booking.com 2025</p>
          </div>
        </div>
      </footer>
    </>
  );
}
