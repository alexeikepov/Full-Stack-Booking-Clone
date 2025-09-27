import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMyReviews } from "@/lib/api";
import Footer from "@/components/navigation/Footer";
import { useNavigationTabsStore } from "@/stores/navigationTabs";
import { getPrimaryImage } from "@/utils/hotel-images";
import type { Review } from "@/types/review";
import {
  ReviewCard,
  ReviewTabs,
  ReviewSummary,
  ReviewFilters,
} from "@/components/reviews";

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
        const total = mapped.length;
        const sum = mapped.reduce(
          (s, r) => s + (Number.isFinite(r.score) ? r.score : 0),
          0
        );
        setAvgScore(total ? sum / total : 0);
        const byStatus = (st: string) =>
          mapped.filter((r) => (r.status || "").toUpperCase() === st).length;
        setPublishedCount(byStatus("APPROVED") || total);
        setPendingCount(byStatus("PENDING"));
        setRejectedCount(byStatus("REJECTED"));
      } catch (e: any) {
        setError(e?.response?.data?.error || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
      <div className="h-[16px]" />

      <main className="mx-auto max-w-[1128px] px-4">
        <div className="mb-3 h-[14px] w-full rounded-sm bg-[#0a3d8f]/10" />

        <div className="grid grid-cols-12 gap-8">
          <aside className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="text-[22px] font-semibold">Your reviews</div>

            <ReviewTabs />

            <ReviewSummary
              avgScore={avgScore}
              publishedCount={publishedCount}
              pendingCount={pendingCount}
              rejectedCount={rejectedCount}
            />
          </aside>

          <section className="col-span-12 md:col-span-8 lg:col-span-6">
            <ReviewFilters year={year} months={months} onYearChange={setYear} />

            <div className="mx-auto w-full max-w-[580px] space-y-3">
              {(loading
                ? []
                : filteredReviews.length
                ? filteredReviews
                : DEMO
              ).map((r) => (
                <ReviewCard
                  key={r.id}
                  review={r}
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
