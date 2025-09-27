import { Link } from "react-router-dom";

import importPropertyDetailsImg from "../../img/ListYourPropertyPageImg/Import your property details.png";
import startFastImg from "../../img/ListYourPropertyPageImg/Start fast with review scores.png";
import standOutImg from "../../img/ListYourPropertyPageImg/Stand out in the market.png";

const btn =
  "inline-flex h-10 items-center justify-center rounded-md bg-[#006ce4] px-6 text-[16px] font-semibold text-white hover:bg-[#0059bc]";
const h2 = "text-[32px] leading-[1.2] font-bold mb-6 text-left";

export default function SimpleToBeginSection() {
  return (
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
            <h4 className="text-[16px] font-bold">Stand out in the market</h4>
            <p className="mx-auto max-w-[300px] text-[14px] leading-6 text-[#595959] md:mx-0">
              The "New to Booking.com" label helps you stand out in our search
              results.
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
  );
}
