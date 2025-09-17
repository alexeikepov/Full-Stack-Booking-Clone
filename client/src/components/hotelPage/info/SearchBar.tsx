import { useSearchParams } from "react-router-dom";
import { DatePicker } from "@/components/search/DatePicker";
import { GuestsPopover } from "@/components/search/GuestsPopover";
import { useSearchStore } from "@/stores/search";

interface SearchBarProps {
  requiredRooms: number;
}

export default function SearchBar({ requiredRooms }: SearchBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    picker,
    adults,
    children,
    rooms: searchRooms,
    setPicker,
    setAdults,
    setChildren,
    setRooms,
  } = useSearchStore();

  const handleChangeSearch = (e: React.MouseEvent) => {
    e.preventDefault();

    const base: Record<string, string> = {
      ...(searchParams.get("city") ? { city: searchParams.get("city")! } : {}),
      adults: String(adults),
      children: String(children),
      rooms: String(searchRooms),
    };

    if (picker.mode === "calendar" && picker.range?.from && picker.range?.to) {
      const next = new URLSearchParams({
        ...base,
        from: picker.range.from.toISOString().slice(0, 10),
        to: picker.range.to.toISOString().slice(0, 10),
      });
      setSearchParams(next);
      // Обновляем URL без перенаправления и прокрутки
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${next.toString()}`
      );

      // Прокручиваем к секции с ценами
      setTimeout(() => {
        const infoSection = document.getElementById("info");
        if (infoSection) {
          infoSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  return (
    <div className="rounded-[8px] bg-[hsl(44,99%,50%)] p-1 shadow-[0_2px_10px_rgba(0,0,0,0.12)] mb-8 max-w-2xl">
      <div className="grid grid-cols-[1.3fr_1.1fr_auto] gap-1">
        <DatePicker
          value={picker}
          onChange={setPicker}
          triggerClassName="h-14"
        />

        <GuestsPopover
          adults={adults}
          children={children}
          rooms={searchRooms}
          setAdults={setAdults}
          setChildren={setChildren}
          setRooms={setRooms}
          minRooms={requiredRooms}
        />

        {/* Change search button */}
        <button
          onClick={handleChangeSearch}
          className="h-14 rounded-md bg-[#0071c2] px-6 text-[18px] font-semibold text-white hover:bg-[#0a69b4]"
        >
          Change search
        </button>
      </div>
    </div>
  );
}
