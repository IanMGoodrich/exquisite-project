import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '@/lib/s3';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const URL_EXPIRY_SECONDS = 60;

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { contentType, contentLength } = await req.json();

    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: 'File type not allowed. Use JPEG, PNG, WebP, or GIF.' },
        { status: 400 }
      );
    }

    if (!contentLength || contentLength > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    const ext = contentType.split('/')[1];
    const timestamp = Date.now();

    // Scoped to users/ prefix — keeps user uploads separate from prompts/
    const key = `users/${userId}_${timestamp}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_USER_IMAGE_S3_BUCKET!,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: URL_EXPIRY_SECONDS,
    });
    
    const publicUrl = `https://${process.env.AWS_USER_IMAGE_S3_BUCKET}.s3.${process.env.AWS_USER_IMAGE_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({ presignedUrl, publicUrl, key });
  } catch (error) {
    console.error('[presigned-url] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}