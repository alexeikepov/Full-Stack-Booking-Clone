import { Link } from "react-router-dom";
import Tick from "./Tick";

const btn =
  "inline-flex h-10 items-center justify-center rounded-md bg-[#006ce4] px-6 text-[16px] font-semibold text-white hover:bg-[#0059bc]";

export default function HeroSection() {
  return (
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
              List on one of the world's most downloaded travel apps to earn
              more, faster and expand into new markets.
            </p>
          </div>

          <div className="rounded-lg border-4 border-[#ffb700] bg-white text-[#262626] shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
            <div className="p-5">
              <h3 className="mb-1 text-[20px] font-bold">Register for free</h3>
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
                  We'll facilitate payments for you
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
  );
}
