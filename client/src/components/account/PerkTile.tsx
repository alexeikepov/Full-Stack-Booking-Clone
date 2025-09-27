import { Unlock } from "lucide-react";

interface PerkTileProps {
  img: string;
  title: string;
  badge?: string;
}

export default function PerkTile({ img, title, badge }: PerkTileProps) {
  return (
    <div className="relative h-[110px] rounded-[10px] border border-[#e6eaf0] bg-white px-4 py-6 flex items-center gap-3 shadow-[0_1px_2px_rgba(0,0,0,.03)]">
      <img src={img} alt="" className="h-8 w-8 object-contain" />
      <div className="text-[14px] font-medium leading-5">{title}</div>
      {badge && (
        <span className="absolute -top-2 left-2 rounded-full bg-[#fff3cd] px-2 py-[2px] text-[10px] font-semibold text-[#8a6d3b] flex items-center gap-1">
          <Unlock className="h-3 w-3" />
          {badge}
        </span>
      )}
    </div>
  );
}
