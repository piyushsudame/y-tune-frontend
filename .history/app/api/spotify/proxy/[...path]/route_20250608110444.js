import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/lib/user';

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

    let user;

    if (userId) {
      user = await User.findOne({ clerkId: userId });
    } else {
      user = await User.findOne({
        expiresAt: { $gt: new Date() },
        isSpotifyConnected: true
      }).sort({ updatedAt: -1 });
    }

    if (!user || !user.isSpotifyConnected) {
      return NextResponse.json({ error: 'No valid Spotify session found' }, { status: 401 });
    }

    if (new Date() > new Date(user.expiresAt)) {
      const refreshResponse = await fetch('http://localhost:3000/api/spotify/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.clerkId })
      });

      if (!refreshResponse.ok) {
        return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 });
      }

      const updatedUser = await User.findOne({ clerkId: user.clerkId });

      if (!updatedUser) {
        return NextResponse.json({ error: 'User not found after refresh' }, { status: 401 });
      }

      user = updatedUser;
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
