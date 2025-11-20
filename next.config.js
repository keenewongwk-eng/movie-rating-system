/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 確保環境變數被正確載入
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

module.exports = nextConfig;
