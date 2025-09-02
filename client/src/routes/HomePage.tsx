// src/routes/HomePage.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroSearch from "@/components/search/HeroSearch";
import PropertyTypesSection from "@/components/PropertyTypesSection";

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

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8 pt-20">
        <header>
          <h2 className="text-[26px] font-bold">Offers</h2>
          <p className="mt-1 mb-3 text-[16px] text-muted-foreground">
            Promotions, deals and special offers for you
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr]">
          <Card className="relative overflow-hidden rounded-sm border-0 shadow-md p-0">
            <div className="relative h-[180px] w-full md:h-[190px]">
              <img
                src="https://q-xx.bstatic.com/xdata/images/xphoto/814x138/535341132.jpeg?k=9adf4d98ff2d48c5745b37654d2d77e09169647b979dfda9c6baa54198b9fc6c&o="
                alt="Holiday rentals"
                className="absolute inset-0 block h-full w-full object-cover object-[58%_50%]"
              />
              <div className="absolute inset-0" />

              <div className="absolute inset-0 flex items-center justify-start">
                <div className="p-6 text-left text-white">
                  <p className="text-[11px] tracking-wide opacity-90">
                    Holiday rentals
                  </p>
                  <h3 className="text-lg font-bold md:text-xl">
                    Live the dream in a holiday home
                  </h3>
                  <p className="mt-1 text-sm opacity-90">
                    Choose from houses, villas, chalets and more
                  </p>
                  <Button className="mt-3 w-auto rounded bg-[#0071c2] hover:bg-[#0a69b4]">
                    Book yours
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="h-[170px] md:h-[160px] overflow-hidden rounded-sm border-1  self-start">
            <CardContent className="flex h-full justify-between">
              <div className="min-w-0">
                <div className="text-2xl font-bold">
                  Quick escape, quality time
                </div>
                <div className="mt-1 text-sm ">
                  Save up to 20% with a Getaway Deal
                </div>
                <Button className="mt-3 w-auto rounded bg-[#0071c2] hover:bg-[#0a69b4]">
                  Save on stays
                </Button>
              </div>
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md md:h-28 md:w-28">
                <img
                  src="https://r-xx.bstatic.com/xdata/images/xphoto/248x248/468828542.jpeg?k=b51cb74f05db0ebc1a1cbcca384fa2ee8c4d6c0b5fd089a15b1fd14a107ccab4&o="
                  alt="Deal"
                  className="h-full w-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <PropertyTypesSection />

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8 pt-20">
        <h2 className="text-[26px] font-bold">Browse by property type</h2>
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
