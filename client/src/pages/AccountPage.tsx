import { Link } from "react-router-dom";
import { useEffect } from "react";
import { getMe } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
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
  BriefcaseBusiness,
} from "lucide-react";
import { useNavigationTabsStore } from "@/stores/navigationTabs";
import {
  GeniusHeader,
  RewardsSection,
  GeniusLevelPanel,
  CreditsPanel,
  Section,
  Row,
} from "@/components/account";

export default function AccountPage() {
  const { signIn, user: authUser } = useAuth();
  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        signIn({
          id: me.id,
          name: me.name,
          email: me.email,
          genius: me.genius,
        });
      } catch {}
    })();
  }, []);
  const { setShowTabs } = useNavigationTabsStore();

  const initials = authUser?.name
    ? authUser.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((n: string) => n[0]?.toUpperCase() ?? "")
        .join("") || "U"
    : "U";

  const geniusLevel = authUser?.genius?.level ?? 1;
  const rewardsCount = 5;
  const creditsCount = 0;

  useEffect(() => {
    setShowTabs(false);
    return () => setShowTabs(true);
  }, [setShowTabs]);

  if (!authUser) {
    return (
      <div className="min-h-screen bg-[#f2f5f9] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to view your account.
          </p>
          <Link
            to="/login"
            className="inline-block bg-[#0a5ad6] text-white px-6 py-2 rounded-md hover:bg-[#0950b5]"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f5f9] text-[#1a1a1a]">
      <GeniusHeader initials={initials} geniusLevel={geniusLevel} />

      <main className="mx-auto max-w-[1128px] px-4 -mt-[40px] pb-10">
        <div className="grid grid-cols-[minmax(0,1fr)_312px] gap-6">
          <RewardsSection rewardsCount={rewardsCount} />

          <div className="flex flex-col gap-6">
            <GeniusLevelPanel />
            <CreditsPanel creditsCount={creditsCount} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Section title="Payment information">
            <Row
              to="/account/rewards"
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
            <Row
              to="/account/friends"
              icon={<Users className="h-4 w-4" />}
              label="Friends"
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
