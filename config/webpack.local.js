const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const DIST_DIR = "../public";

module.exports = {
  mode: "development",
  entry: "./src/main.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, DIST_DIR)
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, DIST_DIR),
    compress: true,
    // hot: true,
    host: "0.0.0.0",
    port: 4000
  },
  module: {
    rules: [
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        loader: "shader-loader",
        options: {
          glsl: {
            // chunkPath: resolve("/glsl/chunks")
          }
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin([
      {
        from: path.join(__dirname, "../assets"),
        to: path.join(__dirname, DIST_DIR)
      }
    ]),
    new HtmlWebpackPlugin()
    // new webpack.HotModuleReplacementPlugin()
  ]
};
