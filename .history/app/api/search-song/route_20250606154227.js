import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const res = await fetch(`${process.env.NEXT_PUBLIC_RESEND_BASE_URL}/api/search-song`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });
  return NextResponse.json(await res.json());
}