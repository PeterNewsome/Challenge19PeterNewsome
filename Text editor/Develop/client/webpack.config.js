const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const { InjectManifest } = require("workbox-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = () => {
  return {
    mode: "development",
    // Entry files for your JavaScript
    entry: {
      main: "./src/js/index.js",
      install: "./src/js/install.js",
    },
    // Output bundled files
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "client", "dist"),
      clean: true, // This will clean the dist folder before each build
    },
    // Plugins configuration
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'), // Updated path to 'client' directory
        filename: 'index.html',
      }),      
      new InjectManifest({
        swSrc: path.resolve(__dirname, 'src-sw.js'), // Make sure this points to your existing source service worker file
        swDest: 'service-worker.js', // This is the output file that will be placed in the 'dist' directory
      }),      
      new WebpackPwaManifest({
        name: "Just Another Text Editor",
        short_name: "JATE",
        description: "Just Another Text Editor",
        background_color: "#ffffff",
        crossorigin: "use-credentials", // Can be null, use-credentials or anonymous
        icons: [
          {
            src: path.resolve(__dirname, 'src', 'images', 'logo.png'),
            sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
            destination: path.join("assets", "icons"),
          },
        ],
      }),
      new CleanWebpackPlugin(),
    ],
    // Loaders configuration
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: ["@babel/plugin-transform-runtime"],
            },
          },
        },
      ],
    },
  };
};
