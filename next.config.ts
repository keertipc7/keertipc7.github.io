import type { NextConfig } from "next";

/*
 * Static export so the site can be served by GitHub Pages (keertipc7.github.io).
 * trailingSlash makes every route a folder with an index.html, which is what
 * Pages serves; images are unoptimized because there is no image server.
 */
const nextConfig: NextConfig = {
  output: "export",
  // Set NEXT_PUBLIC_BASE_PATH (e.g. "/preview") to serve the site from a subfolder.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
