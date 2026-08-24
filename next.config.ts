import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_LYNK_PRODUCT_URL:
      process.env.NEXT_PUBLIC_LYNK_PRODUCT_URL ??
      'https://lynk.id/allan24/3wdkq65omg9n',
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
