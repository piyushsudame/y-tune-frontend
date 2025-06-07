import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server'
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
    
    // Try to find a valid session
    if (userId) {
      // If we have a userId, find the session for that user
       ('[Spotify Proxy] Finding session for user:', userId);
      session = await SpotifySession.findOne({ userId });
    } else {
      // If no userId, try to find the most recent valid session
       ('[Spotify Proxy] No user ID, looking for a valid session...');
      
      // Find the most recent session that's not expired
      session = await SpotifySession.findOne({
        expiresAt: { $gt: new Date() }
      }).sort({ updatedAt: -1 });
      
       ('[Spotify Proxy] Session found:', session ? 'Yes' : 'No');
      if (session) {
         ('[Spotify Proxy] Using session for user:', session.userId);
      }
    }
    
     ('[Spotify Proxy] Session found:', session ? 'Yes' : 'No');
    
    if (!session) {
      console.error('[Spotify Proxy] No valid Spotify session found');
      return NextResponse.json({ error: 'No valid Spotify session found' }, { status: 401 });
    }
    
     ('[Spotify Proxy] Session validated successfully');
    
     ('[Spotify Proxy] Session expires at:', session.expiresAt);
     ('[Spotify Proxy] Current time:', new Date());
    
    // Check if the token is expired
    if (new Date() > new Date(session.expiresAt)) {
       ('[Spotify Proxy] Token expired, attempting to refresh...');
      
      // Token is expired, try to refresh it
      const refreshResponse = await fetch('http://localhost:3000/api/spotify/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: session.userId })
      });
      
       ('[Spotify Proxy] Refresh response status:', refreshResponse.status);
      
      if (!refreshResponse.ok) {
        console.error('[Spotify Proxy] Failed to refresh token:', await refreshResponse.text());
        return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 });
      }
      
      // Get updated session
       ('[Spotify Proxy] Getting updated session after refresh');
      const updatedSession = await SpotifySession.findOne({ userId: session.userId });
      
      if (!updatedSession) {
        console.error('[Spotify Proxy] Session not found after refresh');
        return NextResponse.json({ error: 'Session not found after refresh' }, { status: 401 });
      }
      
      // Use the updated access token
       ('[Spotify Proxy] Using updated access token');
      session = updatedSession;
    }

    // Get the path from params - await it since it's a Promise in Next.js App Router
    const resolvedParams = await params;
    const { path } = resolvedParams;
     ('[Spotify Proxy] Path params:', path);

    // Ensure path is an array before joining
    const pathArray = Array.isArray(path) ? path : [path];
    
    // Reconstruct the path
    const endpoint = `/${pathArray.join('/')}`;
    const url = `https://api.spotify.com/v1${endpoint}`;
     ('[Spotify Proxy] Spotify API URL:', url);
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
     ('[Spotify Proxy] Full URL with query params:', fullUrl);
    
    // Get request body if present
    let body;
    if (method !== 'GET' && method !== 'HEAD') {
      body = await request.text();
       ('[Spotify Proxy] Request body:', body ? 'Present' : 'None');
    }
    
    // Make the request to Spotify
     ('[Spotify Proxy] Making request to Spotify API...');
     ('[Spotify Proxy] Access token present:', !!session.accessToken);
    
    const response = await fetch(fullUrl, {
      method,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body,
    });
    
     ('[Spotify Proxy] Spotify API response status:', response.status);
    
    const data = await response.json();
     ('[Spotify Proxy] Spotify API response data received');
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Spotify Proxy] Error in proxy request:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}