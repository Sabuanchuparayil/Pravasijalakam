/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['ml', 'en'],
    defaultLocale: 'ml',
    localeDetection: true,
  },
  images: {
    domains: [
      'res.cloudinary.com',
      'images.unsplash.com',
    ],
  },
  experimental: {
    // Enable if needed
  },
};

module.exports = nextConfig;

