const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "production",
  entry: ["./src/server.js", "./package.json"],
  output: {
    filename: "main.js",
    path: path.resolve("dist"),
  },
  target: "node",
  externals: [nodeExternals()],
};
