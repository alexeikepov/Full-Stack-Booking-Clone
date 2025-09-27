// src/components/Footer.tsx
import { Link } from "react-router-dom";
import CurrencySelector from "@/components/forms/CurrencySelector";
import LanguageSelector from "@/components/forms/LanguageSelector";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Main Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Support */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/coronavirus-faqs"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Coronavirus (COVID-19) FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/manage-trips"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Manage your trips
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Contact Customer Service
                </Link>
              </li>
              <li>
                <Link
                  to="/safety"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Safety resource centre
                </Link>
              </li>
            </ul>
          </div>

          {/* Discover */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm">Discover</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/genius"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Genius loyalty programme
                </Link>
              </li>
              <li>
                <Link
                  to="/deals"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Seasonal and holiday deals
                </Link>
              </li>
              <li>
                <Link
                  to="/travel-articles"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Travel articles
                </Link>
              </li>
              <li>
                <Link
                  to="/business"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Booking.com for Business
                </Link>
              </li>
              <li>
                <Link
                  to="/awards"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Traveller Review Awards
                </Link>
              </li>
              <li>
                <Link
                  to="/car-hire"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Car hire
                </Link>
              </li>
              <li>
                <Link
                  to="/flights"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Flight finder
                </Link>
              </li>
              <li>
                <Link
                  to="/restaurants"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Restaurant reservations
                </Link>
              </li>
              <li>
                <Link
                  to="/travel-agents"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Booking.com for Travel Agents
                </Link>
              </li>
            </ul>
          </div>

          {/* Terms and settings */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm">
              Terms and settings
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Privacy & cookies
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/accessibility"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Accessibility Statement
                </Link>
              </li>
              <li>
                <Link
                  to="/partner-dispute"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Partner dispute
                </Link>
              </li>
              <li>
                <Link
                  to="/modern-slavery"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Modern Slavery Statement
                </Link>
              </li>
              <li>
                <Link
                  to="/human-rights"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Human Rights Statement
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm">Partners</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/extranet"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Extranet login
                </Link>
              </li>
              <li>
                <Link
                  to="/partner-help"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Partner help
                </Link>
              </li>
              <li>
                <Link
                  to="/list-property"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  List your property
                </Link>
              </li>
              <li>
                <Link
                  to="/affiliate"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Become an affiliate
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm">About</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  About Booking.com
                </Link>
              </li>
              <li>
                <Link
                  to="/how-we-work"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  How we work
                </Link>
              </li>
              <li>
                <Link
                  to="/sustainability"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Sustainability
                </Link>
              </li>
              <li>
                <Link
                  to="/press"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Press centre
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/investor-relations"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Investor relations
                </Link>
              </li>
              <li>
                <Link
                  to="/corporate-contact"
                  className="hover:text-gray-900 transition-colors text-sm"
                >
                  Corporate contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Language/Currency Selector */}
        <div className="mb-6 flex items-center justify-start gap-4">
          <CurrencySelector variant="footer" />
          <LanguageSelector variant="footer" />
        </div>

        {/* Copyright & Partner Logos Section */}
        <div className="border-t border-gray-300 pt-6">
          {/* Copyright Information */}
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Booking.com is part of Booking Holdings Inc., the world leader in
              online travel and related services.
            </p>
            <p className="text-sm text-gray-600">
              Copyright © 1996–2025 Booking.com™. All rights reserved.
            </p>
          </div>

          {/* Partner Logos */}
          <div className="flex flex-wrap items-center justify-center gap-6">
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
    </footer>
  );
}
