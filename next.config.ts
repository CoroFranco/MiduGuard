import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['imgur.com', 'i.imgur.com'], // A veces las imágenes vienen de i.imgur.com
  },
}

export default nextConfig;
