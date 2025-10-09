// src/scripts/seedDatabase.ts
import mongoose from "mongoose";
import { HotelModel } from "../models/Hotel";
import { ReviewModel } from "../models/Review";
import { UserModel } from "../models/User";
// import { sampleHotelData, sampleReviewData } from "../data/sampleHotelData";

// Temporary sample data
const sampleHotelData = {
  name: "Test Hotel",
  address: "123 Test St",
  city: "Test City",
  country: "Test Country",
  location: { coordinates: [0, 0] },
  description: "A test hotel",
  amenities: ["WiFi", "Pool"],
  categories: ["Hotel"],
  rooms: [
    {
      name: "Standard",
      pricePerNight: 100,
      totalRooms: 10,
      availableRooms: 10,
      capacity: 2,
      maxAdults: 2,
      maxChildren: 0,
    },
  ],
};

const sampleReviewData = [
  { rating: 8.5, comment: "Good hotel", negative: "", guestName: "John" },
  { rating: 9.0, comment: "Excellent", negative: "", guestName: "Jane" },
  { rating: 7.5, comment: "Okay", negative: "", guestName: "Bob" },
  { rating: 9.5, comment: "Amazing", negative: "", guestName: "Alice" },
  { rating: 8.0, comment: "Nice", negative: "", guestName: "Tom" },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/booking",
    );
    console.log("Connected to MongoDB");

    // Clear existing data
    await HotelModel.deleteMany({});
    await ReviewModel.deleteMany({});
    console.log("Cleared existing data");

    // Create a test user
    const testUser = await UserModel.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      role: "USER",
    });
    console.log("Created test user");

    // Create hotel
    const hotel = await HotelModel.create({
      ...sampleHotelData,
      ownerId: testUser._id,
      adminIds: [testUser._id],
      approvalStatus: "APPROVED",
      submittedAt: new Date(),
      approvedAt: new Date(),
    });
    console.log("Created hotel:", hotel.name);

    // Create reviews
    const reviews = await Promise.all(
      sampleReviewData.map((reviewData) =>
        ReviewModel.create({
          ...reviewData,
          hotel: hotel._id,
          user: testUser._id,
          status: "APPROVED",
        }),
      ),
    );
    console.log(`Created ${reviews.length} reviews`);

    // Update hotel with computed fields
    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    await HotelModel.findByIdAndUpdate(hotel._id, {
      averageRating: Number(averageRating.toFixed(1)),
      reviewsCount: totalReviews,
      "guestReviews.overallRating": Number(averageRating.toFixed(1)),
      "guestReviews.totalReviews": totalReviews,
    });

    console.log("Database seeded successfully!");
    console.log(`Hotel: ${hotel.name}`);
    console.log(`Reviews: ${totalReviews}`);
    console.log(`Average Rating: ${averageRating.toFixed(1)}`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
