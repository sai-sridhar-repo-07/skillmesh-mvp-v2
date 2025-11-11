import mongoose, { Schema, Types } from "mongoose";

const Participant = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  joinedAt: { type: Date, default: null },
  leftAt: { type: Date, default: null }
}, { _id: false });

const SessionSchema = new Schema({
  hostId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  topic: { type: String, required: true },
  tags: { type: [String], default: [] },
  description: { type: String, default: "" },
  status: { type: String, enum: ["scheduled","live","completed","cancelled"], default: "scheduled" },
  mode: { type: String, enum: ["instant","scheduled"], default: "instant" },
  priceCredits: { type: Number, default: 2 },
  maxParticipants: { type: Number, default: 1 },
  participants: { type: [Participant], default: [] },
  signalingRoomId: { type: String, default: "" },
  whiteboardRoomId: { type: String, default: "" },
  startedAt: { type: Date, default: null },
  endedAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model("Session", SessionSchema);
