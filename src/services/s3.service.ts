import S3 from 'aws-sdk/clients/s3';
import { config } from 'dotenv';

config();

export function getPreSignedUrl(key: string) {
  const s3 = new S3();
  const bucket = process.env.S3_BUCKET;
  const signedUrlExpireSeconds = 60 * 60;

  const saveKey = `chat-${Date.now()}-${key}`;

  const url = s3.getSignedUrl('putObject', {
    Bucket: bucket,
    Key: saveKey,
    Expires: signedUrlExpireSeconds,
  });

  return {
    url,
    key: saveKey,
  };
}

export function getSignedUrl(key: string) {
  const s3 = new S3();
  const myBucket = process.env.S3_BUCKET;
  const signedUrlExpireSeconds = 60 * 60;

  const url = s3.getSignedUrl('getObject', {
    Bucket: myBucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });

  return url;
}
