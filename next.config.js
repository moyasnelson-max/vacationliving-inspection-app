import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
      "@/app": path.resolve(__dirname, "app"),
      "@/lib": path.resolve(__dirname, "app/lib"),
      "@/components": path.resolve(__dirname, "app/components"),
      "@/styles": path.resolve(__dirname, "app/styles")
    };

    return config;
  },
};

export default nextConfig;