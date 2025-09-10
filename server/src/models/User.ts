import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["OWNER", "HOTEL_ADMIN", "USER"], default: "USER" },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    managedHotels: [{ type: Schema.Types.ObjectId, ref: "Hotel" }],
  
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: "users3" } 
);

export const UserModel = model("User", UserSchema);
