import { NextResponse } from 'next/server';

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
  const accessToken = request.cookies.get('spotify_access_token')?.value;
  
  if (!accessToken) {
    return NextResponse.json({ error: 'No access token found' }, { status: 401 });
  }

  try {
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
        Authorization: `Bearer ${accessToken}`,
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