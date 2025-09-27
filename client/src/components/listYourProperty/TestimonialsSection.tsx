import { Link } from "react-router-dom";
import TestimonialCard from "./TestimonialCard";

import parleyRoseImg from "../../img/ListYourPropertyPageImg/Parely Rose.png";
import martinFieldmanImg from "../../img/ListYourPropertyPageImg/Martin Fieldman.png";
import michelAsjaImg from "../../img/ListYourPropertyPageImg/Michel and Asja.png";
import louisGonzalezImg from "../../img/ListYourPropertyPageImg/Louis Gonzalez.png";
import zoeyBerghoffImg from "../../img/ListYourPropertyPageImg/Zoey Berghoff.png";
import shawnRitzenthalerImg from "../../img/ListYourPropertyPageImg/Shawn Ritzenthaler.png";

const btn =
  "inline-flex h-10 items-center justify-center rounded-md bg-[#006ce4] px-6 text-[16px] font-semibold text-white hover:bg-[#0059bc]";
const h2 = "text-[32px] leading-[1.2] font-bold mb-6 text-left";

export default function TestimonialsSection() {
  return (
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
  );
}
