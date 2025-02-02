/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
};

module.exports = nextConfig;
