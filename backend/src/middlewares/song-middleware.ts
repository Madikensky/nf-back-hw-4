import { S3 } from '@aws-sdk/client-s3';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const s3 = new S3({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_KEY_ID!,
  },
});
