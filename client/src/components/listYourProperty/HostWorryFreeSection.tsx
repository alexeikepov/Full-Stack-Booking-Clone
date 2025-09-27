import { Link } from "react-router-dom";
import Tick from "./Tick";

const btn =
  "inline-flex h-10 items-center justify-center rounded-md bg-[#006ce4] px-6 text-[16px] font-semibold text-white hover:bg-[#0059bc]";
const h2 = "text-[32px] leading-[1.2] font-bold mb-6 text-left";

export default function HostWorryFreeSection() {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-[1128px] px-6">
        <h2 className={h2}>Host worry-free. We've got your back</h2>

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
                Manage your guests' expectations by setting up clear house
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
  );
}
