import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongoose';
import SpotifySession from '@/lib/spotifySession';

// Handle all HTTP methods
export async function GET(request, context) {
  const { params } = context;
  return handleRequest(request, params, 'GET');
}

export async function POST(request, context) {
  const { params } = context;
  return handleRequest(request, params, 'POST');
}

export async function PUT(request, context) {
  const { params } = context;
  return handleRequest(request, params, 'PUT');
}

export async function DELETE(request, context) {
  const { params } = context;
  return handleRequest(request, params, 'DELETE');
}

async function handleRequest(request, params, method) {
  try {
    const { userId } = auth();

    await connectToDatabase();

    let session;

    if (userId) {
      session = await SpotifySession.findOne({ userId });
    } else {
      session = await SpotifySession.findOne({
        expiresAt: { $gt: new Date() }
      }).sort({ updatedAt: -1 });
    }

    if (!session) {
      return NextResponse.json({ error: 'No valid Spotify session found' }, { status: 401 });
    }

    if (new Date() > new Date(session.expiresAt)) {
      const refreshResponse = await fetch('http://localhost:3000/api/spotify/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: session.userId })
      });

      if (!refreshResponse.ok) {
        return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 });
      }

      const updatedSession = await SpotifySession.findOne({ userId: session.userId });

      if (!updatedSession) {
        return NextResponse.json({ error: 'Session not found after refresh' }, { status: 401 });
      }

      session = updatedSession;
    }

    const resolvedParams = await params;
    const { path } = resolvedParams;

    const pathArray = Array.isArray(path) ? path : [path];
    const endpoint = `/${pathArray.join('/')}`;
    const url = `https://api.spotify.com/v1${endpoint}`;

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    let body;
    if (method !== 'GET' && method !== 'HEAD') {
      body = await request.text();
    }

    const response = await fetch(fullUrl, {
      method,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Spotify Proxy] Error in proxy request:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
