/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '', // Optional, leave empty for default ports (80 for http, 443 for https)
        pathname: '/u/**', // You can be more specific if needed, e.g., '/u/**'
      },
      // You can add other remote patterns here if needed
    ],
  },
};

export default nextConfig; 
