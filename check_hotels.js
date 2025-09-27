// Simple script to check hotels in database
const mongoose = require("mongoose");

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/booking";
mongoose.connect(mongoUri);

// Define hotel schema (simplified)
const hotelSchema = new mongoose.Schema({}, { strict: false });
const HotelModel = mongoose.model("Hotel", hotelSchema);

async function checkHotels() {
  try {
    console.log("Checking hotels in database...");

    // Get all hotels
    const hotels = await HotelModel.find({})
      .select("_id name approvalStatus isVisible")
      .lean();

    console.log(`Found ${hotels.length} hotels:`);

    hotels.forEach((hotel, index) => {
      console.log(`${index + 1}. ID: ${hotel._id}`);
      console.log(`   Name: ${hotel.name || "No name"}`);
      console.log(`   Approval Status: ${hotel.approvalStatus || "Not set"}`);
      console.log(
        `   Is Visible: ${
          hotel.isVisible !== undefined ? hotel.isVisible : "Not set"
        }`
      );
      console.log("   ---");
    });

    // Check approved and visible hotels
    const approvedHotels = await HotelModel.find({
      approvalStatus: "APPROVED",
      isVisible: true,
    })
      .select("_id name")
      .lean();

    console.log(`\nApproved and visible hotels: ${approvedHotels.length}`);
    approvedHotels.forEach((hotel) => {
      console.log(`- ${hotel._id}: ${hotel.name}`);
    });
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    mongoose.connection.close();
  }
}

checkHotels();
