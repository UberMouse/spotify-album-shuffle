const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InjectBodyPlugin = require('inject-body-webpack-plugin').default;

module.exports = {
  entry: './src/index.tsx',
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin(),
    new InjectBodyPlugin({
      content: "<div id='root'></div>",
    })
  ],
  output: {
    path: path.resolve(__dirname, "out"),
  },
  devServer: {
    port: 3001,
    historyApiFallback: true
  },
};