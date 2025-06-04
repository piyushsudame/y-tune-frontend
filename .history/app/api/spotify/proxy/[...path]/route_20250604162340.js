import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
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
    console.log(`[Spotify Proxy] Handling ${method} request`);
    
    console.log(`[Spotify Proxy] Handling ${method} request`);
    
    // Get the current user ID from Clerk
    const { userId } = auth();
    console.log('[Spotify Proxy] User ID from auth:', userId);
    console.log('[Spotify Proxy] User ID from auth:', userId);
    
    if (!userId) {
      console.error('[Spotify Proxy] No user ID found in auth');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Connect to the database
    console.log('[Spotify Proxy] Connecting to database...');
    await connectToDatabase();
    console.log('[Spotify Proxy] Database connected');
    
    // Find the user's Spotify session
    console.log('[Spotify Proxy] Finding session for user:', userId);
    const session = await SpotifySession.findOne({ userId });
    console.log('[Spotify Proxy] Session found:', session ? 'Yes' : 'No');
    
    if (!session) {
      console.error('[Spotify Proxy] No Spotify session found for user:', userId);
      return NextResponse.json({ error: 'No Spotify session found' }, { status: 401 });
    }
    
    console.log('[Spotify Proxy] Session expires at:', session.expiresAt);
      console.log('[Spotify Proxy] Token expired, attempting to refresh...');
      
    console.log('[Spotify Proxy] Current time:', new Date());
    if (!userId) {
      console.error('[Spotify Proxy] No user ID found in auth');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Connect to the database
    console.log('[Spotify Proxy] Connecting to database...');
    await connectToDatabase();
    console.log('[Spotify Proxy] Database connected');
    
    // Find the user's Spotify session
      console.log('[Spotify Proxy] Getting updated session after refresh');
    console.log('[Spotify Proxy] Finding session for user:', userId);
    const session = await SpotifySession.findOne({ userId });
    console.log('[Spotify Proxy] Session found:', session ? 'Yes' : 'No');
    
    if (!session) {
        console.error('[Spotify Proxy] Session not found after refresh');
      console.error('[Spotify Proxy] No Spotify session found for user:', userId);
      
      return NextResponse.json({ error: 'No Spotify session found' }, { status: 401 });
    }
    
    console.log('[Spotify Proxy] Session expires at:', session.expiresAt);
    console.log('[Spotify Proxy] Current time:', new Date());
    
    // Check if the token is expired
    if (new Date() > new Date(session.expiresAt)) {
      console.log('[Spotify Proxy] Token expired, attempting to refresh...');
      
      // Token is expired, try to refresh it
      const refreshResponse = await fetch('http://localhost:3000/api/spotify/refresh', {
        method: 'POST',
        headers: {
    console.log('[Spotify Proxy] Full URL with query params:', fullUrl);
          'Content-Type': 'application/json'
        }
      });
      
      console.log('[Spotify Proxy] Refresh response status:', refreshResponse.status);
      
      if (!refreshResponse.ok) {
        console.error('[Spotify Proxy] Failed to refresh token:', await refreshResponse.text());
        return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 });
       updated session
      console.log('[Spotify Proxy] Getting updated session after refresh');
      const updatedSession = await SpotifySession.findOne({ userId });
      
      if (!updatedSession) {
        console.error('[Spotify Proxy] Session not found after refresh');
        console.error('[Spotify Proxy] Error in proxy request:', error);
    return NextResponse.json({ error: 'Session not found after refresh' }, { status: 401 });
      }
      
      // Use the updated access token
      console.log('[Spotify Proxy] Using updated access token');
      session.accessToken = updatedSession.accessToken;
    }

    const { path } = await params;
    console.log('[Spotify Proxy] Path params:', path);

    // Reconstruct the path
    const endpoint = `/${path.join('/')}`;
    const url = `https://api.spotify.com/v1${endpoint}`;
    console.log('[Spotify Proxy] Spotify API URL:', url);
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    console.log('[Spotify Proxy] Full URL with query params:', fullUrl);
    
    // Get request body if present
    let body;
    if (method !== 'GET' && method !== 'HEAD') {
      body = await request.text();
      console.log('[Spotify Proxy] Request body:', body ? 'Present' : 'None');
    }
    
    // Make the request to Spotify
    console.log('[Spotify Proxy] Making request to Spotify API...');
    console.log('[Spotify Proxy] Access token present:', !!session.accessToken);
    
    const response = await fetch(fullUrl, {
      method,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body,
    });
    
    console.log('[Spotify Proxy] Spotify API response status:', response.status);
    
    const data = await response.json();
    console.log('[Spotify Proxy] Spotify API response data received');
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Spotify Proxy] Error in proxy request:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}