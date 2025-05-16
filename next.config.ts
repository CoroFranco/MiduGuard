import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['imgur.com', 'i.imgur.com'], // A veces las imágenes vienen de i.imgur.com
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'https://khs5sq9j-3000.use.devtunnels.ms/'
      ]
    }
  }
}

export default nextConfig;
