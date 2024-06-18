import express from 'express';
import {
  createSong,
  getSongs,
  deleteSong,
  updateSong,
} from './songs-controller';
import multer from 'multer';

const songRouter = express.Router();
const upload = multer();

songRouter.post('/create_song', upload.single('song_cover'), createSong);
songRouter.get('/songs', getSongs);
songRouter.delete('/songs/:id', deleteSong);
songRouter.put('/songs/:id', upload.single('song_cover'), updateSong);

export default songRouter;
