const CrisisAlertSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: "Patient" },
  severity: { type: String, required: true },
  alertType: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: "active" },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  resolvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});