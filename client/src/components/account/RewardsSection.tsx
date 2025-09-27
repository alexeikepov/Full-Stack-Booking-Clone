import { Link } from "react-router-dom";
import PerkTile from "./PerkTile";

import perkStays from "@/img/account images/perk-stays.png";
import perkCars from "@/img/account images/perk-cars.png";
import perkBreakfast from "@/img/account images/perk-breakfasts.png";
import perkUpgrade from "@/img/account images/perk-upgrades.png";
import perkPriority from "@/img/account images/perk-priority.png";

interface RewardsSectionProps {
  rewardsCount: number;
}

export default function RewardsSection({ rewardsCount }: RewardsSectionProps) {
  return (
    <div className="rounded-[12px] bg-white shadow-[0_2px_8px_rgba(0,0,0,.06)] ring-1 ring-[#e6eaf0]">
      <div className="px-6 pt-8 pb-6">
        <div className="text-[16px] font-semibold">
          You have {rewardsCount} Genius rewards
        </div>
        <div className="mt-3 text-[13px] text-black/60">
          Enjoy rewards and discounts on select stays and rental cars worldwide.
        </div>
      </div>

      <div className="px-5 pb-6">
        <div className="grid grid-cols-5 gap-5">
          <PerkTile img={perkStays} title="10–20% off stays" badge="Level 1" />
          <PerkTile img={perkCars} title="10–15% discounts on rental cars" />
          <PerkTile img={perkBreakfast} title="Free breakfasts" />
          <PerkTile img={perkUpgrade} title="Free room upgrades" />
          <PerkTile img={perkPriority} title="Priority support on stays" />
        </div>
      </div>

      <div className="px-6 pb-8 pt-3">
        <Link
          to="/account/rewards"
          className="text-[#0071c2] text-[13px] font-medium hover:underline"
        >
          Learn more about your rewards
        </Link>
      </div>
    </div>
  );
}
