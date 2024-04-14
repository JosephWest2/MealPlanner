/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: "build",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "www.kroger.com",
            },
            {
                protocol: "https",
                hostname: "www.spoonacular.com",
            },
            {
                protocol: "https",
                hostname: "img.spoonacular.com",
            },
        ],
    },
};

export default nextConfig;
