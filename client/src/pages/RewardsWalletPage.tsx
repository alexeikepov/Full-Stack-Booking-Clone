import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigationTabsStore } from "@/stores/navigationTabs";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export default function RewardsWalletPage() {
  const { setShowTabs } = useNavigationTabsStore();

  useEffect(() => {
    setShowTabs(false);
    return () => setShowTabs(true);
  }, [setShowTabs]);

  return (
    <div className="min-h-screen">
      {/* Top blue section */}
      <div className="bg-[#003b95] pb-16">
        <div className="mx-auto max-w-[1128px] px-4 pt-8">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Link to="/account" className="text-white text-sm hover:underline">
              My account
            </Link>
            <span className="text-white text-sm mx-2">&gt;</span>
            <span className="text-white text-sm">Rewards & Wallet</span>
          </div>

          {/* Main title and subtitle */}
          <div className="text-center">
            <h1 className="text-white text-4xl font-bold mb-2">
              Rewards & Wallet
            </h1>
            <p className="text-white text-lg">
              Save money on your next adventure with Booking.com
            </p>
          </div>
        </div>
      </div>

      {/* White card section */}
      <div className="mx-auto max-w-[1128px] -mt-8 pb-10">
        <div className="bg-white rounded-xl shadow-lg p-6 mx-auto max-w-[800px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left section - Wallet balance */}
            <div className="flex items-start gap-4">
              {/* Wallet icon */}
              <div className="relative">
                <img
                  src="https://t-cf.bstatic.com/design-assets/assets/v3.160.0/illustrations-traveller/Wallet@2x.png"
                  alt="Wallet"
                  className="w-32 h-32 object-contain"
                />
                {/* Gold coin */}
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-[#febb02] rounded-full flex items-center justify-center">
                  <span className="text-[#8a6d3b] text-xs font-bold">$</span>
                </div>
                {/* Green banknote */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">₪</span>
                </div>
              </div>

              {/* Wallet balance content */}
              <div className="flex-1">
                <h2 className="text-black text-xl font-bold mb-1">
                  Wallet balance
                </h2>
                <p className="text-gray-600 text-sm mb-3">
                  Includes all spendable rewards
                </p>
                <div className="text-black text-3xl font-bold">₪ 0</div>
              </div>
            </div>

            {/* Right section - Credits & Vouchers */}
            <div className="space-y-4">
              {/* Credits */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-black text-base">Credits</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-4 h-4 bg-white border border-gray-300 rounded-full flex items-center justify-center cursor-help">
                        <span className="text-gray-600 text-xs font-bold">
                          i
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Credits are spendable on anything through Booking.com
                        that accepts Wallet payments.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-black text-base font-semibold">₪ 0</span>
              </div>

              {/* Vouchers */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-black text-base">Vouchers (0)</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-4 h-4 bg-white border border-gray-300 rounded-full flex items-center justify-center cursor-help">
                        <span className="text-gray-600 text-xs font-bold">
                          i
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Each voucher has its own terms and conditions, so check
                        them carefully before spending.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-black text-base font-semibold">₪ 0</span>
              </div>

              {/* Activity link */}
              <div className="pt-2">
                <Link
                  to="/account/rewards/activity"
                  className="text-[#003b95] text-sm underline hover:no-underline"
                >
                  Browse Rewards & Wallet activity
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Coupon code section */}
        <div className="mt-8 text-left px-4">
          <span className="text-black text-base">Got a coupon code? </span>
          <Link
            to="/account/rewards/add-coupon"
            className="text-[#0066cc] text-base hover:text-[#0052a3] hover:bg-[#d6e4ff] px-2 py-1 rounded transition-colors"
          >
            Add coupon into Wallet
          </Link>
        </div>

        {/* Divider line */}
        <div className="mt-8 mb-8 border-t border-gray-300 mx-4"></div>

        {/* What's Rewards & Wallet section */}
        <div className="mt-12 px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-black text-2xl font-bold text-left">
              What's Rewards & Wallet?
            </h2>
            <Link
              to="/help/faq"
              className="text-[#0066cc] text-sm hover:text-[#0052a3] hover:bg-[#d6e4ff] px-2 py-1 rounded transition-colors"
            >
              Need help? Visit FAQs
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Book and earn travel rewards */}
            <div className="text-left flex gap-4">
              <div className="flex-shrink-0">
                <img
                  src="https://t-cf.bstatic.com/design-assets/assets/v3.160.0/illustrations-traveller/GeniusCredits@2x.png"
                  alt="Genius Credits"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div>
                <h3 className="text-black text-lg font-semibold mb-3">
                  Book and earn travel rewards
                </h3>
                <p className="text-gray-600 text-sm leading-6">
                  Credits, vouchers, you name it! These are all spendable on
                  your next Booking.com trip.
                </p>
              </div>
            </div>

            {/* Column 2: Track everything at a glance */}
            <div className="text-left flex gap-4">
              <div className="flex-shrink-0">
                <img
                  src="https://t-cf.bstatic.com/design-assets/assets/v3.160.0/illustrations-traveller/PhoneVoucher@2x.png"
                  alt="Phone Voucher"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div>
                <h3 className="text-black text-lg font-semibold mb-3">
                  Track everything at a glance
                </h3>
                <p className="text-gray-600 text-sm leading-6">
                  Your Wallet keeps all rewards safe, while updating you of your
                  earnings and spendings.
                </p>
              </div>
            </div>

            {/* Column 3: Pay with Wallet to save money */}
            <div className="text-left flex gap-4">
              <div className="flex-shrink-0">
                <img
                  src="https://t-cf.bstatic.com/design-assets/assets/v3.160.0/illustrations-traveller/MoneyUsp@2x.png"
                  alt="Money USP"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div>
                <h3 className="text-black text-lg font-semibold mb-3">
                  Pay with Wallet to save money
                </h3>
                <p className="text-gray-600 text-sm leading-6">
                  If a booking accepts any rewards in your Wallet, it'll appear
                  during payment for spending.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark blue band */}
      <div className="mt-14 w-full bg-[#003b95] text-white">
        <div className="mx-auto max-w-[1128px] px-4">
          <div className="flex justify-center pt-4">
            <Link
              to="#"
              className="rounded-[4px] border border-white/70 px-3 py-[6px] text-[12px] font-medium hover:bg-white/10"
            >
              List your property
            </Link>
          </div>
        </div>

        {/* full-width white separator */}
        <div className="h-px w-full bg-white/35" />

        {/* white nav links with underline (inside container) */}
        <div className="mx-auto max-w-[1128px] px-4">
          <nav className="flex flex-wrap items-center gap-x-8 gap-y-2 py-3 text-[13px] font-medium">
            <Link
              to="#"
              className="underline decoration-white/85 underline-offset-4 hover:decoration-white"
            >
              Mobile version
            </Link>
            <Link
              to="#"
              className="underline decoration-white/85 underline-offset-4 hover:decoration-white"
            >
              Manage your bookings
            </Link>
            <Link
              to="#"
              className="underline decoration-white/85 underline-offset-4 hover:decoration-white"
            >
              Customer Service help
            </Link>
            <Link
              to="#"
              className="underline decoration-white/85 underline-offset-4 hover:decoration-white"
            >
              Become an affiliate
            </Link>
            <Link
              to="#"
              className="underline decoration-white/85 underline-offset-4 hover:decoration-white"
            >
              Booking.com for Business
            </Link>
          </nav>
        </div>
      </div>

      {/* White area with blue links */}
      <div className="w-full bg-white py-10">
        <div className="mx-auto max-w-[1128px] px-4">
          <div className="grid grid-cols-2 gap-8 text-[13px] sm:grid-cols-4">
            <FooterCol
              title="Countries"
              items={[
                "Regions",
                "Cities",
                "Airports",
                "Hotels",
                "Places of interest",
              ]}
            />
            <FooterCol
              title="Homes & apts"
              items={[
                "Apartments",
                "Resorts",
                "Villas",
                "Hostels",
                "B&Bs",
                "Guest Houses",
              ]}
            />
            <FooterCol
              title="Car hire"
              items={[
                "Car hire",
                "Flight finder",
                "Restaurant reservations",
                "Booking.com for Travel Agents",
              ]}
            />
            <FooterCol
              title="Company"
              items={[
                "Coronavirus (COVID-19) FAQs",
                "About Booking.com",
                "Customer Service help",
                "Partner help",
                "Careers",
                "Sustainability",
                "Press centre",
                "Safety resource centre",
                "Investor relations",
                "Terms of Service",
                "Partner dispute",
                "Privacy & Cookie Statement",
                "Modern Slavery Statement",
                "Human Rights Statement",
                "Corporate contact",
                "Content guidelines and reporting",
                "We Price Match",
              ]}
            />
          </div>

          <div className="mt-10 text-center">
            <Link to="#" className="text-[#0071c2] hover:underline">
              Extranet login
            </Link>
          </div>

          <div className="mt-8 text-left text-[11px] text-black/50">
            © 1996–2025 Booking.com™. All rights reserved.
          </div>

          <div className="mt-2 text-center text-[11px] text-black/45">
            Booking.com is part of Booking Holdings Inc., the world leader in
            online travel and related services.
          </div>

          {/* Partner Logos */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <div className="text-blue-800 font-bold text-sm">Booking.com</div>
            <div className="text-blue-600 font-bold text-sm flex items-center gap-1">
              priceline
              <span className="text-orange-500 text-xs">®</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-orange-500 text-white px-1 py-1 text-xs font-bold">
                K
              </div>
              <div className="bg-orange-500 text-white px-1 py-1 text-xs font-bold">
                A
              </div>
              <div className="bg-orange-500 text-white px-1 py-1 text-xs font-bold">
                Y
              </div>
              <div className="bg-orange-500 text-white px-1 py-1 text-xs font-bold">
                A
              </div>
              <div className="bg-orange-500 text-white px-1 py-1 text-xs font-bold">
                K
              </div>
            </div>
            <div className="text-gray-700 font-bold text-sm flex flex-col items-center gap-1">
              <div>agoda</div>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                </div>
              </div>
              <span className="text-gray-700 font-bold text-xs">
                <span className="font-normal">Open</span>
                <span className="font-bold">Table</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <Link
        to="#"
        className="block text-[#0071c2] font-semibold hover:underline"
      >
        {title}
      </Link>
      <ul className="mt-2 space-y-1">
        {items.map((i) => (
          <li key={i}>
            <Link to="#" className="text-[#0071c2] hover:underline">
              {i}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
