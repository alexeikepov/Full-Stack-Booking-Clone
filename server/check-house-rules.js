const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/booking-app"
);

const HotelSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    country: String,
    city: String,
    location: {
      lat: Number,
      lng: Number,
    },
    stars: Number,
    description: String,
    rooms: [mongoose.Schema.Types.Mixed],
    adminIds: [mongoose.Schema.Types.ObjectId],
    amenityIds: [mongoose.Schema.Types.ObjectId],
    media: [mongoose.Schema.Types.Mixed],
    categories: [String],
    averageRating: Number,
    reviewsCount: Number,
    ownerId: mongoose.Schema.Types.ObjectId,
    approvalStatus: String,
    submittedAt: Date,
    approvedAt: Date,
    houseRules: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", HotelSchema);

async function checkHouseRules() {
  try {
    console.log("Checking house rules structure...");

    const hotels = await Hotel.find({}).limit(3);
    console.log(`Found ${hotels.length} hotels`);

    for (const hotel of hotels) {
      console.log(`\nHotel: ${hotel.name}`);
      console.log(
        "House rules structure:",
        JSON.stringify(hotel.houseRules, null, 2)
      );
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkHouseRules();
