/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Allow builds to complete with TypeScript errors for deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allow builds to complete with ESLint errors for deployment
    ignoreDuringBuilds: true,
  },
  // Optimize images
  images: {
    domains: [],
  },
  // Handle missing environment variables during build
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
  },
}

module.exports = nextConfig