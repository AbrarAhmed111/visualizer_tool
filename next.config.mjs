/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'www.mizbuilders.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'placehold.co',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'www.shutterstock.com',
          pathname: '/**',
        },
      ],
      unoptimized: false,
    },
  };
  
  export default nextConfig;
  