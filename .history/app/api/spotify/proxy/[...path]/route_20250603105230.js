import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import SpotifySession from '@/lib/spotifySession';
import { auth } from '@clerk/nextjs';

// Handle all HTTP methods
export async function GET(request, { params }) {
  return handleRequest(request, params, 'GET');
}

export async function POST(request, { params }) {
  return handleRequest(request, params, 'POST');
}

export async function PUT(request, { params }) {
  return handleRequest(request, params, 'PUT');
}

export async function DELETE(request, { params }) {
  return handleRequest(request, params, 'DELETE');
}

async function handleRequest(request, { path }, method) {
  try {
    // Get the current user ID from Clerk
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Connect to the database
    await connectToDatabase();
    
    // Find the user's Spotify session
    const session = await SpotifySession.findOne({ userId });
    
    if (!session) {
      return NextResponse.json({ error: 'No Spotify session found' }, { status: 401 });
    }
    
    // Check if the token is expired
    if (new Date() > new Date(session.expiresAt)) {
      // Token is expired, try to refresh it
      const refreshResponse = await fetch('/api/spotify/refresh', {
        method: 'POST',
      });
      
      if (!refreshResponse.ok) {
        return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 });
      }
      
      // Get the updated session
      const updatedSession = await SpotifySession.findOne({ userId });
      if (!updatedSession) {
        return NextResponse.json({ error: 'Session not found after refresh' }, { status: 401 });
      }
      
      // Use the updated access token
      session.accessToken = updatedSession.accessToken;
    }

    // Reconstruct the path
    const endpoint = `/${path.join('/')}`;
    const url = `https://api.spotify.com/v1${endpoint}`;
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    
    // Get request body if present
    let body;
    if (method !== 'GET' && method !== 'HEAD') {
      body = await request.text();
    }
    
    // Make the request to Spotify
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}