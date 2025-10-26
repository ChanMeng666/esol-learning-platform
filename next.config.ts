import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during builds (not recommended for production)
    // ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      // Redirect old routes to new dashboard routes
      {
        source: '/speaking',
        destination: '/student/dashboard/speaking',
        permanent: false,
      },
      {
        source: '/practice/general',
        destination: '/student/dashboard/practice/general',
        permanent: false,
      },
      {
        source: '/practice/nzcel',
        destination: '/student/dashboard/practice/nzcel',
        permanent: false,
      },
      {
        source: '/practice/nzcel/skills',
        destination: '/student/dashboard/practice/nzcel/skills',
        permanent: false,
      },
      {
        source: '/practice/nzcel/conversation',
        destination: '/student/dashboard/practice/nzcel/conversation',
        permanent: false,
      },
      {
        source: '/diagnostic',
        destination: '/student/dashboard/diagnostic',
        permanent: false,
      },
      {
        source: '/diagnostic/:path*',
        destination: '/student/dashboard/diagnostic/:path*',
        permanent: false,
      },
      // Redirect practice root to NZCEL practice
      {
        source: '/practice',
        destination: '/student/dashboard/practice/nzcel',
        permanent: false,
      },
      // Redirect settings to role-based dashboard settings
      {
        source: '/dashboard/settings',
        destination: '/student/dashboard/settings',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
