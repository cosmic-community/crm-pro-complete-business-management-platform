/** @type {import('next').NextConfig} */
const nextConfig = {
  // Updated for Next.js 15 - moved from experimental.serverComponentsExternalPackages
  serverExternalPackages: ['bcryptjs', 'jsonwebtoken'],
  images: {
    domains: ['images.unsplash.com', 'cdn.cosmicjs.com'],
  },
}

module.exports = nextConfig