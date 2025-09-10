// src/models/SearchHistory.ts
import { Schema, model } from "mongoose";

const SearchHistorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    // store exactly your search payload as JSON string
    query: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, collection: "search_history" }
);

SearchHistorySchema.index({ userId: 1, createdAt: -1 });
export const SearchHistoryModel = model("SearchHistory", SearchHistorySchema);
