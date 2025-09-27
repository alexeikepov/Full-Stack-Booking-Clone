// src/components/PropertyTypesSection.tsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

type PropertyType = { key: string; title: string; image: string };

const PROPERTY_TYPES: PropertyType[] = [
  {
    key: "hotels",
    title: "Hotels",
    image:
      "https://r-xx.bstatic.com/xdata/images/hotel/263x210/595550862.jpeg?k=3514aa4abb76a6d19df104cb307b78b841ac0676967f24f4b860d289d55d3964&o=",
  },
  {
    key: "apartments",
    title: "Apartments",
    image:
      "https://q-xx.bstatic.com/xdata/images/hotel/263x210/595548591.jpeg?k=01741bc3aef1a5233dd33794dda397083092c0215b153915f27ea489468e57a2&o=",
  },
  {
    key: "resorts",
    title: "Resorts",
    image:
      "https://r-xx.bstatic.com/xdata/images/hotel/263x210/595551044.jpeg?k=262826efe8e21a0868105c01bf7113ed94de28492ee370f4225f00d1de0c6c44&o=",
  },
  {
    key: "villas",
    title: "Villas",
    image:
      "https://q-xx.bstatic.com/xdata/images/hotel/263x210/620168315.jpeg?k=300d8d8059c8c5426ea81f65a30a7f93af09d377d4d8570bda1bd1f0c8f0767f&o=",
  },

  {
    key: "cabins",
    title: "Cabins",
    image:
      "https://q-xx.bstatic.com/xdata/images/hotel/263x210/595549239.jpeg?k=ad5273675c516cc1efc6cba2039877297b7ad2b5b3f54002c55ea6ebfb8bf949&o=",
  },
  {
    key: "cottages",
    title: "Cottages",
    image:
      "https://q-xx.bstatic.com/xdata/images/hotel/263x210/595530000.jpeg?k=71eeb3e0996d7f734e57a6fa426c718749a36df768ca5d2fb1dc65fcd7483c1d&o=",
  },
  {
    key: "glamping",
    title: "Glamping",
    image:
      "https://r-xx.bstatic.com/xdata/images/xphoto/263x210/45450090.jpeg?k=52f6b8190edb5a9c91528f8e0f875752ce55a6beb35dc62873601e57944990e4&o=",
  },
  {
    key: "serviced-apartments",
    title: "Serviced apartments",
    image:
      "https://q-xx.bstatic.com/xdata/images/hotel/263x210/595551195.jpeg?k=fe19403cca087623a33bf24c4154a636cd26d04c2aa948634fb05afa971e7767&o=",
  },
  {
    key: "holiday-homes",
    title: "Holiday homes",
    image:
      "https://r-xx.bstatic.com/xdata/images/hotel/263x210/595550229.jpeg?k=2ae1f5975fa1f846ac707d3334eb604a7e8f817f640cbd790185b2691532476b&o=",
  },
  {
    key: "guest-houses",
    title: "Guest houses",
    image:
      "https://r-xx.bstatic.com/xdata/images/hotel/263x210/595550178.jpeg?k=1db9bffadd03a0f2a9f0a06ba6c7751b16465f2dd251738f229d7a57dca799ef&o=",
  },
  {
    key: "hostels",
    title: "Hostels",
    image:
      "https://r-xx.bstatic.com/xdata/images/hotel/263x210/595550415.jpeg?k=8967853a074040381dfa25a568e6c780e309b529e0c144995c5bbc9644721eca&o=",
  },
  {
    key: "motels",
    title: "Motels",
    image:
      "https://q-xx.bstatic.com/xdata/images/hotel/263x210/595550975.jpeg?k=6d2c22368ec017e1f99a4811c8abb1cb2d7fd829c9ddd12a82ff1aa77ab7da19&o=",
  },
];

export default function PropertyTypesSection() {
  const { t } = useTranslation();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const measure = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    measure();
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => measure();
    el.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;

    const item = el.querySelector<HTMLElement>(".group.snap-start");
    const itemWidth = item?.getBoundingClientRect().width ?? 260;

    const styles = window.getComputedStyle(el);
    const gap =
      parseFloat(
        styles.getPropertyValue("column-gap") ||
          styles.getPropertyValue("gap") ||
          "0"
      ) || 0;

    el.scrollBy({ left: (itemWidth + gap) * dir, behavior: "smooth" });
  };

  return (
    <section className="mx-auto w-full max-w-6xl mt-6 px-4 md:px-6 lg:px-8">
      <header className="mb-4 md:mb-4">
        <h2 className="text-[26px] font-bold">{t("home.propertyTypes.title")}</h2>
      </header>

      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l to-transparent md:w-12 dark:from-background/95"
        />

        {canLeft && (
          <button
            aria-label="Scroll left"
            onClick={() => scrollBy(-1)}
            className="hidden md:flex absolute left-2 top-1/2 z-10 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white shadow-md  dark:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {canRight && (
          <button
            aria-label="Scroll right"
            onClick={() => scrollBy(1)}
            className="hidden md:flex absolute right-2 top-1/2 z-10 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white shadow-md dark:bg-muted"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        <div
          ref={trackRef}
          className="
            flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          "
        >
          {PROPERTY_TYPES.map((pt) => (
            <Link
              key={pt.key}
              to={`/search?type=${pt.key}`}
              className="group snap-start"
              style={{ minWidth: 260 }}
            >
              <div className="h-44 w-[250px] overflow-hidden rounded-md md:h-52">
                <img
                  src={pt.image}
                  alt={pt.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="mt-3 ml-1 text-base font-bold">{t(`home.propertyTypes.items.${pt.key}`)}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
