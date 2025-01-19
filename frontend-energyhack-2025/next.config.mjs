/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		localPatterns: [
			{
				pathname: "**", // Matches all images under /public/assets/images/
				search: "", // Optionally match query strings (leave blank to match all)
			},
		],
	},
};

export default nextConfig;
