import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Image optimization settings
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Configure this with your actual image domains
      },
    ],
  },
  
  // Enable React strict mode for better development practices
  reactStrictMode: true,
  
  // Disable ESLint during production builds (optional - remove once linting is clean)
  eslint: {
    ignoreDuringBuilds: false, // Set to true temporarily if ESLint errors block deployment
  },
  
  // Disable TypeScript type checking during builds (optional)
  typescript: {
    ignoreBuildErrors: false, // Set to true temporarily if type errors block deployment
  },
  
  // Environment variables that should be exposed to the browser
  env: {
    // Add any public env vars here that start with NEXT_PUBLIC_
    // Example: NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Configure for better performance
  swcMinify: true,
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;