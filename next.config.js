/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_URL: 'https://nighthub.io',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.nighthub.io/:path*',
      },
    ];
  },
};

module.exports = nextConfig;