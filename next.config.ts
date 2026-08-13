import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  reactStrictMode: true,
  eslint: {
    // Keep production builds unblocked by stylistic lint on legacy canvas code.
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "*.scdn.co" },
    ],
  },
};

export default nextConfig;
