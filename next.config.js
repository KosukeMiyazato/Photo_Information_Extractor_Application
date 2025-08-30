/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  optimizeFonts: false,
  env: {
    NEXT_FONT_GOOGLE_OPTIMIZED: 'false',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
