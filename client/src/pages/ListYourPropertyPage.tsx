// src/pages/ListYourPropertyPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "@/components/admin/AdminHeader";

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

const btn =
  "inline-flex h-10 items-center justify-center rounded-md bg-[#006ce4] px-6 text-[16px] font-semibold text-white hover:bg-[#0059bc]";

const h2 = "text-[32px] leading-[1.2] font-bold mb-6 text-left";

function Tick() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11.5" fill="none" stroke="#D9D9D9" />
      <path
        d="M7 12.1579L10.0588 15L17 8"
        stroke="#262626"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDown({ className = "" }: { className?: string }) {
  return (
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
}

function TestimonialCard({ quote, name, role, imgSrc }: TestimonialCardProps) {
  return (
    <div className="mb-6 break-inside-avoid rounded-lg border border-[#ffb700] bg-white p-6">
      <p className="mb-4 text-[16px] leading-7 text-[#595959]">"{quote}"</p>
      <div className="flex items-center gap-3">
        <img
          src={imgSrc}
          alt={name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="text-[14px]">
          <div className="font-bold text-[#262626]">{name}</div>
          <div className="text-[#595959]">{role}</div>
        </div>
      </div>
    </div>
  );
}

export default function ListYourPropertyPage() {
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

  return (
    <>
      <AdminHeader />

      <main>
        <section className="bg-[#003b95] py-8 text-white">
          <div className="mx-auto max-w-[1128px] px-6">
            <div className="mb-6 inline-flex items-center gap-2 rounded-md bg-[#008009] px-3 py-1 text-[14px] font-medium text-white">
              Join 29,278,209 other listings already on Booking.com
            </div>

            <div className="grid items-start gap-8 lg:grid-cols-[1fr_400px]">
              <div>
                <h1 className="mb-2 text-[52px] font-bold leading-[1.1] tracking-[-0.5px]">
                  List your{" "}
                  <span className="bg-gradient-to-b from-[#31b4ff] to-[#0a6adf] bg-clip-text text-transparent">
                    apartment
                  </span>
                  <br />
                  on Booking.com
                </h1>
                <p className="max-w-[550px] text-[18px] leading-7 text-white/90">
                  List on one of the world’s most downloaded travel apps to earn
                  more, faster and expand into new markets.
                </p>
              </div>

              <div className="rounded-lg border-4 border-[#ffb700] bg-white text-[#262626] shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                <div className="p-5">
                  <h3 className="mb-1 text-[20px] font-bold">
                    Register for free
                  </h3>
                  <small className="mb-3 block text-[14px] text-[#595959]">
                    45% of hosts get their first booking within a week
                  </small>

                  <div className="my-3 flex items-center gap-3">
                    <Tick />
                    <span className="text-[14px] leading-[1.4]">
                      Choose instant bookings or <b>Request to Book</b>
                    </span>
                  </div>

                  <div className="my-3 flex items-center gap-3">
                    <Tick />
                    <span className="text-[14px] leading-[1.4]">
                      We’ll facilitate payments for you
                    </span>
                  </div>

                  <Link
                    to="/partner-register"
                    className={`${btn} mt-4 w-full h-11 text-[16px] font-bold`}
                  >
                    Start registration →
                  </Link>

                  <div className="mt-4 border-t border-[#e0e0e0] pt-4 text-[14px] text-[#262626]">
                    Already started a registration?{" "}
                    <Link
                      to="/partner-register"
                      className="font-bold underline decoration-transparent hover:decoration-inherit"
                    >
                      Continue your registration
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto max-w-[1128px] px-6">
            <h2 className={h2}>Host worry-free. We’ve got your back</h2>

            <div className="grid gap-12 md:grid-cols-3">
              <div>
                <h4 className="mb-3 text-[18px] font-bold leading-[1.4]">
                  Your rental, your rules
                </h4>

                <div className="mb-3 flex items-start gap-3 text-[16px] leading-6 text-[#595959]">
                  <Tick />
                  <span>
                    Accept or decline bookings with{" "}
                    <a
                      href="#"
                      className="text-[#006ce4] underline-offset-2 hover:underline"
                    >
                      Request to Book
                    </a>
                    .
                  </span>
                </div>

                <div className="mb-3 flex items-start gap-3 text-[16px] leading-6 text-[#595959]">
                  <Tick />
                  <span>
                    Manage your guests’ expectations by setting up clear house
                    rules.
                  </span>
                </div>

                <div className="mt-6">
                  <Link to="/partner-register" className={btn}>
                    Start registration
                  </Link>
                </div>

                <div className="mt-3 text-[12px] text-[#6b7280]">
                  *Currently available for guest bookings made via iOS.
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-[18px] font-bold leading-[1.4]">
                  Get to know your guests
                </h4>

                <div className="mb-3 flex items-start gap-3 text-[16px] leading-6 text-[#595959]">
                  <Tick />
                  <span>
                    Chat with your guests before accepting their stay with
                    pre-booking messaging.*
                  </span>
                </div>

                <div className="mb-3 flex items-start gap-3 text-[16px] leading-6 text-[#595959]">
                  <Tick />
                  <span>Access guest travel history insights.</span>
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-[18px] font-bold leading-[1.4]">
                  Stay protected
                </h4>

                <div className="mb-3 flex items-start gap-3 text-[16px] leading-6 text-[#595959]">
                  <Tick />
                  <span>
                    Protection against{" "}
                    <a
                      href="#"
                      className="text-[#006ce4] underline-offset-2 hover:underline"
                    >
                      liability claims
                    </a>{" "}
                    from guests and neighbours up to €/$/£1,000,000 for every
                    reservation.
                  </span>
                </div>

                <div className="mb-3 flex items-start gap-3 text-[16px] leading-6 text-[#595959]">
                  <Tick />
                  <span>
                    Selection of{" "}
                    <a
                      href="#"
                      className="text-[#006ce4] underline-offset-2 hover:underline"
                    >
                      damage protection
                    </a>{" "}
                    options for you to choose.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f5f5f5] py-14">
          <div className="mx-auto max-w-[1128px] px-6">
            <h2 className={h2}>
              Take control of your finances with Payments by Booking.com
            </h2>

            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <div className="mb-3 flex items-start gap-3 text-[16px] leading-6 text-[#595959]">
                  <Tick />
                  <span>
                    <b>Payments made easy</b>
                    <br />
                    We facilitate the payment process for you, freeing up your
                    time to grow your business.
                  </span>
                </div>

                <div className="mb-3 flex items-start gap-3 text-[16px] leading-6 text-[#595959]">
                  <Tick />
                  <span>
                    <b>Greater revenue security</b>
                    <br />
                    Whenever guests complete prepaid reservations at your
                    property and pay online, you are guaranteed payment.
                  </span>
                </div>

                <div className="mb-3 flex items-start gap-3 text-[16px] leading-6 text-[#595959]">
                  <Tick />
                  <span>
                    <b>More control over your cash flow</b>
                    <br />
                    Choose your payout method and timing based on regional
                    availability.
                  </span>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-start gap-3 text-[16px] leading-6 text-[#595959]">
                  <Tick />
                  <span>
                    <b>Daily payouts in select markets</b>
                    <br />
                    Get payouts faster! We’ll send your payouts 24 hours after
                    guest checkout.
                  </span>
                </div>

                <div className="mb-3 flex items-start gap-3 text-[16px] leading-6 text-[#595959]">
                  <Tick />
                  <span>
                    <b>One-stop solution for multiple listings</b>
                    <br />
                    Save time managing finances with group invoicing and
                    reconciliation.
                  </span>
                </div>

                <div className="mb-3 flex items-start gap-3 text-[16px] leading-6 text-[#595959]">
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

            <div className="mt-6 text-left">
              <Link to="/partner-register" className={btn}>
                Start registration
              </Link>
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto max-w-[1128px] px-6">
            <h2 className={h2}>Simple to begin and stay ahead</h2>

            <div className="grid gap-12 md:grid-cols-3">
              <div className="text-center md:text-left">
                <img
                  src={importPropertyDetailsImg}
                  alt="Import property details icon"
                  className="mx-auto mb-4 h-16 md:mx-0"
                />
                <h4 className="text-[16px] font-bold">
                  Import your property details
                </h4>
                <p className="mx-auto max-w-[300px] text-[14px] leading-6 text-[#595959] md:mx-0">
                  Seamlessly import your property information from other travel
                  websites and avoid overbooking with calendar sync.
                </p>
              </div>

              <div className="text-center md:text-left">
                <img
                  src={startFastImg}
                  alt="Start fast with review scores icon"
                  className="mx-auto mb-4 h-16 md:mx-0"
                />
                <h4 className="text-[16px] font-bold">
                  Start fast with review scores
                </h4>
                <p className="mx-auto max-w-[300px] text-[14px] leading-6 text-[#595959] md:mx-0">
                  Your review scores on other travel websites are converted and
                  displayed on your property page before your first Booking.com
                  guests leave their reviews.
                </p>
              </div>

              <div className="text-center md:text-left">
                <img
                  src={standOutImg}
                  alt="Stand out in the market icon"
                  className="mx-auto mb-4 h-16 md:mx-0"
                />
                <h4 className="text-[16px] font-bold">
                  Stand out in the market
                </h4>
                <p className="mx-auto max-w-[300px] text-[14px] leading-6 text-[#595959] md:mx-0">
                  The "New to Booking.com" label helps you stand out in our
                  search results.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link to="/partner-register" className={btn}>
                Start registration
              </Link>
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto max-w-[1128px] px-6 text-left">
            <h2 className={h2}>Reach a unique global customer base</h2>

            <div className="grid items-center gap-8 md:grid-cols-3">
              <div>
                <div className="text-[48px] font-bold text-[#003b95]">
                  1.8+ billion
                </div>
                <div className="text-[16px] leading-6 text-[#595959]">
                  holiday rental guests since 2010.
                </div>
              </div>
              <div>
                <div className="text-[48px] font-bold text-[#003b95]">
                  1 in every 3
                </div>
                <div className="text-[16px] leading-6 text-[#595959]">
                  room nights booked in 2024 was a holiday rental.
                </div>
              </div>
              <div>
                <div className="text-[48px] font-bold text-[#003b95]">
                  48% of nights
                </div>
                <div className="text-[16px] leading-6 text-[#595959]">
                  booked were for international stays at the end of 2023.
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link to="/partner-register" className={btn}>
                Start registration
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#f5f5f5] py-14">
          <div className="mx-auto max-w-[1128px] px-6">
            <h2 className={h2}>What hosts like you say</h2>

            <div className="columns-1 gap-6 md:columns-2">
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

            <div className="mt-8 text-left">
              <Link to="/partner-register" className={btn}>
                Start registration
              </Link>
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto max-w-[1128px] px-6">
            <h2 className={h2}>Your questions answered</h2>

            <div className="grid gap-6 md:grid-cols-2">
              {faqs.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className={`rounded-lg border border-[#e0e0e0] bg-white p-4 ${
                      isOpen ? "pb-5" : ""
                    }`}
                  >
                    <button
                      className="flex w-full items-center justify-between text-left text-[16px] font-bold text-[#262626]"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`h-6 w-6 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div className="my-4 h-px w-full bg-[#e0e0e0]" />

                    <div
                      id={`faq-panel-${i}`}
                      className={`text-[16px] leading-7 text-[#595959] transition-[max-height] duration-300 ${
                        isOpen ? "max-h-[500px]" : "max-h-0 overflow-hidden"
                      }`}
                    >
                      {item.a}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-6 text-left text-[16px] text-[#595959]">
              Still have questions? Find answers to all your questions on our{" "}
              <a
                href="#"
                className="text-[#006ce4] underline-offset-2 hover:underline"
              >
                FAQ
              </a>
              .
            </p>

            <div className="mt-4 text-left">
              <Link to="/partner-register" className={btn}>
                Start registration
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#003b95] pt-[72px] text-white">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_380px]">
            <div>
              <h2 className="text-[44px] font-bold leading-[1.1]">
                Sign up and start
                <br />
                welcoming guests today!
              </h2>
            </div>

            <div className="rounded-lg border-4 border-[#ffb700] bg-white text-black shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
              <div className="p-5">
                <h3 className="mb-3 text-[20px] font-bold">
                  Register for free
                </h3>
                <ul className="mb-4 grid gap-2">
                  <li className="flex items-center gap-2 text-[14px] text-[#262626]">
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
                  <li className="flex items-center gap-2 text-[14px] text-[#262626]">
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
                  <li className="flex items-center gap-2 text-[14px] text-[#262626]">
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
                <Link
                  to="/partner-register"
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-[#006ce4] font-semibold text-white hover:bg-[#0059bc]"
                >
                  Start registration <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="my-14 border-t border-white/35" />

          <div className="grid gap-8 lg:grid-cols-3">
            <div>
              <h4 className="mb-3 text-[16px] font-bold">Discover</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="underline">
                    Trust and Safety
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-[16px] font-bold">Useful links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="underline">
                    Extranet
                  </a>
                </li>
                <li>
                  <a href="#" className="underline">
                    Pulse for Android
                  </a>
                </li>
                <li>
                  <a href="#" className="underline">
                    Pulse for iOS
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-[16px] font-bold">
                Help and communities
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="underline">
                    Partner Help
                  </a>
                </li>
                <li>
                  <a href="#" className="underline">
                    Partner Community
                  </a>
                </li>
                <li>
                  <a href="#" className="underline">
                    How-to videos
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <a href="#" className="underline">
                About Us
              </a>
              <span className="opacity-60">|</span>
              <a href="#" className="underline">
                Privacy and Cookie Statement
              </a>
            </div>
            <p className="m-0 text-[12px] text-white/85">
              © Copyright Booking.com 2025
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
