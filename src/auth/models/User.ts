import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>('User', UserSchema);
