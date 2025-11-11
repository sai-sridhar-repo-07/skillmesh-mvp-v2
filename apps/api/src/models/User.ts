import mongoose, { Schema, Types } from "mongoose";

const AvailabilitySlot = new Schema({
  dayOfWeek: { type: Number, min: 0, max: 6, required: true },
  start: { type: String, required: true }, // "09:00"
  end: { type: String, required: true }    // "17:00"
}, { _id: false });

const Availability = new Schema({
  timezone: { type: String, default: "UTC" },
  slots: { type: [AvailabilitySlot], default: [] }
}, { _id: false });

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, default: null },
  avatarUrl: { type: String, default: "" },
  bio: { type: String, default: "" },
  skills: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  availability: { type: Availability, default: () => ({}) },
  credits: { type: Number, default: 0 },
  ratingAvg: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  roles: { type: [String], default: ["learner"] },
  verified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
