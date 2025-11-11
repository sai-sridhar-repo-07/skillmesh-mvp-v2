import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    avatarUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    skills: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    availability: {
      timezone: { type: String, default: "UTC" },
      slots: [
        {
          dayOfWeek: Number,
          start: String,
          end: String,
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
