import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import SpotifySession from '@/lib/spotifySession';
import { auth } from '@clerk/nextjs';

export async function POST() {
  try {
    // Get the current user ID from Clerk
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Connect to the database
    await connectToDatabase();
    
    // Remove the session from the database
    await SpotifySession.findOneAndDelete({ userId });
    
    // Clear the client-side authentication flag
    const response = NextResponse.json({ success: true });
    response.cookies.set('spotify_authenticated', '', {
      httpOnly: false,
      secure: true,
      maxAge: 0,
    });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}