import mongoose from "mongoose";

export interface IMedication extends mongoose.Document {
  tagId: string;
  prescribedBy: mongoose.Types.ObjectId;
  disease: string;
  description: string;
  solution: string;
  createdAt: Date;
}

const MedicationSchema = new mongoose.Schema<IMedication>(
  {
    tagId: { type: String, required: true },
    prescribedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    disease: { type: String, required: true },
    description: { type: String, required: true },
    solution: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMedication>('Medication', MedicationSchema);