import { Router } from 'express';
import authRouter from './auth/auth-router';
import songRouter from './songs/songs-router';
// other routers can be imported here

const globalRouter = Router();

globalRouter.use(authRouter);
globalRouter.use(songRouter);

// other routers can be added here

export default globalRouter;
