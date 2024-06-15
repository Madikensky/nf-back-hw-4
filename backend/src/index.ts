import 'dotenv/config';
import express from 'express';
import connectDB from './db';
import globalRouter from './global-router';
import { logger } from './logger';

const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(cors());
app.use(logger);
app.use(express.json());
app.use('/api/v1/', globalRouter);

app.listen(PORT, () => {
  console.log(`Server runs at http://localhost:${PORT}`);
});
