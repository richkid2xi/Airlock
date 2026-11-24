/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@airlock/shared', '@airlock/datasource'],
};

module.exports = nextConfig;
