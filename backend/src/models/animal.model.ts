import { Schema, model, Document, Types } from 'mongoose';

export interface IAnimal extends Document {
  tagId: string;
  species?: string;
  breed?: string;
  owner: Types.ObjectId;
  attendanceLogs?: Date[];
  createdAt: Date;
}

const AnimalSchema = new Schema<IAnimal>(
  {
    tagId: { type: String, required: true, unique: true },
    species: { type: String },
    breed: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    attendanceLogs: [Date],
  },
  { timestamps: true }
);

export default model<IAnimal>('Animal', AnimalSchema);
