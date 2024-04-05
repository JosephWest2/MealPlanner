/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.kroger.com',
            }
        ]
    }
};

export default nextConfig;
