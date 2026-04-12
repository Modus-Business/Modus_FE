import path from "node:path";
import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(path.resolve(process.cwd(), "../.."));

const nextConfig: NextConfig = {
  transpilePackages: ["@modus/classroom-ui"],
  allowedDevOrigins: ["127.0.0.1"]
};

export default nextConfig;
