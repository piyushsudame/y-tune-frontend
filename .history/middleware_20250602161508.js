import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export default function middleware(req) {
  // Get auth information from Clerk
  const { userId } = getAuth(req);
  
  // If user is authenticated with Clerk
  if (userId) {
    // Exclude Spotify callback routes to prevent redirect loops
    if (!req.nextUrl.pathname.startsWith('/api/auth/callback/spotify') && 
        !req.nextUrl.pathname.startsWith('/api/spotify')) {
      
      // Check if Spotify token exists in cookies
      const spotifyToken = req.cookies.get('spotify_token');
      
      // If no Spotify token, redirect to Spotify login
      if (!spotifyToken) {
        console.log('Redirecting to Spotify login');
        return NextResponse.redirect(new URL('/api/spotify/auth', req.url));
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
