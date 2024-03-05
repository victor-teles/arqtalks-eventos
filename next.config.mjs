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
};

export default nextConfig;
