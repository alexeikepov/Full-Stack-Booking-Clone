// src/routes/HomePage.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeroSearch from "@/components/search/HeroSearch";

const PROPERTY_TYPES = [
  {
    key: "hotels",
    title: "Hotels",
    image: "https://picsum.photos/seed/hotels/600/400",
  },
  {
    key: "apartments",
    title: "Apartments",
    image: "https://picsum.photos/seed/apartments/600/400",
  },
  {
    key: "resorts",
    title: "Resorts",
    image: "https://picsum.photos/seed/resorts/600/400",
  },
  {
    key: "villas",
    title: "Villas",
    image: "https://picsum.photos/seed/villas/600/400",
  },
];

const TRENDING = [
  {
    id: "athens",
    city: "Athens",
    flag: "🇬🇷",
    image: "https://picsum.photos/seed/athens/1200/800",
  },
  {
    id: "budapest",
    city: "Budapest",
    flag: "🇭🇺",
    image: "https://picsum.photos/seed/budapest/1200/800",
  },
  {
    id: "rome",
    city: "Rome",
    flag: "🇮🇹",
    image: "https://picsum.photos/seed/rome/1200/800",
  },
  {
    id: "dubai",
    city: "Dubai",
    flag: "🇦🇪",
    image: "https://picsum.photos/seed/dubai/1200/800",
  },
  {
    id: "bangkok",
    city: "Bangkok",
    flag: "🇹🇭",
    image: "https://picsum.photos/seed/bangkok/1200/800",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="w-full bg-[#003b95] text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
          <h1 className="text-3xl font-bold md:text-5xl">
            Find your next stay
          </h1>
          <p className="text-2xl mt-2 text-white/90">
            Search low prices on hotels, homes and much more…
          </p>
        </div>
      </section>
      <div className="-mt-8">
        <HeroSearch />
      </div>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[2fr_1fr]">
        <Card className="overflow-hidden">
          <div className="h-44 w-full overflow-hidden md:h-52">
            <img
              src="https://picsum.photos/seed/offer1/1200/600"
              alt="Holiday rentals"
              className="h-full w-full object-cover"
            />
          </div>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="flex h-full items-center justify-between gap-4 p-4">
            <div>
              <div className="text-lg font-semibold">
                Quick escape, quality time
              </div>
              <div className="text-sm opacity-70">
                Save up to 20% with a Getaway Deal
              </div>
              <Button className="mt-3 bg-[#0071c2] hover:bg-[#0a69b4]">
                Save on stays
              </Button>
            </div>
            <div className="h-24 w-28 overflow-hidden rounded-md">
              <img
                src="https://picsum.photos/seed/offer2/400/300"
                alt="Deal"
                className="h-full w-full object-cover"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-2">
        <h2 className="text-2xl font-semibold">Browse by property type</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROPERTY_TYPES.map((p) => (
            <Card key={p.key} className="overflow-hidden">
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{p.title}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10 pt-2">
        <h2 className="text-2xl font-semibold">Trending destinations</h2>
        <div className="text-sm opacity-70">
          Most popular choices for travellers from Israel
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TRENDING.map((t) => (
            <Link
              key={t.id}
              to={`/search?city=${encodeURIComponent(t.city)}`}
              className="relative overflow-hidden rounded-xl border"
            >
              <img
                src={t.image}
                alt={t.city}
                className="h-56 w-full object-cover md:h-64"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute left-4 top-4 text-2xl font-semibold text-white drop-shadow">
                {t.city} <span className="text-xl">{t.flag}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t py-6 text-sm opacity-70">
        <div className="mx-auto max-w-6xl px-4">
          © {new Date().getFullYear()} Booking Clone — All rights reserved.
        </div>
      </footer>
    </div>
  );
}
