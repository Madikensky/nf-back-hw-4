import { Request, Response } from 'express';
import Song from './models/Song';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
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
    res.send(songs);
  } catch (error) {
    res.status(500).send('Error while getting the data..');
  }
};

export const deleteSong = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const song = await Song.findByIdAndDelete(id);
    if (!song) {
      return res.status(400).send('Song not found');
    }

    const deleteParams = {
      Bucket: bucketName,
      Key: `${folderName}/${song.song_cover}`,
    };

    const deleteCommand = new DeleteObjectCommand(deleteParams);
    await s3.send(deleteCommand);

    res.send({ message: 'Song deleted' });
  } catch (e) {
    res.status(500).send('Errors while deleting a song..');
  }
};

export const updateSong = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    let updateData = {
      ...req.body,
    };

    if (req.file) {
      const imgName = randomImageName();
      const filePath = `${folderName}/${imgName}`;

      const params = {
        Bucket: bucketName,
        Key: filePath,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);

      const getObjectParams = {
        Bucket: bucketName,
        Key: filePath,
      };

      const signedUrl = await getSignedUrl(
        s3,
        new GetObjectCommand(getObjectParams),
        { expiresIn: 3600 }
      );
      updateData.song_cover = imgName;
      updateData.song_cover_url = signedUrl;
    }

    const filter = { _id: id };
    let song = await Song.findOneAndUpdate(filter, updateData, { new: true });

    if (!song) {
      return res.status(400).send('Song not found');
    }
    res.send(updateData);
  } catch (e) {
    res.status(500).send('Errors when updating a song');
  }
};
