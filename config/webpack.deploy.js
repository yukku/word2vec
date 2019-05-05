const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const DIST_DIR = "../../yukku.github.io/examples/word2vec-tsne";

module.exports = {
  mode: "production",
  entry: "./src/main.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, DIST_DIR)
  },

  plugins: [
    new CopyPlugin([
      {
        from: path.join(__dirname, "../assets"),
        to: path.join(__dirname, DIST_DIR)
      }
    ]),
    new HtmlWebpackPlugin()
  ]
};
