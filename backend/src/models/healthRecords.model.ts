import { Schema, model, Document, Types } from 'mongoose';

export interface IHealthRecord extends Document {
  animal: Types.ObjectId;
  postureScore?: number;
  visibleIssue?: string;
  riskLevel: 'low' | 'medium' | 'high';
  analyzedImage: string;
  createdAt: Date;
}

const HealthRecordSchema = new Schema<IHealthRecord>(
  {
    animal: { type: Schema.Types.ObjectId, ref: 'Animal', required: true },
    postureScore: Number,
    visibleIssue: String,
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    analyzedImage: { type: String, required: true }
  },
  { timestamps: true }
);

export default model<IHealthRecord>('HealthRecord', HealthRecordSchema);
