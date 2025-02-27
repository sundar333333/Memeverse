/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'i.imgflip.com',
      'i.ibb.co',
      'api.memegen.link',
      'images.unsplash.com'
    ],
  },
}

module.exports = nextConfig