/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static export
  trailingSlash: true,
  images: {
    unoptimized: true  // For static export
  },
  // Optional: custom output directory
  distDir: 'out'
};

export default nextConfig;
