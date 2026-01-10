import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phone: string;
  password: string;
  role: 'farmer' | 'vet';
  pincode: string;
  farmName?: string;
  location?: string;
  createdAt: Date;
}
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: {type: String, required: true},
    pincode: {type: String, required: true},
    role: {
      type: String,
      enum: ['farmer', 'vet'],
      default: 'farmer'
    },
    farmName: { type: String },
    location: { type: String }
  },
  { timestamps: true }
);

export default model<IUser>('User', UserSchema);
