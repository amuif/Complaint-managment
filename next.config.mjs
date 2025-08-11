/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  // Remove experimental.outputFileTracingIncludes and add this instead:
  outputFileTracingIncludes: {
    '/*': ['./**/*'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
   
      outputFileTracingExcludes: {
        "*": ["**/*"],
      },
    // Add this to prevent memory issues
    workerThreads: false,
    cpus: 1,
  },
  // Add these to prevent build stack issues
  webpack: (config) => {
    config.infrastructureLogging = {
      level: 'error',
    };
    return config;
  },
};

export default nextConfig;
