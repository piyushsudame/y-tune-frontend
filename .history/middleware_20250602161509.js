import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Create a custom middleware that extends clerkMiddleware
const middleware = async (req, evt) => {
  const clerkResp = await clerkMiddleware()(req, evt);
  
  // If Clerk authentication is successful
  if (clerkResp.auth?.userId && 
      !req.nextUrl.pathname.startsWith('/api/auth/callback/spotify') && 
      !req.nextUrl.pathname.startsWith('/api/spotify')) {
    
    // Check if Spotify token exists in cookies
    const spotifyToken = req.cookies.get('spotify_token');
    
    // If no Spotify token, redirect to Spotify login
    if (!spotifyToken) {
      return NextResponse.redirect(new URL('/api/spotify/auth', req.url));
    }
  }
  
  return clerkResp;
};

export default middleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
