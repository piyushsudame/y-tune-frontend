/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'img.clerk.com', 
      'images.clerk.dev',
      'platform-lookaside.fbsbx.com',
      "i.scdn.co",
      "mosaic.scdn.co" 
    ],
  },
  logging: {
    incomingRequests: 
  }
};

export default nextConfig;
