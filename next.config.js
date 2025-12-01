/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: true
  },
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
