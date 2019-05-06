const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const DIST_DIR = "../build";

module.exports = {
  mode: "production",
  entry: "./src/main.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, DIST_DIR)
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
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
    new HtmlWebpackPlugin({
      title: "word2vec experiment"
    })
  ]
};
