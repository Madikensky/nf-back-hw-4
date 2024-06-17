import express from 'express';
import { createSong } from './songs-controller';
import multer from 'multer';
import { getSongs } from './songs-controller';

const songRouter = express.Router();
const upload = multer();

songRouter.post('/create_song', upload.single('song_cover'), createSong);
songRouter.get('/songs', getSongs);

export default songRouter;
