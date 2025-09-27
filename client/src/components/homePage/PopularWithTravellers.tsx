// src/components/homePage/PopularWithTravellers.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function PopularWithTravellers() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("domestic");
  const [showMore, setShowMore] = useState(false);

  const tabs = [
    { id: "domestic", label: t("home.popular.tabs.domestic") },
    { id: "international", label: t("home.popular.tabs.international") },
    { id: "regions", label: t("home.popular.tabs.regions") },
    { id: "countries", label: t("home.popular.tabs.countries") },
    { id: "places", label: t("home.popular.tabs.places") },
  ];

  const domesticCities = [
    "Eilat hotels",
    "Tel Aviv hotels",
    "Netanya hotels",
    "Haifa hotels",
    "Mitzpe Ramon hotels",
    "Tiberias hotels",
    "Beer Sheva hotels",
    "Herzelia hotels",
    "Arad hotels",
    "Zuqim hotels",
    "Bet Oren hotels",
    "Rishon LeZiyyon hotels",
    "Ashkelon hotels",
    "Bat Yam hotels",
    "Zikhron Ya'aqov hotels",
    "Ashdod hotels",
    "Safed hotels",
    "Ein Bokek hotels",
    "Sede Boqer hotels",
    "Petah Tiqwa hotels",
    "Caesarea hotels",
    "Ein Gedi hotels",
    "Nazareth hotels",
    "Be'er Ora hotels",
    "Nahariyya hotels",
    "Yeroẖam hotels",
    "Naẕerat 'Illit hotels",
    "Qiryat 'Anavim hotels",
    "Moshav Ramot hotels",
    "'Afula hotels",
    "Rosh Pinna hotels",
    "H̱adera hotels",
    "Metsoke Dragot hotels",
    "'Akko hotels",
    "Ma'ale Adumim hotels",
    "Bet Shemesh hotels",
    "Ramat Gan hotels",
    "Rechovot hotels",
    "H̱olon hotels",
    "Neve Zohar hotels",
    "Neve Ativ hotels",
    "Beit Zait hotels",
    "Giv'atayim hotels",
    "Yafo hotels",
    "Neve Ilan hotels",
    "Pardes H̱anna hotels",
    "Regba hotels",
    "Dimona hotels",
    "Giv'at Olga hotels",
    "Yotvata hotels",
    "Yavne'el hotels",
    "Herzliyya B hotels",
    "Qiryat Motzkin hotels",
    "Gedera hotels",
    "Ramat Aviv hotels",
    "Ẕofar hotels",
    "Or Yehuda hotels",
    "Midreshet Ben Gurion hotels",
    "Ra'ananna hotels",
    "Gan Shemu'el hotels",
  ];

  const internationalCities = [
    { city: "Athens hotels", country: "Greece" },
    { city: "Rome hotels", country: "Italy" },
    { city: "Budapest hotels", country: "Hungary" },
    { city: "Prague hotels", country: "Czech Republic" },
    { city: "Dubai hotels", country: "United Arab Emirates" },
    { city: "London hotels", country: "United Kingdom" },
    { city: "Bucharest hotels", country: "Romania" },
    { city: "Barcelona hotels", country: "Spain" },
    { city: "Vienna hotels", country: "Austria" },
    { city: "Paris hotels", country: "France" },
    { city: "Bangkok hotels", country: "Thailand" },
    { city: "Madrid hotels", country: "Spain" },
    { city: "Larnaka hotels", country: "Cyprus" },
    { city: "Lisbon hotels", country: "Portugal" },
    { city: "Batumi hotels", country: "Georgia" },
    { city: "Milan hotels", country: "Italy" },
    { city: "Limassol hotels", country: "Cyprus" },
    { city: "Tokyo hotels", country: "Japan" },
    { city: "Tbilisi City hotels", country: "Georgia" },
    { city: "Paphos City hotels", country: "Cyprus" },
  ];

  const regions = [
    "Dead Sea",
    "Koh Samui",
    "Tel Aviv District",
    "Jerusalem District",
    "North District Israel",
    "Crete",
    "Corfu",
    "Rhodes",
    "Tuscany",
    "Dolomites",
    "Koh Phangan",
    "Krabi Province",
    "Mount Fuji",
    "Negev",
    "Sea of Galilee",
    "Phuket Province",
    "South District Israel",
    "Lake Garda",
    "Center District Israel",
    "Pattaya",
  ];

  const countries = [
    "Israel",
    "Italy",
    "Greece",
    "Thailand",
    "United States",
    "Spain",
    "Japan",
    "Austria",
    "Cyprus",
    "Romania",
    "France",
    "Germany",
    "Hungary",
    "Czech Republic",
    "Georgia",
    "Switzerland",
    "Portugal",
    "United Kingdom",
    "United Arab Emirates",
    "Poland",
  ];

  const placesToStay = [
    "Apartments",
    "Cheap hotels",
    "Hostels",
    "Beach Hotels",
    "Lodges",
    "Five-Star Hotels",
    "Spa Hotels",
    "Boutique Hotels",
    "Villas",
    "Romantic Hotels",
    "Serviced Apartments",
    "Family Hotels",
    "Hotels with Parking",
    "Luxury Hotels",
    "Resorts",
    "Hotels with Pools",
    "Ryokans",
    "Pet-Friendly Hotels",
    "Guest Houses",
    "Cabins",
  ];

  const getCurrentCities = () => {
    if (activeTab === "domestic") {
      return showMore ? domesticCities : domesticCities.slice(0, 25);
    } else if (activeTab === "international") {
      return internationalCities;
    } else if (activeTab === "regions") {
      return regions;
    } else if (activeTab === "countries") {
      return countries;
    } else if (activeTab === "places") {
      return placesToStay;
    }
    return [];
  };

  const visibleCities = getCurrentCities();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-[26px] font-bold text-gray-900 mb-4">{t("home.popular.title")}</h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowMore(false);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-3xl transition-colors ${
                activeTab === tab.id
                  ? "bg-white border border-blue-400 text-blue-600"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          {visibleCities.map((cityData, index) => {
            const city =
              typeof cityData === "string" ? cityData : cityData.city;
            const country =
              typeof cityData === "object" ? cityData.country : null;

            return (
              <Link
                key={index}
                to={`/search?destination=${city.replace(" hotels", "")}`}
                className="text-xs text-gray-700 hover:text-blue-600 transition-colors block"
              >
                <div>
                  <div>{city}</div>
                  {country && activeTab === "international" && (
                    <div className="text-[10px] text-gray-500 mt-1">
                      {country}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Show More Button - only for domestic cities */}
        {activeTab === "domestic" && (
          <Button
            onClick={() => setShowMore(!showMore)}
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal"
          >
            {showMore ? t("home.popular.showLess") : t("home.popular.showMore")}
          </Button>
        )}
      </div>

      {/* Footer Links */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          <Link
            to="/countries"
            className="hover:text-gray-700 transition-colors text-xs"
          >
            {t("home.popular.footer.countries")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link to="/regions" className="hover:text-gray-700 transition-colors">
            {t("home.popular.footer.regions")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link to="/cities" className="hover:text-gray-700 transition-colors">
            {t("home.popular.footer.cities")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            to="/districts"
            className="hover:text-gray-700 transition-colors text-xs"
          >
            {t("home.popular.footer.districts")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            to="/airports"
            className="hover:text-gray-700 transition-colors text-xs"
          >
            {t("home.popular.footer.airports")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link to="/hotels" className="hover:text-gray-700 transition-colors">
            {t("home.popular.footer.hotels")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            to="/places-of-interest"
            className="hover:text-gray-700 transition-colors text-xs"
          >
            {t("home.popular.footer.placesOfInterest")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            to="/holiday-homes"
            className="hover:text-gray-700 transition-colors text-xs"
          >
            {t("home.popular.footer.holidayHomes")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            to="/apartments"
            className="hover:text-gray-700 transition-colors text-xs"
          >
            {t("home.popular.footer.apartments")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link to="/resorts" className="hover:text-gray-700 transition-colors">
            {t("home.popular.footer.resorts")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link to="/villas" className="hover:text-gray-700 transition-colors">
            {t("home.popular.footer.villas")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link to="/hostels" className="hover:text-gray-700 transition-colors">
            {t("home.popular.footer.hostels")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link to="/b-and-b" className="hover:text-gray-700 transition-colors">
            {t("home.popular.footer.bnb")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            to="/guest-houses"
            className="hover:text-gray-700 transition-colors text-xs"
          >
            {t("home.popular.footer.guestHouses")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            to="/unique-places"
            className="hover:text-gray-700 transition-colors text-xs"
          >
            {t("home.popular.footer.uniquePlaces")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            to="/all-destinations"
            className="hover:text-gray-700 transition-colors text-xs"
          >
            {t("home.popular.footer.allDestinations")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            to="/all-flight-destinations"
            className="hover:text-gray-700 transition-colors text-xs"
          >
            {t("home.popular.footer.allFlightDestinations")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            to="/all-car-hire"
            className="hover:text-gray-700 transition-colors text-xs"
          >
            {t("home.popular.footer.allCarHire")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            to="/all-holiday-destinations"
            className="hover:text-gray-700 transition-colors text-xs"
          >
            {t("home.popular.footer.allHolidayDestinations")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link to="/guides" className="hover:text-gray-700 transition-colors">
            {t("home.popular.footer.guides")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            to="/discover"
            className="hover:text-gray-700 transition-colors text-xs"
          >
            {t("home.popular.footer.discover")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link to="/reviews" className="hover:text-gray-700 transition-colors">
            {t("home.popular.footer.reviews")}
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            to="/monthly-stays"
            className="hover:text-gray-700 transition-colors text-xs"
          >
            {t("home.popular.footer.monthlyStays")}
          </Link>
        </div>
      </div>
    </section>
  );
}
