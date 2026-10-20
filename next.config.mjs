/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: { optimizeCss: false },
    images: {
        domains: [
            "**"
        ],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
            {
                protocol: "http",
                hostname: "**",
            },
        ],
    },
    reactStrictMode: false,
    trailingSlash: true,
    async rewrites() {
        return [
          {
            source: "/webadmin/:path*",
            destination: `/webadmin/index.html`
          }
        ];
      }
};

export default nextConfig;
