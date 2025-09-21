// src/pages/PartnerRegisterPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function PartnerRegisterPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Top bar */}
      <div className="sticky top-0 z-10 h-14 w-full bg-[#003b95]">
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
          <span className="text-white text-[18px] font-semibold">Booking.com</span>
          <div className="flex items-center gap-6">
            <span className="text-white/90 text-sm">GB</span>
            <span className="text-white/90 text-lg leading-none">?</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[820px] px-6 py-12">
        {/* Info banner */}
        <div className="mx-auto mb-6 w-full max-w-[560px] rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3 text-[15px] leading-6 text-neutral-800">
            <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-green-600">
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 12.9l2.7 2.7L17 9.3" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <span>
              We’ve completed the signup form using your account information as you’re logged in to your
              Booking.com account.
            </span>
            <button className="ml-auto rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700" aria-label="close">
              ✕
            </button>
          </div>
        </div>

        {/* Main card */}
        <div className="mx-auto w-full max-w-[560px] rounded-lg border border-neutral-300 bg-white shadow-sm">
          <div className="p-6">
            <h1 className="text-[22px] font-bold text-neutral-900">Create your partner account</h1>
            <p className="mt-2 text-[14px] leading-6 text-neutral-600">
              Create an account to list and manage your property.
            </p>

            <label className="mt-6 block text-[12px] font-semibold tracking-wide text-neutral-700">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="mt-1 w-full rounded border border-neutral-400 px-3 py-2 text-[14px] outline-none focus:border-neutral-500"
            />

            <button
              className="mt-4 w-full rounded bg-[#0071c2] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#0062a9]"
            >
              Continue
            </button>

            <div className="my-5 h-px w-full bg-neutral-200" />

            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center rounded border border-neutral-400 bg-white px-4 py-2 text-[14px] font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              Sign in
            </Link>

            <div className="mt-5 text-[12px] leading-6 text-neutral-600">
              Do you have questions about your property or the extranet? Visit{" "}
              <a className="text-[#0071c2] underline">Partner Help</a>.
            </div>

            <div className="mt-4 text-[12px] leading-6 text-neutral-600">
              By signing in or creating an account, you agree with our{" "}
              <a className="text-[#0071c2] underline">Terms &amp; conditions</a> and{" "}
              <a className="text-[#0071c2] underline">Privacy statement</a>.
            </div>

            <div className="mt-6 text-center text-[11px] leading-6 text-neutral-500">
              All rights reserved.
              <br />
              Copyright (2006 – 2025) – Booking.com™
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
