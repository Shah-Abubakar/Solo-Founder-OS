/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/settings/:path*',
        destination: 'http://localhost:3001/api/settings/:path*',
      },
      {
        source: '/api/settings',
        destination: 'http://localhost:3001/api/settings',
      },
    ]
  },
}

module.exports = nextConfig
