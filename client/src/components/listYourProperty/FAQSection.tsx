import { useState } from "react";
import { Link } from "react-router-dom";
import ChevronDown from "./ChevronDown";

const btn =
  "inline-flex h-10 items-center justify-center rounded-md bg-[#006ce4] px-6 text-[16px] font-semibold text-white hover:bg-[#0059bc]";
const h2 = "text-[32px] leading-[1.2] font-bold mb-6 text-left";

export default function FAQSection() {
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
  );
}
