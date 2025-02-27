/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: true, 
  images: {
    domains: [
      'i.imgflip.com',
      'i.ibb.co',
      'api.memegen.link',
      'images.unsplash.com'
    ],
    unoptimized: true, 
  },
}

module.exports = nextConfig
