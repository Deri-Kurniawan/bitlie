const package = require("./package.json");
const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

const METADATA = `/**!
 * @name: ${package.name}
 * @version: ${package.version}
 * @description: ${package.description}
 * @main: ${package.main}
 * @type: ${package.type}
 * @license: ${package.license}
 * @author: ${package.author}
 * @repository: ${package.repository.url}
 * @homepage: ${package.homepage}
 * @bugs: ${package.bugs.url}
 * @keywords: ${package.keywords}
 * @dependencies: ${Object.keys(package.dependencies)}
 * @devDependencies: ${Object.keys(package.devDependencies)}
 */`;
module.exports = {
  mode: "production",
  entry: ["./dist/app.js", "./package.json"],
  output: {
    filename: "main.bundle.js",
    path: path.resolve("dist"),
  },
  target: "node",
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(?:|ts|js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: METADATA,
      raw: true,
      entryOnly: true,
    }),
  ],
};
