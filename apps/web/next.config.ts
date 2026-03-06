import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@broadcasts/ui", "@broadcasts/chess", "@broadcasts/protocol"],
};

export default nextConfig;
