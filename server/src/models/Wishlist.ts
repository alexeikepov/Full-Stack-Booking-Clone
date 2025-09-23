import { Schema, model } from "mongoose";

const WishlistSchema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      index: true 
    },
    name: { 
      type: String, 
      required: true, 
      trim: true,
      default: "My Wishlist"
    },
    description: { 
      type: String, 
      trim: true 
    },
    hotelIds: [{ 
      type: Schema.Types.ObjectId, 
      ref: "Hotel" 
    }],
    isPublic: { 
      type: Boolean, 
      default: false 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: { 
      type: Date, 
      default: Date.now 
    },
  },
  { 
    timestamps: true, 
    collection: "wishlists" 
  }
);

// Index for efficient queries
WishlistSchema.index({ userId: 1, createdAt: -1 });

// Update updatedAt on save
WishlistSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const WishlistModel = model("Wishlist", WishlistSchema);
