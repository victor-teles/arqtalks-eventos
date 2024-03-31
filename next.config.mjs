/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{
				source: "/ticket",
				destination: "/",
				permanent: true,
			},
		];
	},
	webpack: (
		config,
		{ buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
	) => {
		// Important: return the modified config
		return { plugins: [...config.plugins], ...config };
	},
};

export default nextConfig;
