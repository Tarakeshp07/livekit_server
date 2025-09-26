const NotificationSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  targetAudience: { type: String, default: "all" },
  isScheduled: { type: Boolean, default: false },
  scheduledFor: { type: Date },
  sentAt: { type: Date },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});