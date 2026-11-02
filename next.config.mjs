/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  outputFileTracingExcludes: { "*": ["replica/**", "public/media/**"] },
};

export default nextConfig;
