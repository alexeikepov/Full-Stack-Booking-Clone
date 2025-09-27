import { Link } from "react-router-dom";
import Tick from "./Tick";

const btn =
  "inline-flex h-10 items-center justify-center rounded-md bg-[#006ce4] px-6 text-[16px] font-semibold text-white hover:bg-[#0059bc]";
const h2 = "text-[32px] leading-[1.2] font-bold mb-6 text-left";

export default function PaymentsSection() {
  return (
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
                We facilitate the payment process for you, freeing up your time
                to grow your business.
              </span>
            </div>

            <div className="mb-3 flex items-start gap-3 text-[16px] leading-6 text-[#595959]">
              <Tick />
              <span>
                <b>Greater revenue security</b>
                <br />
                Whenever guests complete prepaid reservations at your property
                and pay online, you are guaranteed payment.
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
                Get payouts faster! We'll send your payouts 24 hours after guest
                checkout.
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
                We help you stay compliant with regulatory changes and reduce
                the risk of fraud and chargebacks.
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
  );
}
