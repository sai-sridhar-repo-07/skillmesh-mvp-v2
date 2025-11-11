import mongoose, { Schema } from "mongoose";

const RatingSchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: "Session", index: true },
  raterId: { type: Schema.Types.ObjectId, ref: "User" },
  rateeId: { type: Schema.Types.ObjectId, ref: "User" },
  stars: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: "" }
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model("Rating", RatingSchema);
