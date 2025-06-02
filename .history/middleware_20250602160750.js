import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
  afterAuth(auth, req) {
    // If the user is logged in with Clerk and not on the Spotify callback route
    if (auth.userId && 
        !req.nextUrl.pathname.startsWith('/api/auth/callback/spotify') && 
        !req.nextUrl.pathname.startsWith('/api/spotify')) {
      
      // Check if Spotify token exists in localStorage
      const spotifyToken = req.cookies.get('spotify_token');
      
      // If no Spotify token, redirect to Spotify login
      if (!spotifyToken) {
        return NextResponse.redirect(new URL('/api/spotify/auth', req.url));
      }
    }
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
