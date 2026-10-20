const path = require("path"); // built-in Node module; ol' school module reference
const CopyPlugin = require("copy-webpack-plugin"); // Plugin import for copying files
const HtmlWebpackPlugin = require("html-webpack-plugin"); // Plugin for html template

let production = process.env.NODE_ENV === "production";

let config = {
	mode: "development", // need to specify the build mode: development or production
	entry: "./src/Index.tsx", // all about bundling JavaScript; need to know where to start the dependency resolution
	output: {
		filename: "bundle.js", // output file name
		path: path.resolve(__dirname, "dist"), // absolute path to the distribution directory
		clean: true // this will clean out the dist 
	},
	devtool: "inline-source-map",
	devServer: {
		static: "./dist", // where the static files are
		historyApiFallback: {
			index: "/index.html"
		}
	},
	resolve: { // to allow Webpack to assume extension for imports, etc.
		extensions: [".ts", ".tsx", ".js"]
	},
	module: {
		rules: [
			{
				test: /(\.tsx$|\.ts$)/,
				exclude: /node_modules/,
				use: "ts-loader"
			},
			{
				test: /\.css$/,
				// exclude: /node_modules/,
				use: ["style-loader", "css-loader"] // processes right-to-left; or like a stack

			}
		]
	},
	plugins: [
		new CopyPlugin({ // Copy all files
			patterns: [
				{from: "./src/images", to: "images"},
				{from: "./src/fonts", to: "fonts"},
				{from: "./src/music", to: "music"},
				{from: "./src/old", to: "old"}
			]
		}),
		new HtmlWebpackPlugin({
			template: "./src/index.html",
			filename: "index.html"
		})
	]
}

if (production) {
	config.mode = "production";
}

module.exports = config;