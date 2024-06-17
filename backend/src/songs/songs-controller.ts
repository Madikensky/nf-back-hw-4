import { Request, Response } from 'express';
import Song from './models/Song';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const folderName = process.env.FOLDER_NAME;
const bucketRegion = process.env.REGION;
const accessKey = process.env.ACCESS_KEY_ID;
const secretKey = process.env.SECRET_KEY_ID;

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString('hex');

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey!,
    secretAccessKey: secretKey!,
  },
  region: bucketRegion,
});

export const createSong = async (req: Request, res: Response) => {
  const imgName = randomImageName();
  const filePath = `${folderName}/${imgName}`;

  const params = {
    Bucket: bucketName,
    Key: filePath,
    Body: req.file?.buffer,
    ContentType: req.file?.mimetype,
  };

  const command = new PutObjectCommand(params);

  await s3.send(command);

  try {
    const getObjectParams = {
      Bucket: bucketName,
      Key: filePath,
    };

    const signedUrl = await getSignedUrl(
      s3,
      new GetObjectCommand(getObjectParams),
      { expiresIn: 3600 }
    );

    const song = new Song({
      ...req.body,
      song_cover: imgName,
      song_cover_url: signedUrl,
    });

    await song.save();
    res.send(song);
  } catch (error) {
    res.status(500).send('Some errors :(');
  }
};

export const getSongs = async (req: Request, res: Response) => {
  try {
    const songs = await Song.find().sort({ createdAt: 1 });
    const songsWithSignedUrls = await Promise.all(
      songs.map(async (song) => {
        const getObjectParams = {
          Bucket: bucketName,
          Key: `${folderName}/${song.song_cover}`,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return {
          ...song.toObject(),
          song_cover_url: url,
        };
      })
    );
    res.send(songsWithSignedUrls);
  } catch (error) {
    res.status(500).send('Error while getting the data..');
  }
};
