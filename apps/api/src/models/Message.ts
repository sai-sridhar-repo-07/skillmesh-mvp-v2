import mongoose, { Schema } from "mongoose";
const Attachment = new Schema({
  url: String, name: String, size: Number
}, { _id: false });

const MessageSchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: "Session", index: true },
  senderId: { type: Schema.Types.ObjectId, ref: "User" },
  text: String,
  attachments: { type: [Attachment], default: [] }
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model("Message", MessageSchema);
