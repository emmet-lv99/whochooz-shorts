/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '*.kakaocdn.net',
      },
      {
        protocol: 'https',
        hostname: '*.kakaocdn.net',
      },
      {
        protocol: 'https',
        hostname: 'k.kakaocdn.net',
      },
      {
         protocol: 'http',
         hostname: 'k.kakaocdn.net',
      },
      {
          protocol: 'https',
          hostname: 't1.kakaocdn.net',
      }
    ],
  },
};

export default nextConfig;
