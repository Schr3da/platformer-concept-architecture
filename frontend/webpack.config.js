const dotenv = require("dotenv"),
  path = require("path"),
  process = require("process"),
  webpack = require("webpack"),
  CleanWebpackPlugin = require("clean-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  MiniCSSExtractPlugin = require("mini-css-extract-plugin");

dotenv.config();

const environment = process.env.NODE_ENV,
  project = __dirname.split("/"),
  dist = path.resolve(__dirname, "dist", environment);

const isDebugEnv = () => {
	return environment === "debug";
};

module.exports = {
  mode: isDebugEnv() ? "development" : "production",
  entry: "./src/index.ts",
  output: {
    filename: project[project.length - 1] + ".js",
    publicPath: "/",
    path: dist
  },
  devtool: "inline-source-map",
  devServer: {
    inline: true,
    historyApiFallback: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".svg", ".json", ".css"]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      { test: /\.svg$/, loader: 'svg-inline-loader' },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              strictMath: true,
              noIeCompat: true,
            },
          },
        ],
      },
    ]
  },
  optimization: {
    minimize: environment === "release"
  },
  performance: {
    hints: false
  },
  plugins: [
    new CleanWebpackPlugin([environment]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCSSExtractPlugin({
      filename: project[project.length - 1] + ".css",
    }),
    new HtmlWebpackPlugin({
      appBaseServiceUrl: process.env.SERVICE_BASE_URL || "http://127.0.0.1:9000", 
      filename: "index.html",
      hash: true,
      template: "./index.html",
      title: "",
    })
  ]
};
