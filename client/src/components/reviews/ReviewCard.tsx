import { useState } from "react";
import { api } from "@/lib/api";
import type { Review } from "@/types/review";
import { ScoreBadge, RowLabel, RatingDots } from "./ui";

interface ReviewCardProps {
  review: Review;
  onUpdated?: (review: Review) => void;
  onDeleted?: (id: string) => void;
}

export function ReviewCard({
  review: r,
  onUpdated,
  onDeleted,
}: ReviewCardProps) {
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
        <div className="hidden shrink-0 sm:block">
          <img
            src={r.thumbnail ?? "/placeholder-hotel.svg"}
            alt=""
            className="h-20 w-28 rounded-[6px] object-cover ring-1 ring-black/5"
          />
        </div>

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
