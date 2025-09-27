import { Link } from "react-router-dom";

const btn =
  "inline-flex h-10 items-center justify-center rounded-md bg-[#006ce4] px-6 text-[16px] font-semibold text-white hover:bg-[#0059bc]";
const h2 = "text-[32px] leading-[1.2] font-bold mb-6 text-left";

export default function GlobalCustomerSection() {
  return (
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
  );
}
