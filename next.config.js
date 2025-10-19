/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress hydration warnings caused by browser extensions
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Additional configuration to handle hydration warnings
  experimental: {
    // This helps with hydration issues
    optimizePackageImports: ["lucide-react"],
  },
};

module.exports = nextConfig;
