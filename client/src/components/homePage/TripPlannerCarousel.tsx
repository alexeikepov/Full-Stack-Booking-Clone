// src/components/TripPlannerCarousel.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Category =
  | "Festivals"
  | "Art & Music"
  | "Beach Relaxation"
  | "Gastronomy & Wine"
  | "Shopping & Markets"
  | "Cultural Exploration";

type Destination = {
  city: string;
  distance: string;
  image: string;
  categories: Category[];
  href?: string;
};

const CATEGORIES: Category[] = [
  "Festivals",
  "Art & Music",
  "Beach Relaxation",
  "Gastronomy & Wine",
  "Shopping & Markets",
  "Cultural Exploration",
];

const DESTINATIONS: Destination[] = [
  {
    city: "Tel Aviv",
    distance: "9 km away",
    image:
      "https://q-xx.bstatic.com/xdata/images/city/170x136/654845.jpg?k=82cf90c38f119a87c59c4f9d47a34246b66453e61e954af69c616682837d0a77&o=",
    categories: [
      "Festivals",
      "Art & Music",
      "Beach Relaxation",
      "Shopping & Markets",
    ],
  },
  {
    city: "Bat Yam",
    distance: "14 km away",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/13089226.jpg?k=3e7e5afaa5c3a7cda5a6aa46e3648074c6f9f90a6528ca60c25dfd4c31b20e1a&o=&hp=1=",
    categories: [
      "Festivals",
      "Art & Music",
      "Beach Relaxation",
      "Shopping & Markets",
    ],
  },
  {
    city: "Netanya",
    distance: "27 km away",
    image:
      "https://r-xx.bstatic.com/xdata/images/city/170x136/654830.jpg?k=7210313433c5a7774712fb624ef0d53d79ef04d8a591a85ac5814dbedecd63af&o=",
    categories: [
      "Festivals",
      "Art & Music",
      "Beach Relaxation",
      "Shopping & Markets",
    ],
  },
  {
    city: "Hadera",
    distance: "39 km away",
    image:
      "https://q-xx.bstatic.com/xdata/images/city/170x136/730812.jpg?k=fa4fb44fd5daba4d893d5a2b1b9a492dcc99759db37a19b0561a64308509b301&o=",
    categories: [
      "Festivals",
      "Art & Music",
      "Beach Relaxation",
      "Shopping & Markets",
    ],
  },
  {
    city: "Jerusalem",
    distance: "48 km away",
    image:
      "https://r-xx.bstatic.com/xdata/images/city/170x136/690881.jpg?k=83e13b86482653ec4570636ec81985c62ab8ba89f5a8180e95e13512541e1305&o=",
    categories: [
      "Festivals",
      "Art & Music",
      "Gastronomy & Wine",
      "Cultural Exploration",
      "Shopping & Markets",
    ],
  },
  {
    city: "Haifa",
    distance: "82 km away",
    image:
      "https://r-xx.bstatic.com/xdata/images/city/170x136/654812.jpg?k=6fcef01b1908e944b5641a4ebe50b6ce77008687e588cdb25eb5ebc42070b324&o=",
    categories: [
      "Festivals",
      "Art & Music",
      "Beach Relaxation",
      "Cultural Exploration",
      "Shopping & Markets",
    ],
  },
  {
    city: "Ashkelon",
    distance: "55 km away",
    image:
      "https://q-xx.bstatic.com/xdata/images/city/170x136/949663.jpg?k=c696420dc5edc9ff24bea144a8a8d2cfed163f09ffb82d25fc8f9c6fe697a756&o=",
    categories: ["Festivals", "Beach Relaxation"],
  },
  {
    city: "Ashdod",
    distance: "38 km away",
    image:
      "https://r-xx.bstatic.com/xdata/images/city/170x136/955066.jpg?k=39623d2dda481fa8b049118daef0e3866a2f4ae933d24ffb9d1130ac90339c19&o=",
    categories: [
      "Festivals",
      "Beach Relaxation",
      "Gastronomy & Wine",
      "Shopping & Markets",
    ],
  },
  {
    city: "Nazareth",
    distance: "80 km away",
    image:
      "https://r-xx.bstatic.com/xdata/images/city/170x136/955041.jpg?k=46ac8e5d3cd4459eeabdbeb97d54b8a0a43ff37f25368ee91683dc5c4ff38bcc&o=",
    categories: [
      "Festivals",
      "Cultural Exploration",
      "Gastronomy & Wine",
      "Shopping & Markets",
    ],
  },
  {
    city: "Safed",
    distance: "114 km away",
    image:
      "https://q-xx.bstatic.com/xdata/images/city/170x136/995538.jpg?k=bf9dbd123933de801ae7d7b15b71cbc80857d3ec0e10550a4ab1169d8d62929a&o=",
    categories: ["Festivals", "Art & Music", "Cultural Exploration"],
  },
  {
    city: "‘Akko",
    distance: "95 km away",
    image:
      "https://q-xx.bstatic.com/xdata/images/city/170x136/933521.jpg?k=71d2cdc2253e8e903b4183cd7fca029ab72c89cf57f5d549ff435b4c48241f70&o",
    categories: [
      "Festivals",
      "Cultural Exploration",
      "Beach Relaxation",
      "Shopping & Markets",
    ],
  },
  {
    city: "Beer Sheva",
    distance: "93 km away",
    image:
      "https://q-xx.bstatic.com/xdata/images/city/170x136/987448.jpg?k=e829eca2397cdff2a544ce7ff5570ef281a7db941245e84462433e45fcc35561&o=",
    categories: ["Festivals", "Gastronomy & Wine"],
  },
  {
    city: "Eilat",
    distance: "282 km away",
    image:
      "https://r-xx.bstatic.com/xdata/images/city/170x136/654782.jpg?k=f323ba25d295ba4a886e1ed2317a9323a83187ff64908a36d576943ed98806b7&o=",
    categories: ["Festivals", "Beach Relaxation"],
  },
  {
    city: "Rishon LeZiyyon",
    distance: "15 km away",
    image:
      "https://r-xx.bstatic.com/xdata/images/city/170x136/991522.jpg?k=9bea96bdd807a1f24ada1283cbb2e1fadf452f5467846124bc8cc14902696e38&o=",
    categories: ["Beach Relaxation", "Festivals", "Shopping & Markets"],
  },
  {
    city: "Zichron Ya'akov",
    distance: "60 km away",
    image:
      "https://q-xx.bstatic.com/xdata/images/city/170x136/987457.jpg?k=b1683f34fa816e7ed70474bdef0c8a139a1292c8f97798f9b00eb131dbd31df1&o=",
    categories: ["Festivals", "Gastronomy & Wine", "Cultural Exploration"],
  },
  {
    city: "Carmel Region",
    distance: "95 km away",
    image:
      "https://q-xx.bstatic.com/xdata/images/city/170x136/553059.jpg?k=da6ba716a2a8d60f10d35a6454f2d5547631809ab5dfb0050e4c5d14c9a4f826&o=",
    categories: ["Festivals", "Gastronomy & Wine", "Cultural Exploration"],
  },
];

function buildHref(city: string) {
  return `/search?city=${encodeURIComponent(city)}`;
}

export default function TripPlannerCarousel() {
  const { t } = useTranslation();
  const [active, setActive] = useState<Category>("Festivals");
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const GAP = 16;

  const list = useMemo(
    () => DESTINATIONS.filter((d) => d.categories.includes(active)),
    [active]
  );

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxLeft = Math.max(0, scrollWidth - clientWidth);
    const EPS = 2;
    setCanLeft(scrollLeft > EPS);
    setCanRight(scrollLeft < maxLeft - EPS);
  };

  const scrollByOne = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    if (!card) return;
    const delta = card.offsetWidth + GAP;
    el.scrollBy({ left: dir === "right" ? delta : -delta, behavior: "smooth" });
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    requestAnimationFrame(updateArrows);
  }, [active]);

  useEffect(() => {
    updateArrows();
    const onResize = () => updateArrows();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8 py-10">
      <h2 className="text-[26px] font-bold">{t("home.tripPlanner.title")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("home.tripPlanner.subtitle")}</p>

      {/* Табы */}
      <div
        role="tablist"
        aria-label="Trip planner categories"
        className="mt-4 flex gap-4 overflow-x-auto no-scrollbar text-sm font-medium"
      >
        {CATEGORIES.map((cat) => {
          const isActive = cat === active;
          const labelKeyMap: Record<Category, string> = {
            "Festivals": "home.tripPlanner.categories.festivals",
            "Art & Music": "home.tripPlanner.categories.artMusic",
            "Beach Relaxation": "home.tripPlanner.categories.beachRelaxation",
            "Gastronomy & Wine": "home.tripPlanner.categories.gastronomyWine",
            "Shopping & Markets": "home.tripPlanner.categories.shoppingMarkets",
            "Cultural Exploration": "home.tripPlanner.categories.culturalExploration",
          };
          const label = t(labelKeyMap[cat]);
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(cat)}
              className={[
                "whitespace-nowrap rounded-full px-4 py-1 transition-colors",
                isActive
                  ? "border border-blue-600 text-blue-600"
                  : "border border-transparent hover:bg-muted text-foreground",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="relative mt-6 overflow-hidden">
        {canLeft && (
          <button
            onClick={() => scrollByOne("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow p-2 hover:bg-gray-50"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {canRight && (
          <button
            onClick={() => scrollByOne("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow p-2 hover:bg-gray-50"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        <div
          ref={trackRef}
          onScroll={updateArrows}
          className={[
            "no-scrollbar flex gap-4 overflow-x-auto scroll-smooth",
            canLeft ? "pl-8" : "pl-0",
            canRight ? "pr-8" : "pr-0",
          ].join(" ")}
        >
          {list.map((d) => {
            const getDistance = (raw: string) => {
              const m = raw.match(/^(\d+)\s*km\s*away$/i);
              if (m) return t("home.tripPlanner.kmAway", { km: m[1] });
              return raw;
            };
            const content = (
              <div data-card className="flex-shrink-0 w-[220px] cursor-pointer">
                <div className="h-[140px] w-full overflow-hidden rounded-xl">
                  <img
                    src={d.image}
                    alt={d.city}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="mt-2 text-[15px] font-semibold">{d.city}</div>
                <div className="text-xs text-muted-foreground">
                  {getDistance(d.distance)}
                </div>
              </div>
            );
            return (
              <Link
                key={`${active}-${d.city}`}
                to={d.href ?? buildHref(d.city)}
                aria-label={d.city}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
