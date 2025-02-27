/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: [
      'i.imgflip.com',
      'i.ibb.co',
      'api.memegen.link',
      'images.unsplash.com'
    ],
  },
}

module.exports = nextConfig
