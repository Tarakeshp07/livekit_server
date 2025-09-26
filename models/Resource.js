import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, required: true },
  category: { type: String, required: true },
  language: { type: String, default: "en" },
  content: { type: String },
  metadata: { type: Object },
  isPublished: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Resource = mongoose.model("Resource", ResourceSchema);
export default Resource;
