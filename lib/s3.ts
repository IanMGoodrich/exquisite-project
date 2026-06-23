import { S3Client } from "@aws-sdk/client-s3";

// Singleton — reuse across requests (important in serverless to avoid cold start overhead)
export const s3Client = new S3Client({
  region: process.env.AWS_USER_IMAGE_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_USER_IMAGE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_USER_IMAGE_SECRET_ACCESS_KEY_ID!,
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});
