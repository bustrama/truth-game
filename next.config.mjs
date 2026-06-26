/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — no server routes needed for V1 (single-device, client-only).
  output: 'export',
  reactStrictMode: true,
  images: {
    // next/image optimization requires a server; disable for static export.
    unoptimized: true,
  },
};

export default nextConfig;
