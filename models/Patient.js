const PatientSchema = new Schema({
  anonymousId: { type: String, required: true, unique: true },
  demographics: { type: Object }, 
  riskLevel: { type: String, default: "low" },
  lastActivityAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});
