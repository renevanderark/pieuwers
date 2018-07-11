const path = require("path");

module.exports = {
  entry: ["./src/index.ts"],
  output: {
    path: path.resolve(__dirname, "public/js"),
    filename: "index.js"
  },
  mode: process.env.NODE_ENV || 'development',
  devtool: 'source-map',
  resolve: {
      extensions: ['.js', '.json', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "awesome-typescript-loader"
      },
    ]
  }
};
