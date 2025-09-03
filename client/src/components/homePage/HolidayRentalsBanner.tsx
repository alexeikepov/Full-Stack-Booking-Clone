// src/components/HolidayRentalsBanner.tsx
import { Link } from "react-router-dom";

export default function HolidayRentalsBanner() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8 py-8">
      <Link to="/holiday-rentals" className="block group">
        <div className="relative overflow-hidden rounded-sm border bg-white">
          <div className="grid h-[220px] md:h-[260px] grid-cols-1 md:grid-cols-[1fr_360px]">
            <div className="relative flex items-center justify-center px-6">
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 z-0 h-[620px] w-[620px] md:h-[650px] md:w-[650px]
                           -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#006ce4]"
              />
              <div
                aria-hidden
                className="absolute -left-4 top-45 z-0 h-12 w-12 md:h-16 md:w-16 -translate-y-1/2 rounded-full bg-[#ffb700]"
              />

              <div className="relative z-10 mx-auto max-w-[760px] text-left text-white">
                <h3 className="text-[22px] md:text-[28px] font-bold leading-snug tracking-tight">
                  Want to feel at home on your
                  <br />
                  next adventure?
                </h3>

                <span
                  className="mt-4 inline-flex items-center justify-center
                             h-[44px] w-[360px] md:h-[34px] md:w-[400px]
                             rounded bg-white text-[#006ce4]
                             text-sm md:text-[15px] font-medium shadow-sm
                             transition-colors group-hover:bg-white/95"
                >
                  Discover holiday rentals
                </span>
              </div>
            </div>

            <div className="relative hidden md:flex items-center justify-center">
              <img
                src="https://cf.bstatic.com/psb/capla/static/media/bh_aw_cpg_main_image.ae847bb6.png"
                alt=""
                className="h-full w-full object-contain p-4 md:p-6"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
