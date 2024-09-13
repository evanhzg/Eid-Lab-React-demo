/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// Add this line to enable webpack HMR
	webpack: (config) => {
		config.experiments = { ...config.experiments, topLevelAwait: true };
		return config;
	},
};

export default nextConfig;
