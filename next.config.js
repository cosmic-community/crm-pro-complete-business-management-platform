/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs', 'jsonwebtoken'],
  },
  images: {
    domains: ['images.unsplash.com', 'cdn.cosmicjs.com'],
  },
}

module.exports = nextConfig