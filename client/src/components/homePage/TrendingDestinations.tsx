// src/components/TrendingDestinations.tsx
import { Link } from "react-router-dom";
import "flag-icons/css/flag-icons.min.css";

type Item = {
  city: string;
  iso2: string;
  image: string;
};

const ROW1: Item[] = [
  {
    city: "Athens",
    iso2: "gr",
    image:
      "https://cf.bstatic.com/xdata/images/city/600x600/971374.jpg?k=95b428839d92c523c81fc50dd7158a9073bbdf92df2a5166748b2d396976ae32&o=",
  },
  {
    city: "Budapest",
    iso2: "hu",
    image:
      "https://cf.bstatic.com/xdata/images/city/600x600/977213.jpg?k=5ae24d0d471f6087e429086b6db1efd8ecc1d5933bb37bdfa7724df6b2741fc5&o==",
  },
];

const ROW2: Item[] = [
  {
    city: "Rome",
    iso2: "it",
    image:
      "https://cf.bstatic.com/xdata/images/city/600x600/981621.jpg?k=28592ab3120c4a8cc6110eafde84e421991074461f2e7b3323fcc00eb0916a56&o==",
  },
  {
    city: "Dubai",
    iso2: "ae",
    image:
      "https://cf.bstatic.com/xdata/images/city/600x600/977220.jpg?k=ee4b7b42c35b8cbf09c8ddb7630092b40cd706fec153c41904ed6e252a883938&o==",
  },
  {
    city: "Bangkok",
    iso2: "th",
    image:
      "https://cf.bstatic.com/xdata/images/city/600x600/977255.jpg?k=701d538f315c17d17ca4eb5ff1a7bd0f8ed9222acebdaa6a212b638d04bef1c1&o=",
  },
];

function FlagBadge({ iso2 }: { iso2: string }) {
  return <span className={`fi fi-${iso2}`} style={{ width: 24, height: 24 }} />;
}

function buildHref(city: string) {
  return `/search?city=${encodeURIComponent(city)}`;
}

function Tile({ item, className }: { item: Item; className: string }) {
  return (
    <Link
      to={buildHref(item.city)}
      aria-label={`Open ${item.city}`}
      className={`group relative overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${className}`}
    >
      <img
        src={item.image}
        alt={item.city}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />

      <div className="absolute left-5 top-5 flex items-center gap-2 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        <span className="text-2xl font-extrabold tracking-tight">
          {item.city}
        </span>
        <FlagBadge iso2={item.iso2} />
      </div>
    </Link>
  );
}

export default function TrendingDestinations() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8 py-10">
      <h2 className="text-[26px] font-bold">Trending destinations</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Most popular choices for travellers from Israel
      </p>

      <div className="mt-6 grid grid-cols-12 gap-4">
        <Tile item={ROW1[0]} className="col-span-12 md:col-span-6 h-[280px]" />
        <Tile item={ROW1[1]} className="col-span-12 md:col-span-6 h-[280px]" />
        <Tile item={ROW2[0]} className="col-span-12 md:col-span-4 h-[230px]" />
        <Tile item={ROW2[1]} className="col-span-12 md:col-span-4 h-[230px]" />
        <Tile item={ROW2[2]} className="col-span-12 md:col-span-4 h-[230px]" />
      </div>
    </section>
  );
}
