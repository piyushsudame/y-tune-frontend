import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { video_id } = params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_RESEND_BASE_URL}/api/song-info/${video_id}`);
  return NextResponse.json(await res.json());
}