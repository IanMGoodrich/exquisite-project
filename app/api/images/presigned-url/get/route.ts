import { NextResponse } from 'next/server';
import { getRandomPromptImage } from '@/lib/image-utils';

export async function GET() {
  const url = await getRandomPromptImage();
  if (!url) {
    return NextResponse.json({ error: 'No prompt images found' }, { status: 404 });
  }
  return NextResponse.json({ url });
}