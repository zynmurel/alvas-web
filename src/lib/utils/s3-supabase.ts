import { S3Client } from '@aws-sdk/client-s3';

export const client = new S3Client({
  forcePathStyle: true,
  region: 'us-east-1',
  endpoint: 'https://brtsckbiqiwmrqcjqmfm.supabase.co/storage/v1/s3',
  credentials: {
    accessKeyId: '1424528b9e245d2ad45cd0026f9858a8',
    secretAccessKey: 'd01635b65dd5f5c8bd9a9dba853c24b6ebf912ed082a09b2fca2b4314b1efe5a',
  }
})
