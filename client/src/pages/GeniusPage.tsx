import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMe, getReservations } from "@/lib/api";

type GeniusInfo = {
  level: number;
  completedLast24Months: number;
  nextThreshold: number | null;
  remaining: number;
};

export default function GeniusPage() {
  const [genius, setGenius] = useState<GeniusInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        let info: GeniusInfo | null = null;
        try {
          const me = await getMe();
          if (me?.genius) {
            info = me.genius;
          }
        } catch (e: any) {
          // ignore 404 and compute locally instead
        }
        if (!info) {
          try {
            const rows: any[] = await getReservations({ status: "COMPLETED", limit: 500 });
            const since = new Date();
            since.setMonth(since.getMonth() - 24);
            const now = new Date();
            const count = rows.filter((r: any) => {
              const status = String(r.status || "").toUpperCase();
              const d = new Date(r.checkOut || r.checkIn || r.createdAt);
              return (
                status === "COMPLETED" &&
                !isNaN(+d) &&
                d >= since &&
                d <= now
              );
            }).length;
            let level = 1;
            if (count >= 15) level = 3; else if (count >= 5) level = 2;
            const nextThreshold = level === 1 ? 5 : level === 2 ? 15 : null;
            const remaining = nextThreshold ? Math.max(0, nextThreshold - count) : 0;
            info = { level, completedLast24Months: count, nextThreshold, remaining };
          } catch (e: any) {
            setError(e?.response?.data?.error || "Failed to load Genius status");
          }
        }
        if (info) setGenius(info);
      } catch (e: any) {
        setError(e?.response?.data?.error || "Failed to load Genius status");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const level = genius?.level ?? 1;
  const total = genius?.completedLast24Months ?? 0;
  const next = genius?.nextThreshold;
  const remaining = genius?.remaining ?? 0;
  const progress = next ? Math.min(100, Math.round((total / next) * 100)) : 100;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Genius</h1>
          <Link to="/account" className="text-[#0071c2] hover:underline">Back to account</Link>
        </div>

        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : error ? (
          <div className="rounded border border-[#f3c2c0] bg-[#fdeeee] px-4 py-3 text-sm text-[#8b1f1b]">{error}</div>
        ) : (
          <div className="space-y-8">
            {/* Current status banner */}
            <div className="rounded-xl border border-[#e6eaf0] bg-gradient-to-r from-[#f7fbff] to-white p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-lg font-semibold text-[#1f2937]">You're at Genius Level {level}</div>
                  <div className="mt-1 text-sm text-[#6b7280]">
                    {total} bookings in the last 24 months
                  </div>
                </div>
                <div className="w-full sm:w-[360px]">
                  <div className="flex items-center justify-between text-xs text-[#6b7280]">
                    <span>Progress to {next ? `Level ${level + 1}` : 'max level'}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded bg-[#eef2f7]">
                    <div className="h-2 bg-[#003b95]" style={{ width: `${progress}%` }} />
                  </div>
                  {next && (
                    <div className="mt-1 text-xs text-[#6b7280]">
                      {remaining} more bookings to reach Level {level + 1}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rewards grid */}
            <div className="rounded-xl border border-[#e6eaf0] bg-white p-5">
              <div className="text-[16px] font-semibold">Enjoy your travel rewards</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Perk title="10% off selected stays" active={level >= 1} />
                <Perk title="15% off selected stays" active={level >= 2} />
                <Perk title="20% off selected stays" active={level >= 3} />
                <Perk title="Priority support" active={level >= 3} />
                <Perk title="Free breakfasts (select properties)" active={level >= 2} />
                <Perk title="Room upgrades (when available)" active={level >= 2} />
                <Perk title="Rental car discounts" active={level >= 1} />
                <Perk title="Members-only deals" active={level >= 1} />
              </div>
            </div>

            {/* Levels comparison */}
            <div className="rounded-xl border border-[#e6eaf0] bg-white p-5">
              <div className="text-[16px] font-semibold mb-3">Discover Genius levels</div>
              <div className="grid gap-4 md:grid-cols-3">
                <LevelCard level={1} current={level} thresholdLabel="Create an account" benefits={["10% off stays", "Car rental discounts"]} />
                <LevelCard level={2} current={level} thresholdLabel="5 bookings in 24 months" benefits={["15% off stays", "Free breakfast", "Room upgrades"]} />
                <LevelCard level={3} current={level} thresholdLabel="15 bookings in 24 months" benefits={["20% off stays", "Priority support"]} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Perk({ title, active }: { title: string; active: boolean }) {
  return (
    <div className={`rounded-[10px] border px-3 py-3 text-sm ${active ? 'border-[#c7dbff] bg-[#f5f9ff] text-[#1f2937]' : 'border-[#e6eaf0] bg-[#fafafa] text-[#9ca3af]'}`}>
      {title}
    </div>
  );
}

function LevelCard({ level, current, thresholdLabel, benefits }: { level: number; current: number; thresholdLabel: string; benefits: string[] }) {
  const isCurrent = current === level;
  return (
    <div className={`rounded-[12px] border p-4 ${isCurrent ? 'border-[#c7dbff] bg-[#f5f9ff]' : 'border-[#e6eaf0] bg-white'}`}>
      <div className="flex items-center justify-between">
        <div className="text-[15px] font-semibold">Genius Level {level}</div>
        {isCurrent && <span className="rounded-full bg-[#003b95] px-2 py-[2px] text-[11px] font-medium text-white">Current</span>}
      </div>
      <div className="mt-1 text-[12px] text-[#6b7280]">{thresholdLabel}</div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-[13px] text-[#374151]">
        {benefits.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
}


