import mongoose, { Schema } from "mongoose";

const WhiteboardSnapshotSchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: "Session", index: true },
  data: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("WhiteboardSnapshot", WhiteboardSnapshotSchema);
