// Property mock data for PropertyDetailsScreen
// Move this file if you want to share mock data across more components

const MOCK_PROPERTY_DATA = {
  id: 1,
  name: "La Viscontina",
  rating: 7.9,
  stars: 3,
  totalReviews: 5902,
  address: "Via al Ticino 10, 21019 Somma Lombardo, Italy",
  coordinates: {
    latitude: 45.6916,
    longitude: 8.7167,
  },
  images: [require("../assets/images/hotel7.png")],
  checkIn: "Wed, 24 Sep",
  checkOut: "Thu, 25 Sep",
  rooms: 1,
  adults: 2,
  children: 0,
  isAvailable: false,
  alternatives: [
    { dateRange: "26-27 Sep", price: "from € 81" },
    { dateRange: "27-28 Sep", price: "from € 81" },
    { dateRange: "26-28 Sep", price: "from € 161" },
  ],
  ratings: {
    cleanliness: 8.3,
    comfort: 8.2,
    facilities: 8.0,
    staff: 8.5,
    valueForMoney: 8.1,
    location: 8.7,
    food: 8.4,
    wifi: 7.9,
    service: 8.6,
  },
  facilities: [
    { icon: "ban-smoking", name: "Non-smoking rooms" },
    { icon: "restaurant", name: "Restaurant" },
    { icon: "car", name: "Parking" },
    { icon: "airplane", name: "Airport shuttle" },
    { icon: "wifi", name: "Internet" },
    { icon: "people", name: "Family rooms" },
    { icon: "wine", name: "Bar" },
    { icon: "fitness", name: "Fitness center" },
    { icon: "water", name: "Swimming pool" },
    { icon: "paw", name: "Pet friendly" },
    { icon: "snow", name: "Air conditioning" },
    { icon: "tv", name: "TV" },
    { icon: "café", name: "Room service" },
    { icon: "business", name: "Business center" },
    { icon: "accessibility", name: "Wheelchair accessible" },
    { icon: "checkroom", name: "Luggage storage" },
    { icon: "local-laundry-service", name: "Laundry service" },
    { icon: "spa", name: "Spa services" },
  ],
  reviews: [
    {
      id: 1,
      reviewerName: "Svitlana - Family",
      reviewerInitial: "S",
      country: "Australia",
      text: "The transfer from and to the airport was good. The rooms are clean and big. Compliment to breakfast, we had everything that we usually have for breakfast. Good price for the service",
    },
    {
      id: 2,
      reviewerName: "Marco - Business",
      reviewerInitial: "M",
      country: "Italy",
      text: "Perfect location for business trips . The shuttle service is reliable and the rooms are comfortable. Staff is very professional and helpful.",
    },
    {
      id: 3,
      reviewerName: "Emma - Couple",
      reviewerInitial: "E",
      country: "Germany",
      text: "Great value for money! The property is well-maintained and the breakfast exceeded our expectations. Would definitely stay here again.",
    },
    {
      id: 4,
      reviewerName: "James - Solo",
      reviewerInitial: "J",
      country: "United Kingdom",
      text: "Clean, comfortable, and convenient. The Wi-Fi was fast and the location is perfect for accessing both the airport a city center.",
    },
    {
      id: 5,
      reviewerName: "Sophie - Family",
      reviewerInitial: "S",
      country: "France",
      text: "Family-friendly hotel with spacious rooms. The kids loved the breakfast selection. Great place to stay before early flights.",
    },
  ],
  questions: [
    {
      id: 1,
      question:
        "Hello, is it possible to pick me up either from the central station or from the airport and drop me at the airport the following morning? How much will it cost?",
      answer: "It is possible only from the airport and back.",
      answerDate: "28 Jun 2022",
    },
    {
      id: 2,
      question: "What time is breakfast served?",
      answer: "Breakfast is served from 6:30 AM to 10:00 AM daily.",
      answerDate: "15 Aug 2022",
    },
    {
      id: 3,
      question: "Is there free parking available?",
      answer: "Yes, we provide free parking for all guests.",
      answerDate: "2 Sep 2022",
    },
    {
      id: 4,
      question: "Do you allow pets?",
      answer: "Yes, pets are welcome. Additional charges may apply.",
      answerDate: "20 Jul 2022",
    },
    {
      id: 5,
      question: "Is WiFi available throughout the property?",
      answer:
        "Yes, complimentary WiFi is available in all rooms and common areas.",
      answerDate: "5 Oct 2022",
    },
  ],
  description:
    "Located in Somma Lombardo, La Viscontina offers accommodation with a garden and free WiFi. The property is around 3.1 km from Malpensa Airport and 45 km fr city center.\n\nThis charming agritourism property features elegantly furnished rooms with modern amenities including air conditioning, flat-screen TV, and private bathroom. Guests can enjoy a delicious continental breakfast featuring local products.\n\nLa Viscontina is surrounded by beautiful countryside and offers easy access to bo's cultural attractions and the convenience of Malpensa Airport. The property features a restaurant serving traditional Italian cuisine, a bar, and ample parking space.\n\nThe friendly staff provides excellent service and can assist with airport transfers, restaurant recommendations, and tourist information. Whether you're here for business or leisure, La Viscontina provides the perfect base for exploring the Lombardy region.",
  shortDescription:
    "Located in Somma Lombardo, La Viscontina offers accommodation with a garden and free WiFi. The property is around 3.1 km from Malpensa Airport and 45 km fr city center.",
};

export default MOCK_PROPERTY_DATA;
