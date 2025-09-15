// src/pages/ReviewsTimelinePage.tsx
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import Footer from "@/components/Footer";

type Review = {
  id: string;
  hotel: string;
  city: string;
  country?: string;
  stayed: string;     // e.g. "Sep 2024"
  reviewed: string;   // e.g. "17 Oct 2024"
  score: number;      // 1..10
  positive?: string;
  negative?: string;
  response?: string;
  thumbnail?: string;
};

const BLUE = "#0a5ad6";
const DARK_BLUE = "#003b95";

const DEMO: Review[] = [
  {
    id: "r1",
    hotel: "Ocean Breeze Resort",
    city: "Herceg-Novi",
    country: "ME",
    stayed: "Jul 2024",
    reviewed: "17 Jul 2024",
    score: 8.4,
    positive:
      "Lovely pool and great staff. Good breakfast variety. Room was very clean and quiet.",
    response:
      "Thanks a lot for the feedback! We're improving Wi-Fi capacity and adding more breakfast options soon.",
    thumbnail:
      "https://images.unsplash.com/photo-1501117716987-c8e78eb7f0a1?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "r2",
    hotel: "City Center Boutique Hotel",
    city: "Bucharest",
    country: "RO",
    stayed: "Sep 2024",
    reviewed: "22 Sep 2024",
    score: 7.9,
    positive: "Nice design and comfy bed.",
    negative: "Room was a bit small.",
    thumbnail:
      "https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "r3",
    hotel: "Sunset Marina",
    city: "Makarska",
    country: "HR",
    stayed: "Aug 2024",
    reviewed: "04 Sep 2024",
    score: 9.1,
    positive:
      "Perfect location near the beach. Friendly staff and amazing sea view from the balcony.",
    thumbnail:
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=400&auto=format&fit=crop",
  },
];

export default function ReviewsTimelinePage() {
  const [year, setYear] = useState("2024");
  const months = useMemo(() => 3, []);

  return (
    <div className="min-h-screen bg-[#f7f7f9] text-[#1a1a1a]">
      {/* top spacer under global header */}
      <div className="h-[16px]" />

      <main className="mx-auto max-w-[1128px] px-4">
        {/* mini tabs bar under the blue header */}
        <div className="mb-3 h-[14px] w-full rounded-sm bg-[#0a3d8f]/10" />

        <div className="grid grid-cols-12 gap-8">
          {/* left rail */}
          <aside className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="text-[22px] font-semibold">Your reviews</div>

            {/* tabs */}
            <div className="mt-2 inline-flex rounded-[6px] border border-[#dfe6ef] bg-white p-[3px]">
              <button className="rounded-[4px] px-3 py-1.5 text-[12px] text-[#3b3f46] hover:bg-[#f1f5fb]">
                Reviews
              </button>
              <button className="rounded-[4px] bg-[#eef4ff] px-3 py-1.5 text-[12px] font-medium text-[#0a5ad6]">
                Timeline
              </button>
            </div>

            {/* summary */}
            <div className="mt-4 w-[260px] max-w-full rounded-[10px] border border-[#e6eaf0] bg-white p-3 text-[12px]">
              <div className="mb-2 text-[12.5px] font-semibold text-[#3b3f46]">
                Summary
              </div>
              <div className="grid grid-cols-2 gap-y-1">
                <span className="text-[#6b7280]">Average score</span>
                <span className="text-right font-medium">8.3</span>

                <span className="text-[#6b7280]">Published</span>
                <span className="text-right font-medium">{DEMO.length}</span>

                <span className="text-[#6b7280]">Pending</span>
                <span className="text-right font-medium">0</span>

                <span className="text-[#6b7280]">Rejected</span>
                <span className="text-right font-medium">0</span>
              </div>
            </div>
          </aside>

          {/* timeline + filters */}
          <section className="col-span-12 md:col-span-8 lg:col-span-6">
            {/* filters row aligned to the right like booking */}
            <div className="mb-3 flex items-center justify-end gap-2">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="h-8 rounded-[6px] border border-[#dfe6ef] bg-white px-2 text-[12px] text-[#1a1a1a]"
              >
                <option>2025</option>
                <option>2024</option>
                <option>2023</option>
              </select>

              <div className="rounded-[6px] border border-[#dfe6ef] bg-white px-2 py-1 text-[12px] text-[#3b3f46]">
                {months} months
              </div>
            </div>

            {/* cards column (narrow) */}
            <div className="mx-auto w-full max-w-[580px] space-y-3">
              {DEMO.map((r) => (
                <ReviewCard key={r.id} r={r} />
              ))}

              <div className="pt-2 text-center">
                <button className="rounded-[6px] border border-[#b9d2f5] bg-white px-3 py-2 text-[12px] font-medium text-[#0a5ad6] hover:bg-[#f0f6ff]">
                  Load more
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* dark blue band before footer */}
      <div className="mt-10 w-full bg-[#003b95] py-4">
        <div className="mx-auto max-w-[1128px] px-4">
          <div className="flex justify-center">
            <Link
              to="#"
              className="rounded-[4px] border border-white/70 px-3 py-[6px] text-[12px] font-medium text-white hover:bg-white/10"
            >
              List your property
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ---------------- Components ---------------- */

function ReviewCard({ r }: { r: Review }) {
  return (
    <article className="overflow-hidden rounded-[10px] border border-[#e6eaf0] bg-white">
      <div className="flex gap-3 p-3">
        {/* thumbnail */}
        <div className="hidden shrink-0 sm:block">
          <img
            src={
              r.thumbnail ??
              "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d93?q=80&w=400&auto=format&fit=crop"
            }
            alt=""
            className="h-20 w-28 rounded-[6px] object-cover ring-1 ring-black/5"
          />
        </div>

        {/* body */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold">
                {r.hotel}
              </div>
              <div className="mt-[2px] text-[11.5px] text-[#6b7280]">
                {r.city}
                {r.country ? ` · ${r.country}` : ""}
              </div>
              <div className="mt-[6px] text-[11.5px] text-[#6b7280]">
                Stayed {r.stayed} · Reviewed {r.reviewed}
              </div>
            </div>

            <ScoreBadge value={r.score} />
          </div>

          {r.positive && (
            <div className="mt-2 rounded-[8px] border border-[#e6eaf0] bg-[#f7fbff] p-2">
              <RowLabel label="Positive" />
              <p className="mt-[6px] text-[12px] leading-5 text-[#1f2937]">
                {r.positive}
              </p>
            </div>
          )}

          {r.negative && (
            <div className="mt-2 rounded-[8px] border border-[#f3c2c0] bg-[#fff0f0] p-2">
              <RowLabel label="Negative" variant="neg" />
              <p className="mt-[6px] text-[12px] leading-5 text-[#8b1f1b]">
                {r.negative}
              </p>
            </div>
          )}

          {r.response && (
            <div className="mt-2 rounded-[8px] border border-[#e6eaf0] bg-[#fafafa] p-2">
              <div className="text-[11px] font-medium text-[#3b3f46]">
                Property response
              </div>
              <p className="mt-[6px] text-[12px] leading-5 text-[#3b3f46]">
                {r.response}
              </p>
            </div>
          )}

          <div className="mt-2">
            <button className="text-[12px] font-medium text-[#0a5ad6] hover:underline">
              Read more
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ScoreBadge({ value }: { value: number }) {
  return (
    <div className="inline-flex h-[26px] min-w-[26px] items-center justify-center rounded-[4px] bg-[#003b95] px-2 text-[12px] font-semibold text-white">
      {value.toFixed(1)}
    </div>
  );
}

function RowLabel({ label, variant }: { label: string; variant?: "neg" }) {
  return (
    <div
      className={
        "inline-flex items-center gap-1 rounded-[4px] px-1.5 py-[2px] text-[11px] " +
        (variant === "neg"
          ? "bg-[#ffe6e6] text-[#742a2a]"
          : "bg-[#eaf3ff] text-[#0a5ad6]")
      }
    >
      {variant === "neg" ? (
        <svg viewBox="0 0 20 20" className="h-3 w-3 fill-current">
          <path d="M10 1.667A8.333 8.333 0 1 0 18.333 10 8.343 8.343 0 0 0 10 1.667Zm3.333 11.666H6.667a.833.833 0 0 1 0-1.666h6.666a.833.833 0 0 1 0 1.666ZM7.5 7.5a1.25 1.25 0 1 1 1.25-1.25A1.25 1.25 0 0 1 7.5 7.5Zm5 0a1.25 1.25 0 1 1 1.25-1.25A1.25 1.25 0 0 1 12.5 7.5Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" className="h-3 w-3 fill-current">
          <path d="M10 1.667A8.333 8.333 0 1 0 18.333 10 8.343 8.343 0 0 0 10 1.667Zm4.1 6.309-4.525 4.525a.833.833 0 0 1-1.178 0L5.9 9.002a.833.833 0 1 1 1.178-1.178l1.955 1.955 3.936-3.936A.833.833 0 1 1 14.1 7.976Z" />
        </svg>
      )}
      <span>{label}</span>
    </div>
  );
}
