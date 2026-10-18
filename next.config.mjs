/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dribbble.com',
      },
      {
        protocol: 'https',
        hostname: 'portfoliofy.io',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.jayant.codes',
          },
        ],
        destination: 'https://jayant.codes/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'jayantpotdar.in',
          },
        ],
        destination: 'https://jayant.codes/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.jayantpotdar.in',
          },
        ],
        destination: 'https://jayant.codes/:path*',
        permanent: true,
      },
      {
        source: '/components/radial-gradient-animate-card',
        destination: '/components/radial-gradient-card',
        permanent: true,
      },
      {
        source: '/projects/nova-learn',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/work',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/work/:slug*',
        destination: '/projects/:slug*',
        permanent: true,
      },
      {
        source: '/case-studies',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/case-studies/:slug',
        destination: '/projects/:slug',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|woff2|woff)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
