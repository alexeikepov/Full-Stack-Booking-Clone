// src/pages/AccountPage.tsx
import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  CreditCard,
  Wallet,
  User,
  Shield,
  Users,
  Settings2,
  Mail,
  FileText,
  Building2,
  ChevronRight,
  BriefcaseBusiness,
} from "lucide-react";
import { useNavigationTabsStore } from "@/stores/navigationTabs";

import perkStays from "@/img/account images/perk-stays.png";
import perkCars from "@/img/account images/perk-cars.png";
import perkBreakfast from "@/img/account images/perk-breakfasts.png";
import perkUpgrade from "@/img/account images/perk-upgrades.png";
import perkPriority from "@/img/account images/perk-priority.png";
import highestGenius from "@/img/account images/perk-highest-genius.png";

type UserLite = {
  name?: string | null;
  geniusLevel?: number | null;
  rewardsCount?: number | null;
  creditsCount?: number | null;
  initials?: string | null;
};

export default function AccountPage({
  user = {
    name: "Alexei Kepiv",
    geniusLevel: 3,
    rewardsCount: 5,
    creditsCount: 0,
    initials: "AK",
  },
}: {
  user?: UserLite;
}) {
  const { setShowTabs } = useNavigationTabsStore();
  const geniusLabel = `Genius Level ${user.geniusLevel ?? 3}`;

  // Generate initials from name
  const initials =
    user?.initials ||
    (user?.name
      ? user.name
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((n) => n[0]?.toUpperCase() ?? "")
          .join("") || "U"
      : "U");

  useEffect(() => {
    setShowTabs(false);
    return () => setShowTabs(true);
  }, [setShowTabs]);

  return (
    <div className="min-h-screen bg-[#f2f5f9] text-[#1a1a1a]">
      {/* Welcome Genius Level Section */}
      <div className="w-full bg-[#003b95]">
        <div className="mx-auto max-w-[1128px] px-4 py-8 pb-16">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full p-[3px] bg-[#febb02]">
              <div
                className="grid h-full w-full place-items-center rounded-full text-white font-semibold text-2xl"
                style={{
                  background:
                    "radial-gradient(circle at 50% 45%, #cf5418 0 60%, #b84512 100%)",
                }}
              >
                {initials}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-2xl font-bold">Welcome</span>
              <span className="text-lg font-medium">
                <span className="text-white">Genius </span>
                <span className="text-[#febb02]">
                  Level {user?.geniusLevel ?? 3}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1128px] px-4 -mt-[40px] pb-10">
        <div className="grid grid-cols-[minmax(0,1fr)_312px] gap-6">
          <div className="rounded-[12px] bg-white shadow-[0_2px_8px_rgba(0,0,0,.06)] ring-1 ring-[#e6eaf0]">
            <div className="px-6 pt-8 pb-6">
              <div className="text-[16px] font-semibold">
                You have {user.rewardsCount ?? 5} Genius rewards
              </div>
              <div className="mt-3 text-[13px] text-black/60">
                Enjoy rewards and discounts on select stays and rental cars
                worldwide.
              </div>
            </div>

            <div className="px-5 pb-6">
              <div className="grid grid-cols-5 gap-5">
                <PerkTile
                  img={perkStays}
                  title="10–20% off stays"
                  badge="Level 3"
                />
                <PerkTile
                  img={perkCars}
                  title="10–15% discounts on rental cars"
                />
                <PerkTile img={perkBreakfast} title="Free breakfasts" />
                <PerkTile img={perkUpgrade} title="Free room upgrades" />
                <PerkTile
                  img={perkPriority}
                  title="Priority support on stays"
                />
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

          {/* Right column with two stacked panels */}
          <div className="flex flex-col gap-6">
            {/* Top right panel: Genius level */}
            <div className="rounded-[12px] bg-white shadow-[0_2px_8px_rgba(0,0,0,.06)] ring-1 ring-[#e6eaf0]">
              <div className="px-6 py-8">
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={highestGenius}
                    alt=""
                    className="h-16 w-16 object-contain"
                  />
                  <div className="text-[16px] font-semibold text-center">
                    You're at the highest Genius level!
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom right panel: Credits and vouchers */}
            <div className="rounded-[12px] bg-white shadow-[0_2px_8px_rgba(0,0,0,.06)] ring-1 ring-[#e6eaf0]">
              <div className="px-6 py-8">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-[14px] text-black/70">
                    No Credits or vouchers yet
                  </div>
                  <div className="text-[13px] text-black font-bold">
                    {user.creditsCount ?? 0}
                  </div>
                </div>
                <Link
                  to="/account/credits"
                  className="text-[#0071c2] text-[13px] font-medium hover:underline"
                >
                  More details
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Section title="Payment information">
            <Row
              to="/account/wallet"
              icon={<Wallet className="h-4 w-4" />}
              label="Rewards & Wallet"
            />
            <Row
              to="/account/payments"
              icon={<CreditCard className="h-4 w-4" />}
              label="Payment methods"
            />
          </Section>

          <Section title="Manage account">
            <Row
              to="/account/personal"
              icon={<User className="h-4 w-4" />}
              label="Personal details"
            />
            <Row
              to="/account/security"
              icon={<Shield className="h-4 w-4" />}
              label="Security settings"
            />
            <Row
              to="/account/travellers"
              icon={<Users className="h-4 w-4" />}
              label="Other travellers"
            />
          </Section>

          <Section title="Preferences">
            <Row
              to="/account/customizations"
              icon={<Settings2 className="h-4 w-4" />}
              label="Customization preferences"
            />
            <Row
              to="/account/email-preferences"
              icon={<Mail className="h-4 w-4" />}
              label="Email preferences"
            />
          </Section>

          <Section title="Travel activity">
            <Row
              to="/account/bookings"
              icon={<BriefcaseBusiness className="h-4 w-4" />}
              label="Trips and bookings"
            />
            <Row
              to="/account/saved"
              icon={<FileText className="h-4 w-4" />}
              label="Saved lists"
            />
            <Row
              to="/account/reviews"
              icon={<FileText className="h-4 w-4" />}
              label="My reviews"
            />
          </Section>

          <Section title="Help and support">
            <Row
              to="/support/contact"
              icon={<FileText className="h-4 w-4" />}
              label="Contact Customer service"
            />
            <Row
              to="/support/safety"
              icon={<FileText className="h-4 w-4" />}
              label="Safety resource centre"
            />
            <Row
              to="/support/disputes"
              icon={<FileText className="h-4 w-4" />}
              label="Dispute resolution"
            />
          </Section>

          <Section title="Legal and privacy">
            <Row
              to="/legal/privacy"
              icon={<Shield className="h-4 w-4" />}
              label="Privacy and data management"
            />
            <Row
              to="/legal/content"
              icon={<FileText className="h-4 w-4" />}
              label="Content guidelines"
            />
          </Section>

          <Section title="Manage your property">
            <Row
              to="/list-your-property"
              icon={<Building2 className="h-4 w-4" />}
              label="List your property"
            />
          </Section>
        </div>

        <div className="mx-auto mt-10 max-w-[960px] text-center text-[12px] text-black/55">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <span>Contact Customer Service</span>
            <span>•</span>
            <span>Privacy & cookies</span>
            <span>•</span>
            <span>Modern Slavery Statement</span>
            <span>•</span>
            <span>Human Rights Statement</span>
            <span>•</span>
            <span>Terms of Service</span>
          </div>
          <div className="mt-2 text-black/45">
            Copyright © 1996–2025 Booking.com™. All rights reserved.
          </div>
        </div>
      </main>
    </div>
  );
}

function PerkTile({
  img,
  title,
  badge,
}: {
  img: string;
  title: string;
  badge?: string;
}) {
  return (
    <div className="relative h-[110px] rounded-[10px] border border-[#e6eaf0] bg-white px-4 py-6 flex items-center gap-3 shadow-[0_1px_2px_rgba(0,0,0,.03)]">
      <img src={img} alt="" className="h-8 w-8 object-contain" />
      <div className="text-[14px] font-medium leading-5">{title}</div>
      {badge && (
        <span className="absolute -top-2 left-2 rounded-full bg-[#fff3cd] px-2 py-[2px] text-[10px] font-semibold text-[#8a6d3b]">
          {badge}
        </span>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[12px] bg-white shadow-[0_2px_8px_rgba(0,0,0,.06)] ring-1 ring-[#e6eaf0]">
      <div className="px-5 py-4 border-b border-[#e6eaf0] text-[14px] font-semibold">
        {title}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function Row({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-[10px] px-4 py-4 hover:bg-[#f6f7fb]"
    >
      <div className="flex items-center gap-3">
        <span className="text-[#003b95]">{icon}</span>
        <span className="text-[13px]">{label}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-black/30" />
    </Link>
  );
}
