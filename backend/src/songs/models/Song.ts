import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISong extends Document {
  title: string;
  author: string;
  song_cover: string;
  song_cover_url: string;
}

const SongSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  song_cover: {
    type: String,
    required: true,
  },
  song_cover_url: { type: String, required: true },
});

const Song = mongoose.model<ISong>('Song', SongSchema);

export default Song;
