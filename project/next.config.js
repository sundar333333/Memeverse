/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: true, // Add this line here
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
