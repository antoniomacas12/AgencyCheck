/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript — build will surface real type errors in production
  typescript: {
    ignoreBuildErrors: false,
  },
  // ESLint — runs during builds (important for production safety)
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ["app", "components", "lib"],
  },
  // Increase body size limit for multipart form submissions with photos (default is 1MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Uploaded review photos are served as plain <img> tags (no Next/Image),
    // so no localPatterns config needed here.
  },
  async redirects() {
    return [
      // Randstad short slug → canonical slug
      { source: "/agencies/randstad",              destination: "/agencies/randstad-nederland",              permanent: true },
      { source: "/agencies/randstad/reviews",      destination: "/agencies/randstad-nederland/reviews",      permanent: true },
      { source: "/agencies/randstad/jobs",         destination: "/agencies/randstad-nederland/jobs",         permanent: true },
      // Otto short slug → canonical slug
      { source: "/agencies/otto-work-force",       destination: "/agencies/otto-workforce",                  permanent: true },
      { source: "/agencies/otto-work-force/reviews", destination: "/agencies/otto-workforce/reviews",        permanent: true },
      { source: "/agencies/otto-work-force/jobs",  destination: "/agencies/otto-workforce/jobs",             permanent: true },
    ];
  },
};

module.exports = nextConfig;
