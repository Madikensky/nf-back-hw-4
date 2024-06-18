import mongoose, { Document, Schema } from 'mongoose';
import Song from '../../songs/models/Song';

export interface IUser extends Document {
  email: string;
  username?: string;
  password: string;
  // favoriteSongs: [];
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>('User', UserSchema);
