const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "production",
  entry: ["./dist/server.js", "./package.json"],
  output: {
    filename: "main.bundle.js",
    path: path.resolve("dist"),
  },
  target: "node",
  externals: [nodeExternals()],
};
