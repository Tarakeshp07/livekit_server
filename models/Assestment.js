const AssessmentSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: "Patient" },
  assessmentType: { type: String, required: true },
  scores: { type: Object, required: true },
  totalScore: { type: Number },
  severity: { type: String },
  completedAt: { type: Date, default: Date.now }
});