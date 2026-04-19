/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@anthropic-ai/sdk'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.vercel.app' },
    ],
  },
  // Vercelデプロイ時にCompany slugを動的にルーティング
  async rewrites() {
    return [
      {
        source: '/d/:slug',
        destination: '/dashboard/:slug',
      },
    ]
  },
}

module.exports = nextConfig
