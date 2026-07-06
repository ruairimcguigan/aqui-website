import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve /portfolio/maestro with a trailing slash so the Maestro page's
  // relative asset/link paths resolve against /portfolio/maestro/.
  trailingSlash: true,
};

export default nextConfig;
