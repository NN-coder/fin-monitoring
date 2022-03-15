/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/categories/all',
        permanent: true,
      },
    ];
  },
};
