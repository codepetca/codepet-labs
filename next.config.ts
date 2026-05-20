import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/about",
        destination: "/#about",
        permanent: false,
      },
      {
        source: "/join",
        destination: "/#join",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
