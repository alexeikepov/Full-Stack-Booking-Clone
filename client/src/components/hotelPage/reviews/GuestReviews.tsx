import type { Hotel } from "@/types/hotel";
import ReactCountryFlag from "react-country-flag";

interface GuestReviewsProps {
  hotel: Hotel;
}

export default function GuestReviews({ hotel }: GuestReviewsProps) {
  // Используем данные с бэка, если есть, иначе fallback значения
  const categoryRatings = hotel.categoryRatings || {
    staff: 9.5,
    comfort: 9.1,
    freeWifi: 9.9,
    facilities: 8.8,
    valueForMoney: 8.8,
    cleanliness: 9.3,
    location: 9.5,
  };

  const categoryNames = hotel.categoryNames || {
    staff: "Staff",
    comfort: "Comfort",
    freeWifi: "Free WiFi",
    facilities: "Facilities",
    valueForMoney: "Value for money",
    cleanliness: "Cleanliness",
    location: "Location",
  };

  const highScoreCategories = hotel.highScoreCategories || [
    "freeWifi",
    "location",
  ];
  const highScoreTexts = hotel.highScoreTexts || {};
  const reviewTopics = hotel.reviewTopics || [
    "Location",
    "Room",
    "Clean",
    "Noise",
    "Bed",
  ];
  const guestReviews = hotel.guestReviews || [
    {
      id: "1",
      reviewerName: "Michael",
      reviewerInitial: "M",
      country: "Israel",
      countryCode: "IL",
      reviewText:
        "Wonderful and stylish hotel, big and clean rooms, nice location. We've got complimentary wine bottle for a little waiting time which was really nice too.",
      rating: 9.2,
    },
    {
      id: "2",
      reviewerName: "Josh",
      reviewerInitial: "J",
      country: "United States",
      countryCode: "US",
      reviewText:
        "This is my second stay at this hotel, and both times have been fantastic. The staff is consistently kind, welcoming, and helpful, which really adds to the experience. The rooms are beautiful—well-designed, stylish, and very comfortable. Everything...",
      rating: 9.5,
    },
    {
      id: "3",
      reviewerName: "Josh",
      reviewerInitial: "J",
      country: "United States",
      countryCode: "US",
      reviewText:
        "had the pleasure of staying at Villa Albi. I can honestly say it exceeded all my expectations. From the moment I checked in, the staff was incredibly welcoming and attentive, making me feel right at home. The check-in process was smooth and...",
      rating: 9.8,
    },
  ];

  // Функция для получения флага страны
  const getCountryFlag = (country: string) => {
    const countryCodeMap: Record<string, string> = {
      Israel: "IL",
      "United States": "US",
      "United Kingdom": "GB",
      Germany: "DE",
      France: "FR",
      Spain: "ES",
      Italy: "IT",
      Canada: "CA",
      Australia: "AU",
      Japan: "JP",
      China: "CN",
      Brazil: "BR",
      Mexico: "MX",
      India: "IN",
      Russia: "RU",
      "South Korea": "KR",
      Netherlands: "NL",
      Sweden: "SE",
      Norway: "NO",
      Denmark: "DK",
      Finland: "FI",
      Poland: "PL",
      "Czech Republic": "CZ",
      Hungary: "HU",
      Romania: "RO",
      Bulgaria: "BG",
      Greece: "GR",
      Turkey: "TR",
      Egypt: "EG",
      "South Africa": "ZA",
      Argentina: "AR",
      Chile: "CL",
      Colombia: "CO",
      Peru: "PE",
      Venezuela: "VE",
      Uruguay: "UY",
      Paraguay: "PY",
      Bolivia: "BO",
      Ecuador: "EC",
      Guyana: "GY",
      Suriname: "SR",
      "French Guiana": "GF",
    };

    const countryCode = countryCodeMap[country] || "IL";

    return (
      <ReactCountryFlag
        countryCode={countryCode}
        svg
        style={{
          width: "20px",
          height: "15px",
          borderRadius: "2px",
        }}
      />
    );
  };

  const ProgressBar = ({ score }: { score: number }) => {
    const percentage = (score / 10) * 100;
    const isHighScore = score >= 9.5;

    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            isHighScore ? "bg-green-500" : "bg-[#003b95]"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  const CategoryItem = ({
    name,
    score,
    showArrow = false,
    arrowText = "",
  }: {
    name: string;
    score: number;
    showArrow?: boolean;
    arrowText?: string;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">{score}</span>
          {showArrow && (
            <div className="flex items-center gap-1">
              <span className="text-green-600">↗</span>
            </div>
          )}
        </div>
      </div>
      <ProgressBar score={score} />
    </div>
  );

  return (
    <div id="reviews" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Guest reviews</h2>
          <div className="flex items-center gap-4">
            <div className="bg-[#003b95] text-white px-4 py-2 rounded font-bold text-lg">
              {hotel.averageRating?.toFixed(1) || "8.9"}
            </div>
            <div>
              <div className="font-bold text-lg text-gray-900">
                {hotel.ratingLabel || "Fabulous"}
              </div>
              <div className="text-sm text-gray-600">
                {hotel.reviewsCount || 375} reviews
              </div>
            </div>
            <button className="text-[#0071c2] hover:underline font-medium">
              Read all reviews
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Categories:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <CategoryItem
                name={categoryNames.staff}
                score={categoryRatings.staff}
              />
              <CategoryItem
                name={categoryNames.comfort}
                score={categoryRatings.comfort}
              />
              <CategoryItem
                name={categoryNames.freeWifi}
                score={categoryRatings.freeWifi}
                showArrow={highScoreCategories.includes("freeWifi")}
                arrowText={highScoreTexts.freeWifi}
              />
            </div>

            {/* Middle Column */}
            <div className="space-y-4">
              <CategoryItem
                name={categoryNames.facilities}
                score={categoryRatings.facilities}
              />
              <CategoryItem
                name={categoryNames.valueForMoney}
                score={categoryRatings.valueForMoney}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <CategoryItem
                name={categoryNames.cleanliness}
                score={categoryRatings.cleanliness}
              />
              <CategoryItem
                name={categoryNames.location}
                score={categoryRatings.location}
                showArrow={highScoreCategories.includes("location")}
                arrowText={highScoreTexts.location}
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select topics to read reviews:
          </h3>
          <div className="flex flex-wrap gap-2">
            {reviewTopics.map((topic) => (
              <button
                key={topic}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                + {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Guests who stayed here loved section */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Guests who stayed here loved
          </h3>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {guestReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {review.reviewerInitial}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">
                        {review.reviewerName}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        {getCountryFlag(review.country)}
                        <span>{review.country}</span>
                      </div>
                      <div className="text-gray-700 text-sm leading-relaxed">
                        "{review.reviewText}"
                      </div>
                      <button className="text-[#0071c2] text-sm font-medium mt-2 hover:underline">
                        Read more
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action button */}
            <div className="flex items-center mt-6">
              <button className="px-6 py-2 border border-[#0071c2] text-[#0071c2] rounded-lg font-medium hover:bg-[#0071c2] hover:text-white transition-colors">
                Read all reviews
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
