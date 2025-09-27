import { Link } from "react-router-dom";

export default function FooterSection() {
  return (
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
              <h3 className="mb-3 text-[20px] font-bold">Register for free</h3>
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
                  We'll facilitate payments for you
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
            <h4 className="mb-3 text-[16px] font-bold">Help and communities</h4>
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
  );
}
