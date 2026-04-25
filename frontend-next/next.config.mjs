/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactCompiler: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  trailingSlash: false,
};

export default nextConfig;
