const AppointmentSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: "Patient" },
  counselorId: { type: Schema.Types.ObjectId, ref: "User" },
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, default: 60 },
  type: { type: String, required: true },
  status: { type: String, default: "scheduled" },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});