// src/routes/HomePage.tsx
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroSearch from "@/components/search/HeroSearch";
import PropertyTypesSection from "@/components/homePage/PropertyTypesSection";
import TrendingDestinations from "@/components/homePage/TrendingDestinations";
import TripPlannerCarousel from "@/components/homePage/TripPlannerCarousel";
import TravelMoreSection from "@/components/homePage/TravelMoreSection";
import PopularWithTravellers from "@/components/homePage/PopularWithTravellers";
import Footer from "@/components/navigation/Footer";
import { useNavigationStore } from "@/stores/navigation";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { setActiveTab } = useNavigationStore();
  const { t } = useTranslation();

  // Set active tab to 'stays' when home page loads
  useEffect(() => {
    setActiveTab("stays");
  }, [setActiveTab]);

  return (
    <div className="flex flex-col">
      <section className="w-full bg-[#003b95] text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
          <h1 className="text-3xl font-bold md:text-5xl">
            {t("home.hero.title")}
          </h1>
          <p className="text-2xl mt-2 text-white/90">
            {t("home.hero.subtitle")}
          </p>
        </div>
      </section>
      <div className="relative -mt-8">
        <HeroSearch />
      </div>

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8 pt-20">
        <header>
          <h2 className="text-[26px] font-bold">{t("home.offers.title")}</h2>
          <p className="mt-1 mb-3 text-[16px] text-muted-foreground">
            {t("home.offers.subtitle")}
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
                  <p className="text-[11px] tracking-wide opacity-80">
                    {t("home.card1.kicker")}
                  </p>
                  <h3 className="text-lg font-bold md:text-xl">
                    {t("home.card1.title")}
                  </h3>
                  <p className="mt-1 text-sm opacity-90">
                    {t("home.card1.subtitle")}
                  </p>
                  <Button className="mt-3 w-auto rounded bg-[#0071c2] hover:bg-[#0a69b4]">
                    {t("home.card1.cta")}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="h-[170px] md:h-[160px] overflow-hidden rounded-sm border-1  self-start">
            <CardContent className="flex h-full justify-between">
              <div className="min-w-0">
                <div className="text-2xl font-bold">
                  {t("home.card2.title")}
                </div>
                <div className="mt-1 text-sm ">{t("home.card2.subtitle")}</div>
                <Button className="mt-3 w-auto rounded bg-[#0071c2] hover:bg-[#0a69b4]">
                  {t("home.card2.cta")}
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
      <TrendingDestinations />
      <PropertyTypesSection />
      <TripPlannerCarousel />
      <TravelMoreSection />

      <PopularWithTravellers />
      <Footer />
    </div>
  );
}
