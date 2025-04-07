import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "avatars.slack-edge.com",
      "secure.gravatar.com",
      "cdn.discordapp.com",
    ], // ✅ Add this line
  },
};

export default nextConfig;
