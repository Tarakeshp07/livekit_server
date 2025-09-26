import mongoose from "mongoose";

const PeerGroupSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  memberCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  moderatorId: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Peer = mongoose.model("Peer", PeerGroupSchema);
export default Peer;
