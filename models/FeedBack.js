const FeedbackSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: "Patient" },
  appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
  counselorId: { type: Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number },
  feedback: { type: String },
  category: { type: String },
  isAnonymous: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});