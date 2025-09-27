// src/pages/ReviewsTimelinePage.tsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api, getMyReviews } from "@/lib/api";
import Footer from "@/components/navigation/Footer";
import { useNavigationTabsStore } from "@/stores/navigationTabs";
import { getPrimaryImage } from "@/utils/hotel-images";

type Review = {
  id: string;
  hotel: string;
  city: string;
  country?: string;
  stayed: string;
  reviewed: string;
  score: number;
  positive?: string;
  negative?: string;
  response?: string;
  thumbnail?: string;
  status?: string;
  categoryRatings?: {
    staff?: number;
    comfort?: number;
    freeWifi?: number;
    facilities?: number;
    valueForMoney?: number;
    cleanliness?: number;
    location?: number;
  };
  reviewedYear?: number;
};

//

const DEMO: Review[] = [];

export default function ReviewsTimelinePage() {
  const { setShowTabs } = useNavigationTabsStore();
  const [year, setYear] = useState("2025");
  const [months, setMonths] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avgScore, setAvgScore] = useState<number>(0);
  const [publishedCount, setPublishedCount] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [rejectedCount, setRejectedCount] = useState<number>(0);

  useEffect(() => {
    setShowTabs(false);
    return () => setShowTabs(true);
  }, [setShowTabs]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyReviews({ page: 1, limit: 50 });
        const mapped: Review[] = (data.items || []).map((it: any) => {
          const dt = new Date(it.createdAt);
          const reviewed = dt.toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
          const stayed = it.stayDate || reviewed;
          const thumb = (() => {
            // Use the hotel-images utility to get the primary image
            if (it.hotel) {
              return getPrimaryImage(it.hotel as any);
            }
            // Fallback to direct media access
            const m = it.hotel?.media || [];
            return m.find((x: any) => x?.url)?.url || m[0]?.url;
          })();
          const hotelResponseText =
            it.hotelResponse?.text || it.response || it.reply || "";
          return {
            id: String(it._id),
            hotel: it.hotel?.name || "",
            city: it.hotel?.city || "",
            score: Number(it.rating) || 0,
            positive: it.comment || it.positive,
            negative: it.negative,
            stayed,
            reviewed,
            thumbnail: thumb,
            status: it.status || "APPROVED",
            categoryRatings: it.categoryRatings,
            reviewedYear: dt.getFullYear(),
            response: hotelResponseText || undefined,
          };
        });
        setReviews(mapped);
        // months will be computed per selected year in a separate effect
        // Summary stats (fallback if server doesn't provide)
        const total = mapped.length;
        const sum = mapped.reduce(
          (s, r) => s + (Number.isFinite(r.score) ? r.score : 0),
          0
        );
        setAvgScore(total ? sum / total : 0);
        const byStatus = (st: string) =>
          mapped.filter((r) => (r.status || "").toUpperCase() === st).length;
        setPublishedCount(byStatus("APPROVED") || total); // if no status, treat all as published
        setPendingCount(byStatus("PENDING"));
        setRejectedCount(byStatus("REJECTED"));
      } catch (e: any) {
        setError(e?.response?.data?.error || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Recompute months and filtered list when year or reviews change
  const selectedYear = Number(year);
  const filteredReviews = reviews.filter((r) =>
    r.reviewedYear
      ? r.reviewedYear === selectedYear
      : r.reviewed.includes(String(selectedYear))
  );

  useEffect(() => {
    const monthsSet = new Set(
      filteredReviews.map((r) => {
        const parts = r.reviewed.split(" ");
        return parts.length >= 2 ? parts[1] : r.reviewed;
      })
    );
    setMonths(monthsSet.size);
  }, [year, reviews]);

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
                <span className="text-right font-medium">
                  {avgScore.toFixed(1)}
                </span>

                <span className="text-[#6b7280]">Published</span>
                <span className="text-right font-medium">{publishedCount}</span>

                <span className="text-[#6b7280]">Pending</span>
                <span className="text-right font-medium">{pendingCount}</span>

                <span className="text-[#6b7280]">Rejected</span>
                <span className="text-right font-medium">{rejectedCount}</span>
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
              {(loading
                ? []
                : filteredReviews.length
                ? filteredReviews
                : DEMO
              ).map((r) => (
                <ReviewCard
                  key={r.id}
                  r={r}
                  onUpdated={(updated) =>
                    setReviews((prev) =>
                      prev.map((x) =>
                        x.id === updated.id ? { ...x, ...updated } : x
                      )
                    )
                  }
                  onDeleted={(id) =>
                    setReviews((prev) => prev.filter((x) => x.id !== id))
                  }
                />
              ))}

              {!loading && !error && !reviews.length && (
                <div className="text-center text-[13px] text-[#6b7280]">
                  No reviews yet.
                </div>
              )}

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

function ReviewCard({
  r,
  onUpdated,
  onDeleted,
}: {
  r: Review;
  onUpdated?: (r: Review) => void;
  onDeleted?: (id: string) => void;
}) {
  const RatingDots = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`Set rating ${n}`}
          onClick={() => onChange(n)}
          className={
            "h-6 w-6 rounded-full border text-[11px] font-semibold transition-colors " +
            (value >= n
              ? "bg-[#003b95] border-[#003b95] text-white"
              : "border-[#d1d5db] text-[#6b7280] hover:border-[#9ca3af]")
          }
        >
          {n}
        </button>
      ))}
    </div>
  );
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState({
    positive: r.positive || "",
    negative: r.negative || "",
    score: r.score,
    categoryRatings: {
      staff: r.categoryRatings?.staff || 0,
      comfort: r.categoryRatings?.comfort || 0,
      freeWifi: r.categoryRatings?.freeWifi || 0,
      facilities: r.categoryRatings?.facilities || 0,
      valueForMoney: r.categoryRatings?.valueForMoney || 0,
      cleanliness: r.categoryRatings?.cleanliness || 0,
      location: r.categoryRatings?.location || 0,
    },
  });

  const saveEdit = async () => {
    try {
      // best-effort update; server id may differ, so we navigate via reviews API if available
      await api.patch(`/api/reviews/${r.id}`, {
        rating: draft.score,
        comment: draft.positive,
        negative: draft.negative,
        categoryRatings: draft.categoryRatings,
      });
      onUpdated?.({
        ...r,
        positive: draft.positive,
        negative: draft.negative,
        score: draft.score,
        categoryRatings: draft.categoryRatings,
      });
      setEditOpen(false);
    } catch (e) {
      alert("Failed to update review");
    }
  };

  const deleteReview = async () => {
    try {
      await api.delete(`/api/reviews/${r.id}`);
      onDeleted?.(r.id);
    } catch (e) {
      alert("Failed to delete review");
    }
  };
  return (
    <article className="overflow-hidden rounded-[10px] border border-[#e6eaf0] bg-white">
      <div className="flex gap-3 p-3">
        {/* thumbnail */}
        <div className="hidden shrink-0 sm:block">
          <img
            src={r.thumbnail ?? "/placeholder-hotel.svg"}
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

            <div className="flex items-start gap-2">
              <ScoreBadge value={r.score} />
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="h-7 w-7 grid place-items-center rounded-full hover:bg-black/5"
                >
                  <span className="inline-block h-1 w-1 rounded-full bg-black/60" />
                  <span className="mx-[2px] inline-block h-1 w-1 rounded-full bg-black/60" />
                  <span className="inline-block h-1 w-1 rounded-full bg-black/60" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-md border border-black/10 bg-white py-1 text-[13px] shadow">
                    <button
                      className="block w-full px-3 py-2 text-left hover:bg-[#f6f7fb]"
                      onClick={() => {
                        setMenuOpen(false);
                        setEditOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="block w-full px-3 py-2 text-left text-[#b00020] hover:bg-[#fff2f2]"
                      onClick={() => {
                        setMenuOpen(false);
                        deleteReview();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {r.positive && (
            <div className="mt-2 rounded-[8px] border border-[#e6eaf0] bg-[#f7fbff] p-2">
              <RowLabel label="Positive" />
              <p
                className={`mt-[6px] text-[12px] leading-5 text-[#1f2937] ${
                  expanded ? "" : "line-clamp-3"
                }`}
              >
                {r.positive}
              </p>
              {r.positive.length > 180 && (
                <button
                  className="mt-1 text-[12px] font-medium text-[#0a5ad6] hover:underline"
                  onClick={() => setExpanded((v) => !v)}
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
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

          {editOpen && (
            <div className="mt-2 rounded-[10px] border border-[#dfe6ef] bg-white p-3">
              <div className="text-[14px] font-semibold text-[#1f2937]">
                Edit your review
              </div>
              <div className="mt-3 flex items-center gap-2">
                <label className="text-[12px] text-[#6b7280]">Score</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={draft.score}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      score: Math.max(
                        1,
                        Math.min(10, Number(e.target.value) || 1)
                      ),
                    })
                  }
                  className="w-20 rounded border px-2 py-1 text-[13px]"
                />
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <div className="text-[12px] font-medium text-[#0a5ad6]">
                    Positive
                  </div>
                  <textarea
                    value={draft.positive}
                    onChange={(e) =>
                      setDraft({ ...draft, positive: e.target.value })
                    }
                    rows={6}
                    className="mt-1 w-full rounded border px-3 py-2 text-[13px]"
                    placeholder="What did you like?"
                  />
                </div>
                <div>
                  <div className="text-[12px] font-medium text-[#b00020]">
                    Negative
                  </div>
                  <textarea
                    value={draft.negative}
                    onChange={(e) =>
                      setDraft({ ...draft, negative: e.target.value })
                    }
                    rows={6}
                    className="mt-1 w-full rounded border px-3 py-2 text-[13px]"
                    placeholder="What could be improved?"
                  />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                {(
                  [
                    ["staff", "Staff"],
                    ["comfort", "Comfort"],
                    ["freeWifi", "Free WiFi"],
                    ["facilities", "Facilities"],
                    ["valueForMoney", "Value for Money"],
                    ["cleanliness", "Cleanliness"],
                    ["location", "Location"],
                  ] as const
                ).map(([key, label]) => (
                  <div
                    key={key}
                    className="rounded-[8px] border border-[#e6eaf0] bg-[#fafafa] p-2"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[12px] font-medium text-[#374151]">
                        {label}
                      </span>
                      <span className="text-[11px] text-[#6b7280]">
                        {(draft.categoryRatings as any)[key] || 0}/10
                      </span>
                    </div>
                    <RatingDots
                      value={(draft.categoryRatings as any)[key] || 0}
                      onChange={(n) =>
                        setDraft({
                          ...draft,
                          categoryRatings: {
                            ...draft.categoryRatings,
                            [key]: n,
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setEditOpen(false)}
                  className="rounded border px-3 py-2 text-[13px]"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="rounded bg-[#0071c2] px-4 py-2 text-[13px] text-white"
                >
                  Save
                </button>
              </div>
            </div>
          )}
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
