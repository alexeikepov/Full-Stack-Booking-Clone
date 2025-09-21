// src/pages/ListYourPropertyPage.tsx
import { useEffect } from "react";

// Import the local images from your project structure
import importPropertyDetailsImg from "../img/ListYourPropertyPageImg/Import your property details.png";
import startFastImg from "../img/ListYourPropertyPageImg/Start fast with review scores.png";
import standOutImg from "../img/ListYourPropertyPageImg/Stand out in the market.png";

// Define a TypeScript interface for the TestimonialCard props
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
  --blue-darker: #00224F;
  --blue-dark: #003580;
  --blue: #006ce4;
  --ink-black: #262626;
  --ink-grey: #595959;
  --line-grey: #e0e0e0;
  --gold: #ffb700;
  --green: #008009;
  --tick-ring: #D9D9D9;
  --body-bg: #fff;
}
*{box-sizing:border-box}
html,body,#root{height:100%}
body{margin:0;font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;color:var(--ink-black);background:var(--body-bg)}
a{color:var(--blue);text-decoration:none}
a:hover{text-decoration:underline}
b, strong { font-weight: 700; }

.wrap{max-width:1128px;margin:0 auto;padding:0 24px}
.btn{display:inline-flex;align-items:center;justify-content:center;height:40px;padding:0 24px;border:0;border-radius:4px;background:var(--blue);color:#fff;font-weight:500;font-size:16px;cursor:pointer;text-decoration:none}
.btn:hover{background:#0059bc}

/* HEADER */
.page-header{background:var(--blue-dark);color:#fff; padding: 12px 0;}
.header-in{display:flex;justify-content:space-between;align-items:center}
.logo{font-size:24px;font-weight:bold;color:#fff;text-decoration:none}
.header-nav{display:flex;align-items:center;gap:16px}
.header-nav span{font-size:14px}
.header-btn{display:inline-block;padding:8px 12px;border:1px solid #fff;border-radius:4px;color:#fff;text-decoration:none;font-size:14px;background:transparent}
.header-btn:hover{background:rgba(255,255,255,0.1)}

/* HERO SECTION */
.hero-section { background: var(--blue-dark); color: #fff; padding: 32px 0; }
.hero-join-banner{display:inline-flex;align-items:center;gap:8px;background:var(--green);color:#fff;padding:4px 10px;border-radius:4px;font-size:14px;font-weight:500; margin-bottom: 24px;}
.hero-grid{display:grid;gap:32px;align-items:start}
@media(min-width:992px){.hero-grid{grid-template-columns:1fr 400px}}
.h1{margin:0 0 8px;font-weight:700;letter-spacing:-.5px;font-size:52px;line-height:1.1}
.h1 .accent{display:inline;background:linear-gradient(180deg,#31b4ff 0%,#0a6adf 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.subt{color:rgba(255,255,255,.9);font-size:18px;line-height:1.5;max-width:550px;margin:0}

/* REGISTRATION CARD */
.card{background:#fff;border-radius:8px;border:4px solid var(--gold);box-shadow:0 4px 16px rgba(0,0,0,.15)}
.card-b{padding:20px}
.card h3{margin:0 0 4px;font-size:20px;font-weight:700;color:var(--ink-black)}
.card small{display:block;color:var(--ink-grey);font-size:14px;margin-bottom:12px}
.card-row{display:flex;gap:12px;align-items:center;margin:12px 0}
.card-row span{font-size:14px;line-height:1.4;color:var(--ink-black)}
.card .btn{margin-top:16px;width:100%;font-size:16px;font-weight:bold;height:44px}
.card-note{margin-top:16px;border-top:1px solid var(--line-grey);padding-top:16px;font-size:14px;color:var(--ink-black)}
.card-note a { font-weight: 700; }

/* GENERIC SECTION */
.section{padding:56px 0}
.h2{font-size:32px;line-height:1.2;font-weight:700;margin:0 0 24px}
.cols{display:grid;gap:48px}
@media(min-width:768px){.cols-3{grid-template-columns:repeat(3,1fr)}}
@media(min-width:768px){.cols-2{grid-template-columns:repeat(2,1fr)}}
.col h4{margin:0 0 12px;font-size:18px;line-height:1.4;font-weight:700}
.feature-line{display:flex;gap:12px;align-items:flex-start;margin:12px 0;font-size:16px;line-height:1.5;color:var(--ink-grey)}

/* LOCAL IMAGE SECTION */
.image-col{text-align:center}
.image-col img{margin:0 auto 16px;height:64px}
.image-col h4{font-size:16px;font-weight:bold}
.image-col p{font-size:14px;color:var(--ink-grey);line-height:1.5;max-width:300px;margin:0 auto}

/* GLOBAL STATS SECTION */
.global-section{background-color:#f5f5f5;text-align:center;}
.global-grid{display:grid;gap:32px;align-items:center}
@media(min-width:768px){.global-grid{grid-template-columns:repeat(3,1fr)}}
.stat-num{font-size:48px;font-weight:700;margin:0 0 8px;color:var(--blue-darker)}
.stat-desc{font-size:16px;line-height:1.5;color:var(--ink-grey)}

/* TESTIMONIALS SECTION */
.testimonials-grid{column-count:2;column-gap:24px}
.testimonial-card{background:#fff;border:1px solid var(--gold);border-radius:8px;padding:24px;margin-bottom:24px;break-inside:avoid}
.testimonial-quote{font-size:16px;line-height:1.6;color:var(--ink-grey);margin:0 0 16px}
.testimonial-author{display:flex;align-items:center;gap:12px}
.testimonial-author img{width:48px;height:48px;border-radius:50%}
.testimonial-author .author-info{font-size:14px}
.author-info .name{font-weight:700;color:var(--ink-black)}
.author-info .role{color:var(--ink-grey)}

/* FAQ SECTION */
.faq-grid{display:grid;gap:24px;max-width:1128px;margin:0 auto}
@media(min-width:768px){.faq-grid{grid-template-columns:repeat(2,1fr)}}
.faq-item{border:1px solid var(--line-grey);border-radius:8px;padding:16px 24px}
.faq-question{display:flex;justify-content:space-between;align-items:center;font-size:16px;font-weight:700;cursor:pointer}
.faq-note{text-align:center;margin-top:24px;font-size:14px}

/* FOOTER */
.footer{background:var(--blue-darker);color:#fff;padding:56px 0 0}
.footer-grid{display:grid;gap:48px;align-items:start}
@media(min-width:992px){.footer-grid{grid-template-columns:1fr 400px}}
.footer h2{font-size:40px;margin:0 0 32px;font-weight:700}
.footer-links-grid{display:grid;gap:32px;grid-template-columns:repeat(auto-fill,minmax(180px,1fr))}
.footer-col h4{margin:0 0 12px;font-size:16px;font-weight:bold;text-decoration:none}
.footer-col ul{margin:0;padding:0;list-style:none}
.footer-col li{margin-bottom:8px}
.footer-col a{color:#fff;text-decoration:underline;font-size:14px}
.footer-bottom-bar{border-top:1px solid rgba(255,255,255,.2);margin-top:48px;padding:24px 0}
.footer-bottom-links{display:flex;flex-wrap:wrap;gap:24px;justify-content:center;font-size:14px}
.footer-bottom-links a{color:#fff;text-decoration:underline}
.copyright{text-align:center;margin-top:16px;font-size:12px;color:rgba(255,255,255,.8)}
`;
    document.head.appendChild(s);
    return () => {
      const styleEl = document.getElementById(id);
      if (styleEl) styleEl.remove();
    };
  }, []);
  
  const TestimonialCard = ({ quote, name, role, imgSrc }: TestimonialCardProps) => (
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

  const UKFlag = () => (
    <svg width="24" height="24" viewBox="0 0 24 24">
        <defs><clipPath id="a"><path d="M0 0h24v24H0z"/></clipPath></defs>
        <g clip-path="url(#a)">
            <path fill="#00247d" d="M0 0h24v24H0z"/>
            <path fill="#fff" d="m23.1-1.3-10.6 7-1.7-1.1L21.3-2l1.8.7Zm-24 0L9.7 5.7l1.7-1.1L.9-2l-1.8.7Z M.9 26 11.5 19l1.7 1.1L2.7 26.7.9 26Zm24 0L12.3 19l-1.7 1.1L21.3 26.7l1.8-.7Z"/>
            <path fill="#cf142b" d="m14.3 9.4-12.8-8.5-2.4 3.6 12.8 8.5 2.4-3.6Zm-2.9 8.8L-1.4 26.7l2.4 3.6 12.8-8.5-2.4-3.6Z M-1.4-1.3 11.5 7.2l2.4-3.6L1.1-4.9-1.4-1.3Zm12.8 24.1L-1.4 4.3l2.4-3.6 12.8 8.5-2.4 3.6Z"/>
            <path fill="#fff" d="M9.1 0h5.8v24H9.1V0ZM0 9.1h24v5.8H0V9.1Z"/>
            <path fill="#cf142b" d="M10.3 0h3.4v24h-3.4V0ZM0 10.3h24v3.4H0v-3.4Z"/>
        </g>
    </svg>
  );

  const Tick = () => (
     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11.5" fill="none" stroke="var(--tick-ring)"/>
        <path d="M7 12.1579L10.0588 15L17 8" stroke="var(--ink-black)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ChevronDown = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor"/>
    </svg>
  );

  return (
    <>
      <header className="page-header">
          <div className="wrap header-in">
            <a href="#" className="logo">Booking.com</a>
            <nav className="header-nav">
              <UKFlag />
              <span>Already a partner?</span>
              <a href="#" className="header-btn">Sign in</a>
              <a href="#" className="header-btn">Help</a>
            </nav>
          </div>
      </header>
      
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
                  <br/>
                  on Booking.com
                </h1>
                <p className="subt">
                  List on one of the world’s most downloaded travel apps to earn more, faster and expand into new markets.
                </p>
              </div>

              <div className="card">
                <div className="card-b">
                  <h3>Register for free</h3>
                  <small>45% of hosts get their first booking within a week</small>
                  <div className="card-row"><Tick /><span>Choose instant bookings or <b>Request to Book</b></span></div>
                  <div className="card-row"><Tick /><span>We’ll facilitate payments for you</span></div>
                  <a href="#" className="btn">Start registration →</a>
                  <div className="card-note">
                    Already started a registration? <a href="#">Continue your registration</a>
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
                <div className="feature-line"><Tick /><span>Accept or decline bookings with <a href="#">Request to Book</a>.</span></div>
                <div className="feature-line"><Tick /><span>Manage your guests’ expectations by setting up clear house rules.</span></div>
                <div style={{marginTop: "24px"}}><a href="#" className="btn">Start registration</a></div>
                <div style={{ marginTop: 12, color: "#6b7280", fontSize: 12 }}>*Currently available for guest bookings made via iOS.</div>
              </div>
              <div className="col">
                <h4>Get to know your guests</h4>
                <div className="feature-line"><Tick /><span>Chat with your guests before accepting their stay with pre-booking messaging.*</span></div>
                <div className="feature-line"><Tick /><span>Access guest travel history insights.</span></div>
              </div>
              <div className="col">
                <h4>Stay protected</h4>
                <div className="feature-line"><Tick /><span>Protection against <a href="#">liability claims</a> from guests and neighbours up to €/$/£1,000,000 for every reservation.</span></div>
                <div className="feature-line"><Tick /><span>Selection of <a href="#">damage protection</a> options for you to choose.</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="wrap">
            <h2 className="h2">Take control of your finances with Payments by Booking.com</h2>
            <div className="cols cols-2">
              <div className="col">
                <div className="feature-line"><Tick /><span><b>Payments made easy</b><br/>We facilitate the payment process for you, freeing up your time to grow your business.</span></div>
                <div className="feature-line"><Tick /><span><b>Greater revenue security</b><br/>Whenever guests complete prepaid reservations at your property and pay online, you are guaranteed payment.</span></div>
                <div className="feature-line"><Tick /><span><b>More control over your cash flow</b><br/>Choose your payout method and timing based on regional availability.</span></div>
              </div>
              <div className="col">
                <div className="feature-line"><Tick /><span><b>Daily payouts in select markets</b><br/>Get payouts faster! We’ll send your payouts 24 hours after guest checkout.</span></div>
                <div className="feature-line"><Tick /><span><b>One-stop solution for multiple listings</b><br/>Save time managing finances with group invoicing and reconciliation.</span></div>
                <div className="feature-line"><Tick /><span><b>Reduced risk</b><br/>We help you stay compliant with regulatory changes and reduce the risk of fraud and chargebacks.</span></div>
              </div>
            </div>
              <div style={{marginTop: "24px"}}><a href="#" className="btn">Start registration</a></div>
          </div>
        </section>

        <section className="section">
            <div className="wrap">
                <h2 className="h2" style={{textAlign:"center"}}>Simple to begin and stay ahead</h2>
                <div className="cols cols-3">
                    <div className="image-col">
                        <img src={importPropertyDetailsImg} alt="Import property details icon" />
                        <h4>Import your property details</h4>
                        <p>Seamlessly import your property information from other travel websites and avoid overbooking with calendar sync.</p>
                    </div>
                    <div className="image-col">
                        <img src={startFastImg} alt="Start fast with review scores icon" />
                        <h4>Start fast with review scores</h4>
                        <p>Your review scores on other travel websites are converted and displayed on your property page before your first Booking.com guests leave their reviews.</p>
                    </div>
                    <div className="image-col">
                         <img src={standOutImg} alt="Stand out in the market icon" />
                        <h4>Stand out in the market</h4>
                        <p>The "New to Booking.com" label helps you stand out in our search results.</p>
                    </div>
                </div>
                <div style={{textAlign: "center", marginTop: "32px"}}><a href="#" className="btn">Start registration</a></div>
            </div>
        </section>

        <section className="section global-section">
          <div className="wrap">
            <h2 className="h2">Reach a unique global customer base</h2>
            <div className="global-grid">
              <div>
                <div className="stat-num">1.8+ billion</div>
                <div className="stat-desc">holiday rental guests since 2010.</div>
              </div>
              <div>
                <div className="stat-num">1 in every 3</div>
                <div className="stat-desc">room nights booked in 2024 was a holiday rental.</div>
              </div>
              <div>
                <div className="stat-num">48% of nights</div>
                <div className="stat-desc">booked were for international stays at the end of 2023.</div>
              </div>
            </div>
            <a href="#" className="btn" style={{ marginTop: 32 }}>Start registration</a>
          </div>
        </section>
        
        <section className="section">
          <div className="wrap">
            <h2 className="h2" style={{ textAlign: "center" }}>What hosts like you say</h2>
            <div className="testimonials-grid">
              <TestimonialCard 
                quote="I was able to list within 15 minutes, and no more than two hours later, I had my first booking!"
                name="Parley Rose"
                role="UK-based host"
                imgSrc="https://cf.bstatic.com/static/img/join/list-your-property/testimonials/Parley_Rose@2x.jpg"
              />
              <TestimonialCard 
                quote="Booking.com is the most straightforward [OTA] to work with. Everything is clear. It's easy. And it frees us up to focus on the aspects that we can really add value to, like the guest experience."
                name="Martin Fieldman"
                role="Managing Director, Abodebed"
                imgSrc="https://cf.bstatic.com/static/img/join/list-your-property/testimonials/Martin_Fieldman@2x.jpg"
              />
              <TestimonialCard 
                quote="Booking.com accounts for our largest share of guests and has helped get us where we are today."
                name="Michel and Asja"
                role="Owners of La Maison de Souhey"
                imgSrc="https://cf.bstatic.com/static/img/join/list-your-property/testimonials/Michel_and_Asja@2x.jpg"
              />
              <TestimonialCard 
                quote="Travellers come to Charming Lofts from all over the world. Booking.com really helps with that. Unlike some other platforms, it’s multinational and caters to a much larger audience. For me, that was a real game-changer."
                name="Louis Gonzalez"
                role="Charming Lofts, Los Angeles"
                imgSrc="https://cf.bstatic.com/static/img/join/list-your-property/testimonials/Louis_Gonzalez@2x.jpg"
              />
              <TestimonialCard 
                quote="After joining Booking.com and setting up the listing, my occupancy went up significantly and bookings were coming in five to six months in advance."
                name="Zoey Berghoff"
                role="US-based host"
                imgSrc="https://cf.bstatic.com/static/img/join/list-your-property/testimonials/Zoey_Berghoff@2x.jpg"
              />
               <TestimonialCard 
                quote="Getting started with Booking.com was super simple and took no time at all."
                name="Shawn Ritzenthaler"
                role="Owner of The Hollywood Hills Mansion"
                imgSrc="https://cf.bstatic.com/static/img/join/list-your-property/testimonials/Shawn_Ritzenthaler@2x.jpg"
              />
            </div>
            <div style={{textAlign: "center", marginTop: "32px"}}><a href="#" className="btn">Start registration</a></div>
          </div>
        </section>

        <section className="section">
            <div className="wrap">
                <h2 className="h2" style={{textAlign: "center"}}>Your questions answered</h2>
                <div className="faq-grid">
                    <div className="faq-item">
                        <div className="faq-question">
                            <span>What happens if my property is damaged by a guest?</span>
                            <ChevronDown />
                        </div>
                    </div>
                    <div className="faq-item">
                        <div className="faq-question">
                            <span>When will my property go online?</span>
                            <ChevronDown />
                        </div>
                    </div>
                </div>
                <p className="faq-note">Still have questions? Find answers to all your questions on our <a href="#">FAQ</a>.</p>
                <div style={{textAlign: "center", marginTop: "16px"}}>
                    <a href="#" className="btn">Start registration</a>
                </div>
            </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <h2>Sign up and start welcoming guests today!</h2>
              <div className="footer-links-grid">
                <div className="footer-col">
                  <h4>Discover</h4>
                  <ul><li><a href="#">Trust and Safety</a></li></ul>
                </div>
                <div className="footer-col">
                  <h4>Useful links</h4>
                  <ul>
                    <li><a href="#">Extranet</a></li>
                    <li><a href="#">Pulse for Android</a></li>
                    <li><a href="#">Pulse for iOS</a></li>
                  </ul>
                </div>
                <div className="footer-col">
                  <h4>Help and communities</h4>
                  <ul>
                    <li><a href="#">Partner Help</a></li>
                    <li><a href="#">Partner Community</a></li>
                    <li><a href="#">How-to videos</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card" style={{borderColor: "#fff"}}>
              <div className="card-b">
                <h3>Register for free</h3>
                <small>45% of hosts get their first booking within a week</small>
                <div className="card-row"><Tick /><span>Choose instant bookings or <b>Request to Book</b></span></div>
                <div className="card-row"><Tick /><span>We’ll facilitate payments for you</span></div>
                <a href="#" className="btn">Start registration →</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom-bar">
            <div className="footer-bottom-links">
                <a href="#">About Us</a>
                <a href="#">Privacy and Cookie Statement</a>
            </div>
            <p className="copyright">© Copyright Booking.com 2025</p>
          </div>
        </div>
      </footer>
    </>
  );
}