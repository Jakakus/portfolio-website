import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'three/addons/': 'three/examples/jsm/',
    };
    return config;
  },
};

export default nextConfig;
