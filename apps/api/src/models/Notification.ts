import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
  type: { type: String, required: true },
  payload: { type: Schema.Types.Mixed, default: {} },
  read: { type: Boolean, default: false }
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model("Notification", NotificationSchema);
