import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  // Para el demo estático de GitHub Pages (scripts/demo-estatico.sh)
  basePath: process.env.PAGES_BASE ?? "",
};

export default nextConfig;
