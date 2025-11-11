import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  passwordHash?: string | null;
  avatarUrl?: string;
  bio?: string;
  skills: string[];
  tags: string[];
  availability?: {
    timezone: string;
    slots: { dayOfWeek: number; start: string; end: string }[];
  };
  credits: number;
  ratingAvg: number;
  ratingCount: number;
  roles: ("learner" | "mentor" | "admin")[];
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: String,
    email: { type: String, unique: true, required: true, index: true },
    passwordHash: { type: String, default: null },
    avatarUrl: String,
    bio: String,
    skills: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    availability: {
      timezone: { type: String, default: "Asia/Kolkata" },
      slots: {
        type: [
          {
            dayOfWeek: Number, // 0..6
            start: String,     // "09:00"
            end: String,       // "18:00"
          },
        ],
        default: [],
      },
    },
    credits: { type: Number, default: 0 },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    roles: { type: [String], default: ["learner"] },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
