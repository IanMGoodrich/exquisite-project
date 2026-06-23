import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { s3Client } from '@/lib/s3';
 
/**
 * Returns the public URL of a randomly selected image from the prompts/ prefix.
 * Call this in a Server Component or server action — never from the client,
 * as it uses the S3 client which requires your AWS credentials.
 *
 * Usage:
 *   const imageUrl = await getRandomPromptImage();
 *   <img src={imageUrl} alt="Prompt" />
 */
export async function getRandomPromptImage(): Promise<string | null> {
  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_USER_IMAGE_S3_BUCKET!,
    Prefix: 'prompts/',
  });
 
  const response = await s3Client.send(command);
 
  // Filter out the folder placeholder object S3 creates for the prefix itself
  const objects = (response.Contents ?? []).filter(
    (obj) => obj.Key && obj.Key !== 'prompts/'
  );
 
  if (objects.length === 0) return null;
 
  // Pick a random object
  const random = objects[Math.floor(Math.random() * objects.length)];
 
  return `https://${process.env.AWS_USER_IMAGE_S3_BUCKET}.s3.${process.env.AWS_USER_IMAGE_REGION}.amazonaws.com/${random.Key}`;
}
 